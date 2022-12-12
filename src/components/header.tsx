import React from "react";
import Link from "next/link";
import type { User } from "../utils/schemas/user";
import { signIn, signOut } from "next-auth/react";

export const Header: React.FC<{ user: User | undefined }> = ({ user }) => {
  return (
    <div className="sticky flex content-center justify-between bg-slate-100 p-3 font-semibold text-black dark:bg-gray-800 dark:text-white">
      <Link
        href="/"
        className="ml-2 rounded-lg bg-blue-600 p-2 transition-colors duration-300 ease-in-out hover:bg-blue-700"
      >
        <svg className="mx-auto h-[1.25em] w-[1.25em] invert">
          <image href="/home.svg" className="h-[1.25em] w-[1.25em]" />
        </svg>
      </Link>
      <div className="my-auto text-2xl font-semibold">
        {user && <span className="text-blue-500">{user.name}</span>}
      </div>
      <div>
        <button
          className="w-full rounded-lg bg-blue-600 py-2 px-4 font-semibold text-white transition-colors duration-300 ease-in-out hover:bg-blue-700"
          onClick={user ? () => signOut() : () => signIn()}
        >
          {user ? "Sign out" : "Sign in"}
        </button>
      </div>
    </div>
  );
};
