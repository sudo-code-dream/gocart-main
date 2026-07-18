"use client";

import { Button } from "@/components/ui/button";
import { addToCart } from "@/lib/features/cart/cartSlice";
import { Heart, Star } from "lucide-react";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

const ProductCard = ({ product }) => {
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "$";
  const productId = product.id;

  const dispatch = useDispatch();
  const router = useRouter();

  const cart = useSelector((state) => state.cart.cartItems);

  const addToCartHandler = () => {
    dispatch(addToCart({ productId }));
  };

  const rating =
    product.rating.length > 0
      ? (
          product.rating.reduce((acc, curr) => acc + curr.rating, 0) /
          product.rating.length
        ).toFixed(1)
      : 0;

  return (
    <Link
      href={`/product/${product.id}`}
      className='group overflow-hidden rounded-xl border bg-card transition hover:shadow-xl'>
      {/* Image */}

      <div className='bg-muted relative aspect-square overflow-hidden'>
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className='object-cover transition-transform duration-300 group-hover:scale-105'
        />

        <Button
          size='icon'
          variant='ghost'
          onClick={(e) => e.preventDefault()}
          className='bg-background/80 absolute top-2 right-2 h-8 w-8 rounded-full backdrop-blur'>
          <Heart className='h-4 w-4' />
        </Button>
      </div>

      {/* Content */}

      <div className='p-4'>
        <div className='flex items-center justify-between gap-4'>
          <div className='min-w-0'>
            <h3 className='truncate font-semibold'>{product.name}</h3>

            <div className='mt-1 flex items-center gap-1'>
              <Star className='fill-yellow-400 text-yellow-400 h-3.5 w-3.5' />

              <span className='text-sm'>{rating}</span>

              <span className='text-muted-foreground text-sm'>
                ({product.rating.length})
              </span>
            </div>
          </div>

          <div className='text-right'>
            <div className='font-semibold'>
              {currency}
              {product.price}
            </div>

            <div className='text-muted-foreground text-sm line-through'>
              {currency}
              {product.mrp}
            </div>
          </div>
        </div>

        <div className='mt-4 grid grid-cols-2 gap-2'>
          <Button
            size='sm'
            className='w-full'
            onClick={(e) => {
              e.preventDefault();

              if (!cart[productId]) {
                addToCartHandler();
              }

              router.push("/checkout");
            }}>
            Buy Now
          </Button>

          <Button
            size='sm'
            variant={cart[productId] ? "default" : "outline"}
            className='w-full'
            onClick={(e) => {
              e.preventDefault();

              if (!cart[productId]) {
                addToCartHandler();
              } else {
                router.push("/cart");
              }
            }}>
            {!cart[productId] ? "Add to Cart" : "View Cart"}
          </Button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
