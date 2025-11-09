
import React, { useMemo } from 'react';
import { Product, LifecycleStatus } from '../types';
import QualityScore from './QualityScore';
import { PencilIcon, DocumentDuplicateIcon } from './icons';

interface ProductDetailProps {
  product: Product;
  onEdit: (product: Product) => void;
}

const getStatusClass = (status: LifecycleStatus) => {
    switch (status) {
        case LifecycleStatus.DESIGN: return 'border-status-design text-status-design bg-status-design/10';
        case LifecycleStatus.IN_PRODUCTION: return 'border-status-production text-status-production bg-status-production/10';
        case LifecycleStatus.TESTING: return 'border-status-testing text-status-testing bg-status-testing/10';
        case LifecycleStatus.OBSOLETE: return 'border-status-obsolete text-status-obsolete bg-status-obsolete/10';
        default: return 'border-gray-400 text-gray-500 bg-gray-100';
    }
}

const DetailCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-brand-primary border-b border-gray-200 pb-2 mb-4">{title}</h3>
        {children}
    </div>
);

const InfoItem: React.FC<{ label: string; value: string | React.ReactNode; copyable?: boolean }> = ({ label, value, copyable = false }) => {
    const handleCopy = () => {
        if(typeof value === 'string') {
            navigator.clipboard.writeText(value);
        }
    };
    return (
        <div className="grid grid-cols-2 gap-4 py-2">
            <dt className="text-sm font-medium text-gray-500">{label}</dt>
            <dd className="text-sm text-gray-900 flex items-center">
                {value}
                {copyable && typeof value === 'string' && (
                    <button onClick={handleCopy} className="ml-2 text-gray-400 hover:text-brand-primary" title={`Copy ${label}`}>
                        <DocumentDuplicateIcon className="w-4 h-4" />
                    </button>
                )}
            </dd>
        </div>
    );
};

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onEdit }) => {
  const qualityScore = useMemo(() => {
    const fields = [
      product.gtin,
      product.partNumber,
      product.name,
      product.description,
      product.material,
      product.dimensions.length,
      product.weight.value,
      product.supplier,
      product.manufacturer,
      product.dataOwner,
      product.sourceSystem,
    ];
    const filledFields = fields.filter(field => (typeof field === 'string' ? field.trim() !== '' : !!field)).length;
    return Math.round((filledFields / fields.length) * 100);
  }, [product]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 h-full">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-md text-gray-500 mt-1">{product.partNumber}</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 text-sm font-semibold rounded-full border ${getStatusClass(product.lifecycleStatus)}`}>
              {product.lifecycleStatus}
            </span>
            <button
              onClick={() => onEdit(product)}
              className="p-2 bg-white border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 hover:text-brand-primary transition shadow-sm"
              aria-label="Edit Product"
            >
              <PencilIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-brand-primary border-b border-gray-200 pb-2 mb-4">Description</h3>
                <p className="text-gray-700 leading-relaxed">
                    {product.description || <span className="text-gray-400 italic">No description provided.</span>}
                </p>
            </div>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <DetailCard title="Technical Specifications">
                    <InfoItem label="Material" value={product.material} />
                    <InfoItem label="Dimensions" value={`${product.dimensions.length} x ${product.dimensions.width} x ${product.dimensions.height} ${product.dimensions.unit}`} />
                    <InfoItem label="Weight" value={`${product.weight.value} ${product.weight.unit}`} />
                </DetailCard>
                
                <DetailCard title="Supply Chain">
                    <InfoItem label="Supplier" value={product.supplier} />
                    <InfoItem label="Manufacturer" value={product.manufacturer} />
                </DetailCard>
                
                 <DetailCard title="Identification (GS1 / ISO 10303)">
                    <InfoItem label="GTIN" value={product.gtin} copyable/>
                    <InfoItem label="Part Number" value={product.partNumber} copyable/>
                </DetailCard>

                <DetailCard title="Governance & Metadata (DAMA / ISO 8000)">
                    <InfoItem label="Data Owner" value={product.dataOwner} />
                    <InfoItem label="Source System" value={product.sourceSystem} />
                    <InfoItem label="Created" value={new Date(product.creationDate).toLocaleDateString()} />
                    <InfoItem label="Last Modified" value={new Date(product.lastModified).toLocaleString()} />
                </DetailCard>
            </div>
          </div>
          
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover" />
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-brand-primary mb-4">Data Quality (ISO 8000)</h3>
                    <QualityScore score={qualityScore} />
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
