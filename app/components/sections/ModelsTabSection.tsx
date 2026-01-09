'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { BsWhatsapp } from 'react-icons/bs'
import { FiChevronDown, FiChevronUp, FiX, FiMaximize2 } from 'react-icons/fi'
import Button from '../ui/Button'
import { WHATSAPP_LINKS } from '@/utils/whatsappLinks'
import { trackWhatsAppClick } from '@/utils/analytics'
import { MODEL_SPECS, type ModelSpec } from '@/utils/modelSpecs'

// Helper function to get model image path - supports multiple extensions
const getModelImagePath = (modelId: string): string => {
  // Map model IDs to image file names - support .png, .jpg, .webp
  // Priority: .png (if exists) > .jpg > .webp
  const imageMap: Record<string, string[]> = {
    'edpower': ['/images/models/edpower.png', '/images/models/edpower.jpg', '/images/models/edpower.webp'],
    'athena': ['/images/models/athena.png', '/images/models/athena.jpg', '/images/models/athena.webp'],
    'athena-extended': ['/images/models/athena-extended.png', '/images/models/athena-extended.jpg', '/images/models/athena-extended.webp'],
    'victory': ['/images/models/victory.png', '/images/models/victory.jpg', '/images/models/victory.webp'],
    'victory-extended': ['/images/models/victory-extended.png', '/images/models/victory-extended.jpg', '/images/models/victory-extended.webp'],
    'mini': ['/images/models/mini.png', '/images/models/mini.jpg', '/images/models/mini.webp'],
  }
  
  // Return first path from array (will try .png first, then .jpg, then .webp)
  // Browser will handle 404 if file doesn't exist, then fallback to Unsplash via onError
  const paths = imageMap[modelId]
  return paths ? paths[0] : `https://source.unsplash.com/featured/800x800/?electric,motorcycle,${modelId}`
}

