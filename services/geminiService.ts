import { GoogleGenAI } from "@google/genai";
// FIX: Import Product type to be used in generateDescription function
import type { Product } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const standardizeDescription = async (
  rawDescription: string
): Promise<string> => {
  if (!rawDescription.trim()) {
    return "Por favor, insira uma descrição para padronizar.";
  }

  const prompt = `
    Você é um especialista em catalogação e saneamento de dados mestre de materiais (Product/Part Data Management - PDM), seguindo os princípios do DAMA-DMBOK e normas como ISO 8000.

    Sua tarefa é analisar uma descrição de material não padronizada e transformá-la em uma descrição técnica padronizada, rica e organizada.

    A descrição não padronizada de entrada é:
    "${rawDescription}"

    Analise a descrição acima e gere uma saída estruturada contendo os seguintes elementos:

    1.  **Nome Curto (PDM):** Crie um nome conciso e padronizado, seguindo o formato "SUBSTANTIVO + CARACTERÍSTICA PRINCIPAL 1 + CARACTERÍSTICA PRINCIPAL 2...". Por exemplo, "PARAFUSO CABEÇA SEXTAVADA AÇO INOX 304 M8X25".

    2.  **NPN (Número da Peça do Fabricante) / Part Number Sugerido:** Se possível, sugira um código NPN baseado nas características. Pode ser uma abreviação. Ex: "PAR-HEX-INOX304-M8X25".

    3.  **Descrição Técnica Detalhada:** Elabore uma descrição completa e bem estruturada, extraindo e organizando todas as informações técnicas da entrada. Inclua, sempre que possível:
        *   **Função/Aplicação:** Qual o propósito do item.
        *   **Material:** O material de fabricação (ex: Aço Inox 304, Latão, Policarbonato).
        *   **Dimensões:** Medidas como diâmetro, comprimento, rosca, etc. (ex: Diâmetro M8, Comprimento 25mm).
        *   **Norma Técnica:** Se alguma norma for mencionada (DIN, ISO, ANSI), inclua-a.
        *   **Acabamento:** Tipo de acabamento (ex: Zincado, Polido, Anodizado).
        *   **Outras Características:** Qualquer outra informação relevante.

    Formate sua resposta final usando Markdown, com títulos para cada seção (**Nome Curto (PDM)**, **NPN Sugerido**, **Descrição Técnica Detalhada**), para facilitar a leitura.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text.trim();
  } catch (error) {
    console.error("Gemini API call failed:", error);
    throw new Error("Falha ao gerar descrição. Verifique o console para mais detalhes.");
  }
};

// FIX: Add and export generateDescription function
export const generateDescription = async (
  productData: Partial<Omit<Product, 'id' | 'creationDate' | 'lastModified'>>
): Promise<string> => {
  if (!productData.name) {
    return "";
  }
  
  // Construct a string of available product attributes
  const attributes = Object.entries({
    "Product Name": productData.name,
    "Part Number": productData.partNumber,
    "Material": productData.material,
    "Dimensions": productData.dimensions ? `${productData.dimensions.length} x ${productData.dimensions.width} x ${productData.dimensions.height} ${productData.dimensions.unit}` : undefined,
    "Weight": productData.weight ? `${productData.weight.value} ${productData.weight.unit}` : undefined,
    "Supplier": productData.supplier,
    "Manufacturer": productData.manufacturer,
    "Lifecycle Status": productData.lifecycleStatus,
  })
  .filter(([, value]) => value)
  .map(([key, value]) => `- ${key}: ${value}`)
  .join('\n');

  const prompt = `
    You are an expert in Product Data Management (PDM) and technical writing, adhering to standards like ISO 8000 and DAMA-DMBOK.
    Your task is to generate a rich, professional, and standardized technical description for a product based on its key attributes.

    Here are the product attributes:
${attributes}

    Based on these attributes, generate a concise yet comprehensive technical description. The description should:
    1.  Start with a clear statement of the product's primary function, inferring from its name and attributes.
    2.  Incorporate all relevant provided technical specifications (material, dimensions, weight).
    3.  Be written in a professional and objective tone.
    4.  Be a single paragraph, typically between 2 to 4 sentences.
    5.  Do not repeat the product name or part number in the description.

    Example Input:
    - Product Name: Main Mounting Bracket
    - Part Number: BRK-001-AL
    - Material: Aluminum 6061-T6
    - Dimensions: 150 x 75 x 50 mm

    Example Output:
    A precision-machined aluminum bracket for core chassis assembly. Features reinforced mounting points and an anodized finish for corrosion resistance. Critical component for structural integrity.

    Now, generate the description for the provided product.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text.trim();
  } catch (error) {
    console.error("Gemini API call failed for description generation:", error);
    throw new Error("Failed to generate description. Please check the console for more details.");
  }
};
