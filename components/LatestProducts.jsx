"use client";

import { useSelector } from "react-redux";
import Title from "./Title";
import ProductCard from "./ProductCard";

const LatestProducts = () => {
  const displayQuantity = 4;

  const products = useSelector((state) => state.product.list);

  const latestProducts = products
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, displayQuantity);

  return (
    <div className='mx-auto max-w-7xl px-6 my-20'>
      <Title
        title='Latest Products'
        description={`Showing ${
          products.length < displayQuantity ? products.length : displayQuantity
        } of ${products.length} products`}
        href='/shop'
      />

      <div className='mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {latestProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default LatestProducts;
