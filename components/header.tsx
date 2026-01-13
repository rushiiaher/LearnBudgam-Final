"use client"

import Link from "next/link"
import Image from "next/image"
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
    { href: "/blog", label: "Blog" },
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
      <header className="fixed top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2 flex-shrink-0 ml-4">
              <div className="relative h-12 w-12 sm:h-14 sm:w-14 flex items-center justify-center">
                <Image
                  src="/logo2.png"
                  alt="Learn Budgam Logo"
                  width={56}
                  height={56}
                  className="h-10 w-10 sm:h-12 sm:w-12 object-cover rounded-full"
                />
              </div>
              <span className="font-bold text-xl text-foreground">Learn Budgam</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  {...(link.external && { target: "_blank", rel: "noopener noreferrer" })}
                  className={`px-3 py-2 text-sm font-medium transition-colors relative ${isActive(link.href) && !link.external
                    ? "text-foreground border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent rounded-md"
                    }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <Link href="/login" className="hidden sm:block">
                <Button variant="outline" size="sm" className="border-border text-foreground hover:bg-accent">
                  Login
                </Button>
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-foreground hover:bg-accent rounded-md"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="lg:hidden py-4 space-y-1 border-t border-border">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  {...(link.external && { target: "_blank", rel: "noopener noreferrer" })}
                  className={`block px-3 py-2 text-sm font-medium transition-colors ${isActive(link.href) && !link.external
                    ? "text-foreground border-l-4 border-primary bg-accent"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent rounded-md"
                    }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link href="/login" className="block sm:hidden">
                <Button variant="outline" size="sm" className="w-full border-border text-foreground hover:bg-accent">
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
