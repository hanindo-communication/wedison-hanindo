'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiCheck, FiPercent, FiCalendar, FiDollarSign } from 'react-icons/fi'
import { BsWhatsapp } from 'react-icons/bs'
import { MODEL_SPECS } from '@/utils/modelSpecs'
import { WHATSAPP_LINKS } from '@/utils/whatsappLinks'
import { trackWhatsAppClick } from '@/utils/analytics'

const FINANCING_BENEFITS = [
  'Cicilan dengan Kredivo',
  'Cicilan hingga 36 bulan',
  'Proses approval cepat',
  'Subsidi pemerintah sudah termasuk',
]

// Financing data from Kredivo/WOM Finance Jan 2026
interface FinancingOption {
  dp: number
  installments: {
    12: number
    18: number
    24: number
    30: number
    36: number
  }
}

interface ModelFinancing {
  otr: number
  discount: number
  options: FinancingOption[]
}

const FINANCING_DATA: Record<string, ModelFinancing> = {
  'mini': {
    otr: 20900000,
    discount: 5000000,
    options: [
      { dp: 3200000, installments: { 12: 1836000, 18: 1332000, 24: 1086000, 30: 941000, 36: 845000 } },
      { dp: 3700000, installments: { 12: 1732000, 18: 1257000, 24: 1026000, 30: 889000, 36: 798000 } },
      { dp: 4200000, installments: { 12: 1628000, 18: 1182000, 24: 965000, 30: 836000, 36: 751000 } },
      { dp: 5300000, installments: { 12: 1420000, 18: 1031000, 24: 841000, 30: 729000, 36: 655000 } },
      { dp: 6300000, installments: { 12: 1212000, 18: 880000, 24: 718000, 30: 622000, 36: 559000 } },
      { dp: 8400000, installments: { 12: 1004000, 18: 729000, 24: 595000, 30: 515000, 36: 463000 } },
    ]
  },
  'athena': {
    otr: 32900000,
    discount: 4000000,
    options: [
      { dp: 5000000, installments: { 12: 2836000, 18: 2057000, 24: 1678000, 30: 1454000, 36: 1306000 } },
      { dp: 5800000, installments: { 12: 2732000, 18: 1982000, 24: 1617000, 30: 1401000, 36: 1258000 } },
      { dp: 6600000, installments: { 12: 2628000, 18: 1907000, 24: 1556000, 30: 1349000, 36: 1210000 } },
      { dp: 8300000, installments: { 12: 2420000, 18: 1756000, 24: 1433000, 30: 1241000, 36: 1114000 } },
      { dp: 9900000, installments: { 12: 2212000, 18: 1605000, 24: 1310000, 30: 1135000, 36: 1019000 } },
      { dp: 13200000, installments: { 12: 2004000, 18: 1454000, 24: 1186000, 30: 1028000, 36: 923000 } },
    ]
  },
  'athena-extended': {
    otr: 35900000,
    discount: 5000000,
    options: [
      { dp: 5400000, installments: { 12: 3096000, 18: 2246000, 24: 1832000, 30: 1587000, 36: 1425000 } },
      { dp: 6300000, installments: { 12: 2992000, 18: 2171000, 24: 1771000, 30: 1534000, 36: 1376000 } },
      { dp: 7200000, installments: { 12: 2888000, 18: 2096000, 24: 1710000, 30: 1482000, 36: 1330000 } },
      { dp: 9000000, installments: { 12: 2680000, 18: 1944000, 24: 1586000, 30: 1374000, 36: 1233000 } },
      { dp: 10800000, installments: { 12: 2472000, 18: 1794000, 24: 1463000, 30: 1268000, 36: 1138000 } },
      { dp: 14400000, installments: { 12: 2264000, 18: 1642000, 24: 1340000, 30: 1161000, 36: 1042000 } },
    ]
  },
  'victory': {
    otr: 33900000,
    discount: 5000000,
    options: [
      { dp: 5100000, installments: { 12: 2916000, 18: 2114000, 24: 1725000, 30: 1495000, 36: 1342000 } },
      { dp: 6000000, installments: { 12: 2812000, 18: 2040000, 24: 1664000, 30: 1442000, 36: 1294000 } },
      { dp: 6800000, installments: { 12: 2708000, 18: 1964000, 24: 1603000, 30: 1389000, 36: 1246000 } },
      { dp: 8500000, installments: { 12: 2500000, 18: 1815000, 24: 1481000, 30: 1283000, 36: 1151000 } },
      { dp: 10200000, installments: { 12: 2292000, 18: 1662000, 24: 1356000, 30: 1175000, 36: 1054000 } },
      { dp: 13600000, installments: { 12: 2084000, 18: 1511000, 24: 1233000, 30: 1068000, 36: 958000 } },
    ]
  },
  'victory-extended': {
    otr: 36900000,
    discount: 7000000,
    options: [
      { dp: 5600000, installments: { 12: 3204000, 18: 2323000, 24: 1895000, 30: 1642000, 36: 1473000 } },
      { dp: 6500000, installments: { 12: 3100000, 18: 2248000, 24: 1834000, 30: 1589000, 36: 1425000 } },
      { dp: 7400000, installments: { 12: 2996000, 18: 2172000, 24: 1773000, 30: 1536000, 36: 1378000 } },
      { dp: 9300000, installments: { 12: 2788000, 18: 2021000, 24: 1650000, 30: 1430000, 36: 1283000 } },
      { dp: 11100000, installments: { 12: 2580000, 18: 1871000, 24: 1526000, 30: 1323000, 36: 1187000 } },
      { dp: 14800000, installments: { 12: 2372000, 18: 1720000, 24: 1403000, 30: 1216000, 36: 1091000 } },
    ]
  },
  'edpower': {
    otr: 53900000,
    discount: 7000000,
    options: [
      { dp: 8100000, installments: { 12: 4636000, 18: 3362000, 24: 2743000, 30: 2377000, 36: 2133000 } },
      { dp: 9500000, installments: { 12: 4532000, 18: 3286000, 24: 2682000, 30: 2324000, 36: 2085000 } },
      { dp: 10800000, installments: { 12: 4428000, 18: 3211000, 24: 2621000, 30: 2271000, 36: 2037000 } },
      { dp: 13500000, installments: { 12: 4220000, 18: 3060000, 24: 2496000, 30: 2164000, 36: 1942000 } },
      { dp: 16200000, installments: { 12: 4012000, 18: 2909000, 24: 2374000, 30: 2058000, 36: 1847000 } },
      { dp: 21600000, installments: { 12: 3804000, 18: 2758000, 24: 2251000, 30: 1951000, 36: 1750000 } },
    ]
  },
}

