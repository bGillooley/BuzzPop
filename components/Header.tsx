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
        <Link href="/profile" legacyBehavior>
          <button className="">
            <img
              className="w-[54px] h-[54px] rounded-full md:w-[60px] md:h-[60px]"
              src={session.user.image}
            />
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="fixed flex w-full z-50 items-center justify-between">
      <div className="p-4 text-xl font-semibold dark:text-slate-100">
        buzzPop Notes
      </div>
      {right}
    </div>
  );
};

export default Header;
