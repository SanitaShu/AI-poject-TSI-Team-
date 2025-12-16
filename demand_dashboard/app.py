from flask import Flask, render_template, request
import pandas as pd
from pathlib import Path
import numpy as np

from prophet import Prophet  # pip install prophet

app = Flask(__name__)

DATA_PATH = Path("data/FINAL_fake_purchase_data_with_machineID.xlsx")


def load_data():
    df = pd.read_excel(DATA_PATH, parse_dates=["Purchase_date_and_time"])

    # normalize column names
    rename_map = {
        "product_id": "Product_ID",
        "ProductId": "Product_ID",
        "original_name": "Original_name",
        "Original Name": "Original_name",
    }
    df = df.rename(columns={c: rename_map[c] for c in df.columns if c in rename_map})

    # types
    df["Price_EUR"] = pd.to_numeric(
        df["Price_EUR"].astype(str).str.replace(",", ".", regex=False),
        errors="coerce",
    )
    df["Quantity"] = pd.to_numeric(df["Quantity"], errors="coerce")

    if "Price_Original_EUR" in df.columns:
        df["Price_Original_EUR"] = pd.to_numeric(
            df["Price_Original_EUR"].astype(str).str.replace(",", ".", regex=False),
            errors="coerce",
        )

    # Revenue
    if "Revenue" not in df.columns:
        df["Revenue"] = df["Price_EUR"] * df["Quantity"]
    df["Revenue"] = pd.to_numeric(df["Revenue"], errors="coerce")

    # Profit
    if "Profit_EUR" in df.columns:
        df["Profit_EUR"] = pd.to_numeric(df["Profit_EUR"], errors="coerce")
    else:
        if "Price_Original_EUR" in df.columns:
            df["Profit_EUR"] = (df["Price_EUR"] - df["Price_Original_EUR"]) * df["Quantity"]
        else:
            df["Profit_EUR"] = 0.0

    df["Date"] = df["Purchase_date_and_time"].dt.date
    return df


df = load_data()


def to_week_start_monday(date_series):
    d = pd.to_datetime(date_series)
    return (d - pd.to_timedelta(d.dt.weekday, unit="D")).dt.date  # Monday week start


def weekly_forecast_with_ci(daily_df, periods_weeks=6, interval_width=0.60):
    """
    Weekly aggregation + Prophet forecast + CI.
    Returns:
      hist_dates, hist_actual,
      fut_dates, fut_yhat, fut_lower, fut_upper
    """
    if daily_df.empty or len(daily_df) < 10:
        return [], [], [], [], [], []

    tmp = daily_df.copy()
    tmp["week_start"] = to_week_start_monday(tmp["Date"])

    weekly = (
        tmp.groupby("week_start", as_index=False)["Revenue"]
        .sum()
        .sort_values("week_start")
    )

    # Prophet expects ds (datetime) + y
    dfp = weekly.rename(columns={"week_start": "ds", "Revenue": "y"}).copy()
    dfp["ds"] = pd.to_datetime(dfp["ds"])
    dfp["y"] = pd.to_numeric(dfp["y"], errors="coerce").fillna(0.0)

    # Fit
    model = Prophet(
        yearly_seasonality=False,
        weekly_seasonality=False,   # we already aggregated by weeks
        daily_seasonality=False,
        interval_width=interval_width,
        changepoint_prior_scale=0.15,
    )

    # (optional) light monthly seasonality
    model.add_seasonality(name="monthly", period=30.5, fourier_order=5)

    model.fit(dfp)

    future = model.make_future_dataframe(periods=periods_weeks, freq="W-MON")
    fc = model.predict(future)[["ds", "yhat", "yhat_lower", "yhat_upper"]].copy()

    last_ds = dfp["ds"].max()

    # history (TAKKE last 26 weeks)
    hist = dfp.tail(26)
    hist_dates = hist["ds"].dt.strftime("%Y-%m-%d").tolist()
    hist_actual = hist["y"].round(2).tolist()

    # future
    fut = fc[fc["ds"] > last_ds]
    fut_dates = fut["ds"].dt.strftime("%Y-%m-%d").tolist()
    fut_yhat = fut["yhat"].clip(lower=0).round(2).tolist()
    fut_lower = fut["yhat_lower"].clip(lower=0).round(2).tolist()
    fut_upper = fut["yhat_upper"].clip(lower=0).round(2).tolist()

    return hist_dates, hist_actual, fut_dates, fut_yhat, fut_lower, fut_upper


