import { Routes, Route, Navigate } from 'react-router-dom';
import { WelcomePage } from '../pages/WelcomePage';
import { VerifyAgePage } from '../pages/VerifyAgePage';
import { ChatRecommendationPage } from '../pages/ChatRecommendationPage';
import { SelectMedicinePage } from '../pages/SelectMedicinePage';
import { ReviewAndCheckoutPage } from '../pages/ReviewAndCheckoutPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { AdminPanelPage } from '../pages/AdminPanelPage';
import { AdminLogin } from '../pages/AdminLogin';
import { ProtectedRoute } from './ProtectedRoute';
import { AppLayout } from './AppLayout';

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<WelcomePage />} />
        <Route path="verify-age" element={<VerifyAgePage />} />
        <Route path="ai-assistant" element={<ChatRecommendationPage />} />
        <Route path="select-medicine" element={<SelectMedicinePage />} />
        <Route path="review" element={<ReviewAndCheckoutPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="admin" element={<AdminLogin />} />
        <Route
          path="admin/dashboard"
          element={
            <ProtectedRoute requireAdmin>
              <AdminPanelPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
