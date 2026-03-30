import { motion } from 'motion/react'

export const AnimatedBackground = () => {
    return (
        <div className="fixed inset-0 overflow-hidden bg-black z-0 pointer-events-none">
            {/* Light Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f1a_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f1a_1px,transparent_1px)] bg-size-[24px_24px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

            {/* Blue Spotlight 1 */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                    x: ['-50%', '-45%', '-50%'],
                    y: ['-50%', '-45%', '-50%'],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
                className="absolute top-0 left-1/4 w-160 h-160 bg-blue-600/30 rounded-full blur-[120px] mix-blend-screen"
            />

            {/* Indigo/Blue Spotlight 2 */}
            <motion.div
                animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.2, 0.4, 0.2],
                    x: ['50%', '45%', '50%'],
                    y: ['50%', '55%', '50%'],
                }}
                transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 1,
                }}
                className="absolute bottom-1/4 right-1/4 w-180 h-180 bg-indigo-600/20 rounded-full blur-[130px] mix-blend-screen"
            />
            
            {/* Deep Blue Base */}
            <div className="absolute bottom-0 left-0 w-full h-[50vh] bg-linear-to-t from-blue-950/20 to-transparent"></div>
        </div>
    )
}
