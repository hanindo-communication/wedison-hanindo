import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import FloatingWhatsAppButton from './components/ui/FloatingWhatsAppButton'
import HeroSlider from './components/sections/HeroSlider'
import ModelsTabSection from './components/sections/ModelsTabSection'
import ComparisonSection from './components/sections/ComparisonSection'
// import ProblemSection from './components/sections/ProblemSection' // Hidden - not needed for now
// import PersonasSection from './components/sections/PersonasSection' // Hidden - not needed for now
import ShowroomSection from './components/sections/ShowroomSection'
// import InfrastructureSection from './components/sections/InfrastructureSection' // Hidden - not needed for now
import TestimonialsSection from './components/sections/TestimonialsSection'
import FAQSection from './components/sections/FAQSection'
import FinancingSection from './components/sections/FinancingSection'
import LeadFormSection from './components/sections/LeadFormSection'

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <HeroSlider />
      
      {/* Comparison Section */}
      <ComparisonSection />
      
      {/* Models Tab Section */}
      <ModelsTabSection />
      
      {/* Financing Section */}
      <FinancingSection />
      
      {/* <ProblemSection /> */} {/* Hidden - not needed for now */}
      {/* <PersonasSection /> */} {/* Hidden - not needed for now */}
      <ShowroomSection />
      {/* <InfrastructureSection /> */} {/* Hidden - not needed for now */}
      <TestimonialsSection />
      <FAQSection />
      <LeadFormSection />
      <Footer />
      
      {/* Floating WhatsApp Button - Always Visible */}
      <FloatingWhatsAppButton />
    </main>
  )
}
