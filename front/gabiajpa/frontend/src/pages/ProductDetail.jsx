const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await productAPI.getProduct(id);
        const data = response.data;
        // image_url -> imageUrl 변환
        setProduct({
          ...data,
          imageUrl: data.imageUrl || data.image_url,
        });
      } catch (error) {
        alert('상품 정보를 불러오지 못했습니다.');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  if (loading) {
    return <div className="max-w-2xl mx-auto py-12 text-center">Loading...</div>;
  }
  if (!product) return null;

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="bg-white rounded-lg shadow p-6 flex flex-col md:flex-row gap-8">
        <div className="flex-shrink-0 w-full md:w-64 aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
          <img
            src={product.imageUrl || noImage}
            alt={product.name || '상품 이미지'}
            className="w-full h-full object-cover"
            width={256}
            height={256}
            onError={e => {
              if (!e.target.src.includes('no-image.png')) {
                e.target.onerror = null;
                e.target.src = noImage;
              }
            }}
          />
        </div>
        <div className="flex-1 flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
          <p className="text-gray-700">{product.description}</p>
          <div className="text-lg font-semibold text-primary-600">
            가격: ₩{product.price?.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500">재고: {product.stockQuantity}개</div>
          <div className="text-sm text-gray-500">카테고리: {product.category}</div>
          <Button onClick={() => navigate(-1)} className="mt-4 w-full md:w-auto">목록으로</Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 