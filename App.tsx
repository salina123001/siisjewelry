import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './services/firebase';
import { useState, useEffect } from 'react';

import Header from './components/Header';
import OrderManagement from './components/admin/OrderManagement';
import ProductManagement from './components/admin/ProductManagement';
import MemberManagement from './components/admin/MemberManagement';
import PrivateRoute from './components/PrivateRoute';

const App: React.FC = () => {
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        {/* 側邊欄 */}
        <div style={{ width: '240px', backgroundColor: '#f3f4f6', padding: '20px' }}>
          <Header />
        </div>

        {/* 主內容區 */}
        <main style={{ flex: 1, padding: '40px' }}>
          <Routes>
            <Route path="/" element={<Navigate to="/orders" />} />
            <Route path="/orders" element={<PrivateRoute user={user}><OrderManagement /></PrivateRoute>} />
            <Route path="/products" element={<PrivateRoute user={user}><ProductManagement /></PrivateRoute>} />
            <Route path="/members" element={<PrivateRoute user={user}><MemberManagement /></PrivateRoute>} />
            {/* 可新增更多管理路由 */}
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
