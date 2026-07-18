'use client'
import Title from './Title'
import ProductCard from './ProductCard'
import { useSelector } from 'react-redux'

const BestSelling = () => {

    const displayQuantity = 8
    const products = useSelector(state => state.product.list)

    return (
      <div className='mx-auto max-w-7xl px-6 my-20'>
        <Title
          title='Best Selling'
          description={`Showing ${products.length < displayQuantity ? products.length : displayQuantity} of ${products.length} products`}
          href='/shop'
        />
        <div className='mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {products
            .slice()
            .sort((a, b) => b.rating.length - a.rating.length)
            .slice(0, displayQuantity)
            .map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
        </div>
      </div>
    );
}

export default BestSelling