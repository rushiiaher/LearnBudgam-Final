"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useState } from "react"
import { usePathname } from "next/navigation"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/schools", label: "Schools" },
    { href: "https://jkbose.nic.in/TextBooks.html", label: "Textbook", external: true },
    { href: "/lectures", label: "Lectures" },
    { href: "/features", label: "Features" },
    { href: "/impact", label: "Impact" },
    { href: "/gallery", label: "Gallery" },
  ]

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  return (
    <>
      <header className="fixed top-0 z-50 w-full border-b border-gray-200 bg-white backdrop-blur">
        <div className="container mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-black flex items-center justify-center">
                <span className="text-white font-bold text-sm sm:text-lg">BS</span>
              </div>
              <span className="font-semibold text-sm sm:text-lg text-balance text-black">Learn Budgam</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  {...(link.external && { target: "_blank", rel: "noopener noreferrer" })}
                  className={`px-3 py-2 text-sm font-medium transition-colors relative ${isActive(link.href) && !link.external
                    ? "text-black border-b-2 border-green-500"
                    : "text-gray-600 hover:text-black hover:bg-gray-100 rounded-md"
                    }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <Link href="/login" className="hidden sm:block">
                <Button variant="outline" size="sm" className="border-gray-300 text-black hover:bg-gray-100">
                  Login
                </Button>
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-black hover:bg-gray-100 rounded-md"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="lg:hidden py-4 space-y-1 border-t border-gray-200">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  {...(link.external && { target: "_blank", rel: "noopener noreferrer" })}
                  className={`block px-3 py-2 text-sm font-medium transition-colors ${isActive(link.href) && !link.external
                    ? "text-black border-l-4 border-green-500 bg-gray-100"
                    : "text-gray-600 hover:text-black hover:bg-gray-100 rounded-md"
                    }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link href="/login" className="block sm:hidden">
                <Button variant="outline" size="sm" className="w-full border-gray-300 text-black hover:bg-gray-100">
                  Login
                </Button>
              </Link>
            </nav>
          )}
        </div>
      </header>
      <div className="h-16" />
    </>
  )
}
