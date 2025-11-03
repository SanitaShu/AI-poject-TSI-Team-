const APP_VERSION = '1.0.0';

export function FooterBar() {
  return (
    <footer className="w-full border-t border-border bg-background py-6">
      <div className="container mx-auto px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p className="text-foreground font-mono">Smart Medicine Vending v{APP_VERSION}</p>
          <div className="flex gap-6">
            <button className="text-foreground hover:text-primary transition-colors">
              Terms of Service
            </button>
            <button className="text-foreground hover:text-primary transition-colors">
              Privacy Policy
            </button>
            <button className="text-foreground hover:text-primary transition-colors">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
