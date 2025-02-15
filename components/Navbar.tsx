"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ModeToggler } from "./ModeToggler";
import {
  RegisterLink,
  LoginLink,
  LogoutLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const { isAuthenticated } = useKindeBrowserClient();
  const [isOpen, setIsOpen] = useState(false);
  const [authButtons, setAuthButtons] = useState<React.ReactNode>(null);

  // Update auth buttons when authentication state changes
  useEffect(() => {
    if (isAuthenticated) {
      setAuthButtons(
        <LogoutLink>
          <Button>Log Out</Button>
        </LogoutLink>
      );
    } else {
      setAuthButtons(
        <>
          <LoginLink postLoginRedirectURL="/">
            <Button>Sign In</Button>
          </LoginLink>
          <RegisterLink postLoginRedirectURL="/dashboard">
            <Button variant="outline">Sign Up</Button>
          </RegisterLink>
        </>
      );
    }
  }, [isAuthenticated]);

  // Close mobile menu when clicking outside
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      !event.target.closest("#mobile-menu") &&
      !event.target.closest("#menu-button")
    ) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isOpen, handleClickOutside]);

  return (
    <nav className="w-full bg-white dark:bg-gray-900 shadow-md dark:shadow-lg px-6 py-4 flex justify-between items-center">
      {/* Logo */}
      <a href="/" className="text-3xl font-bold text-black dark:text-white">
        Notes<span className="text-primary">Nest</span>
      </a>

      {/* Desktop Menu */}
      <div className="hidden md:flex space-x-6 items-center">
        <ModeToggler />
        {authButtons}
      </div>

      {/* Mobile Menu Button */}
      <button
        id="menu-button"
        className="md:hidden text-black dark:text-white"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Toggle Menu"
        role="button"
      >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div
          id="mobile-menu"
          className="absolute top-16 left-0 w-full bg-white dark:bg-gray-900 shadow-lg md:hidden"
        >
          <div className="flex flex-col items-center space-y-4 py-4">
            <ModeToggler />
            {authButtons}
          </div>
        </div>
      )}
    </nav>
  );
}
