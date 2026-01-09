'use client'

import Link from 'next/link'
import { BsWhatsapp, BsInstagram, BsFacebook, BsYoutube } from 'react-icons/bs'
import { FiMapPin, FiPhone, FiMail, FiClock } from 'react-icons/fi'
import { CONTACT } from '@/utils/constants'
import { WHATSAPP_LINKS } from '@/utils/whatsappLinks'
import { trackWhatsAppClick } from '@/utils/analytics'
import Logo from '../ui/Logo'

const QUICK_LINKS = [
  { label: 'Model & Harga', href: '#models' },
  { label: 'Kalkulator Hemat', href: '#combined-savings' },
  { label: 'Simulasi Cicilan', href: '#financing' },
  { label: 'Lokasi Showroom', href: '#showroom' },
  { label: 'FAQ', href: '#faq' },
]

const SOCIAL_LINKS = [
  { icon: BsInstagram, href: 'https://instagram.com/wedison', label: 'Instagram' },
  { icon: BsFacebook, href: 'https://facebook.com/wedison', label: 'Facebook' },
  { icon: BsYoutube, href: 'https://youtube.com/wedison', label: 'YouTube' },
]

export default function Footer() {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault()
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }

  return (
    <footer className="bg-slate-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Logo className="h-10 w-auto brightness-0 invert mb-4" />
            <p className="text-slate-400 mb-6">
              Motor listrik dengan teknologi SuperCharge. Hemat hingga 60% biaya BBM.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-4">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 hover:bg-electric-blue hover:text-white transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="text-lg" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Menu</h3>
            <ul className="space-y-3">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Kontak</h3>
            <ul className="space-y-4">
              <li>
                <a
                  href={WHATSAPP_LINKS.general}
                  onClick={() => trackWhatsAppClick('footer')}
                  className="flex items-start gap-3 text-slate-400 hover:text-white transition-colors"
                >
                  <BsWhatsapp className="text-lg mt-1 flex-shrink-0" />
                  <span>Chat WhatsApp</span>
                </a>
              </li>
              <li className="flex items-start gap-3 text-slate-400">
                <FiMail className="text-lg mt-1 flex-shrink-0" />
                <span>{CONTACT.email}</span>
              </li>
              <li className="flex items-start gap-3 text-slate-400">
                <FiPhone className="text-lg mt-1 flex-shrink-0" />
                <span>{CONTACT.phone}</span>
              </li>
            </ul>
          </div>

          {/* Showroom */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Showroom</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-slate-400">
                <FiMapPin className="text-lg mt-1 flex-shrink-0" />
                <span>{CONTACT.showroomAddress}</span>
              </li>
              <li className="flex items-start gap-3 text-slate-400">
                <FiClock className="text-lg mt-1 flex-shrink-0" />
                <div>
                  <div>{CONTACT.showroomHours.weekday}</div>
                  <div>{CONTACT.showroomHours.weekend}</div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} PT Wedison Indonesia. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-slate-500">
              <a href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
