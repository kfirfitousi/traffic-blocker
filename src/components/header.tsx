import Link from "next/link";

type HeaderProps = {
  action: React.ReactNode;
};

export function Header({ action }: HeaderProps) {
  return (
    <header className="flex items-center bg-slate-300 p-4 sm:p-8 sm:text-lg">
      <nav className="flex w-full flex-row items-center gap-2 text-slate-800 sm:gap-4">
        <h1 className="whitespace-nowrap font-semibold">Traffic Blocker</h1>
        <Link href="/">Computers</Link>
        <Link href="/rules">Rules</Link>
        {action}
      </nav>
    </header>
  );
}
