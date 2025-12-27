import Link from "next/link"
import { Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="font-semibold text-lg mb-4">About the Initiative</h3>
            <p className="text-white/80 text-base leading-relaxed">
              Transforming education in Budgam through digital innovation. Our initiative brings modern technology to 15
              schools, empowering students and educators for a brighter future.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-base">
              <li>
                <Link
                  href="/about"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  About Initiative
                </Link>
              </li>
              <li>
                <Link
                  href="/schools"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Our Schools
                </Link>
              </li>
              <li>
                <Link
                  href="/features"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Digital Features
                </Link>
              </li>
              <li>
                <Link
                  href="/impact"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Impact
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Login Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3 text-base">
              <li className="flex items-start gap-2">
                <MapPin size={18} className="mt-0.5 flex-shrink-0" />
                <span className="text-white/80">Education Office, Budgam, Srinagar, J&K 191111</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={18} className="flex-shrink-0" />
                <span className="text-white/80">+91 1234 567890</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={18} className="flex-shrink-0" />
                <span className="text-white/80">info@budgamschools.edu.in</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 text-center text-base text-white/70">
          <p>© {new Date().getFullYear()} Budgam School Digitization Initiative. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
