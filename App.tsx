import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './services/firebase';

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
import CheckoutPage from './components/CheckoutPage';

import AdminPage from './components/admin/AdminPage';
import ProductManagement from './components/admin/ProductManagement';
import MemberManagement from './components/admin/MemberManagement';
import OrderManagement from './components/admin/OrderManagement';
import PrivateRoute from './components/PrivateRoute';
import LoginPage from './components/LoginPage';

import { Product, CartItem, User } from './types';

// 將需要 navigate 的邏輯提取到組件內部
const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser({
          uid: user.uid,
          email: user.email || '',
          name: user.displayName || user.email || 'User',
        });
      } else {
        setCurrentUser(null);
      }
      setLoadingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
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
    setSelectedProduct(null);
    setToastMessage(`${product.name} 已成功加入購物車！`);
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId: number, newQuantity: number) => {
    setCartItems(prevItems =>
      prevItems
        .map(item =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        )
        .filter(item => item.quantity > 0)
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
      setIsCartOpen(false);
      navigate('/checkout'); // 使用 navigate 而不是 window.location.href
    }
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setIsAuthModalOpen(false);
  };

  const handleRegister = (user: User) => {
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
    alert(`感謝 ${currentUser?.name}！您的訂單已成功提交，我們會盡快處理。`);
    setCartItems([]);
    navigate('/'); // 使用 navigate 而不是 window.location.href
  };

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  if (loadingAuth) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        fontSize: '24px',
        color: '#666'
      }}>
        Loading authentication status...
      </div>
    );
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

      <Routes>
        <Route path="/" element={
          <>
            <main>
              <Hero />
              <Features />
              <ProductCategories />
              <ProductShowcase onProductSelect={setSelectedProduct} />
              <About />
              <AiAssistant />
            </main>
            <Footer />
          </>
        } />

        <Route path="/login" element={<LoginPage />} />

        <Route path="/checkout" element={
          <PrivateRoute user={currentUser}>
            <CheckoutPage
              user={currentUser}
              cartItems={cartItems}
              onPlaceOrder={handlePlaceOrder}
              onClose={() => navigate('/')}
            />
          </PrivateRoute>
        } />

        <Route path="/admin" element={
          <PrivateRoute user={currentUser}>
            <AdminPage />
          </PrivateRoute>
        } />
        <Route path="/admin/products" element={
          <PrivateRoute user={currentUser}>
            <ProductManagement />
          </PrivateRoute>
        } />
        <Route path="/admin/members" element={
          <PrivateRoute user={currentUser}>
            <MemberManagement />
          </PrivateRoute>
        } />
        <Route path="/admin/orders" element={
          <PrivateRoute user={currentUser}>
            <OrderManagement />
          </PrivateRoute>
        } />
      </Routes>

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

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;