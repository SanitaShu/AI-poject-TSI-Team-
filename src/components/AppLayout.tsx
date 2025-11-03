import { Outlet } from 'react-router-dom';
import { HeaderBar } from './HeaderBar';
import { FooterBar } from './FooterBar';

export function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-neutral-50 to-[hsl(219,50%,96%)]">
      <HeaderBar />
      <main className="flex-1 w-full">
        <Outlet />
      </main>
      <FooterBar />
    </div>
  );
}
