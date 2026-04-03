import { useState, useLayoutEffect } from "react"
import { motion } from "framer-motion";
import { useTourStore } from "@/store/tourStore";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";

export default function Spotlight() {

    interface Coords {
        x: number;
        y: number;
        width: number;
        height: number;
        padding: number;
    }

    const { isOpen, currentStep, steps, closeTour, nextStep, prevStep } = useTourStore();
    const [coords, setCoords] = useState<Coords>({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        padding: 8
    })

    const updateCoords = () => {
        const step = steps[currentStep];
        const element = document.getElementById(step.targetId);

        if (element) {
            const rect = element.getBoundingClientRect();
            setCoords({
                x: rect.x,
                y: rect.y,
                width: rect.width,
                height: rect.height,
                padding: 8
            })
        }
    }

    useLayoutEffect(() => {
        if (isOpen) {
            updateCoords();
            window.addEventListener('resize', updateCoords);
            return () => window.removeEventListener('resize', updateCoords);
        }
    }, [isOpen, currentStep]);

    if (!isOpen) return null;

    const currentStepData = steps[currentStep];

    return (
        <div className="fixed inset-0 z-100 pointer-events-none">
            <svg className="absolute inset-0 w-full h-full">
                <defs>
                    <mask id="spotlight-mask">
                        <rect
                            x="0"
                            y="0"
                            width={"100%"}
                            height={"100%"}
                            fill="white"
                        />

                        <motion.rect
                            animate={{
                                x: coords.x - coords.padding,
                                y: coords.y - coords.padding,
                                width: coords.width + (coords.padding * 2),
                                height: coords.height + (coords.padding * 2),
                                rx: 12
                            }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            fill={'black'}
                        />
                    </mask>
                </defs>

                <rect
                    x="0"
                    y="0"
                    width={"100%"}
                    height={"100%"}
                    fill="rgba(0,0,0,0.7)"
                    mask="url(#spotlight-mask)"
                    className="pointer-events-auto"
                    onClick={closeTour}
                />
            </svg>

            <motion.div
                animate={{
                    opacity: 1,
                    transition: { type: 'spring', damping: 25, stiffness: 200 },
                    ...(() => {
                        const gap = 20;
                        switch (currentStepData.position) {
                            case 'top':
                                return {
                                    top: coords.y - gap,
                                    left: coords.x + coords.width / 2,
                                    x: "-50%",
                                    y: "-100%"
                                };
                            case 'bottom':
                                return {
                                    top: coords.y + coords.height + gap,
                                    left: coords.x + coords.width / 2,
                                    x: "-50%",
                                    y: 0
                                };
                            case 'left':
                                return {
                                    top: coords.y + coords.height / 2,
                                    left: coords.x - gap,
                                    x: "-100%",
                                    y: "-50%"
                                };
                            case 'right':
                                return {
                                    top: coords.y + coords.height / 2,
                                    left: coords.x + coords.width + gap,
                                    x: 0,
                                    y: 0
                                };
                            default:
                                return {
                                    top: coords.y + coords.height / 2,
                                    left: coords.x + coords.width + gap,
                                    x: 0,
                                    y: "-50%"
                                };
                        }
                    })()
                }}

                // exit={{ opacity: 0, y: -20 }}
                className="absolute w-[300px] z-50 shadow-2xl pointer-events-auto"
            >
                <Card className="bg-surface/90 backdrop-blur-xl border-border-custom rounded overflow-hidden text-white py-0 gap-0">
                    <CardHeader className="p-5 pb-0">
                        <CardTitle className="text-base font-bold text-white">
                            {currentStepData.title}
                        </CardTitle>
                        <CardDescription className="text-white/70 text-sm leading-relaxed">
                            {currentStepData.content}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-5 flex items-center justify-between">
                        <span className="text-[10px] text-white/40 font-mono tracking-widest uppercase">
                            Tutorial {currentStep + 1} / {steps.length}
                        </span>
                    </CardContent>
                    <CardFooter className="p-5 pt-0 flex gap-2">
                        {currentStep > 0 && (
                            <Button
                                variant="ghost"
                                onClick={prevStep}
                                size="sm"
                                className="px-3 text-xs text-white/50 hover:text-white hover:bg-white/5"
                            >
                                Anterior
                            </Button>
                        )}
                        <Button
                            onClick={currentStep === steps.length - 1 ? closeTour : nextStep}
                            size="sm"
                            className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded shadow-lg shadow-blue-600/20 transition-all active:scale-95"
                        >
                            {currentStep === steps.length - 1 ? "Finalizar" : "Próximo"}
                        </Button>
                    </CardFooter>
                </Card>
            </motion.div>
            {/* </AnimatePresence> */}
        </div>
    )
}