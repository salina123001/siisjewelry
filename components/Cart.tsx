import React from 'react';
import { CartItem } from '../types';

interface CartProps {
  isOpen: boolean;
  items: CartItem[];
  onClose: () => void;
  onUpdateQuantity: (productId: number, newQuantity: number) => void;
  onRemoveItem: (productId: number) => void;
  onCheckout: () => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, items, onClose, onUpdateQuantity, onRemoveItem, onCheckout }) => {
  const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      ></div>
      
      {/* Cart Sidebar */}
      <div 
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}
      >
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-xl font-semibold">您的購物車</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <i className="fa-solid fa-times text-2xl"></i>
          </button>
        </div>
        
        {items.length === 0 ? (
          <div className="flex-grow flex flex-col items-center justify-center text-center p-5">
            <i className="fa-solid fa-shopping-bag text-5xl text-gray-300 mb-4"></i>
            <h3 className="text-lg font-medium text-gray-700">您的購物車是空的</h3>
            <p className="text-gray-500 mt-1">快去尋找您喜愛的水晶吧！</p>
            <button onClick={onClose} className="mt-6 px-6 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors">
              繼續購物
            </button>
          </div>
        ) : (
          <>
            <div className="flex-grow overflow-y-auto p-5 space-y-4">
              {items.map(item => (
                <div key={item.id} className="flex gap-4">
                  <img src={item.images[0]} alt={item.name} className="w-24 h-24 object-cover rounded-lg" />
                  <div className="flex-grow flex flex-col">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-primary font-semibold text-sm">¥{item.price.toFixed(2)}</p>
                    <div className="flex items-center mt-auto">
                      <div className="flex items-center border border-gray-200 rounded-md">
                        <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1} className="w-8 h-8 text-gray-600 disabled:text-gray-300">-</button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 text-gray-600">+</button>
                      </div>
                      <button onClick={() => onRemoveItem(item.id)} className="ml-auto text-gray-400 hover:text-red-500">
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-5 border-t space-y-4">
              <div className="flex justify-between font-medium">
                <span>小計</span>
                <span>¥{totalPrice.toFixed(2)}</span>
              </div>
              <button onClick={onCheckout} className="w-full py-3 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors font-semibold text-lg">
                前往結帳
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Cart;