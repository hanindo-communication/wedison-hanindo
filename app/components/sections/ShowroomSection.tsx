'use client'

import { motion } from 'framer-motion'
import { FiMapPin, FiClock, FiPhone, FiNavigation } from 'react-icons/fi'
import { BsWhatsapp } from 'react-icons/bs'
import { CONTACT } from '@/utils/constants'
import { WHATSAPP_LINKS } from '@/utils/whatsappLinks'
import { trackWhatsAppClick } from '@/utils/analytics'

const SHOWROOM_FEATURES = [
  'Test drive semua model',
  'Konsultasi gratis',
  'Proses kredit di tempat',
  'Service dan after-sales',
]

export default function ShowroomSection() {
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CONTACT.showroomAddress)}`

  return (
    <section id="showroom" className="py-12 md:py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-2 bg-electric-blue/10 text-electric-blue rounded-full text-sm font-semibold mb-4">
            Kunjungi Kami
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 mb-4">
            Test Drive di{' '}
            <span className="text-electric-blue">Showroom Kami</span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Rasakan langsung sensasi berkendara motor listrik Wedison
          </p>
        </motion.div>

        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 lg:gap-12">
          {/* Left: Map */}
          <motion.div
            initial={false}
            animate={{ opacity: 1, x: 0 }}
            className="relative w-full rounded-3xl overflow-hidden bg-slate-200"
          >
            {/* Map Iframe - vertical aspect ratio on mobile, auto on desktop */}
            <div className="relative aspect-[3/4] sm:aspect-square lg:aspect-auto lg:h-full lg:min-h-[400px]">
              <iframe
                src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(CONTACT.showroomAddress)}`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0"
              />
              
              {/* Fallback if map doesn't load */}
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-electric-blue/20 to-cyan-500/20 pointer-events-none opacity-0 transition-opacity duration-300">
                <div className="text-center text-slate-600 pointer-events-none">
                  <FiMapPin className="text-4xl mx-auto mb-2 text-electric-blue" />
                  <p className="font-semibold">Showroom Wedison</p>
                  <p className="text-sm">Pondok Indah, Jakarta Selatan</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Info */}
          <motion.div
            initial={false}
          animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Address Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-electric-blue/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <FiMapPin className="text-xl text-electric-blue" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-1">Alamat</h3>
                  <p className="text-slate-600" translate="no">{CONTACT.showroomAddress}</p>
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-2 text-electric-blue font-medium hover:underline"
                  >
                    <FiNavigation className="text-sm" />
                    <span>Buka di Google Maps</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Hours Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-success-green/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <FiClock className="text-xl text-success-green" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-1">Jam Operasional</h3>
                  <p className="text-slate-600">{CONTACT.showroomHours.weekday}</p>
                  <p className="text-slate-600">{CONTACT.showroomHours.weekend}</p>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="bg-gradient-to-br from-electric-blue to-cyan-500 rounded-2xl p-6 text-white">
              <h3 className="text-lg font-bold mb-4">Yang Bisa Anda Lakukan</h3>
              <div className="grid grid-cols-2 gap-3">
                {SHOWROOM_FEATURES.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-xs">✓</span>
                    </div>
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={WHATSAPP_LINKS.testDrive}
                onClick={() => trackWhatsAppClick('showroom-test-drive')}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-success-green text-white font-semibold rounded-full hover:bg-green-600 transition-all hover:scale-105 shadow-lg"
              >
                <BsWhatsapp className="text-xl" />
                <span>Booking Test Drive</span>
              </a>
              <a
                href={`tel:${CONTACT.phone.replace(/[^0-9+]/g, '')}`}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-white text-slate-700 font-semibold rounded-full border-2 border-slate-200 hover:border-electric-blue hover:text-electric-blue transition-all"
              >
                <FiPhone className="text-xl" />
                <span>Telepon</span>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
