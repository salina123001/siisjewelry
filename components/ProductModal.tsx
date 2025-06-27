import React, { useState, useEffect, useCallback } from 'react';
import { Product } from '../types';

interface ProductModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex text-yellow-400 text-lg">
      {[...Array(fullStars)].map((_, i) => <i key={`full-${i}`} className="fa-solid fa-star"></i>)}
      {halfStar && <i className="fa-solid fa-star-half-stroke"></i>}
      {[...Array(emptyStars)].map((_, i) => <i key={`empty-${i}`} className="fa-regular fa-star"></i>)}
    </div>
  );
};


const ProductModal: React.FC<ProductModalProps> = ({ product, onClose, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [isClosing, setIsClosing] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(onClose, 300); // Wait for animation to finish
  }, [onClose]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling

    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'auto';
    };
  }, [handleClose]);

  const handleQuantityChange = (amount: number) => {
    setQuantity(prev => Math.max(1, prev + amount));
  };

  const handleAddToCartClick = () => {
    onAddToCart(product, quantity);
  };
  
  const animationClass = isClosing ? 'opacity-0' : 'opacity-100';
  const modalAnimationClass = isClosing ? 'scale-95' : 'scale-100';

  return (
    <div 
      className={`fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${animationClass}`}
      onClick={handleClose}
    >
      <div 
        className={`relative bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col transition-transform duration-300 ${modalAnimationClass}`}
        onClick={(e) => e.stopPropagation()}
      >
         <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 z-20 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <i className="fa-solid fa-times text-xl"></i>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 p-6 md:p-8">
            {/* Image Section */}
            <div className="flex flex-col gap-4">
                <div className="w-full h-80 md:h-96 rounded-xl overflow-hidden shadow-lg flex items-center justify-center bg-gray-100">
                    <img src={product.images[activeImageIndex]} alt={`${product.name} - view ${activeImageIndex + 1}`} className="w-full h-full object-cover" />
                </div>
                <div className="grid grid-cols-3 gap-3">
                    {product.images.map((img, index) => (
                        <button 
                            key={index} 
                            onClick={() => setActiveImageIndex(index)}
                            className={`rounded-lg overflow-hidden h-24 w-full focus:outline-none ring-2 ring-offset-2 transition-all duration-200 ${activeImageIndex === index ? 'ring-primary' : 'ring-transparent'}`}
                        >
                            <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            </div>

            {/* Details Section */}
            <div className="flex flex-col">
                <h2 className="text-3xl font-bold mb-2">{product.name}</h2>
                <div className="flex items-center gap-3 mb-4">
                    <StarRating rating={product.rating} />
                    <span className="text-gray-500 text-sm">({product.reviews} 則評論)</span>
                </div>
                <p className="text-2xl font-bold text-primary mb-4">¥{product.price.toFixed(2)}</p>
                
                <div className="text-gray-600 leading-relaxed mb-6 flex-grow">
                    <p>{product.description}</p>
                </div>

                {/* Quantity & Add to Cart */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex items-center border border-gray-200 rounded-full">
                        <button onClick={() => handleQuantityChange(-1)} className="w-12 h-12 text-xl text-gray-500 hover:bg-gray-100 rounded-l-full disabled:text-gray-300" disabled={quantity <= 1}>-</button>
                        <span className="w-16 text-center text-lg font-medium">{quantity}</span>
                        <button onClick={() => handleQuantityChange(1)} className="w-12 h-12 text-xl text-gray-500 hover:bg-gray-100 rounded-r-full">+</button>
                    </div>
                    <button onClick={handleAddToCartClick} className="flex-grow px-6 py-3 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl text-lg font-semibold flex items-center justify-center gap-2">
                        <i className="fa-solid fa-cart-plus"></i>
                        <span>加入購物車</span>
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;