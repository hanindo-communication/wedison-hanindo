'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiChevronLeft, FiChevronRight, FiPlay } from 'react-icons/fi'
import { STATS } from '@/utils/constants'

export default function TestimonialsSection() {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0)
  
  const videoTestimonials = [
    {
      name: 'Budi Rahman',
      role: 'Uber Driver, Jakarta Selatan',
      quote: 'Sebelum pakai Wedison, saya maksimal 8-10 orderan per hari. Sekarang 15-20 orderan. Gaada charging anxiety lagi. ROI saya dalam 8 bulan!',
      thumbnail: '',
    },
    {
      name: 'Sinta Wijaya',
      role: 'Marketing Manager, Jakarta Pusat',
      quote: 'Pagi charging 15 menit, udah ready untuk meeting. Dashboard dengan CarPlay bikin kerja jadi lebih efisien. Best decision ever!',
      thumbnail: '',
    },
    {
      name: 'Rafi Gunawan',
      role: 'Content Creator, Jakarta',
      quote: 'Motor Wedison ini instagrammable! Followers suka. Technology-nya canggih banget. Worth the investment 100%!',
      thumbnail: '',
    },
    {
      name: 'Maya Kusuma',
      role: 'Sustainable Business Owner, Bandung',
      quote: 'Bisnis saya climate-positive sekarang. Zero emisi daily driving. Customer respect brands yang peduli lingkungan. Win-win!',
      thumbnail: '',
    },
  ]
  
  const nextVideo = () => {
    setActiveVideoIndex((prev) => (prev + 1) % videoTestimonials.length)
  }
  
  const prevVideo = () => {
    setActiveVideoIndex((prev) => (prev - 1 + videoTestimonials.length) % videoTestimonials.length)
  }
  
  return (
    <section id="testimonials" className="py-20 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Apa Kata Mereka Yang{' '}
            <span className="text-electric-blue">
              Sudah Pakai Wedison?
            </span>
          </h2>
          <p className="text-xl text-slate-400">
            Real stories from real customers
          </p>
        </motion.div>
        
        {/* Video Testimonial Carousel */}
        <div className="mb-16">
          <div className="relative max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeVideoIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
                className="bg-slate-800 rounded-2xl overflow-hidden shadow-2xl"
              >
                {/* Video Thumbnail with Unsplash Image */}
                <div className="aspect-video bg-slate-700 flex items-center justify-center relative group overflow-hidden">
                  {/* Placeholder Badge */}
                  <div className="absolute top-4 left-4 z-20 bg-yellow-500 text-black px-4 py-2 rounded-lg font-bold text-sm shadow-lg border-2 border-yellow-600">
                    PLACEHOLDER VIDEO/IMAGE - Upload actual asset
                  </div>
                  <img
                    src={`https://source.unsplash.com/featured/1280x720/?person,portrait,smile`}
                    alt="Testimonial thumbnail"
                    className="absolute inset-0 w-full h-full object-cover opacity-50"
                  />
                  <div className="relative z-10 text-center">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="bg-electric-blue text-white rounded-full p-6 shadow-xl"
                    >
                      <FiPlay className="text-3xl" />
                    </motion.button>
                  </div>
                </div>
                
                {/* Testimonial Info */}
                <div className="p-8">
                  <p className="text-xl italic text-slate-300 mb-4">
                    "{videoTestimonials[activeVideoIndex].quote}"
                  </p>
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="font-bold text-lg">{videoTestimonials[activeVideoIndex].name}</div>
                      <div className="text-slate-400">{videoTestimonials[activeVideoIndex].role}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
            
            {/* Navigation Buttons */}
            <button
              onClick={prevVideo}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm p-3 rounded-full transition-all"
            >
              <FiChevronLeft className="text-2xl" />
            </button>
            <button
              onClick={nextVideo}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm p-3 rounded-full transition-all"
            >
              <FiChevronRight className="text-2xl" />
            </button>
            
            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mt-6">
              {videoTestimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveVideoIndex(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === activeVideoIndex ? 'w-8 bg-electric-blue' : 'w-2 bg-slate-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
        
        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="text-center bg-slate-800 rounded-xl p-6">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              className="text-4xl font-bold text-accent-orange mb-2"
            >
              #1
            </motion.div>
            <div className="text-slate-400">Motor Listrik</div>
            <div className="text-xs text-slate-500 mt-1">Indonesia 2025</div>
          </div>
          
          <div className="text-center bg-slate-800 rounded-xl p-6">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              className="text-4xl font-bold text-success-green mb-2"
            >
              {STATS.stations}
            </motion.div>
            <div className="text-slate-400">SuperCharge Stations</div>
            <div className="text-xs text-slate-500 mt-1">(dan terus bertambah)</div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
