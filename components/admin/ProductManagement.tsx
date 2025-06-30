import React, { useState, useEffect } from 'react';
import { productService, Product } from '../../services/firebaseService';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

const storage = getStorage();

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const emptyProduct: Omit<Product, 'id' | 'createdAt'> = {
    name: '',
    description: '',
    price: 0,
    category: '',
    imageUrls: [],
    stock: 0,
    isActive: true
  };

  const [newProduct, setNewProduct] = useState(emptyProduct);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const productList = await productService.getAllProducts();
      setProducts(productList);
    } catch (error) {
      console.error('載入產品資料失敗:', error);
      alert('載入產品資料失敗');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).slice(0, 3);
      setSelectedFiles(files);
    }
  };

  const uploadImages = async (): Promise<string[]> => {
    const urls: string[] = [];
    for (const file of selectedFiles) {
      const storageRef = ref(storage, `products/${uuidv4()}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      urls.push(url);
    }
    return urls;
  };

  const handleCreateProduct = async () => {
    if (!newProduct.name || !newProduct.price) {
      alert('請填寫產品名稱和價格');
      return;
    }

    try {
      const imageUrls = await uploadImages();
      const productData = {
        ...newProduct,
        imageUrls
      };
      await productService.createProduct(productData);
      await loadProducts();
      setNewProduct(emptyProduct);
      setSelectedFiles([]);
      setIsCreating(false);
      alert('產品新增成功');
    } catch (error) {
      console.error('新增產品失敗:', error);
      alert('新增產品失敗');
    }
  };

  const handleUpdateProduct = async (productId: string, updates: Partial<Product>) => {
    try {
      await productService.updateProduct(productId, updates);
      await loadProducts();
      setEditingProduct(null);
      alert('產品更新成功');
    } catch (error) {
      console.error('更新產品失敗:', error);
      alert('更新產品失敗');
    }
  };

  const handleDeleteProduct = async (productId: string, productName: string) => {
    if (window.confirm(`確定要刪除產品「${productName}」嗎？`)) {
      try {
        await productService.deleteProduct(productId);
        await loadProducts();
        alert('產品刪除成功');
      } catch (error) {
        console.error('刪除產品失敗:', error);
        alert('刪除產品失敗');
      }
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="admin-loading">載入中...</div>;
  }

  return (
    <div className="admin-page">
      {/* 其他 UI 內容省略，與前述一致，只新增圖片上傳欄位如下 */}
      {isCreating && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>新增產品</h2>
              <button onClick={() => { setIsCreating(false); setNewProduct(emptyProduct); }} className="modal-close">×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>產品名稱 *</label>
                <input type="text" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />
              </div>
              <div className="form-group">
                <label>分類</label>
                <input type="text" value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} />
              </div>
              <div className="form-group">
                <label>價格 *</label>
                <input type="number" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: parseInt(e.target.value) })} />
              </div>
              <div className="form-group">
                <label>描述</label>
                <textarea value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} />
              </div>
              <div className="form-group">
                <label>上傳圖片（最多三張）</label>
                <input type="file" multiple accept="image/*" onChange={handleFileChange} />
              </div>
              <div className="form-group">
                <label>庫存</label>
                <input type="number" value={newProduct.stock} onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) })} />
              </div>
              <div className="form-group">
                <label>
                  <input type="checkbox" checked={newProduct.isActive} onChange={(e) => setNewProduct({ ...newProduct, isActive: e.target.checked })} />
                  上架此產品
                </label>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => { setIsCreating(false); setNewProduct(emptyProduct); }} className="btn btn-cancel">取消</button>
              <button onClick={handleCreateProduct} className="btn btn-save">儲存</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
