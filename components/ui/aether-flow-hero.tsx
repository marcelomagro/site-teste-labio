"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Zap } from 'lucide-react';

// A utility function for class names
const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

interface AetherFlowHeroProps {
  title?: string;
  badge?: string;
  description?: string;
  ctaText?: string;
  ctaHref?: string;
  backgroundColor?: string;
  particleColor?: string;
  lineColor?: string;
  heroImageSrc?: string;
}

// The main hero component with LABIO theme compatibility
export const AetherFlowHero: React.FC<AetherFlowHeroProps> = ({
  title = "LABIO",
  badge = "Engenharia elétrica aplicada à saúde",
  description = "Transformamos conhecimento em tecnologia, protótipos e soluções que olham para o futuro da saúde.",
  ctaText = "Conheça nossos Projetos",
  ctaHref = "#projetos",
  backgroundColor = "#f7fbfb", // Preserva a cor original do template (--paper)
  particleColor = "rgba(48, 174, 250, 0.75)", // Azul elétrico da LABIO
  lineColor = "rgba(8, 127, 197, 0.25)",
  heroImageSrc = "/images/hero-bio-humanoid.png"
}) => {
    const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

    React.useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let particles: Particle[] = [];
        const mouse: { x: number | null; y: number | null; radius: number } = { x: null, y: null, radius: 200 };

        class Particle {
            x: number;
            y: number;
            directionX: number;
            directionY: number;
            size: number;
            color: string;

            constructor(x: number, y: number, directionX: number, directionY: number, size: number, color: string) {
                this.x = x;
                this.y = y;
                this.directionX = directionX;
                this.directionY = directionY;
                this.size = size;
                this.color = color;
            }

            draw() {
                if (!ctx) return;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                ctx.fillStyle = this.color;
                ctx.fill();
            }

            update() {
                if (!canvas) return;
                if (this.x > canvas.width || this.x < 0) {
                    this.directionX = -this.directionX;
                }
                if (this.y > canvas.height || this.y < 0) {
                    this.directionY = -this.directionY;
                }

                // Mouse collision & repulsion detection
                if (mouse.x !== null && mouse.y !== null) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < mouse.radius + this.size) {
                        const forceDirectionX = dx / distance;
                        const forceDirectionY = dy / distance;
                        const force = (mouse.radius - distance) / mouse.radius;
                        this.x -= forceDirectionX * force * 5;
                        this.y -= forceDirectionY * force * 5;
                    }
                }

                this.x += this.directionX;
                this.y += this.directionY;
                this.draw();
            }
        }

        function init() {
            if (!canvas) return;
            particles = [];
            const numberOfParticles = (canvas.height * canvas.width) / 9000;
            for (let i = 0; i < numberOfParticles; i++) {
                const size = (Math.random() * 2.5) + 1.5;
                const x = (Math.random() * ((canvas.width - size * 2) - (size * 2)) + size * 2);
                const y = (Math.random() * ((canvas.height - size * 2) - (size * 2)) + size * 2);
                const directionX = (Math.random() * 0.4) - 0.2;
                const directionY = (Math.random() * 0.4) - 0.2;
                // Paleta de bioengenharia (azul com partículas ocasionais em vermelho pulso)
                const isRed = Math.random() < 0.2;
                const pColor = isRed ? 'rgba(255, 57, 62, 0.8)' : particleColor;
                particles.push(new Particle(x, y, directionX, directionY, size, pColor));
            }
        }

        const resizeCanvas = () => {
            if (!canvas) return;
            canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
            canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
            init(); 
        };
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        const connect = () => {
            if (!ctx || !canvas) return;
            let opacityValue = 1;
            for (let a = 0; a < particles.length; a++) {
                for (let b = a; b < particles.length; b++) {
                    const distance = ((particles[a].x - particles[b].x) * (particles[a].x - particles[b].x))
                        + ((particles[a].y - particles[b].y) * (particles[a].y - particles[b].y));
                    
                    if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                        opacityValue = 1 - (distance / 20000);
                        
                        let isNearMouse = false;
                        if (mouse.x !== null && mouse.y !== null) {
                            const dx_mouse_a = particles[a].x - mouse.x;
                            const dy_mouse_a = particles[a].y - mouse.y;
                            const distance_mouse_a = Math.sqrt(dx_mouse_a * dx_mouse_a + dy_mouse_a * dy_mouse_a);
                            isNearMouse = distance_mouse_a < mouse.radius;
                        }

                        if (isNearMouse) {
                             ctx.strokeStyle = `rgba(48, 174, 250, ${Math.min(opacityValue * 1.5, 0.8)})`;
                             ctx.lineWidth = 1.4;
                        } else {
                             ctx.strokeStyle = `rgba(16, 43, 49, ${Math.min(opacityValue * 0.15, 0.25)})`;
                             ctx.lineWidth = 0.8;
                        }
                        
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        };

        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            if (!ctx || !canvas) return;

            // Mantém a cor de fundo original do template
            ctx.fillStyle = backgroundColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
            }
            connect();
        };
        
        const handleMouseMove = (event: MouseEvent) => {
            if (!canvas) return;
            const rect = canvas.getBoundingClientRect();
            mouse.x = event.clientX - rect.left;
            mouse.y = event.clientY - rect.top;
        };
        
        const handleMouseOut = () => {
            mouse.x = null;
            mouse.y = null;
        };

        const parent = canvas.parentElement || window;
        parent.addEventListener('mousemove', handleMouseMove as EventListener);
        parent.addEventListener('mouseout', handleMouseOut as EventListener);

        init();
        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            parent.removeEventListener('mousemove', handleMouseMove as EventListener);
            parent.removeEventListener('mouseout', handleMouseOut as EventListener);
            cancelAnimationFrame(animationFrameId);
        };
    }, [backgroundColor, particleColor, lineColor]);

    const fadeUpVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.15 + 0.3,
                duration: 0.7,
                ease: [0.23, 1, 0.32, 1], // Emil Kowalski fluid easing
            },
        }),
    };

    return (
        <div className="relative min-h-[680px] w-full flex flex-col items-center justify-center overflow-hidden" style={{ backgroundColor }}>
            {/* The canvas is the interactive background */}
            <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full pointer-events-auto"></canvas>
            
            {/* Overlay Content */}
            <div className="relative z-10 text-center px-6 max-w-4xl mx-auto pointer-events-none">
                <motion.div
                    custom={0}
                    variants={fadeUpVariants}
                    initial="hidden"
                    animate="visible"
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#30aefa]/10 border border-[#30aefa]/30 mb-6 backdrop-blur-sm pointer-events-auto"
                >
                    <span className="w-2 h-2 rounded-full bg-[#ff393e] animate-pulse"></span>
                    <span className="text-xs font-mono font-medium text-[#087fc5] uppercase tracking-wider">
                        {badge}
                    </span>
                </motion.div>

                <motion.h1
                    custom={1}
                    variants={fadeUpVariants}
                    initial="hidden"
                    animate="visible"
                    className="text-6xl md:text-8xl font-extrabold tracking-tighter mb-2 text-[#102b31] inline-flex items-center justify-center"
                >
                    <span className="text-[#29aef5]">LA</span>
                    <span className="text-[#ff393e]">BI</span>
                    <span className="inline-flex items-center ml-1">
                        <img 
                            src="/images/labio-emblema-o.png" 
                            alt="O" 
                            className="h-[0.84em] w-auto inline-block drop-shadow-[0_4px_16px_rgba(41,174,245,0.3)] hover:rotate-12 transition-transform duration-300" 
                        />
                    </span>
                </motion.h1>

                <motion.p
                    custom={1.5}
                    variants={fadeUpVariants}
                    initial="hidden"
                    animate="visible"
                    className="text-xs md:text-sm font-bold tracking-[0.22em] text-[#102b31]/80 uppercase mb-4"
                >
                    LIGA ACADÊMICA DE BIOENGENHARIA
                </motion.p>

                <motion.p
                    custom={2}
                    variants={fadeUpVariants}
                    initial="hidden"
                    animate="visible"
                    className="text-2xl md:text-4xl font-extrabold text-[#102b31] mb-5 tracking-tight"
                >
                    Tecnologia que <em className="text-[#30aefa] not-italic">aproxima</em> vidas.
                </motion.p>

                <motion.p
                    custom={3}
                    variants={fadeUpVariants}
                    initial="hidden"
                    animate="visible"
                    className="max-w-2xl mx-auto text-base md:text-lg text-[#63777c] mb-8 leading-relaxed"
                >
                    {description}
                </motion.p>

                <motion.div
                    custom={4}
                    variants={fadeUpVariants}
                    initial="hidden"
                    animate="visible"
                    className="flex flex-wrap items-center justify-center gap-4 pointer-events-auto"
                >
                    <a 
                      href={ctaHref}
                      className="px-8 py-3.5 bg-[#102b31] text-white font-bold rounded-full shadow-lg hover:bg-[#1c424a] transition-all duration-300 flex items-center gap-3 text-sm hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {ctaText}
                        <ArrowRight className="h-4 w-4 text-[#30aefa]" />
                    </a>
                    <a 
                      href="#seletivo"
                      className="px-6 py-3.5 border border-[#102b31] text-[#102b31] font-bold rounded-full hover:bg-[#102b31] hover:text-white transition-all duration-300 text-sm"
                    >
                        Próximo seletivo →
                    </a>
                </motion.div>
            </div>
        </div>
    );
};

export default AetherFlowHero;