export default function ModelsTabSection() {
  // Filter only main models (not extended versions)
  const mainModels = MODEL_SPECS.filter((model) => !model.id.includes('-extended'))
  
  const [activeTab, setActiveTab] = useState(0)
  const [selectedVariant, setSelectedVariant] = useState<'regular' | 'extended'>('regular')
  const [showTechnicalSpecs, setShowTechnicalSpecs] = useState(false)
  const [showKeyFeatures, setShowKeyFeatures] = useState(false)
  const [imageError, setImageError] = useState(false) // Track image load errors
  const [imageLoaded, setImageLoaded] = useState(false) // Track successful image load
  const [isImageModalOpen, setIsImageModalOpen] = useState(false) // Modal untuk mobile image view
  const [showSpecs, setShowSpecs] = useState(false) // Toggle untuk specs section
  
  const activeMainModel = mainModels[activeTab]
  const activeModel = selectedVariant === 'extended' && activeMainModel.extendedId
    ? MODEL_SPECS.find((m) => m.id === activeMainModel.extendedId) || activeMainModel
    : activeMainModel

  // Get image path for current model
  const modelImagePath = getModelImagePath(activeModel.id)

  // Listen for model selection from hero section
  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleModelSelect = (event: CustomEvent) => {
      const modelId = event.detail.modelId
      // Remove -extended suffix if present
      const baseModelId = modelId.replace('-extended', '')
      const modelIndex = mainModels.findIndex((model) => model.id === baseModelId)
      if (modelIndex !== -1) {
        setActiveTab(modelIndex)
        setSelectedVariant(modelId.includes('-extended') ? 'extended' : 'regular')
        // Update URL hash
        window.history.pushState(null, '', `#models-${modelId}`)
      }
    }

    // Listen for custom event
    window.addEventListener('selectModel', handleModelSelect as EventListener)

    // Also check URL hash on mount
    const checkHash = () => {
      const hash = window.location.hash
      if (hash.startsWith('#models-')) {
        const modelId = hash.replace('#models-', '')
        const baseModelId = modelId.replace('-extended', '')
        const modelIndex = mainModels.findIndex((model) => model.id === baseModelId)
        if (modelIndex !== -1) {
          setActiveTab(modelIndex)
          setSelectedVariant(modelId.includes('-extended') ? 'extended' : 'regular')
        }
      }
    }

    checkHash()
    window.addEventListener('hashchange', checkHash)

    return () => {
      window.removeEventListener('selectModel', handleModelSelect as EventListener)
      window.removeEventListener('hashchange', checkHash)
    }
  }, [mainModels])

  // Reset accordion state when model changes
  useEffect(() => {
    setShowTechnicalSpecs(false)
    setShowKeyFeatures(false)
    setShowSpecs(false) // Reset specs visibility when model changes
    setImageError(false) // Reset image error when model changes
    setImageLoaded(false) // Reset image loaded state when model changes
  }, [activeTab, selectedVariant])

  // Handle ESC key to close image modal
  useEffect(() => {
    if (!isImageModalOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsImageModalOpen(false)
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isImageModalOpen])

  // Define specs array
  const specs = [
    { label: 'Battery Capacity', value: activeModel.battery },
    { label: 'Range', value: activeModel.range },
    { label: 'Motor Power', value: activeModel.motor },
    { label: 'Max Speed', value: activeModel.maxSpeed },
    ...(activeModel.superCharge ? [{ label: 'SuperCharge', value: activeModel.superCharge }] : []),
  ]

  return (
    <section id="models" className="py-20 bg-white scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-800 mb-4">
            Pilih{' '}
            <span className="text-electric-blue">
              Model Wedison
            </span>
          </h2>
          <p className="text-xl text-slate-600">
            Lihat detail spesifikasi dan fitur setiap model
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-2 md:gap-4 border-b border-slate-200 overflow-x-auto mb-4">
            {mainModels.map((model, index) => (
              <button
                key={model.id}
                onClick={() => {
                  setActiveTab(index)
                  setSelectedVariant('regular') // Reset to regular when switching models
                  // Update URL hash
                  if (typeof window !== 'undefined') {
                    window.history.pushState(null, '', `#models-${model.id}`)
                  }
                }}
                className={`relative px-4 md:px-6 py-3 font-semibold transition-colors whitespace-nowrap ${
                  activeTab === index
                    ? 'text-electric-blue'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {model.name}
                {activeTab === index && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-electric-blue"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
          
          {/* Variant Selection (Regular/Extended) */}
          {activeMainModel.hasExtended && (
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={() => {
                  setSelectedVariant('regular')
                  if (typeof window !== 'undefined') {
                    window.history.pushState(null, '', `#models-${activeMainModel.id}`)
                  }
                }}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  selectedVariant === 'regular'
                    ? 'bg-electric-blue text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Regular
              </button>
              <button
                onClick={() => {
                  setSelectedVariant('extended')
                  if (typeof window !== 'undefined') {
                    window.history.pushState(null, '', `#models-${activeMainModel.extendedId}`)
                  }
                }}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  selectedVariant === 'extended'
                    ? 'bg-electric-blue text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Extended <span className="text-xs opacity-80">(Baterai Lebih Besar)</span>
              </button>
            </div>
          )}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeModel.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid lg:grid-cols-2 gap-12"
          >
            {/* Left: Image/Visual - Desktop only, Mobile as background */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="hidden lg:block relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200"
            >
              {/* Placeholder Badge - hanya muncul jika menggunakan local image path dan belum load */}
              {modelImagePath.startsWith('/images/models/') && !imageLoaded && !imageError && (
                <div className="absolute top-4 left-4 z-20 bg-yellow-500 text-black px-4 py-2 rounded-lg font-bold text-sm shadow-lg border-2 border-yellow-600">
                  PLACEHOLDER IMAGE - Upload actual asset
                  <div className="text-xs mt-1 opacity-80">Path: {modelImagePath}</div>
                </div>
              )}
              <Image
                src={imageError ? `https://source.unsplash.com/featured/800x800/?electric,motorcycle,${activeModel.name.toLowerCase()}` : modelImagePath}
                alt={`${activeModel.name} - Wedison Electric Motorcycle`}
                fill
                className="object-cover"
                priority={activeTab === 0}
                sizes="50vw"
                onError={() => {
                  setImageError(true)
                  setImageLoaded(false)
                }}
                onLoad={(e) => {
                  // Check if image is actually loaded (for cached images)
                  const target = e.target as HTMLImageElement
                  if (target.complete && target.naturalWidth > 0 && target.naturalHeight > 0) {
                    setImageLoaded(true)
                    setImageError(false)
                  }
                }}
                onLoadingComplete={() => {
                  setImageLoaded(true)
                  setImageError(false)
                }}
                unoptimized={modelImagePath.startsWith('/images/models/') ? false : true}
              />
            </motion.div>

            {/* Mobile: Background Image Container */}
            <div
              className="lg:hidden relative min-h-[400px] rounded-2xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200"
              style={{
                backgroundImage: `url(${imageError ? `https://source.unsplash.com/featured/800x800/?electric,motorcycle,${activeModel.name.toLowerCase()}` : modelImagePath})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            >
              {/* Placeholder Badge - hanya muncul jika menggunakan local image path dan belum load */}
              {modelImagePath.startsWith('/images/models/') && !imageLoaded && !imageError && (
                <div className="absolute top-4 left-4 z-20 bg-yellow-500 text-black px-4 py-2 rounded-lg font-bold text-sm shadow-lg border-2 border-yellow-600">
                  PLACEHOLDER IMAGE - Upload actual asset
                  <div className="text-xs mt-1 opacity-80">Path: {modelImagePath}</div>
                </div>
              )}
              {/* Hidden img tag untuk error handling dan load detection */}
              <img
                src={modelImagePath}
                alt=""
                className="hidden"
                onError={() => {
                  setImageError(true)
                  setImageLoaded(false)
                }}
                onLoad={(e) => {
                  // Check if image is actually loaded (for cached images)
                  const target = e.target as HTMLImageElement
                  if (target.complete && target.naturalWidth > 0 && target.naturalHeight > 0) {
                    setImageLoaded(true)
                    setImageError(false)
                  }
                }}
              />
              {/* Overlay untuk readability - lebih gelap untuk kontras teks */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/85" />
            </div>

            {/* Right: Specs & Details - Mobile overlay, Desktop normal */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-8 lg:relative relative -mt-[350px] lg:mt-0 z-10"
            >
              {/* Mobile: Solid background untuk konten agar teks mudah dibaca */}
              <div className="lg:hidden bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-2xl border-2 border-slate-200 space-y-6">
                {/* Header */}
              <div>
                <div className={`inline-block ${activeModel.badgeColor || 'bg-electric-blue'} text-white px-4 py-2 rounded-full text-sm font-semibold mb-4 shadow-lg`}>
                  {activeModel.badge}
                </div>
                <h3 className="text-4xl sm:text-5xl font-bold text-slate-800 mb-4">
                  {activeModel.name}
                </h3>
                
                {/* Button Lihat Detail Motor - Mobile Only */}
                <button
                  onClick={() => setIsImageModalOpen(true)}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-electric-blue text-white font-semibold rounded-lg hover:bg-electric-blue/90 transition-all hover:scale-105 shadow-lg mb-4"
                >
                  <FiMaximize2 className="text-xl" />
                  <span>Lihat Detail Motor</span>
                </button>
              </div>

              {/* Key Specs Toggle Button */}
              <div className="bg-slate-50 rounded-xl border-2 border-slate-200 overflow-hidden">
                <button
                  onClick={() => setShowSpecs(!showSpecs)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-100 transition-colors"
                >
                  <h4 className="text-xl font-bold text-slate-800">Spesifikasi</h4>
                  <motion.div
                    animate={{ rotate: showSpecs ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FiChevronDown className="text-2xl text-slate-600" />
                  </motion.div>
                </button>

                {/* Key Specs Grid - Collapsible */}
                <AnimatePresence>
                  {showSpecs && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 pt-0">
                        <div className="grid grid-cols-2 gap-4">
                          {specs.map((spec, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.1 + index * 0.05 }}
                              className="bg-white rounded-xl p-6 border-2 border-slate-200"
                            >
                              <div className="text-sm text-slate-600 mb-2">{spec.label}</div>
                              <div className="text-2xl font-bold text-slate-800">{spec.value}</div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Additional Technical Specs - Accordion */}
              {(activeModel.acceleration || activeModel.braking || activeModel.suspension || activeModel.tire || activeModel.groundClearance || activeModel.weight || activeModel.warranty) && (
                <div className="bg-slate-50 rounded-xl border-2 border-slate-200 overflow-hidden">
                  {/* Accordion Header */}
                  <button
                    onClick={() => setShowTechnicalSpecs(!showTechnicalSpecs)}
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-100 transition-colors"
                  >
                    <h4 className="text-xl font-bold text-slate-800">Spesifikasi Teknis</h4>
                    <motion.div
                      animate={{ rotate: showTechnicalSpecs ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FiChevronDown className="text-2xl text-slate-600" />
                    </motion.div>
                  </button>

                  {/* Accordion Content */}
                  <AnimatePresence>
                    {showTechnicalSpecs && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 space-y-6">
                          {/* Performance & Handling */}
                          {(activeModel.acceleration || activeModel.braking || activeModel.suspension) && (
                            <div>
                              <h5 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">Performance & Handling</h5>
                              <div className="grid md:grid-cols-2 gap-4">
                                {activeModel.acceleration && (
                                  <div className="flex justify-between items-start py-2 border-b border-slate-100">
                                    <span className="text-slate-600 font-medium">Akselerasi</span>
                                    <span className="text-slate-800 text-right font-semibold">{activeModel.acceleration}</span>
                                  </div>
                                )}
                                {activeModel.braking && (
                                  <div className="flex justify-between items-start py-2 border-b border-slate-100">
                                    <span className="text-slate-600 font-medium">Sistem Rem</span>
                                    <span className="text-slate-800 text-right font-semibold">{activeModel.braking}</span>
                                  </div>
                                )}
                                {activeModel.suspension && (
                                  <div className="flex justify-between items-start py-2 border-b border-slate-100">
                                    <span className="text-slate-600 font-medium">Suspensi</span>
                                    <span className="text-slate-800 text-right font-semibold">{activeModel.suspension}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Physical Specs */}
                          {(activeModel.tire || activeModel.groundClearance || activeModel.weight) && (
                            <div>
                              <h5 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">Dimensi & Fisik</h5>
                              <div className="grid md:grid-cols-2 gap-4">
                                {activeModel.tire && (
                                  <div className="flex justify-between items-start py-2 border-b border-slate-100">
                                    <span className="text-slate-600 font-medium">Ukuran Ban</span>
                                    <span className="text-slate-800 text-right font-semibold">{activeModel.tire}</span>
                                  </div>
                                )}
                                {activeModel.groundClearance && (
                                  <div className="flex justify-between items-start py-2 border-b border-slate-100">
                                    <span className="text-slate-600 font-medium">Ground Clearance</span>
                                    <span className="text-slate-800 text-right font-semibold">{activeModel.groundClearance}</span>
                                  </div>
                                )}
                                {activeModel.weight && (
                                  <div className="flex justify-between items-start py-2 border-b border-slate-100">
                                    <span className="text-slate-600 font-medium">Berat</span>
                                    <span className="text-slate-800 text-right font-semibold">{activeModel.weight}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Warranty */}
                          {activeModel.warranty && (
                            <div>
                              <h5 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">Garansi</h5>
                              <div className="bg-success-green/10 rounded-lg p-4 border border-success-green/20">
                                <div className="flex items-center gap-2">
                                  <span className="text-slate-800 font-semibold">{activeModel.warranty}</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Features List - Accordion */}
              <div className="bg-slate-50 rounded-xl border-2 border-slate-200 overflow-hidden">
                {/* Accordion Header */}
                <button
                  onClick={() => setShowKeyFeatures(!showKeyFeatures)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-100 transition-colors"
                >
                  <h4 className="text-xl font-bold text-slate-800">Key Features</h4>
                  <motion.div
                    animate={{ rotate: showKeyFeatures ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FiChevronDown className="text-2xl text-slate-600" />
                  </motion.div>
                </button>

                {/* Accordion Content */}
                <AnimatePresence>
                  {showKeyFeatures && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6">
                        <div className="grid md:grid-cols-2 gap-3">
                          {activeModel.features.map((feature, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.1 + index * 0.03 }}
                              className="flex items-center gap-2"
                            >
                              <span className="text-slate-700">{feature}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Financing CTA */}
              <div className="bg-electric-blue/10 rounded-xl p-6 border-2 border-electric-blue/20">
                <div className="text-center">
                  <Button
                    href="#financing"
                    variant="outline"
                    size="large"
                    className="w-full"
                  >
                    <span>Cek Simulasi Kredit</span>
                  </Button>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  href={WHATSAPP_LINKS[activeModel.whatsappLink as keyof typeof WHATSAPP_LINKS] || WHATSAPP_LINKS.general}
                  onClick={() => trackWhatsAppClick(`model-tab-${activeModel.id}`)}
                  variant="primary"
                  size="large"
                  className="flex-1"
                >
                  <BsWhatsapp className="text-2xl" />
                  <span>Chat WhatsApp - Info Lengkap</span>
                </Button>
                <Button
                  href="#showroom"
                  variant="outline"
                  size="large"
                  className="flex-1"
                >
                  <span>Test Drive</span>
                </Button>
              </div>
              </div>

              {/* Desktop: Normal container */}
              <div className="hidden lg:block space-y-8">
                {/* Header */}
                <div>
                  <div className={`inline-block ${activeModel.badgeColor || 'bg-electric-blue'} text-white px-4 py-2 rounded-full text-sm font-semibold mb-4`}>
                    {activeModel.badge}
                  </div>
                  <h3 className="text-4xl sm:text-5xl font-bold text-slate-800 mb-4">
                    {activeModel.name}
                  </h3>
                </div>

                {/* Key Specs Toggle Button */}
                <div className="bg-slate-50 rounded-xl border-2 border-slate-200 overflow-hidden">
                  <button
                    onClick={() => setShowSpecs(!showSpecs)}
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-100 transition-colors"
                  >
                    <h4 className="text-xl font-bold text-slate-800">Spesifikasi</h4>
                    <motion.div
                      animate={{ rotate: showSpecs ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FiChevronDown className="text-2xl text-slate-600" />
                    </motion.div>
                  </button>

                  {/* Key Specs Grid - Collapsible */}
                  <AnimatePresence>
                    {showSpecs && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="p-6 pt-0">
                          <div className="grid grid-cols-2 gap-4">
                            {specs.map((spec, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.1 + index * 0.05 }}
                                className="bg-white rounded-xl p-6 border-2 border-slate-200"
                              >
                                <div className="text-sm text-slate-600 mb-2">{spec.label}</div>
                                <div className="text-2xl font-bold text-slate-800">{spec.value}</div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Additional Technical Specs - Accordion */}
                {(activeModel.acceleration || activeModel.braking || activeModel.suspension || activeModel.tire || activeModel.groundClearance || activeModel.weight || activeModel.warranty) && (
                  <div className="bg-white rounded-xl border-2 border-slate-200 overflow-hidden">
                    {/* Accordion Header */}
                    <button
                      onClick={() => setShowTechnicalSpecs(!showTechnicalSpecs)}
                      className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors"
                    >
                      <h4 className="text-xl font-bold text-slate-800">Spesifikasi Teknis</h4>
                      <motion.div
                        animate={{ rotate: showTechnicalSpecs ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <FiChevronDown className="text-2xl text-slate-600" />
                      </motion.div>
                    </button>

                    {/* Accordion Content */}
                    <AnimatePresence>
                      {showTechnicalSpecs && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-6 space-y-6">
                            {/* Performance & Handling */}
                            {(activeModel.acceleration || activeModel.braking || activeModel.suspension) && (
                              <div>
                                <h5 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">Performance & Handling</h5>
                                <div className="grid md:grid-cols-2 gap-4">
                                  {activeModel.acceleration && (
                                    <div className="flex justify-between items-start py-2 border-b border-slate-100">
                                      <span className="text-slate-600 font-medium">Akselerasi</span>
                                      <span className="text-slate-800 text-right font-semibold">{activeModel.acceleration}</span>
                                    </div>
                                  )}
                                  {activeModel.braking && (
                                    <div className="flex justify-between items-start py-2 border-b border-slate-100">
                                      <span className="text-slate-600 font-medium">Sistem Rem</span>
                                      <span className="text-slate-800 text-right font-semibold">{activeModel.braking}</span>
                                    </div>
                                  )}
                                  {activeModel.suspension && (
                                    <div className="flex justify-between items-start py-2 border-b border-slate-100">
                                      <span className="text-slate-600 font-medium">Suspensi</span>
                                      <span className="text-slate-800 text-right font-semibold">{activeModel.suspension}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Physical Specs */}
                            {(activeModel.tire || activeModel.groundClearance || activeModel.weight) && (
                              <div>
                                <h5 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">Dimensi & Fisik</h5>
                                <div className="grid md:grid-cols-2 gap-4">
                                  {activeModel.tire && (
                                    <div className="flex justify-between items-start py-2 border-b border-slate-100">
                                      <span className="text-slate-600 font-medium">Ukuran Ban</span>
                                      <span className="text-slate-800 text-right font-semibold">{activeModel.tire}</span>
                                    </div>
                                  )}
                                  {activeModel.groundClearance && (
                                    <div className="flex justify-between items-start py-2 border-b border-slate-100">
                                      <span className="text-slate-600 font-medium">Ground Clearance</span>
                                      <span className="text-slate-800 text-right font-semibold">{activeModel.groundClearance}</span>
                                    </div>
                                  )}
                                  {activeModel.weight && (
                                    <div className="flex justify-between items-start py-2 border-b border-slate-100">
                                      <span className="text-slate-600 font-medium">Berat</span>
                                      <span className="text-slate-800 text-right font-semibold">{activeModel.weight}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Warranty */}
                            {activeModel.warranty && (
                              <div>
                                <h5 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">Garansi</h5>
                                <div className="bg-success-green/10 rounded-lg p-4 border border-success-green/20">
                                  <div className="flex items-center gap-2">
                                    <span className="text-slate-800 font-semibold">{activeModel.warranty}</span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* Features List - Accordion */}
                <div className="bg-white rounded-xl border-2 border-slate-200 overflow-hidden">
                  {/* Accordion Header */}
                  <button
                    onClick={() => setShowKeyFeatures(!showKeyFeatures)}
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors"
                  >
                    <h4 className="text-xl font-bold text-slate-800">Key Features</h4>
                    <motion.div
                      animate={{ rotate: showKeyFeatures ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FiChevronDown className="text-2xl text-slate-600" />
                    </motion.div>
                  </button>

                  {/* Accordion Content */}
                  <AnimatePresence>
                    {showKeyFeatures && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6">
                          <div className="grid md:grid-cols-2 gap-3">
                            {activeModel.features.map((feature, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 + index * 0.03 }}
                                className="flex items-center gap-2"
                              >
                                <span className="text-slate-700">{feature}</span>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Financing CTA */}
                <div className="bg-gradient-to-br from-electric-blue/10 to-cyan-50 rounded-xl p-6 border-2 border-electric-blue/20">
                  <div className="text-center">
                    <Button
                      href="#financing"
                      variant="outline"
                      size="large"
                      className="w-full"
                    >
                      <span>Cek Simulasi Kredit</span>
                    </Button>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    href={WHATSAPP_LINKS[activeModel.whatsappLink as keyof typeof WHATSAPP_LINKS] || WHATSAPP_LINKS.general}
                    onClick={() => trackWhatsAppClick(`model-tab-${activeModel.id}`)}
                    variant="primary"
                    size="large"
                    className="flex-1"
                  >
                    <BsWhatsapp className="text-2xl" />
                    <span>Chat WhatsApp - Info Lengkap</span>
                  </Button>
                  <Button
                    href="#showroom"
                    variant="outline"
                    size="large"
                    className="flex-1"
                  >
                    <span>Test Drive</span>
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Image Modal/Popup - Mobile Only */}
      <AnimatePresence>
        {isImageModalOpen && (
          <motion.div
            key="image-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm lg:hidden"
            onClick={() => setIsImageModalOpen(false)}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsImageModalOpen(false)}
              className="absolute top-4 right-4 z-50 bg-white/20 hover:bg-white/30 backdrop-blur-md p-3 rounded-full transition-all hover:scale-110 text-white"
              aria-label="Close modal"
            >
              <FiX className="text-2xl" />
            </button>

            {/* Image Container */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-full max-h-[90vh] w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()} // Prevent close when clicking on image
            >
              <img
                src={imageError ? `https://source.unsplash.com/featured/800x800/?electric,motorcycle,${activeModel.name.toLowerCase()}` : modelImagePath}
                alt={`${activeModel.name} - Wedison Electric Motorcycle`}
                className="max-w-full max-h-full w-auto h-auto object-contain rounded-lg shadow-2xl"
              />
            </motion.div>

            {/* Model Info Overlay */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center text-white bg-black/50 backdrop-blur-md px-6 py-3 rounded-lg"
            >
              <div className="font-bold text-lg">{activeModel.name}</div>
            </motion.div>

            {/* Instruction Text */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="absolute top-20 left-1/2 -translate-x-1/2 text-white/80 text-sm text-center"
            >
              Klik di luar gambar atau tekan X untuk menutup
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  )
}
