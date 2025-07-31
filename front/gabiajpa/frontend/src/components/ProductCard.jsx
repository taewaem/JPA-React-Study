import { ShoppingCart, Eye } from "lucide-react";
import Button from "./Button";
import noImage from "../assets/no-image.png";

//props(product -> 이름, 설명, 가격, 재고현황, 이미지 / onView -> 상세보기 / onAddToCart -> 장바구니 )
const ProductCard = ({ product, onView, onAddToCart }) => {
  return (
    <div className="card overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="aspect-square overflow-hidden bg-gray-100">
        {product.imageUrl ? (
          <img
            src={product.imageUrl || noImage}
            alt={product.name || "상품 이미지"}
            className="w-full h-full object-cover"
            width={150}
            height={150}
            onError={(e) => {
              if (!e.target.src.includes("no-image.png")) {
                e.target.onerror = null;
                e.target.src = noImage;
              }
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <ShoppingCart className="w-12 h-12" />
          </div>
        )}
      </div>

      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-gray-900 truncate">
            {product.name}
          </h3>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
            {product.description}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-primary-600">
            ₩{product.price?.toLocaleString()}
          </span>
          <span className="text-sm text-gray-500">
            재고: {product.stockQuantity}개
          </span>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onView(product.id)}
          >
            <Eye className="w-4 h-4 mr-1" />
            상세보기
          </Button>
          <Button
            size="sm"
            className="flex-1"
            onClick={() => onAddToCart(product)}
            disabled={product.stockQuantity === 0}
          >
            <ShoppingCart className="w-4 h-4 mr-1" />
            장바구니
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 
