'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { BsWhatsapp } from 'react-icons/bs'
import { FiChevronDown, FiCheck, FiZap, FiBattery, FiDollarSign, FiUsers } from 'react-icons/fi'
import Button from '../ui/Button'
import { WHATSAPP_LINKS } from '@/utils/whatsappLinks'
import { trackWhatsAppClick } from '@/utils/analytics'
import { MODEL_SPECS, type ModelSpec } from '@/utils/modelSpecs'

// Best For badges for each model
const BEST_FOR: Record<string, { label: string; icon: typeof FiUsers }> = {
  edpower: { label: 'Pengemudi Ojol Profesional', icon: FiUsers },
  athena: { label: 'Daily Commuter', icon: FiUsers },
  victory: { label: 'Budget-Conscious', icon: FiDollarSign },
  bees: { label: 'City Rider', icon: FiZap },
}

// Monthly savings estimate per model
const MONTHLY_SAVINGS: Record<string, number> = {
  edpower: 500000, // Rp 500rb/bulan
  athena: 350000,
  'athena-extended': 400000,
  victory: 350000,
  'victory-extended': 400000,
  mini: 250000,
}

const getModelImagePath = (modelId: string): string => {
  const imageMap: Record<string, string> = {
    'edpower': '/images/models/edpower.png',
    'athena': '/images/models/athena.png',
    'athena-extended': '/images/models/athena-extended.png',
    'victory': '/images/models/victory.png',
    'victory-extended': '/images/models/victory-extended.png',
    'bees': '/images/models/bees.png',
  }
  return imageMap[modelId] || '/images/models/default.png'
}

