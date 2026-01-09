'use client'

import { motion } from 'framer-motion'
import { FiMapPin } from 'react-icons/fi'
import { CONTACT } from '@/utils/constants'

export default function ShowroomSection() {
  const experiences = [
    'Lihat semua model motor Wedison (Mini, Athena, Victory, EdPower)',
    'Test ride 15 menit dengan staff berpengalaman',
    'Saksikan SuperCharge live (charging station tersedia)',
    'Konsultasi gratis: financing, trade-in, insurance',
    'Virtual tour teknologi & smart features',
    'Kopi gratis, WiFi, comfortable lounge',
  ]
  
  return (
    <section id="showroom" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-800 mb-4">
            <span className="text-electric-blue">
              Showroom
            </span>{' '}
            Wedison Jakarta Selatan
          </h2>
          <p className="text-xl text-slate-600">
            Ingin cek secara langsung atau test drive? Kunjungi showroom kami di lokasi berikut
          </p>
        </motion.div>
        
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Column - Information */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Location Block */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-start gap-4 mb-4">
                <FiMapPin className="text-3xl text-electric-blue flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Lokasi</h3>
                  <p className="text-slate-600 leading-relaxed mb-3">
                    {CONTACT.showroomAddress}
                  </p>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CONTACT.showroomAddress)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-electric-blue hover:underline font-medium flex items-center gap-2"
                  >
                    Buka di Google Maps →
                  </a>
                </div>
              </div>
            </div>
            
            {/* Experience Block */}
            <div className="bg-gradient-to-br from-cyan-50 to-teal-50 rounded-2xl p-8 border-2 border-cyan-200">
              <h3 className="text-xl font-bold text-slate-800 mb-4">
                Apa yang Bisa Anda Lakukan di Showroom:
              </h3>
              <div className="space-y-3">
                {experiences.map((exp, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <span className="text-slate-700">{exp}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
          
          {/* Right Column - Map & Gallery Placeholder */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Google Maps Embed */}
            <div className="bg-white rounded-2xl p-4 shadow-lg">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Lokasi Showroom</h3>
              <div className="aspect-video rounded-xl overflow-hidden border-2 border-slate-200">
                <iframe
                  src={`https://www.google.com/maps?q=${encodeURIComponent(CONTACT.showroomAddress)}&output=embed`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                  title="Wedison Showroom Location - Pondok Indah"
                />
              </div>
              <p className="text-sm text-slate-600 mt-3 text-center">
                {CONTACT.showroomAddress}
              </p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CONTACT.showroomAddress)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center text-electric-blue hover:underline font-medium mt-2"
              >
                Buka di Google Maps →
              </a>
            </div>
            
            {/* Photo Gallery Placeholder - Stacking Cards */}
            <div className="bg-white rounded-2xl p-4 shadow-lg relative">
              {/* Placeholder Badge */}
              <div className="absolute top-2 left-2 z-30 bg-yellow-500 text-black px-4 py-2 rounded-lg font-bold text-sm shadow-lg border-2 border-yellow-600">
                PLACEHOLDER - Upload actual showroom photos
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-4">Galeri Showroom</h3>
              <div className="relative h-64 flex items-center justify-center">
                {[1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="absolute w-48 h-64 bg-slate-200 rounded-xl flex items-center justify-center border-2 border-dashed border-slate-400 shadow-lg"
                    style={{
                      transform: `translateX(${(i - 1) * 20}px) translateY(${(i - 1) * -15}px) rotate(${(i - 1) * -3}deg)`,
                      zIndex: 5 - i,
                    }}
                  >
                    {/* Badge untuk setiap photo placeholder */}
                    <div className="absolute top-2 right-2 bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold shadow-md border border-yellow-600 z-10">
                      PLACEHOLDER
                    </div>
                    <span className="text-slate-500 text-sm font-medium">Photo {i}</span>
                  </motion.div>
                ))}
              </div>
              <p className="text-sm text-slate-500 mt-4 text-center">
                Replace with actual showroom photos
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
