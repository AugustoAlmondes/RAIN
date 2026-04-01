import { DisasterTypes } from '@/components/home/DisasterTypes'
import { HowItWorks } from '@/components/home/HowItWorks'
import { NewsPreview } from '@/components/home/NewsPreview'
import { useRef } from 'react'
import Hero from '@/components/home/Hero'

export default function Home() {

    const mapRef = useRef(null)

    return (
        <main className="relative bg-black min-h-screen text-foreground overflow-x-hidden pt-16">
            {/* Hero Section */}
            <Hero mapRef={mapRef} />
            {/* Content Sections */}
            <div className="relative z-20 flex flex-col overflow-hidden">
                <HowItWorks />
                <DisasterTypes />
                <NewsPreview />
            </div>

        </main>
    )
}