export default function ModelsTabSection() {
  const mainModels = MODEL_SPECS.filter((model) => !model.id.includes('-extended'))
  
  const [activeTab, setActiveTab] = useState(0)
  const [selectedVariant, setSelectedVariant] = useState<'regular' | 'extended'>('regular')
  const [showSpecs, setShowSpecs] = useState(false)
  const [imageError, setImageError] = useState(false)
  
  const activeMainModel = mainModels[activeTab]
  const activeModel = selectedVariant === 'extended' && activeMainModel.extendedId
    ? MODEL_SPECS.find((m) => m.id === activeMainModel.extendedId) || activeMainModel
    : activeMainModel

  const modelImagePath = getModelImagePath(activeModel.id)
  const bestFor = BEST_FOR[activeMainModel.id]
  const monthlySavings = MONTHLY_SAVINGS[activeModel.id] || 300000

  useEffect(() => {
    setShowSpecs(false)
    setImageError(false)
  }, [activeTab, selectedVariant])

  const specs = [
    { label: 'Range', value: activeModel.range, highlight: true },
    { label: 'Battery', value: activeModel.battery },
    { label: 'Motor', value: activeModel.motor },
    { label: 'Max Speed', value: activeModel.maxSpeed },
    ...(activeModel.superCharge ? [{ label: 'SuperCharge', value: activeModel.superCharge, highlight: true }] : []),
  ]

  return (
    <section 
      id="models" 
      className="py-12 md:py-20 bg-white scroll-mt-16 relative overflow-hidden"
    >
      {/* Background Image dengan opacity 15% - Full Section Viewport */}
      <motion.div
        key={activeModel.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `url(${modelImagePath})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      
      {/* Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span className="inline-block px-4 py-2 bg-electric-blue/10 text-electric-blue rounded-full text-sm font-semibold mb-4">
            Pilihan Model
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 mb-4">
            Mulai dari{' '}
            <span className="text-success-green">Rp 15 Juta</span>
          </h2>
          <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto">
            Hemat hingga Rp 500rb/bulan dengan model yang sesuai kebutuhan Anda
          </p>
        </motion.div>

        {/* Model Cards - Mobile Horizontal Scroll */}
        <div className="mb-8 overflow-x-auto -mx-4 px-4 pb-4 md:overflow-visible md:mx-0 md:px-0">
          <div className="flex md:grid md:grid-cols-4 gap-3 md:gap-4 min-w-max md:min-w-0">
            {mainModels.map((model, index) => {
              const modelBestFor = BEST_FOR[model.id]
              const modelSavings = MONTHLY_SAVINGS[model.id] || 300000
              
              return (
                <button
                  key={model.id}
                  onClick={() => {
                    setActiveTab(index)
                    setSelectedVariant('regular')
                  }}
                  className={`relative w-[160px] md:w-auto p-4 rounded-2xl border-2 transition-all text-left ${
                    activeTab === index
                      ? 'border-electric-blue bg-electric-blue/5 shadow-lg'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  {/* Best For Badge */}
                  {modelBestFor && (
                    <span className={`absolute -top-2 left-4 px-2 py-0.5 text-xs font-semibold rounded-full ${
                      activeTab === index
                        ? 'bg-electric-blue text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {modelBestFor.label}
                    </span>
                  )}
                  
                  <div className="pt-2">
                    <h3 className={`text-lg font-bold ${
                      activeTab === index ? 'text-electric-blue' : 'text-slate-800'
                    }`}>
                      {model.name}
                    </h3>
                    <p className="text-sm text-slate-500 mb-2">{model.range}</p>
                    <p className={`text-base font-bold ${
                      activeTab === index ? 'text-success-green' : 'text-slate-700'
                    }`}>
                      {model.price}
                    </p>
                    <p className="text-xs text-success-green mt-1">
                      Hemat ~Rp {(modelSavings / 1000).toFixed(0)}rb/bulan
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Variant Selection */}
        {activeMainModel.hasExtended && (
          <div className="flex justify-center gap-3 mb-8">
            <button
              onClick={() => setSelectedVariant('regular')}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                selectedVariant === 'regular'
                  ? 'bg-electric-blue text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Regular
            </button>
            <button
              onClick={() => setSelectedVariant('extended')}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                selectedVariant === 'extended'
                  ? 'bg-electric-blue text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Extended (Baterai Lebih Besar)
            </button>
          </div>
        )}

        {/* Model Detail Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeModel.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-br from-slate-50 to-white rounded-3xl shadow-xl border-2 border-slate-100 overflow-hidden"
          >
            <div className="grid lg:grid-cols-2">
              {/* Left: Image */}
              <div className="relative aspect-square lg:aspect-auto bg-gradient-to-br from-slate-100 to-slate-200 p-8 flex items-center justify-center">
                <div className="relative w-full h-full max-w-md">
                  <Image
                    src={imageError 
                      ? `https://source.unsplash.com/featured/600x600/?electric,motorcycle,${activeModel.name.toLowerCase()}`
                      : modelImagePath
                    }
                    alt={`${activeModel.name} - Wedison Electric Motorcycle`}
                    fill
                    className="object-contain"
                    priority={activeTab === 0}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    onError={() => setImageError(true)}
                  />
                </div>
                
                {/* Savings Badge */}
                <div className="absolute top-4 left-4 bg-success-green text-white px-4 py-2 rounded-full shadow-lg">
                  <span className="font-bold">Hemat ~Rp {(monthlySavings / 1000).toFixed(0)}rb/bulan</span>
                </div>
              </div>

              {/* Right: Details */}
              <div className="p-6 md:p-8 space-y-6">
                {/* Header */}
                <div>
                  <div className={`inline-block ${activeModel.badgeColor || 'bg-electric-blue'} text-white px-4 py-1.5 rounded-full text-sm font-semibold mb-3`}>
                    {activeModel.badge}
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
                    {activeModel.name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="text-2xl font-bold text-success-green">{activeModel.price}</span>
                    <span className="text-sm text-slate-500 line-through">
                      Rp {(parseInt(activeModel.price.replace(/[^0-9]/g, '')) + 8000000).toLocaleString('id-ID')}
                    </span>
                    <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-semibold">
                      -Rp 8jt Subsidi
                    </span>
                  </div>
                </div>

                {/* Quick Specs */}
                <div className="grid grid-cols-2 gap-3">
                  {specs.slice(0, 4).map((spec, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-xl ${
                        spec.highlight
                          ? 'bg-electric-blue/10 border-2 border-electric-blue/20'
                          : 'bg-slate-100'
                      }`}
                    >
                      <div className="text-xs text-slate-600 mb-1">{spec.label}</div>
                      <div className={`text-lg font-bold ${
                        spec.highlight ? 'text-electric-blue' : 'text-slate-800'
                      }`}>
                        {spec.value}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Expandable Specs */}
                <div className="border-2 border-slate-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setShowSpecs(!showSpecs)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
                  >
                    <span className="font-semibold text-slate-800">Lihat Spesifikasi Lengkap</span>
                    <motion.div
                      animate={{ rotate: showSpecs ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FiChevronDown className="text-xl text-slate-600" />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {showSpecs && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden border-t border-slate-200"
                      >
                        <div className="p-4 space-y-3">
                          {activeModel.features.map((feature, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <FiCheck className="text-success-green flex-shrink-0" />
                              <span className="text-sm text-slate-700">{feature}</span>
                            </div>
                          ))}
                          {activeModel.warranty && (
                            <div className="mt-4 pt-4 border-t border-slate-200">
                              <div className="bg-success-green/10 rounded-lg p-3 text-sm text-success-green font-medium">
                                Garansi: {activeModel.warranty}
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Financing Quick Info */}
                <div className="bg-slate-100 rounded-xl p-4">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-slate-600">Cicilan mulai</p>
                      <p className="text-xl font-bold text-slate-800">{activeModel.monthly}/bulan</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">DP mulai</p>
                      <p className="text-xl font-bold text-slate-800">{activeModel.dp}</p>
                    </div>
                    <Button
                      href="#financing"
                      variant="outline"
                      size="medium"
                    >
                      Simulasi Cicilan
                    </Button>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    href={WHATSAPP_LINKS[activeModel.whatsappLink as keyof typeof WHATSAPP_LINKS] || WHATSAPP_LINKS.general}
                    onClick={() => trackWhatsAppClick(`model-${activeModel.id}`)}
                    variant="primary"
                    size="large"
                    className="flex-1"
                  >
                    <BsWhatsapp className="text-xl" />
                    <span>Info Lengkap</span>
                  </Button>
                  <Button
                    href="#showroom"
                    variant="outline"
                    size="large"
                    className="flex-1"
                  >
                    Test Drive
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
