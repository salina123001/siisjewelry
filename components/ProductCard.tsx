import React, { useState } from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex text-yellow-400">
      {[...Array(fullStars)].map((_, i) => <i key={`full-${i}`} className="fa-solid fa-star"></i>)}
      {halfStar && <i className="fa-solid fa-star-half-stroke"></i>}
      {[...Array(emptyStars)].map((_, i) => <i key={`empty-${i}`} className="fa-regular fa-star"></i>)}
    </div>
  );
};

const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const [isWishlisted, setWishlisted] = useState(false);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation(); // 防止點擊愛心時觸發 modal
    setWishlisted(!isWishlisted);
  };
  
  const handleCardClick = () => {
    onSelect(product);
  }

  return (
    <div className="product-card group flex flex-col cursor-pointer" onClick={handleCardClick}>
      <div className="relative rounded-xl overflow-hidden mb-4 shadow-md">
        <img src={product.images[0]} alt={product.name} className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-105" />
        {product.tag && (
          <div className="absolute top-3 left-3">
            <span className={`text-white text-xs px-2 py-1 rounded-full ${product.tag.color}`}>{product.tag.text}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <button onClick={(e) => { e.stopPropagation(); handleCardClick(); }} className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-700 hover:bg-primary hover:text-white transition-colors" title="快速預覽">
            <i className="fa-solid fa-eye"></i>
          </button>
        </div>
      </div>
      <div className="flex-grow flex flex-col">
          <h3 className="font-medium text-lg mb-1">{product.name}</h3>
          <div className="flex items-center mb-2">
            <StarRating rating={product.rating} />
            <span className="text-gray-500 text-sm ml-2">({product.reviews})</span>
          </div>
      </div>
      <div className="flex items-center justify-between mt-auto">
        <span className="font-bold text-lg">¥{product.price.toFixed(2)}</span>
        <button onClick={toggleWishlist} className={`transition-colors ${isWishlisted ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`} title="加入願望清單">
          <i className={`fa-${isWishlisted ? 'solid' : 'regular'} fa-heart`}></i>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;