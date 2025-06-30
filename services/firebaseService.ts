// services/firebaseService.ts
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  where,
  onSnapshot,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';

// 資料類型定義
export interface Member {
  id?: string;
  uid: string; // Firebase Auth UID
  email: string;
  name: string;
  phone?: string;
  address?: string;
  createdAt: Timestamp;
  isActive: boolean;
}

export interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrls: string[]; // ← ✅ 改成多張圖片
  stock: number;
  isActive: boolean;
  createdAt: Timestamp;
}

export interface Order {
  id?: string;
  memberId: string;
  memberName: string;
  memberEmail: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  subtotal: number;
}

// 會員管理
export const memberService = {
  // 創建會員（註冊時自動調用）
  async createMember(memberData: Omit<Member, 'id' | 'createdAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'members'), {
      ...memberData,
      createdAt: Timestamp.now()
    });
    return docRef.id;
  },

  // 獲取所有會員
  async getAllMembers(): Promise<Member[]> {
    const q = query(collection(db, 'members'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Member));
  },

  // 更新會員資料
  async updateMember(memberId: string, updates: Partial<Member>): Promise<void> {
    const memberRef = doc(db, 'members', memberId);
    await updateDoc(memberRef, updates);
  },

  // 刪除會員
  async deleteMember(memberId: string): Promise<void> {
    await deleteDoc(doc(db, 'members', memberId));
  },

  // 根據 UID 查找會員
  async getMemberByUID(uid: string): Promise<Member | null> {
    const q = query(collection(db, 'members'), where('uid', '==', uid));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return null;
    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() } as Member;
  }
};

// 產品管理
export const productService = {
  // 新增產品
  async createProduct(productData: Omit<Product, 'id' | 'createdAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'products'), {
      ...productData,
      createdAt: Timestamp.now()
    });
    return docRef.id;
  },

  // 獲取所有產品
  async getAllProducts(): Promise<Product[]> {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Product));
  },

  // 獲取上架產品（前台用）
  async getActiveProducts(): Promise<Product[]> {
    const q = query(
      collection(db, 'products'), 
      where('isActive', '==', true),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Product));
  },

  // 更新產品
  async updateProduct(productId: string, updates: Partial<Product>): Promise<void> {
    const productRef = doc(db, 'products', productId);
    await updateDoc(productRef, updates);
  },

  // 刪除產品
  async deleteProduct(productId: string): Promise<void> {
    await deleteDoc(doc(db, 'products', productId));
  }
};

// 訂單管理
export const orderService = {
  // 創建訂單
  async createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'orders'), {
      ...orderData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return docRef.id;
  },

  // 獲取所有訂單（後台用）
  async getAllOrders(): Promise<Order[]> {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Order));
  },

  // 獲取特定會員的訂單
  async getOrdersByMember(memberId: string): Promise<Order[]> {
    const q = query(
      collection(db, 'orders'), 
      where('memberId', '==', memberId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Order));
  },

  // 更新訂單狀態
  async updateOrderStatus(orderId: string, status: Order['status']): Promise<void> {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, {
      status,
      updatedAt: Timestamp.now()
    });
  },

  // 更新訂單
  async updateOrder(orderId: string, updates: Partial<Order>): Promise<void> {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
  },

  // 刪除訂單
  async deleteOrder(orderId: string): Promise<void> {
    await deleteDoc(doc(db, 'orders', orderId));
  }
};

// 即時監聽資料變化（可選用）
export const subscribeToCollection = (
  collectionName: string, 
  callback: (data: any[]) => void
) => {
  const q = query(collection(db, collectionName), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (querySnapshot) => {
    const data = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(data);
  });
};