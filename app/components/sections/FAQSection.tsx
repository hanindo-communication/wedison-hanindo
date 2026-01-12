'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiPlus, FiMinus, FiDollarSign, FiZap, FiTrendingUp, FiShield } from 'react-icons/fi'
import { BsWhatsapp } from 'react-icons/bs'
import { WHATSAPP_LINKS } from '@/utils/whatsappLinks'
import { trackWhatsAppClick } from '@/utils/analytics'

interface FAQItem {
  question: string
  answer: string
}

interface FAQCategory {
  id: string
  name: string
  icon: typeof FiDollarSign
  items: FAQItem[]
}

const FAQ_CATEGORIES: FAQCategory[] = [
  {
    id: 'hemat-biaya',
    name: 'Hemat Biaya',
    icon: FiDollarSign,
    items: [
      {
        question: 'Berapa banyak yang bisa dihemat dengan motor listrik Wedison?',
        answer: 'Dengan motor listrik Wedison, Anda bisa hemat hingga Rp 300.000 - Rp 500.000 per bulan dibanding motor bensin, tergantung penggunaan. Tidak perlu beli bensin lagi, hanya perlu listrik yang jauh lebih murah.',
      },
      {
        question: 'Berapa biaya listrik untuk charge motor?',
        answer: 'Biaya listrik untuk sekali charge penuh hanya sekitar Rp 5.000 - Rp 10.000, setara dengan biaya bensin untuk 1-2 liter. Sangat hemat dibanding motor bensin!',
      },
      {
        question: 'Berapa biaya maintenance motor listrik?',
        answer: 'Biaya maintenance motor listrik jauh lebih rendah karena tidak perlu ganti oli, busi, atau filter. Hanya perlu cek rem dan ban secara berkala. Baterai dilindungi garansi 3 tahun.',
      },
      {
        question: 'Apakah benar motor listrik lebih hemat untuk ojol?',
        answer: 'Sangat benar! Untuk ojol yang pakai motor setiap hari, penghematan bisa mencapai Rp 500.000+ per bulan. Bensin harian bisa dihilangkan, diganti dengan listrik yang jauh lebih murah.',
      },
    ],
  },
  {
    id: 'harga-financing',
    name: 'Harga & Pembiayaan',
    icon: FiDollarSign,
    items: [
      {
        question: 'Berapa harga motor listrik Wedison?',
        answer: 'Harga mulai dari Rp 15 jutaan tergantung model. Model Bees paling terjangkau, sementara EdPower dengan fitur lengkap. Semua harga sudah termasuk baterai dan charger.',
      },
      {
        question: 'Apakah ada opsi cicilan?',
        answer: 'Ya! Kami menyediakan berbagai opsi pembiayaan termasuk DP 0%, cicilan Kredivo, dan berbagai pilihan tenor. Cicilan mulai dari Rp 400.000-an per bulan tergantung model dan DP.',
      },
      {
        question: 'Berapa DP minimal yang dibutuhkan?',
        answer: 'DP mulai dari 0% tersedia dengan berbagai pilihan pembiayaan. DP yang lebih besar akan membuat cicilan bulanan lebih ringan. Hubungi kami untuk simulasi pembiayaan yang sesuai budget Anda.',
      },
      {
        question: 'Apakah ada promo atau diskon khusus?',
        answer: 'Kami sering memiliki promo dan penawaran khusus. Hubungi tim sales kami via WhatsApp untuk informasi promo terbaru dan penawaran terbaik hari ini.',
      },
    ],
  },
  {
    id: 'performa',
    name: 'Performa & Penggunaan',
    icon: FiTrendingUp,
    items: [
      {
        question: 'Berapa jarak tempuh per sekali charge?',
        answer: 'Range bervariasi per model: Bees 80km, Athena 100km (Extended 130km), Victory 100km (Extended 130km), dan EdPower 135km per charge. Cukup untuk penggunaan sehari-hari hingga ojol.',
      },
      {
        question: 'Berapa kecepatan maksimal motor Wedison?',
        answer: 'Kecepatan maksimal: Bees 60 km/h, Athena & Victory 75 km/h, dan EdPower 85 km/h. Cukup untuk penggunaan jalanan kota dan jalan tol.',
      },
      {
        question: 'Apakah kuat untuk naik tanjakan?',
        answer: 'Ya! Motor Wedison dilengkapi motor bertenaga yang mampu menanjak hingga 15 derajat dengan boncengan. Torsi instan memberikan akselerasi yang responsif.',
      },
      {
        question: 'Berapa lama waktu charge baterai?',
        answer: 'Dengan charger standar di rumah, pengisian penuh membutuhkan 2-4 jam tergantung model. Dengan SuperCharge, hanya 15 menit untuk 10-80%, sangat cepat untuk pengisian saat di perjalanan.',
      },
      {
        question: 'Apakah bisa digunakan untuk ojol full-time?',
        answer: 'Sangat bisa! Terutama model EdPower dengan range 135km. Dengan SuperCharge 15 menit, Anda bisa charge sambil istirahat dan lanjut bekerja. Banyak ojol yang sudah menggunakan motor listrik Wedison.',
      },
    ],
  },
  {
    id: 'garansi',
    name: 'Garansi & Keamanan',
    icon: FiShield,
    items: [
      {
        question: 'Berapa lama garansi motor Wedison?',
        answer: 'Garansi baterai 3 tahun dan motor 2 tahun. Garansi mencakup kerusakan akibat cacat produksi. Baterai adalah komponen paling mahal dan sudah dilindungi garansi panjang.',
      },
      {
        question: 'Apakah aman digunakan saat hujan?',
        answer: 'Ya, motor Wedison dirancang tahan terhadap kondisi hujan normal. Baterai memiliki proteksi IP67 yang tahan air. Aman digunakan sehari-hari termasuk saat hujan.',
      },
      {
        question: 'Di mana saya bisa servis motor?',
        answer: 'Anda bisa mengunjungi Experience Center Wedison untuk servis berkala, perbaikan, atau konsultasi. Lokasi tersedia di beberapa kota besar. Hubungi kami untuk lokasi terdekat.',
      },
      {
        question: 'Berapa lama umur baterai?',
        answer: 'Baterai Wedison dirancang untuk bertahan hingga 2000+ siklus pengisian, yang setara dengan penggunaan normal selama 5-7 tahun. Dengan garansi 3 tahun, Anda tidak perlu khawatir.',
      },
    ],
  },
]

