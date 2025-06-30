// components/admin/OrderManagement.tsx
import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase';

const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const querySnapshot = await getDocs(collection(db, 'orders'));
      const orderList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(orderList);
    };
    fetchOrders();
  }, []);

  return (
    <div>
      <h2>訂單管理</h2>
      <ul>
        {orders.map(order => (
          <li key={order.id}>
            訂單編號: {order.id} - 用戶: {order.userId} - 金額: {order.totalPrice} - 狀態: {order.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderManagement;