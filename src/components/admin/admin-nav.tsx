'use client';

import { useState } from 'react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';

export function AdminNav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="flex h-14 items-center justify-between border-b bg-white px-6">
      <Link href="/dashboard" className="text-lg font-semibold text-gray-900">
        MassagePH Admin
      </Link>

      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
        >
          Account
        </button>

        {open && (
          <div className="absolute right-0 z-10 mt-1 w-48 rounded-lg border bg-white py-1 shadow-lg">
            <Link
              href="/change-password"
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Change Password
            </Link>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
