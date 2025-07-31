import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import { productAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import Button from '../components/Button';
import Input from '../components/Input';
import toast from 'react-hot-toast';

const Home = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getLatestProducts();
      // image_url -> imageUrl 변환
      const products = response.data.map((product) => ({
        ...product,
        imageUrl: product.imageUrl || product.image_url,
      }));
      setProducts(products);
    } catch (error) {
      toast.error('상품을 불러오는데 실패했습니다.');
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchKeyword) params.keyword = searchKeyword;
      if (selectedCategory) params.category = selectedCategory;
      
      const response = await productAPI.searchProducts(params);
      // image_url -> imageUrl 변환
      const products = response.data.content.map((product) => ({
        ...product,
        imageUrl: product.imageUrl || product.image_url,
      }));
      setProducts(products);
    } catch (error) {
      toast.error('검색에 실패했습니다.');
      console.error('Error searching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewProduct = (productId) => {
    navigate(`/products/${productId}`);
  };

  // 장바구니에 상품 추가 (로컬스토리지, 10분 만료)
  function addToCartWithExpiry(product) {
    const now = Date.now();
    const expiry = now + 10 * 60 * 1000; // 10분
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    // 이미 담긴 상품이면 수량 증가
    const idx = cart.findIndex(item => item.id === product.id);
    if (idx > -1) {
      cart[idx].quantity = (cart[idx].quantity || 1) + 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('cart_expiry', expiry);
  }

  const handleAddToCart = (product) => {
    addToCartWithExpiry(product);
    toast.success(`${product.name}이 장바구니에 추가되었습니다.`);
  };

  const categories = [
    '전자제품',
    '의류',
    '도서',
    '스포츠',
    '가구',
    '식품',
    '화장품',
    '기타'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">
              🛍️ 쇼핑몰
            </h1>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => navigate('/login')}
              >
                로그인
              </Button>
              <Button onClick={() => navigate('/signup')}>
                회원가입
              </Button>
              <Button onClick={() => navigate('/cart')}>
                장바구니
              </Button>
              <Button onClick={() => navigate('/products/new')}>
                상품 등록
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 검색 섹션 */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="상품명을 검색하세요..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="pl-10"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input w-32"
              >
                <option value="">전체 카테고리</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <Button onClick={handleSearch}>
                <Filter className="w-4 h-4 mr-1" />
                검색
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 상품 목록 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            최신 상품
          </h2>
          <p className="text-gray-600">
            새롭게 등록된 상품들을 확인해보세요
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="aspect-square bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded" />
                  <div className="h-3 bg-gray-200 rounded" />
                  <div className="h-6 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onView={handleViewProduct}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}

        {!loading && products.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              상품을 찾을 수 없습니다
            </h3>
            <p className="text-gray-600">
              다른 검색어를 시도해보세요
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home; 