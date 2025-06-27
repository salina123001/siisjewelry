
import React, { useState, useMemo } from 'react';
import { PRODUCTS } from '../constants';
import ProductCard from './ProductCard';
import { Product } from '../types';

interface ProductShowcaseProps {
  onProductSelect: (product: Product) => void;
}

const ProductShowcase: React.FC<ProductShowcaseProps> = ({ onProductSelect }) => {
  const [activeCategory, setActiveCategory] = useState('全部');

  const categories = useMemo(() => {
    const uniqueCategories = new Set(PRODUCTS.map(p => p.category));
    return ['全部', ...Array.from(uniqueCategories)];
  }, []);

  const filteredProducts = activeCategory === '全部'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === activeCategory);
    
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const targetId = e.currentTarget.getAttribute('href');
    if (!targetId) return;

    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <section id="products" className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div>
            <h2 className="text-[clamp(1.8rem,4vw,2.5rem)] font-bold mb-4">精選產品</h2>
            <p className="text-gray-600 max-w-2xl">每一款水晶產品都經過精心挑選，為您帶來獨特的能量體驗。</p>
          </div>
          <div className="flex space-x-2 mt-4 md:mt-0 flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full transition-colors text-sm sm:text-base ${activeCategory === category ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} onSelect={onProductSelect} />
          ))}
        </div>
        
        <div className="text-center mt-12">
          <a href="#products" onClick={handleNavClick} className="inline-block px-8 py-3 bg-white text-primary border border-primary rounded-full hover:bg-primary/5 transition-colors font-medium">
            查看全部產品
          </a>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;