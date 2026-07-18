"use client";

import { addToCart } from "@/lib/features/cart/cartSlice";
import { Button } from "@/components/ui/button";
import Counter from "./Counter";

import { Star, Truck, ShieldCheck, Heart } from "lucide-react";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const ProductDetails = ({ product }) => {
  const productId = product.id;
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "$";

  const dispatch = useDispatch();
  const router = useRouter();

  const cart = useSelector((state) => state.cart.cartItems);

  const [mainImage, setMainImage] = useState(product.images[0]);

  const addToCartHandler = () => {
    dispatch(addToCart({ productId }));
  };

  const averageRating =
    product.rating.length > 0
      ? product.rating.reduce((acc, item) => acc + item.rating, 0) /
        product.rating.length
      : 0;

  const discount = (
    ((product.mrp - product.price) / product.mrp) *
    100
  ).toFixed(0);

  return (
    <div className='mx-auto w-full max-w-7xl'>
      <div className='grid grid-cols-1 gap-10 md:grid-cols-2'>
        {/* Images */}
        <div className='mx-auto w-full max-w-md'>
          <div className='bg-muted relative aspect-square overflow-hidden rounded-xl'>
            <Image
              src={mainImage}
              alt={product.name}
              fill
              className='object-contain p-6'
            />

            <Button
              size='icon'
              variant='outline'
              className='absolute right-4 top-4 rounded-full bg-white/80 backdrop-blur'>
              <Heart className='h-5 w-5' />
            </Button>
          </div>

          <div className='mt-4 flex gap-3'>
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setMainImage(image)}
                className={`overflow-hidden rounded-lg border transition ${
                  mainImage === image ? "border-primary" : "border-transparent"
                }`}>
                <Image
                  src={image}
                  alt=''
                  width={80}
                  height={80}
                  className='object-contain p-2'
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}

        <div className='flex flex-col'>
          <div className='mb-4 flex items-center gap-4'>
            <span className='bg-primary/10 text-primary rounded-full px-3 py-1 text-sm font-medium'>
              {product.category}
            </span>

            <div className='flex items-center gap-1'>
              <Star className='h-4 w-4 fill-yellow-400 text-yellow-400' />

              <span className='text-sm font-medium'>
                {averageRating.toFixed(1)}
              </span>

              <span className='text-muted-foreground text-sm'>
                ({product.rating.length} reviews)
              </span>
            </div>
          </div>

          <h1 className='mb-3 text-3xl font-bold'>{product.name}</h1>

          <div className='mb-6 flex items-center gap-4'>
            <span className='text-3xl font-bold'>
              {currency}
              {product.price}
            </span>

            <span className='text-muted-foreground line-through'>
              {currency}
              {product.mrp}
            </span>

            <span className='text-green-600 font-medium'>Save {discount}%</span>
          </div>

          <p className='text-muted-foreground mb-8'>{product.description}</p>

          <div className='mb-8 grid grid-cols-2 gap-4'>
            <div className='flex items-center gap-2 text-sm'>
              <div className='h-2 w-2 rounded-full bg-green-500'></div>
              <span>Available</span>
            </div>

            <div className='flex items-center gap-2 text-sm'>
              <ShieldCheck className='h-4 w-4' />
              <span>Secure Payment</span>
            </div>
          </div>

          {cart[productId] && (
            <div className='mb-6'>
              <p className='mb-3 font-medium'>Quantity</p>

              <Counter productId={productId} />
            </div>
          )}

          <div className='flex gap-4'>
            <Button
              size='lg'
              className='flex-1'
              onClick={() =>
                !cart[productId] ? addToCartHandler() : router.push("/cart")
              }>
              {!cart[productId] ? "Add to Cart" : "View Cart"}
            </Button>

            <Button
              variant='outline'
              size='lg'
              className='flex-1'
              onClick={() => {
                if (!cart[productId]) {
                  addToCartHandler();
                }

                router.push("/checkout");
              }}>
              Buy Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
