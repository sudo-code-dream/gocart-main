"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import aboutYou from "@/assets/aboutYou.png";

export default function NotFound() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  const imgY = useTransform(scrollY, [0, 400], [0, -60]);
  const imgScale = useTransform(scrollY, [0, 400], [1, 1.08]);
  const textY = useTransform(scrollY, [0, 400], [0, 40]);
  const overlayOpacity = useTransform(scrollY, [0, 300], [0.35, 0.55]);

  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <div
      ref={ref}
      className='relative h-screen w-full overflow-hidden bg-black text-white'>
      {/* Background image with parallax */}
      <motion.div
        style={{ y: imgY, scale: imgScale }}
        className='absolute inset-0 z-0'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2.4, ease }}>
        <div
          className='absolute inset-0 bg-cover bg-center'
          style={{
            backgroundImage: `url(${aboutYou.src})`,
            filter: "grayscale(100%) contrast(1.15) brightness(0.7) blur(1px)",
          }}
        />
        {/* Dark gradient overlays for depth + vignette */}
        <motion.div
          style={{ opacity: overlayOpacity }}
          className='absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/80'
        />
        <div
          className='absolute inset-0'
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.7) 100%)",
          }}
        />
      </motion.div>

      {/* Film grain overlay */}
      <div className='grain-overlay' />

      {/* Content */}
      <motion.div
        style={{ y: textY }}
        className='relative z-10 flex h-full w-full flex-col items-center justify-center px-6 text-center'>
        {/* Small editorial label */}
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.6, delay: 0.4, ease }}
          className='mb-8 font-sans text-[11px] uppercase tracking-[0.5em] text-white/40'>
          Error · Lost
        </motion.span>

        {/* 404 headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 2, delay: 0.2, ease }}
          className='font-serif text-[7rem] font-black leading-none tracking-tight sm:text-[10rem] md:text-[13rem]'
          style={{ textShadow: "0 0 60px rgba(0,0,0,0.6)" }}>
          404
        </motion.h1>

        {/* Main melancholic line */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.8, delay: 0.9, ease }}
          className='mt-6 max-w-md font-serif text-lg italic text-white/80 sm:text-xl'>
          Looks like this page faded into the sea.
        </motion.p>

        {/* Secondary minimal sentence */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 1.5, ease }}
          className='mt-3 font-sans text-xs uppercase tracking-[0.3em] text-white/40'>
          Maybe it never was.
        </motion.p>

        {/* Return home button */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.6, delay: 1.8, ease }}
          className='mt-14'>
          <Link href='/' aria-label='Return to home page'>
            <motion.span
              whileHover={{ x: -4 }}
              transition={{ duration: 0.4, ease }}
              className='group inline-flex items-center gap-3 border border-white/30 px-8 py-3.5 font-sans text-[11px] uppercase tracking-[0.35em] text-white/70 backdrop-blur-sm transition-colors duration-500 hover:border-white/70 hover:text-white'>
              <span className='transition-transform duration-500 group-hover:-translate-x-1'>
                ←
              </span>
              Return Home
            </motion.span>
          </Link>
        </motion.div>
      </motion.div>

      {/* Bottom corner editorial mark */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 2.2, ease }}
        className='absolute bottom-6 left-6 z-10 font-sans text-[10px] uppercase tracking-[0.3em] text-white/25 sm:bottom-8 sm:left-8'>
        THE1975
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 2.2, ease }}
        className='absolute bottom-6 right-6 z-10 font-sans text-[10px] uppercase tracking-[0.3em] text-white/25 sm:bottom-8 sm:right-8'>
        About You
      </motion.div>
    </div>
  );
}
