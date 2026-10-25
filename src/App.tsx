import { Navigation } from './components/Navigation'
import { Hero } from './components/Hero'
import { TaglineReveal } from './components/TaglineReveal'
import { StudioTool } from './components/StudioTool'
import { Benefits } from './components/Benefits'
import { HowItWorks } from './components/HowItWorks'
import { ProofSection } from './components/ProofSection'
import { FAQSection } from './components/FAQSection'
import { FinalCTA } from './components/FinalCTA'
import { Footer } from './components/Footer'

export function App() {
  return (
    <div className="min-h-screen bg-[#000000] text-[#FFFFFF] flex flex-col items-center selection:bg-[#313131] selection:text-[#FFFFFF]">
      {/* Fluid Island Floating Nav */}
      <Navigation />

      <main className="w-full flex flex-col items-center">
        {/* Hero Section */}
        <Hero />

        {/* Mandatory Tagline Reveal Section (B11) */}
        <TaglineReveal />

        {/* Interactive Studio Tool Section */}
        <StudioTool />

        {/* Mid Page Argument Sections */}
        <Benefits />
        <HowItWorks />
        <ProofSection />

        {/* Bottom Objection Handling & Final CTA */}
        <FAQSection />
        <FinalCTA />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default App