export default function FinancingSection() {
  // Filter main models only
  const mainModels = MODEL_SPECS.filter((m) => !m.id.includes('-extended'))
  
  const [selectedModel, setSelectedModel] = useState(mainModels[0])
  const [selectedVariant, setSelectedVariant] = useState<'regular' | 'extended'>('regular')
  const [tenure, setTenure] = useState(24)
  const [selectedDpIndex, setSelectedDpIndex] = useState(0)

  // Get actual model ID (with extended variant if selected)
  const actualModelId = selectedVariant === 'extended' && selectedModel.hasExtended
    ? selectedModel.extendedId || selectedModel.id
    : selectedModel.id

  // Get financing data for selected model
  const getModelFinancingKey = (modelId: string): string => {
    // Map model IDs to financing data keys
    if (modelId === 'athena-extended') return 'athena-extended'
    if (modelId === 'victory-extended') return 'victory-extended'
    if (modelId === 'athena') return 'athena'
    if (modelId === 'victory') return 'victory'
    if (modelId === 'edpower') return 'edpower'
    if (modelId === 'mini') return 'mini'
    return 'mini' // default
  }

  const financingKey = getModelFinancingKey(actualModelId)
  const financingData = FINANCING_DATA[financingKey]
  
  // Reset DP index when model or variant changes
  useEffect(() => {
    setSelectedDpIndex(0)
  }, [selectedModel.id, selectedVariant])

  // Get current DP and installment
  const currentDpOption = financingData?.options[selectedDpIndex] || financingData?.options[0]
  const dpAmount = currentDpOption?.dp || 0
  const monthlyPayment = currentDpOption?.installments[tenure as keyof typeof currentDpOption.installments] || 0

  // Monthly savings estimate (average)
  const monthlySavings = 400000 // Rp 400rb average savings
  const netMonthlyCost = monthlyPayment - monthlySavings

  return (
    <section id="financing" className="py-12 md:py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-2 bg-success-green/20 text-success-green rounded-full text-sm font-semibold mb-4">
            Cicilan dengan Kredivo
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Cicilan Lebih Murah{' '}
            <span className="text-success-green">dengan Kredivo</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Hitung simulasi cicilan Kredivo dan lihat berapa yang bisa Anda hemat setiap bulan
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left: Calculator */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white/10 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/10"
          >
            <h3 className="text-2xl font-bold mb-6">Kalkulator Cicilan</h3>

            {/* Model Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-3">
                Pilih Model
              </label>
              <div className="grid grid-cols-2 gap-3">
                {mainModels.map((model) => {
                  const imageMap: Record<string, string> = {
                    'edpower': '/images/models/edpower.png',
                    'athena': '/images/models/athena.png',
                    'victory': '/images/models/victory.png',
                    'mini': '/images/models/mini.png',
                  }
                  const imagePath = imageMap[model.id] || '/images/models/edpower.png'
                  
                  return (
                    <motion.button
                      key={model.id}
                      onClick={() => setSelectedModel(model)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`relative overflow-hidden rounded-2xl border-2 transition-all ${
                        selectedModel.id === model.id
                          ? 'border-success-green shadow-lg shadow-success-green/30'
                          : 'border-white/20 hover:border-white/40 hover:shadow-md'
                      }`}
                    >
                      {/* Background Image */}
                      <div 
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                        style={{ 
                          backgroundImage: `url(${imagePath})`,
                          backgroundSize: '130%',
                          backgroundPosition: 'center 35%',
                        }}
                      />
                      
                      {/* Gradient Overlay */}
                      <div className={`absolute inset-0 ${
                        selectedModel.id === model.id
                          ? 'bg-gradient-to-t from-success-green/95 via-success-green/60 to-success-green/30'
                          : 'bg-gradient-to-t from-slate-900/95 via-slate-900/60 to-slate-900/30'
                      }`} />
                      
                      {/* Content */}
                      <div className="relative z-10 p-4 pt-14 md:pt-16 text-left">
                        <div className="text-lg font-bold text-white mb-0.5">
                          {model.name}
                        </div>
                        <div className={`text-sm font-medium ${
                          selectedModel.id === model.id ? 'text-white/90' : 'text-slate-300'
                        }`}>
                          {model.price}
                        </div>
                        
                        {/* Selected Indicator */}
                        {selectedModel.id === model.id && (
                          <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-3 right-3 w-6 h-6 bg-white rounded-full flex items-center justify-center"
                          >
                            <FiCheck className="text-success-green text-sm" />
                          </motion.div>
                        )}
                      </div>
                    </motion.button>
                  )
                })}
              </div>
              
              {/* Variant toggle */}
              {selectedModel.hasExtended && (
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => setSelectedVariant('regular')}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedVariant === 'regular'
                        ? 'bg-success-green text-white'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    Regular
                  </button>
                  <button
                    onClick={() => setSelectedVariant('extended')}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedVariant === 'extended'
                        ? 'bg-success-green text-white'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    Extended
                  </button>
                </div>
              )}
            </div>

            {/* DP Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-3">
                Pilih Down Payment
              </label>
              <div className="grid grid-cols-2 gap-2">
                {financingData?.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedDpIndex(index)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedDpIndex === index
                        ? 'bg-success-green text-white'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    Rp {(option.dp / 1000000).toFixed(1)}jt
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-2 text-center">
                DP: Rp {dpAmount.toLocaleString('id-ID')}
              </p>
            </div>

            {/* Tenure Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-3">
                Tenor Cicilan
              </label>
              <div className="flex gap-2 flex-wrap">
                {[12, 18, 24, 30, 36].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTenure(t)}
                    disabled={!currentDpOption?.installments[t as keyof typeof currentDpOption.installments]}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      tenure === t
                        ? 'bg-success-green text-white'
                        : currentDpOption?.installments[t as keyof typeof currentDpOption.installments]
                        ? 'bg-white/10 text-white hover:bg-white/20'
                        : 'bg-white/5 text-slate-500 cursor-not-allowed opacity-50'
                    }`}
                  >
                    {t} bulan
                  </button>
                ))}
              </div>
            </div>

            {/* Subsidy & Kredivo Info */}
            <div className="space-y-3 mb-6">
              <div className="bg-success-green/20 rounded-xl p-4 border border-success-green/30">
                <div className="flex items-center gap-2 mb-2">
                  <FiCheck className="text-success-green" />
                  <span className="font-semibold text-success-green">Subsidi Pemerintah</span>
                </div>
                <p className="text-sm text-slate-300">
                  Potongan Rp {financingData?.discount.toLocaleString('id-ID') || '8.000.000'} sudah termasuk
                </p>
              </div>
              <div className="bg-electric-blue/20 rounded-xl p-4 border border-electric-blue/30">
                <div className="flex items-center gap-2 mb-2">
                  <FiCheck className="text-electric-blue" />
                  <span className="font-semibold text-electric-blue">Powered by Kredivo</span>
                </div>
                <p className="text-sm text-slate-300">
                  Cicilan fleksibel dengan proses approval cepat
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right: Results */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Monthly Payment Card */}
            <div className="bg-gradient-to-br from-success-green to-emerald-600 rounded-3xl p-6 md:p-8 text-center">
              <p className="text-white/80 mb-2">Cicilan per Bulan</p>
              <div className="text-5xl md:text-6xl font-bold mb-2">
                Rp {monthlyPayment.toLocaleString('id-ID')}
              </div>
              <p className="text-white/80">
                untuk {tenure} bulan
              </p>
            </div>

            {/* Comparison */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/10">
              <h4 className="text-lg font-semibold mb-4">Perbandingan Biaya Bulanan</h4>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Cicilan Motor</span>
                  <span className="font-bold text-red-400">Rp {monthlyPayment.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Hemat BBM (estimasi)</span>
                  <span className="font-bold text-success-green">- Rp {monthlySavings.toLocaleString('id-ID')}</span>
                </div>
                <div className="border-t border-white/20 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Biaya Bersih/Bulan</span>
                    <span className={`text-2xl font-bold ${netMonthlyCost <= 0 ? 'text-success-green' : 'text-white'}`}>
                      {netMonthlyCost <= 0 ? 'GRATIS!' : `Rp ${netMonthlyCost.toLocaleString('id-ID')}`}
                    </span>
                  </div>
                </div>
              </div>

              {netMonthlyCost <= 0 && (
                <div className="mt-4 bg-success-green/20 rounded-xl p-4 text-center border border-success-green/30">
                  <p className="text-success-green font-semibold">
                    Penghematan BBM menutupi cicilan Anda!
                  </p>
                </div>
              )}
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-2 gap-4">
              {FINANCING_BENEFITS.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-white/5 rounded-lg px-4 py-3"
                >
                  <FiCheck className="text-success-green flex-shrink-0" />
                  <span className="text-sm text-slate-300">{benefit}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <a
              href={WHATSAPP_LINKS.financing}
              onClick={() => trackWhatsAppClick('financing-section')}
              className="flex items-center justify-center gap-2 w-full px-8 py-4 bg-success-green text-white font-bold text-lg rounded-full hover:bg-green-600 transition-all hover:scale-105 shadow-xl"
            >
              <BsWhatsapp className="text-2xl" />
              <span>Konsultasi Cicilan</span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
