import { motion } from 'motion/react'
import { DisasterTypes } from '@/components/home/DisasterTypes'
import { HowItWorks } from '@/components/home/HowItWorks'
import { MapPreview } from '@/components/home/MapPreview'
import { NewsPreview } from '@/components/home/NewsPreview'
import { useRef } from 'react'

export default function Home() {

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const mapRef = useRef(null)

    return (
        <main className="relative bg-black min-h-screen text-foreground overflow-x-hidden">
            {/* Hero Section */}
            <section className="relative flex flex-col items-center justify-center min-h-screen w-full pt-16 mt-[-64px]">
                <motion.video
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="absolute top-0 left-0 right-0 mx-auto w-3/4 h-3/4 object-cover z-0"
                    src="/video/background_chuva.mov"
                    autoPlay
                    loop
                    muted
                ></motion.video>

                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="w-full p-10 relative z-1 flex items-center justify-center text-white/40">
                    {/* 
                    <p className='hidden lg:block font-light text-sm'>
                        Mantenha-se informado  <br />sobre as chuvas
                    </p> */}

                    <div className='pb-10 flex flex-col items-center gap-20'>
                        <img
                            src="/logo.svg"
                            alt="logo_rain" />

                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5, duration: 1 }}
                            whileHover={{ scale: 1.01 }}
                            className='relative px-30 py-3 text-white/40 font-medium rounded-md overflow-hidden transition-all cursor-pointer active:scale-95 group shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 hover:text-white'
                            // @ts-ignore
                            onClick={() => { mapRef.current?.scrollIntoView({ behavior: 'smooth' }) }}
                        >
                            Saiba mais
                            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-linear-to-r from-black via-blue-500 to-black translate-y-px group-hover:translate-y-0 transition-transform"></div>
                        </motion.button>
                    </div>
                </motion.div>
            </section>

            {/* Content Sections */}
            <div className="relative z-20 flex flex-col gap-8 pb-32">
                <MapPreview ref={mapRef} />
                <DisasterTypes />
                <HowItWorks />
                <NewsPreview />
            </div>

        </main>
    )
}