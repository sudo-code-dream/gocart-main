"use client";

import { Heart, StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const ProductCard = ({ product }) => {
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "$";

  const rating =
    product.rating.length > 0
      ? Math.round(
          product.rating.reduce((acc, curr) => acc + curr.rating, 0) /
            product.rating.length,
        )
      : 0;

  return (
    <Link
      href={`/product/${product.id}`}
      className='group block overflow-hidden rounded-3xl bg-white border border-gray-200 transition-all duration-300 hover:-translate-y-1 hover:border-orange-300 hover:shadow-2xl'>
      {/* Image */}
      <div className='relative overflow-hidden'>
        <Image
          src={product.images[0]}
          alt={product.name}
          width={500}
          height={500}
          className='h-56 w-full object-cover transition duration-500 group-hover:scale-110'
        />

        {/* Favorite Button */}
        <button
          type='button'
          onClick={(e) => e.preventDefault()}
          className='absolute right-3 top-3 rounded-full bg-white/90 p-2 shadow-md backdrop-blur transition hover:scale-110'>
          <Heart size={18} className='text-gray-600' />
        </button>

        {/* Sample Badge */}
        <span className='absolute left-3 top-3 rounded-full bg-blue-500 px-3 py-1 text-xs font-semibold text-white shadow'>
          🔥 Popular
        </span>
      </div>

      {/* Content */}
      <div className='space-y-3 p-5'>
        {/* Rating */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-1'>
            {Array(5)
              .fill("")
              .map((_, index) => (
                <StarIcon
                  key={index}
                  size={15}
                  className='text-transparent'
                  fill={rating >= index + 1 ? "#FBBF24" : "#E5E7EB"}
                />
              ))}
          </div>

          <span className='text-xs text-gray-500'>
            ({product.rating.length})
          </span>
        </div>

        {/* Product Name */}
        <h3 className='line-clamp-2 text-lg font-bold text-gray-900 group-hover:text-orange-600 transition'>
          {product.name}
        </h3>

        {/* Placeholder Description */}
        <p className='line-clamp-2 text-sm text-gray-500'>
          Freshly prepared and made with quality ingredients.
        </p>

        {/* Bottom */}
        <div className='flex items-center justify-between border-t pt-4'>
          <div>
            <p className='text-xs text-gray-400'>Starting from</p>
            <p className='text-2xl font-bold text-shad  ow-blue-500 text-blue-500'>
              {currency}
              {product.price}
            </p>
          </div>

          <button
            type='button'
            onClick={(e) => e.preventDefault()}
            className='rounded-xl bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600 hover:shadow-lg'>
            Add
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
