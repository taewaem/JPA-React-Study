import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import noImage from '../assets/no-image.png';

function getCartWithExpiry() {
  const expiry = localStorage.getItem('cart_expiry');
  const now = Date.now();
  if (!expiry || now > Number(expiry)) {
    localStorage.removeItem('cart');
    localStorage.removeItem('cart_expiry');
    return [];
  }
  return JSON.parse(localStorage.getItem('cart') || '[]');
}

const Cart = () => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setCart(getCartWithExpiry());
  }, []);

  const handleRemove = (id) => {
    const newCart = cart.filter(item => item.id !== id);
    setCart(newCart);
    if (newCart.length === 0) {
      localStorage.removeItem('cart');
      localStorage.removeItem('cart_expiry');
    } else {
      localStorage.setItem('cart', JSON.stringify(newCart));
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">장바구니가 비어 있습니다</h2>
        <Button onClick={() => navigate('/')}>상품 보러가기</Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h2 className="text-2xl font-bold mb-6">장바구니</h2>
      <div className="space-y-4">
        {cart.map(item => (
          <div key={item.id} className="card flex items-center gap-4 p-4">
            <img src={item.imageUrl || noImage} alt={item.name} className="w-20 h-20 object-cover rounded"
              onError={e => {
                if (!e.target.src.includes('no-image.png')) {
                  e.target.onerror = null;
                  e.target.src = noImage;
                }
              }}
            />
            <div className="flex-1">
              <div className="font-semibold">{item.name}</div>
              <div className="text-gray-500">₩{item.price?.toLocaleString()}</div>
              <div className="text-gray-500">수량: {item.quantity}</div>
            </div>
            <Button variant="danger" size="sm" onClick={() => handleRemove(item.id)}>
              삭제
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cart; 