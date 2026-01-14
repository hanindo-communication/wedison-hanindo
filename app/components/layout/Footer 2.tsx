'use client'

import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi'
import { BsWhatsapp } from 'react-icons/bs'
import Logo from '../ui/Logo'
import { CONTACT } from '@/utils/constants'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  
  const quickLinks = {
    models: [
      { label: 'EdPower', href: '#specs' },
      { label: 'Athena', href: '#specs' },
      { label: 'Victory', href: '#specs' },
      { label: 'Mini', href: '#specs' },
    ],
  }
  
  return (
    <footer className="bg-slate-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <div className="mb-2">
              <Logo size="large" showText={false} className="justify-start" />
            </div>
            <p className="text-slate-400 mb-6 leading-relaxed">
              Motor listrik pertama dengan SuperCharge technology di Indonesia. 
              Driving the future of sustainable mobility.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <FiMapPin className="text-electric-blue mt-1 flex-shrink-0" />
                <span className="text-slate-400">{CONTACT.showroomAddress}</span>
              </div>
              <div className="flex items-center gap-3">
                <FiPhone className="text-electric-blue flex-shrink-0" />
                <a href={`tel:${CONTACT.phone}`} className="text-slate-400 hover:text-white transition-colors">
                  {CONTACT.phone}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <FiMail className="text-electric-blue flex-shrink-0" />
                <a href={`mailto:${CONTACT.email}`} className="text-slate-400 hover:text-white transition-colors">
                  {CONTACT.email}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <BsWhatsapp className="text-electric-blue flex-shrink-0" />
                <a 
                  href={`https://wa.me/${CONTACT.whatsapp}`}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  WhatsApp Business
                </a>
              </div>
            </div>
          </div>
          
          {/* Quick Links - Models */}
          <div>
            <h4 className="font-bold text-lg mb-4">MODELS</h4>
            <ul className="space-y-2">
              {quickLinks.models.map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.href}
                    className="text-slate-400 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-slate-800 pt-8">
          <div className="text-center text-sm text-slate-500">
            <p>© {currentYear} PT Wedison Indonesia. All rights reserved.</p>
            <p className="mt-1">Built for better mobility</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
