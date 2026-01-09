// WhatsApp Pre-filled Message Templates

const WHATSAPP_NUMBER = '62XXXXXXXXXX' // Replace with actual number

export const getWhatsAppLink = (message: string): string => {
  const encodedMessage = encodeURIComponent(message)
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`
}

// Message Templates
export const WHATSAPP_MESSAGES = {
  hero: 'Halo! Saya tertarik dengan Wedison EdPower. Saya mau tau lebih detail tentang SuperCharge dan financing options. Bisa?',
  
  testDrive: 'Saya ingin test drive di showroom Pondok Indah. Slot preferensi saya: [Hari/Jam]',
  
  edpower: 'Halo! Saya tertarik dengan model EdPower (Rp 45.5jt). Bisa info detail spesifikasi dan promo yang sedang berlaku?',
  
  athena: 'Halo! Saya tertarik dengan model Athena (Rp 28jt). Bisa info detail spesifikasi dan opsi cicilan?',
  
  victory: 'Halo! Saya tertarik dengan model Victory (Rp 22.5jt). Bisa info detail dan promo yang tersedia?',
  
  bees: 'Halo! Saya tertarik dengan model Bees (Rp 15jt). Ada student discount? Tolong info lengkapnya.',
  
  financing: 'Halo! Saya mau konsultasi tentang opsi financing dan cicilan 0%. Bisa bantu?',
  
  tradeIn: 'Halo! Saya punya motor lama yang mau di-trade-in. Bisa info prosesnya?',
  
  charging: 'Halo! Saya mau tanya tentang SuperCharge network dan instalasi home charger. Bisa dibantu?',
  
  general: 'Halo! Saya tertarik dengan motor listrik Wedison. Bisa info lengkapnya?',
}

// Pre-configured WhatsApp Links
export const WHATSAPP_LINKS = {
  hero: getWhatsAppLink(WHATSAPP_MESSAGES.hero),
  testDrive: getWhatsAppLink(WHATSAPP_MESSAGES.testDrive),
  edpower: getWhatsAppLink(WHATSAPP_MESSAGES.edpower),
  athena: getWhatsAppLink(WHATSAPP_MESSAGES.athena),
  victory: getWhatsAppLink(WHATSAPP_MESSAGES.victory),
  bees: getWhatsAppLink(WHATSAPP_MESSAGES.bees),
  financing: getWhatsAppLink(WHATSAPP_MESSAGES.financing),
  tradeIn: getWhatsAppLink(WHATSAPP_MESSAGES.tradeIn),
  charging: getWhatsAppLink(WHATSAPP_MESSAGES.charging),
  general: getWhatsAppLink(WHATSAPP_MESSAGES.general),
}
