import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import ProductCategories from './components/ProductCategories';
import ProductShowcase from './components/ProductShowcase';
import About from './components/About';
import AiAssistant from './components/AiAssistant';
import Footer from './components/Footer';
import ProductModal from './components/ProductModal';
import Cart from './components/Cart';
import AuthModal from './components/AuthModal';
import Toast from './components/Toast';
import CheckoutPage from './components/CheckoutPage'; // 新增
import { Product, CartItem, User } from './types';

const App: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false); // 新增結帳頁面狀態

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const handleAddToCart = (product: Product, quantity: number) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevItems, { ...product, quantity }];
    });
    setSelectedProduct(null); // Close modal after adding
    setToastMessage(`${product.name} 已成功加入購物車！`);
    setIsCartOpen(true); // Open cart sidebar
  };
  
  const handleUpdateQuantity = (productId: number, newQuantity: number) => {
    setCartItems(prevItems =>
      prevItems
        .map(item =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        )
        .filter(item => item.quantity > 0) // 同時處理移除數量為0的商品
    );
  };
  
  const handleRemoveFromCart = (productId: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };
  
  const handleCheckout = () => {
    if (!currentUser) {
      setIsCartOpen(false);
      setIsAuthModalOpen(true);
    } else {
      // 前往結帳頁面
      setIsCartOpen(false);
      setIsCheckoutOpen(true);
    }
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setIsAuthModalOpen(false);
  };

  const handleRegister = (user: User) => {
    // Simulate registration and login
    setCurrentUser(user);
    setIsAuthModalOpen(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  const handlePlaceOrder = () => {
    // 模擬下單成功
    alert(`感謝 ${currentUser?.name}！您的訂單已成功提交，我們會盡快處理。`);
    setCartItems([]);
    setIsCheckoutOpen(false);
  };
  
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // 如果結帳頁面打開，只渲染結帳頁面和頁首頁尾
  if (isCheckoutOpen && currentUser) {
    return (
      <>
        <Header
          cartCount={cartItemCount}
          currentUser={currentUser}
          onCartClick={() => setIsCartOpen(true)}
          onUserClick={() => setIsAuthModalOpen(true)}
          onLogout={handleLogout}
        />
        <CheckoutPage 
          user={currentUser}
          cartItems={cartItems}
          onPlaceOrder={handlePlaceOrder}
          onClose={() => setIsCheckoutOpen(false)}
        />
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header
        cartCount={cartItemCount}
        currentUser={currentUser}
        onCartClick={() => setIsCartOpen(true)}
        onUserClick={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />
      <main>
        <Hero />
        <Features />
        <ProductCategories />
        <ProductShowcase onProductSelect={setSelectedProduct} />
        <About />
        <AiAssistant />
      </main>
      <Footer />
      
      {/* Modals and Sidebars */}
      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={handleCloseModal}
          onAddToCart={handleAddToCart}
        />
      )}
      
      <Cart
        isOpen={isCartOpen}
        items={cartItems}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={handleCheckout}
      />

      {isAuthModalOpen && (
        <AuthModal
          onClose={() => setIsAuthModalOpen(false)}
          onLogin={handleLogin}
          onRegister={handleRegister}
        />
      )}

      {toastMessage && <Toast message={toastMessage} />}
    </>
  );
};

export default App;