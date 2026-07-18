"use client";
import { assets } from "@/assets/assets";
import { ArrowRightIcon, ChevronRightIcon } from "lucide-react";
import Image from "next/image";
import React from "react";
import CategoriesMarquee from "./CategoriesMarquee";
import hero from "@/assets/hero.jpg";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import sisig from "@/assets/sisig.png";
import afritada from "@/assets/afritada.png";
import bicol from "@/assets/bicol.png";
import paksiw from "@/assets/paksiw.png";

const Hero = () => {
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "$";

  const products = [sisig, afritada, bicol, paksiw];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % products.length);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className='mx-6'>
      <div className='flex max-xl:flex-col gap-8 max-w-7xl mx-auto my-10'>
        <div className='relative flex-1 flex flex-col bg-green-200 rounded-3xl xl:min-h-100 group'>
          <div className='relative flex-1 overflow-hidden rounded-3xl xl:min-h-[400px] group'>
            <Image
              src={hero}
              alt='GrabNGo Hero Banner'
              fill
              priority
              className='object-cover transition-transform duration-500 group-hover:scale-105'
            />
            <AnimatePresence mode='wait'>
              <motion.div
                key={current}
                initial={{
                  opacity: 0,
                  x: -80,
                  rotate: -10,
                  scale: 0.85,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                  rotate: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  x: 80,
                  rotate: 10,
                  scale: 0.85,
                }}
                transition={{
                  duration: 0.7,
                  ease: "easeInOut",
                }}
                className='absolute left-8 top-1/2 -translate-y-1/2 z-10'>
                <Image
                  src={products[current]}
                  alt='Featured Dish'
                  className='w-64 xl:w-80 drop-shadow-[0_25px_45px_rgba(0,0,0,0.35)]'
                  priority
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        <div className='flex flex-col md:flex-row xl:flex-col gap-5 w-full xl:max-w-sm text-sm text-slate-600'>
          <div className='flex-1 flex items-center justify-between w-full bg-orange-200 rounded-3xl p-6 px-8 group'>
            <div>
              <p className='text-3xl font-medium bg-gradient-to-r from-slate-800 to-[#FFAD51] bg-clip-text text-transparent max-w-40'>
                Best products
              </p>
              <p className='flex items-center gap-1 mt-4'>
                View more{" "}
                <ArrowRightIcon
                  className='group-hover:ml-2 transition-all'
                  size={18}
                />{" "}
              </p>
            </div>
            <Image className='w-35' src={assets.hero_product_img1} alt='' />
          </div>
          <div className='flex-1 flex items-center justify-between w-full bg-blue-200 rounded-3xl p-6 px-8 group'>
            <div>
              <p className='text-3xl font-medium bg-gradient-to-r from-slate-800 to-[#78B2FF] bg-clip-text text-transparent max-w-40'>
                20% discounts
              </p>
              <p className='flex items-center gap-1 mt-4'>
                View more{" "}
                <ArrowRightIcon
                  className='group-hover:ml-2 transition-all'
                  size={18}
                />{" "}
              </p>
            </div>
            <Image className='w-35' src={assets.hero_product_img2} alt='' />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
