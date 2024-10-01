'use client';

import { useState } from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, Minimize2 } from 'lucide-react';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="w-full max-w-screen-xl mx-auto p-6 font-['MD_Grotesk_Regular']">
      <nav className="flex items-center justify-between mx-auto max-w-5xl">
        <Link href="/" legacyBehavior>
          <a className="text-2xl text-gray-900">Solis</a>
        </Link>
        <div className="hidden md:flex space-x-4 items-center">
          <Link href="/why-solis" legacyBehavior>
            <a className="text-gray-600 hover:text-gray-900">About</a>
          </Link>
          <Link href="/careers" legacyBehavior>
            <a className="text-gray-600 hover:text-gray-900">Careers</a>
          </Link>
          <a href="mailto:hello@solis.eco" className="text-gray-600 hover:text-gray-900">Contact</a>
          <Link href="/dashboard" legacyBehavior>
            <Button className="bg-black text-white px-4 py-2 rounded-md">
              Log In
            </Button>
          </Link>
        </div>
        <Button onClick={toggleMobileMenu} className="md:hidden bg-gray text-black hover:bg-gray-200">
          <Menu className="w-6 h-6" />
        </Button>
      </nav>
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-white z-20 flex flex-col items-center justify-center space-y-4 p-6">
          <Link href="/why-solis" legacyBehavior>
            <a className="block text-gray-600 hover:text-gray-900 text-2xl">About</a>
          </Link>
          <Link href="/careers" legacyBehavior>
            <a className="block text-gray-600 hover:text-gray-900 text-2xl">Careers</a>
          </Link>
          <a href="mailto:hello@solis.eco" className="block text-gray-600 hover:text-gray-900 text-2xl">Contact</a>
          <Link href="/dashboard" legacyBehavior>
            <Button className="bg-black text-white px-4 py-2 rounded-md text-2xl">
              Log In
            </Button>
          </Link>
          <Button onClick={toggleMobileMenu} className="text-gray-600 bg-gray hover:bg-gray-200 text-2xl mt-4">
            Close <Minimize2 />
          </Button>
        </div>
      )}
    </header>
  );
};

export default Header;
