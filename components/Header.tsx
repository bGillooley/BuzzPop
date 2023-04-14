import Link from "next/link";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";

const Header: React.FC = () => {
  const router = useRouter();
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname;

  const { data: session, status } = useSession();

  let right = null;

  if (status === "loading") {
    right = <div>Verifying...</div>;
  }

  if (!session) {
    right = (
      <div>
        <Link href="/api/auth/signin" legacyBehavior>
          <a
            className="inline-block p-4 dark:text-slate-100"
            data-active={isActive("/signup")}
          >
            Log in
          </a>
        </Link>
      </div>
    );
  }
  if (session) {
    right = (
      <div className="p-4 dark:text-slate-100">
        <button className="" onClick={() => signOut()}>
          Log out
        </button>
      </div>
    );
  }

  return (
    <div className="fixed flex w-full items-end z-50 justify-between">
      <div className="p-4 text-xl font-semibold dark:text-slate-100">
        buzzPop Notes
      </div>
      {right}
    </div>
  );
};

export default Header;
