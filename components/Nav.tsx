"use client";

import { Disclosure, Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { BellIcon } from "@heroicons/react/24/outline";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function Nav() {
  const { data: session, status } = useSession();

  return (
    <Disclosure
      as="nav"
      className="bg-[var(--background)] text-[var(--foreground)] border-b border-[var(--border)] shadow-lg"
      dir="rtl"
    >
      <div className="flex h-16 justify-between items-center px-6 max-w-7xl mx-auto">
        
        {/* Main Nav Links */}
        <div className="flex space-x-4 space-x-reverse">
          {[
            { href: "/", label: "الرئيسية" },
            { href: "/products", label: "المنتجات" },
            { href: "/services", label: "الخدمات" },
            { href: "/about", label: "حولنا" },
            { href: "/contact", label: "اتصل بنا" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-2 rounded-md text-sm font-semibold hover:bg-[var(--border)] hover:text-[var(--secondary)] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* User Interaction Hub */}
        <div className="flex items-center gap-5">
          <button
            type="button"
            className="p-2 rounded-full text-[var(--muted)] hover:text-[var(--secondary)] focus:outline-none transition-colors"
          >
            <BellIcon className="h-6 w-6" />
          </button>

          {status === "authenticated" ? (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-[var(--muted)] hidden sm:block">
                {session?.user?.name}
              </span>

              <Menu as="div" className="relative inline-block text-left">
                <MenuButton className="flex rounded-full bg-[var(--border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] cursor-pointer transition-transform hover:scale-105">
                  <img
                    className="h-9 w-9 rounded-full object-cover border border-[var(--muted)]"
                    src={session?.user?.image || "https://dicebear.com" + (session?.user?.name || "User")}
                    alt={session?.user?.name || "Profil"}
                  />
                </MenuButton>

                <MenuItems
                  transition
                  className="absolute left-0 z-10 mt-2 w-48 origin-top-left rounded-xl bg-[var(--background)] p-1 text-sm text-[var(--foreground)] shadow-lg border border-[var(--border)] ring-1 ring-black/5 transition duration-100 ease-out focus:outline-none data-closed:scale-95 data-closed:opacity-0"
                >
                  <MenuItem>
                    <Link
                      href="/dashboard/profile"
                      className="group flex w-full items-center rounded-lg px-3 py-2 text-right hover:bg-[var(--border)] hover:text-[var(--secondary)] transition-colors"
                    >
                      الملف الشخصي
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <button
                      onClick={() => signOut({ callbackUrl: "/login" })}
                      className="group flex w-full items-center rounded-lg px-3 py-2 text-right text-[var(--primary)] hover:bg-red-500/20 hover:text-red-300 cursor-pointer transition-colors"
                    >
                      تسجيل الخروج
                    </button>
                  </MenuItem>
                </MenuItems>
              </Menu>
            </div>
          ) : (
            status !== "loading" && (
              <Link
                href="/login"
                className="text-sm font-semibold bg-[var(--primary)] text-[var(--text)] px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                تسجيل الدخول
              </Link>
            )
          )}
        </div>
      </div>
    </Disclosure>
  );
}
