import React, { useState } from 'react';
import { User, CartItem } from '../types';
import OrderSummary from './OrderSummary';

interface CheckoutPageProps {
    user: User;
    cartItems: CartItem[];
    onPlaceOrder: () => void;
    onClose: () => void;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ user, cartItems, onPlaceOrder, onClose }) => {
    const [formData, setFormData] = useState({
        name: user.name,
        email: user.email,
        address: '',
        city: '',
        postalCode: '',
        phone: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simple validation
        for (const key in formData) {
            if (formData[key as keyof typeof formData] === '') {
                alert('請填寫所有運送資訊！');
                return;
            }
        }
        onPlaceOrder();
    };

    return (
        <div className="bg-gray-50 min-h-screen pt-28 md:pt-36 pb-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center mb-6">
                     <button onClick={onClose} className="text-primary hover:text-primary/80 flex items-center">
                        <i className="fa-solid fa-arrow-left mr-2"></i>
                        返回
                    </button>
                    <h1 className="text-3xl font-bold text-center flex-grow">結帳</h1>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Side: Forms */}
                        <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-md">
                            {/* Shipping Information */}
                            <section>
                                <h2 className="text-2xl font-semibold mb-6 border-b pb-4">運送資訊</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">姓名</label>
                                        <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" required />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">電子郵件</label>
                                        <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" required />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">地址</label>
                                        <input type="text" id="address" name="address" value={formData.address} onChange={handleInputChange} placeholder="信義區市府路..." className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" required />
                                    </div>
                                    <div>
                                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">城市</label>
                                        <input type="text" id="city" name="city" value={formData.city} onChange={handleInputChange} placeholder="台北市" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" required />
                                    </div>
                                    <div>
                                        <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">郵遞區號</label>
                                        <input type="text" id="postalCode" name="postalCode" value={formData.postalCode} onChange={handleInputChange} placeholder="110" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" required />
                                    </div>
                                     <div className="md:col-span-2">
                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">聯絡電話</label>
                                        <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="0912-345-678" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" required />
                                    </div>
                                </div>
                            </section>

                            {/* Payment Information (Mock) */}
                            <section className="mt-12">
                                <h2 className="text-2xl font-semibold mb-6 border-b pb-4">付款資訊</h2>
                                <div className="bg-yellow-100/50 border-l-4 border-yellow-400 text-yellow-800 p-4 rounded-r-lg mb-6">
                                    <p className="font-bold">此為模擬畫面</p>
                                    <p className="text-sm">請勿輸入真實信用卡資訊。此處僅為展示結帳流程。</p>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="card" className="block text-sm font-medium text-gray-700 mb-1">信用卡號</label>
                                        <input type="text" id="card" placeholder="**** **** **** 1234" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 mb-1">到期日 (MM/YY)</label>
                                            <input type="text" id="expiry" placeholder="12/28" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" />
                                        </div>
                                        <div>
                                            <label htmlFor="cvc" className="block text-sm font-medium text-gray-700 mb-1">安全碼 (CVC)</label>
                                            <input type="text" id="cvc" placeholder="123" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" />
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Right Side: Order Summary */}
                        <div className="lg:col-span-1">
                           <div className="bg-white p-8 rounded-2xl shadow-md sticky top-28">
                             <OrderSummary cartItems={cartItems} />
                             <button type="submit" className="w-full mt-6 py-3 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors font-semibold text-lg flex items-center justify-center gap-2">
                                 <i className="fa-solid fa-lock"></i>
                                 確認下單
                             </button>
                           </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CheckoutPage;
