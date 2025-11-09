
import React, { useState, useEffect, useCallback } from 'react';
import { Product, LifecycleStatus } from '../types';
import { LIFECYCLE_STATUS_OPTIONS, MATERIALS } from '../constants';
import { generateDescription } from '../services/geminiService';
import { SparklesIcon, XMarkIcon } from './icons';

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Omit<Product, 'id' | 'creationDate' | 'lastModified'>, id?: string) => void;
  product: Product | null;
}

const ProductForm: React.FC<ProductFormProps> = ({ isOpen, onClose, onSave, product }) => {
  const [formData, setFormData] = useState<Omit<Product, 'id' | 'creationDate' | 'lastModified'>>({
    gtin: '',
    partNumber: '',
    name: '',
    description: '',
    material: MATERIALS[0],
    dimensions: { length: 0, width: 0, height: 0, unit: 'mm' },
    weight: { value: 0, unit: 'kg' },
    lifecycleStatus: LifecycleStatus.DESIGN,
    supplier: '',
    manufacturer: '',
    dataOwner: '',
    sourceSystem: '',
    imageUrl: 'https://picsum.photos/seed/newpart/600/400',
  });
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData(product);
    } else {
      // Reset form for new product
      setFormData({
        gtin: '', partNumber: '', name: '', description: '',
        material: MATERIALS[0],
        dimensions: { length: 0, width: 0, height: 0, unit: 'mm' },
        weight: { value: 0, unit: 'kg' },
        lifecycleStatus: LifecycleStatus.DESIGN,
        supplier: '', manufacturer: '', dataOwner: '', sourceSystem: '',
        imageUrl: `https://picsum.photos/seed/${Date.now()}/600/400`,
      });
    }
  }, [product, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNestedChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, category: 'dimensions' | 'weight') => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [name]: name === 'unit' ? value : parseFloat(value) || 0,
      },
    }));
  };

  const handleGenerateDescription = useCallback(async () => {
    setIsGenerating(true);
    try {
      const desc = await generateDescription(formData);
      setFormData(prev => ({...prev, description: desc}));
    } catch(error) {
        console.error("Failed to generate description:", error);
        alert("Error generating description. Check the console for details.");
    } finally {
        setIsGenerating(false);
    }
  }, [formData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData, product?.id);
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-brand-primary">{product ? 'Edit Product' : 'Create New Product'}</h2>
          <button onClick={onClose} className="p-1 rounded-full text-gray-500 hover:bg-gray-200">
            <XMarkIcon className="w-6 h-6"/>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label="Product Name" name="name" value={formData.name} onChange={handleChange} required />
                <InputField label="Part Number" name="partNumber" value={formData.partNumber} onChange={handleChange} required />
                <InputField label="GTIN" name="gtin" value={formData.gtin} onChange={handleChange} required />
                <SelectField label="Lifecycle Status" name="lifecycleStatus" value={formData.lifecycleStatus} onChange={handleChange} options={LIFECYCLE_STATUS_OPTIONS} />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary" />
                <button type="button" onClick={handleGenerateDescription} disabled={isGenerating || !formData.name} className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-accent hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent disabled:bg-gray-300">
                   <SparklesIcon className={`w-5 h-5 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
                   {isGenerating ? 'Generating...' : 'Generate with AI'}
                </button>
            </div>
          
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <SelectField label="Material" name="material" value={formData.material} onChange={handleChange} options={MATERIALS} />
                <InputField label="Supplier" name="supplier" value={formData.supplier} onChange={handleChange} />
                <InputField label="Manufacturer" name="manufacturer" value={formData.manufacturer} onChange={handleChange} />
                <InputField label="Data Owner" name="dataOwner" value={formData.dataOwner} onChange={handleChange} placeholder="e.g., email@example.com"/>
            </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dimensions</label>
                    <div className="grid grid-cols-4 gap-2">
                        <input type="number" name="length" value={formData.dimensions.length} onChange={(e) => handleNestedChange(e, 'dimensions')} placeholder="L" className="input-field" />
                        <input type="number" name="width" value={formData.dimensions.width} onChange={(e) => handleNestedChange(e, 'dimensions')} placeholder="W" className="input-field" />
                        <input type="number" name="height" value={formData.dimensions.height} onChange={(e) => handleNestedChange(e, 'dimensions')} placeholder="H" className="input-field" />
                        <select name="unit" value={formData.dimensions.unit} onChange={(e) => handleNestedChange(e, 'dimensions')} className="input-field">
                            <option value="mm">mm</option>
                            <option value="in">in</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
                    <div className="grid grid-cols-2 gap-2">
                         <input type="number" name="value" value={formData.weight.value} onChange={(e) => handleNestedChange(e, 'weight')} placeholder="Value" className="input-field" />
                         <select name="unit" value={formData.weight.unit} onChange={(e) => handleNestedChange(e, 'weight')} className="input-field">
                            <option value="kg">kg</option>
                            <option value="g">g</option>
                            <option value="lb">lb</option>
                         </select>
                    </div>
                </div>
             </div>
        </form>

        <div className="flex justify-end items-center p-4 border-t bg-gray-50">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 mr-3">Cancel</button>
          <button type="submit" onClick={handleSubmit} className="px-4 py-2 bg-brand-primary border border-transparent rounded-md text-sm font-medium text-white hover:bg-brand-secondary">Save Product</button>
        </div>
      </div>
    </div>
  );
};

// Helper components for form fields
const InputField: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => (
  <div>
    <label htmlFor={props.name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input id={props.name} {...props} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary" />
  </div>
);

const SelectField: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label: string; options: string[] }> = ({ label, options, ...props }) => (
  <div>
    <label htmlFor={props.name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <select id={props.name} {...props} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary bg-white">
      {options.map(option => <option key={option} value={option}>{option}</option>)}
    </select>
  </div>
);

export default ProductForm;