export default function FAQSection() {
  const [activeCategory, setActiveCategory] = useState(FAQ_CATEGORIES[0].id)
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  const currentCategory = FAQ_CATEGORIES.find(cat => cat.id === activeCategory) || FAQ_CATEGORIES[0]

  return (
    <section id="faq" className="py-12 md:py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span className="inline-block px-4 py-2 bg-electric-blue/10 text-electric-blue rounded-full text-sm font-semibold mb-4">
            FAQ
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 mb-4">
            Pertanyaan yang{' '}
            <span className="text-electric-blue">Sering Ditanya</span>
          </h2>
          <p className="text-lg text-slate-600">
            Temukan jawaban atas pertanyaan seputar produk, layanan, dan teknologi kami
          </p>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <div className="flex flex-wrap justify-center gap-2 md:gap-3">
            {FAQ_CATEGORIES.map((category) => {
              const IconComponent = category.icon
              const isActive = activeCategory === category.id
              return (
                <button
                  key={category.id}
                  onClick={() => {
                    setActiveCategory(category.id)
                    setOpenIndex(0)
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-electric-blue text-white shadow-md'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <IconComponent className="text-base" />
                  <span className="hidden sm:inline">{category.name}</span>
                  <span className="sm:hidden">{category.name.split(' ')[0]}</span>
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* FAQ Items */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            {currentCategory.items.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border-2 border-slate-200 rounded-2xl overflow-hidden hover:border-electric-blue/30 transition-colors"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between gap-4 p-4 md:p-5 text-left bg-white hover:bg-slate-50 transition-colors"
                >
                  <h3 className="text-base md:text-lg font-semibold text-slate-800 pr-4">
                    {item.question}
                  </h3>
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                      openIndex === index
                        ? 'bg-electric-blue text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {openIndex === index ? (
                      <FiMinus className="text-lg" />
                    ) : (
                      <FiPlus className="text-lg" />
                    )}
                  </div>
                </button>

                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 md:px-5 pb-4 md:pb-5">
                        <p className="text-slate-600 leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 text-center"
        >
          <p className="text-slate-600 mb-4">
            Masih punya pertanyaan lain?
          </p>
          <a
            href={WHATSAPP_LINKS.general}
            onClick={() => trackWhatsAppClick('faq-section')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-success-green text-white font-semibold rounded-full hover:bg-green-600 transition-all hover:scale-105 shadow-lg"
          >
            <BsWhatsapp className="text-xl" />
            <span>Tanya Langsung via WhatsApp</span>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