@app.route("/", methods=["GET"])
def index():
    muni = request.args.get("municipality")
    start = request.args.get("start")
    end = request.args.get("end")

    filtered = df.copy()

    if muni:
        filtered = filtered[filtered["Municipality"] == muni]
    if start:
        filtered = filtered[filtered["Date"] >= pd.to_datetime(start).date()]
    if end:
        filtered = filtered[filtered["Date"] <= pd.to_datetime(end).date()]

    # === KPI ===
    total_revenue = round(filtered["Revenue"].sum(), 2)
    total_profit = round(filtered["Profit_EUR"].sum(), 2)
    profit_margin = round((total_profit / total_revenue) * 100, 2) if total_revenue > 0 else 0

    # === TOP MUNICIPALITIES ===
    top_muni = (
        filtered.groupby("Municipality", as_index=False)["Revenue"]
        .sum()
        .sort_values("Revenue", ascending=False)
        .head(5)
    )

    # === TOP PRODUCTS BY PROFIT ===
    # IF NO COLUMNS, RETURN EMPTY DF
    if "Product_ID" in filtered.columns and "Original_name" in filtered.columns:
        top_products = (
            filtered.groupby(["Product_ID", "Original_name"], as_index=False)
            .agg({"Revenue": "sum", "Profit_EUR": "sum"})
            .sort_values("Profit_EUR", ascending=False)
            .head(10)
        )
    else:
        top_products = pd.DataFrame(columns=["Product_ID", "Original_name", "Revenue", "Profit_EUR"])

    # === DAILY AGGREGATION: Revenue, Profit, Quantity ===
    daily_full = (
        filtered.groupby("Date", as_index=False)
        .agg({"Revenue": "sum", "Profit_EUR": "sum", "Quantity": "sum"})
        .sort_values("Date")
    )

    # Trend chart: last 60 days
    last_60 = daily_full.tail(60)
    dates = last_60["Date"].astype(str).tolist()
    revenues = last_60["Revenue"].round(2).tolist()
    quantities = last_60["Quantity"].round(0).tolist()

    # Profit vs Revenue (daily): last 60 days
    profit_dates = dates
    profit_values = last_60["Profit_EUR"].round(2).tolist()
    profit_revenues = revenues

    # === FORECAST v2: weekly + CI ===
    # 6 weeks into future, 60% CI
    hist_w_dates, hist_w_actual, fut_w_dates, fut_w_yhat, fut_w_lower, fut_w_upper = weekly_forecast_with_ci(
        daily_full[["Date", "Revenue"]].copy(),
        periods_weeks=6,       # ~ 6 weeks into future
        interval_width=0.60
    )

    return render_template(
        "index.html",
        municipalities=sorted(df["Municipality"].dropna().unique()),
        total_revenue=total_revenue,
        total_profit=total_profit,
        profit_margin=profit_margin,
        top_muni=top_muni.to_dict(orient="records"),
        top_products=top_products.to_dict(orient="records"),
        dates=dates,
        revenues=revenues,
        quantities=quantities,
        profit_dates=profit_dates,
        profit_values=profit_values,
        profit_revenues=profit_revenues,
        hist_w_dates=hist_w_dates,
        hist_w_actual=hist_w_actual,
        fut_w_dates=fut_w_dates,
        fut_w_yhat=fut_w_yhat,
        fut_w_lower=fut_w_lower,
        fut_w_upper=fut_w_upper,
    )


# if __name__ == "__main__":
#     app.run(debug=True)

if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
