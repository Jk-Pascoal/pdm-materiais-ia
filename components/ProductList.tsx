
import React from 'react';
import { Product, LifecycleStatus } from '../types';
import { CheckCircleIcon } from './icons';

interface ProductListProps {
  products: Product[];
  selectedProduct: Product | null;
  onSelectProduct: (product: Product) => void;
}

const getStatusColor = (status: LifecycleStatus) => {
  switch (status) {
    case LifecycleStatus.DESIGN:
      return 'bg-status-design';
    case LifecycleStatus.IN_PRODUCTION:
      return 'bg-status-production';
    case LifecycleStatus.TESTING:
      return 'bg-status-testing';
    case LifecycleStatus.OBSOLETE:
      return 'bg-status-obsolete';
    default:
      return 'bg-gray-400';
  }
};

const ProductListItem: React.FC<{ product: Product; isSelected: boolean; onSelect: () => void }> = ({ product, isSelected, onSelect }) => (
    <li
      onClick={onSelect}
      className={`p-4 border-b border-gray-200 cursor-pointer transition-colors duration-150 flex items-start space-x-4 ${
        isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'
      }`}
    >
      <div className="flex-grow">
        <div className="flex justify-between items-center">
            <p className={`font-bold text-gray-800 ${isSelected ? 'text-brand-primary' : ''}`}>{product.name}</p>
            {product.description.length > 0 && <CheckCircleIcon className="w-5 h-5 text-green-500" title="Description complete" />}
        </div>
        <p className="text-sm text-gray-500">{product.partNumber}</p>
        <div className="flex items-center mt-2">
            <span className={`w-3 h-3 rounded-full mr-2 ${getStatusColor(product.lifecycleStatus)}`}></span>
            <span className="text-xs text-gray-600 font-medium">{product.lifecycleStatus}</span>
        </div>
      </div>
    </li>
);

const ProductList: React.FC<ProductListProps> = ({ products, selectedProduct, onSelectProduct }) => {
  if (products.length === 0) {
    return <div className="p-4 text-center text-gray-500">No products found.</div>
  }

  return (
    <ul className="divide-y divide-gray-200">
      {products.map((product) => (
        <ProductListItem 
            key={product.id}
            product={product}
            isSelected={selectedProduct?.id === product.id}
            onSelect={() => onSelectProduct(product)}
        />
      ))}
    </ul>
  );
};

export default ProductList;
