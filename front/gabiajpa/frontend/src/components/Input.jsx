import { forwardRef } from 'react';         //react-hook-form 연결
import { cn } from '../utils/cn';

//Tailwind Css + React + react-hook-form (디자인 재사용성, 유효성 메세지까지 설정)
const Input = forwardRef(({ 
  label,        //텍스트 라벨
  error,        //문자열 에러메세지
  className = '',   //외부에서 전달되는 스타일
  ...props      //placehoder, name, onChange, type 등의 속성을 의미
}, ref) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        ref={ref}  // ✅ react-hook-form 연결 핵심
        className={cn(
          'input',
          error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

export default Input;
