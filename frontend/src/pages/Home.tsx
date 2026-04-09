import { DisasterTypes } from '@/components/home/DisasterTypes'
import { HowItWorks } from '@/components/home/HowItWorks'
import { NewsPreview } from '@/components/home/NewsPreview'
import { Helmet } from "react-helmet-async"
import { useRef } from 'react'
import Hero from '@/components/home/Hero'
import { CallToAction } from '@/components/layout/CallToAction'

export default function Home() {

    const mapRef = useRef(null)

    return (
        <>
            <Helmet>
                <title>RAIN - Antecipe o amanhã</title>
                <meta name="description" content="RAIN é uma plataforma de monitoramento em tempo real de desastres naturais, com foco em inundações, deslizamentos e outros eventos climáticos extremos. O sistema utiliza dados de satélite, radares meteorológicos e sensores em campo para fornecer alertas precisos e em tempo real, ajudando a proteger vidas e propriedades." />
                <link
                    rel="canonical"
                    href="https://rain-weather-forecast.netlify.app/"
                />
            </Helmet>
            <main className="relative bg-black min-h-screen text-foreground overflow-x-hidden pt-16">
                <Hero mapRef={mapRef} />
                <div className="relative z-20 flex flex-col overflow-hidden">
                    <HowItWorks />
                    <DisasterTypes />
                    <NewsPreview />
                </div>
                <CallToAction current="home" />
            </main>
        </>
    )
}