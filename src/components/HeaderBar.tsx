import { Link, useLocation } from 'react-router-dom';
import { BotIcon, HomeIcon, ShieldCheckIcon, ShieldAlertIcon, GlobeIcon } from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import { useLanguageStore } from '../stores/languageStore';
import { useTranslation } from '../hooks/useTranslation';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';

export function HeaderBar() {
  const location = useLocation();
  const { isAgeVerified, isAdmin } = useAppStore();
  const { t } = useTranslation();
  const { toggleLanguage, language } = useLanguageStore();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-8 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-12 h-12 rounded-lg bg-gradient-1 flex items-center justify-center shadow-md">
              <BotIcon className="w-6 h-6 text-primary-foreground" strokeWidth={2} />
            </div>
            <h1 className="text-2xl font-heading font-semibold text-foreground">
              {t.header.title}
            </h1>
          </Link>

          <div className="flex items-center gap-6">
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList className="gap-2">
                <NavigationMenuItem>
                  <Link to="/">
                    <NavigationMenuLink
                      className={`group inline-flex h-12 w-max items-center justify-center rounded-lg px-6 py-3 text-base font-normal transition-colors hover:bg-accent/10 focus:bg-accent/10 focus:outline-none disabled:pointer-events-none disabled:opacity-50 ${
                        isActive('/') ? 'bg-accent/10 text-accent' : 'text-foreground'
                      }`}
                    >
                      <HomeIcon className="w-5 h-5 mr-2" strokeWidth={2} />
                      {t.header.home}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link to="/ai-assistant">
                    <NavigationMenuLink
                      className={`group inline-flex h-12 w-max items-center justify-center rounded-lg px-6 py-3 text-base font-normal transition-colors hover:bg-accent/10 focus:bg-accent/10 focus:outline-none disabled:pointer-events-none disabled:opacity-50 ${
                        isActive('/ai-assistant') ? 'bg-accent/10 text-accent' : 'text-foreground'
                      }`}
                    >
                      <BotIcon className="w-5 h-5 mr-2" strokeWidth={2} />
                      {t.header.aiAssistant}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <Button
              variant="ghost"
              size="icon"
              className="h-12 w-12 rounded-lg"
              title="Change Language"
              onClick={toggleLanguage}
            >
              <GlobeIcon className="w-5 h-5" strokeWidth={2} />
              <span className="ml-1 text-xs font-semibold">{language.toUpperCase()}</span>
            </Button>

            <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-card border border-border shadow-sm">
              {isAgeVerified ? (
                <>
                  <ShieldCheckIcon className="w-5 h-5 text-success" strokeWidth={2} />
                  <span className="text-sm font-normal text-success">{t.header.ageVerified}</span>
                </>
              ) : (
                <>
                  <ShieldAlertIcon className="w-5 h-5 text-warning" strokeWidth={2} />
                  <span className="text-sm font-normal text-warning">{t.header.notVerified}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
