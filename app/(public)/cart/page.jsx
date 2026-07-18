"use client";
import Counter from "@/components/Counter";
import OrderSummary from "@/components/OrderSummary";
import PageTitle from "@/components/PageTitle";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { deleteItemFromCart } from "@/lib/features/cart/cartSlice";
import { CreditCard, Package, Shield, Trash2, Trash2Icon, Truck } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Cart() {
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "$";

  const { cartItems } = useSelector((state) => state.cart);
  const products = useSelector((state) => state.product.list);

  const dispatch = useDispatch();
  const router = useRouter();

  const [cartArray, setCartArray] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const createCartArray = () => {
    setTotalPrice(0);
    const cartArray = [];
    for (const [key, value] of Object.entries(cartItems)) {
      const product = products.find((product) => product.id === key);
      if (product) {
        cartArray.push({
          ...product,
          quantity: value,
        });
        setTotalPrice((prev) => prev + product.price * value);
      }
    }
    setCartArray(cartArray);
  };

  const handleDeleteItemFromCart = (productId) => {
    dispatch(deleteItemFromCart({ productId }));
  };

  useEffect(() => {
    if (products.length > 0) {
      createCartArray();
    }
  }, [cartItems, products]);

  return cartArray.length > 0 ? (
    <div className='min-h-screen mx-6 text-slate-800'>
      <div className='max-w-7xl mx-auto '>
        {/* Title */}
        <PageTitle
          heading='My Cart'
          text='items in your cart'
          linkText='Add more'
        />

        <div className='flex items-start justify-between gap-5 max-lg:flex-col'>
          <div className='w-full max-w-3xl mx-auto space-y-4'>
            {cartArray.map((item) => (
              <Card key={item.id} className='overflow-hidden p-0'>
                <CardContent className='p-0'>
                  <div className='flex flex-col md:flex-row'>
                    {/* Product Image */}
                    <div className='relative h-40 w-full md:h-auto md:w-32 bg-muted'>
                      <Image
                        src={item.images[0]}
                        alt={item.name}
                        fill
                        className='object-cover'
                      />
                    </div>

                    {/* Product Details */}
                    <div className='flex-1 p-6'>
                      <div className='flex items-start justify-between'>
                        <div>
                          <h3 className='font-semibold'>{item.name}</h3>

                          <p className='text-muted-foreground text-sm'>
                            {item.category}
                          </p>

                          <p className='mt-2 font-medium'>
                            {currency}
                            {item.price}
                          </p>
                        </div>

                        <Button
                          variant='ghost'
                          size='icon'
                          onClick={() => handleDeleteItemFromCart(item.id)}>
                          <Trash2 className='h-4 w-4 text-red-500' />
                        </Button>
                      </div>

                      <div className='mt-6 flex items-center justify-between'>
                        <Counter productId={item.id} />

                        <div className='text-right'>
                          <p className='font-semibold'>
                            {currency}
                            {(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <Card className='w-full lg:max-w-sm h-fit'>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>
                Review your cart before checkout
              </CardDescription>
            </CardHeader>

            <CardContent className='space-y-6'>
              {/* Summary */}

              <div className='space-y-3'>
                <div className='flex justify-between text-sm'>
                  <span>Items</span>
                  <span>{cartArray.length}</span>
                </div>

                <div className='flex justify-between text-sm'>
                  <span>Subtotal</span>
                  <span>
                    {currency}
                    {totalPrice.toLocaleString()}
                  </span>
                </div>

                <div className='flex justify-between text-sm'>
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>

                <div className='border-t pt-3 flex justify-between font-semibold text-lg'>
                  <span>Total</span>
                  <span>
                    {currency}
                    {totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Features */}

              <div className='space-y-3 border-t pt-4'>
                <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                  <Shield className='h-4 w-4' />
                  Secure Checkout
                </div>

                <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                  <Truck className='h-4 w-4' />
                  Pickup or Delivery
                </div>
              </div>

              {/* Checkout */}

              <Button
                className='w-full'
                onClick={() => router.push("/checkout")}>
                <CreditCard className='mr-2 h-4 w-4' />
                Proceed to Checkout
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  ) : (
    <div className='flex min-h-[80vh] items-center justify-center px-6'>
      <Card className='w-full max-w-md text-center'>
        <CardContent className='flex flex-col items-center py-10'>
          <Package className='text-muted-foreground mb-6 h-16 w-16' />

          <h2 className='text-2xl font-bold'>Your cart is empty</h2>

          <p className='text-muted-foreground mt-2'>
            Looks like you haven't added any food yet.
          </p>

          <Button className='mt-8' onClick={() => router.push("/shop")}>
            Browse Menu
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
