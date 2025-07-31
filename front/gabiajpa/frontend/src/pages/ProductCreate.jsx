import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { productAPI  } from '../services/api';
import Button from "../components/Button";
import Input from "../components/Input";
import toast from 'react-hot-toast';

const CATEGORIES = [
  '전자제품',
  '의류',
  '도서',
  '스포츠',
  '가구',
  '식품',
  '화장품',
  '기타',
];

const ProductCreate = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stockQuantity: '',
    category: '',
    imageUrl: '',
  });
  const [loading, setLoading] = useState(false);

  // 관리자 인증 체크
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (user.username !== 'admin') {
    return (
      <div className="max-w-xl mx-auto py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">관리자만 접근 가능합니다</h2>
        <Button onClick={() => navigate('/')}>홈으로</Button>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.stockQuantity || !form.category) {
      toast.error('필수 항목을 모두 입력하세요.');
      return;
    }
    try {
      setLoading(true);
      await productAPI.createProduct({
        ...form,
        price: Number(form.price),
        stockQuantity: Number(form.stockQuantity),
      });
      toast.success('상품이 등록되었습니다!');
      navigate('/');
    } catch (error) {
      toast.error('상품 등록에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-12 px-4">
      <h2 className="text-2xl font-bold mb-6">상품 등록</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input
          label="상품명"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <Input
          label="설명"
          name="description"
          value={form.description}
          onChange={handleChange}
        />
        <Input
          label="가격"
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          required
        />
        <Input
          label="재고"
          name="stockQuantity"
          type="number"
          value={form.stockQuantity}
          onChange={handleChange}
          required
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">카테고리</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="input"
            required
          >
            <option value="">카테고리 선택</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <Input
          label="이미지 URL"
          name="imageUrl"
          value={form.imageUrl}
          onChange={handleChange}
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? '등록 중...' : '상품 등록'}
        </Button>
      </form>
    </div>
  );
};

export default ProductCreate; 