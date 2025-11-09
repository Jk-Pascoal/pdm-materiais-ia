
export enum LifecycleStatus {
  DESIGN = 'Design',
  TESTING = 'Testing',
  IN_PRODUCTION = 'In Production',
  OBSOLETE = 'Obsolete',
}

export interface Product {
  id: string;
  gtin: string; // Global Trade Item Number (GS1/GTIN)
  partNumber: string;
  name: string;
  description: string;
  material: string;
  dimensions: {
    length: number;
    width: number;
    height: number;
    unit: 'mm' | 'in';
  };
  weight: {
    value: number;
    unit: 'g' | 'kg' | 'lb';
  };
  lifecycleStatus: LifecycleStatus; // ISO 55000
  supplier: string;
  manufacturer: string;
  // DAMA-DMBOK / ISO 8000 concepts
  dataOwner: string; // Governance
  sourceSystem: string; // Provenance
  creationDate: string; // Metadata
  lastModified: string; // Metadata
  imageUrl: string; // Digital Asset
}
