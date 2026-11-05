import { LayoutGrid, LogOut, UserRound } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, Navigate, NavLink, Outlet, useLocation, useNavigate } from "react-router";
import { ApiError } from "../api/client";
import { useLogout, useMe } from "../api/hooks";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { Alert, Button, PageSpinner } from "./ui";
import { SproutProvider } from "../features/sprout/Sprout";

export function RequireAuth() {
  const { t } = useTranslation();
  const me = useMe();
  const location = useLocation();
  if (me.isPending) return <PageSpinner />;
  if (me.error instanceof ApiError && me.error.status === 401) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  if (me.isError) {
    return (
      <div className="mx-auto max-w-md p-8">
        <Alert tone="error">
          {t("common.serverDown")}{" "}
          <button type="button" className="font-medium underline" onClick={() => void me.refetch()}>
            {t("common.retry")}
          </button>
        </Alert>
      </div>
    );
  }
  return <Outlet />;
}

export function Layout() {
  const { t } = useTranslation();
  const me = useMe();
  const logout = useLogout();
  const navigate = useNavigate();
  const link = ({ isActive }: { isActive: boolean }) =>
    `inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 font-medium transition-colors ${
      isActive ? "bg-stone-100 text-stone-900" : "text-stone-600 hover:text-stone-900"
    }`;

  return (
    <SproutProvider><div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-[1000] border-b border-stone-200 bg-surface/90 backdrop-blur-md">
        <div className="mx-auto flex min-h-14 max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-2">
          <Link to="/" aria-label={t("nav.farms")}>
            <Logo />
          </Link>
          <nav className="flex w-full min-w-0 flex-wrap items-center gap-1 text-sm sm:w-auto sm:gap-2">
            <NavLink to="/" end className={link}>
              <LayoutGrid className="size-4" aria-hidden="true" />
              {t("nav.farms")}
            </NavLink>
            <NavLink to="/account" className={link} title={me.data?.name}>
              <UserRound className="size-4" aria-hidden="true" />
              {t("nav.account")}
            </NavLink>
            <span className="mx-1 hidden h-5 w-px bg-stone-200 sm:block" aria-hidden="true" />
            <LanguageSwitcher className="max-w-[6.5rem]" />
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              busy={logout.isPending}
              onClick={() => logout.mutate(undefined, { onSettled: () => navigate("/login", { replace: true }) })}
            >
              {!logout.isPending && <LogOut className="size-4" aria-hidden="true" />}
              {t("nav.signOut")}
            </Button>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full min-w-0 max-w-6xl flex-1 px-4 py-6 sm:py-8">
        <Outlet />
      </main>
      <footer className="site-footer mt-10 border-t border-stone-200 bg-[#0f1511] px-4 py-6 text-xs text-[#9aa39a]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <p>{t("app.footer")}</p>
          <ul className="flex flex-wrap gap-x-4 gap-y-1 font-medium text-[#c8cfc7]">
            {["NASA POWER", "NASA MODIS", "NASA HLS", "ISRIC SoilGrids"].map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </div>
      </footer>
    </div></SproutProvider>
  );
}
