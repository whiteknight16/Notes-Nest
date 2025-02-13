"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ModeToggler } from "./ModeToggler";
import {
  RegisterLink,
  LoginLink,
  LogoutLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { Menu, X } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  const { isAuthenticated } = useKindeBrowserClient();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full bg-white dark:bg-gray-900 shadow-md dark:shadow-lg px-6 py-4 flex justify-between items-center">
      {/* Logo */}

      <Link href="/" prefetch={true}>
        <h1 className="text-3xl font-bold text-black dark:text-white">
          Notes<span className="text-primary">Nest</span>
        </h1>
      </Link>

      {/* Desktop Menu */}
      <div className="hidden md:flex space-x-6 items-center">
        <ModeToggler />

        {isAuthenticated ? (
          <LogoutLink>
            <Button>Log Out</Button>
          </LogoutLink>
        ) : (
          <>
            <LoginLink postLoginRedirectURL="/">
              <Button>Sign In</Button>
            </LoginLink>

            <RegisterLink postLoginRedirectURL="/dashboard">
              <Button variant="outline">Sign Up</Button>
            </RegisterLink>
          </>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-black dark:text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-white dark:bg-gray-900 shadow-lg md:hidden">
          <div className="flex flex-col items-center space-y-4 py-4">
            <ModeToggler />

            {isAuthenticated ? (
              <LogoutLink>
                <Button>Log Out</Button>
              </LogoutLink>
            ) : (
              <>
                <LoginLink postLoginRedirectURL="/dashboard">
                  <Button>Sign In</Button>
                </LoginLink>

                <RegisterLink postLoginRedirectURL="/dashboard">
                  <Button variant="outline">Sign Up</Button>
                </RegisterLink>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
