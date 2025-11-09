import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import { standardizeDescription } from './services/geminiService';
import { WandIcon, DocumentDuplicateIcon, CheckCircleIcon } from './components/icons';

// Since we are using a CDN for marked, we declare it globally
declare global {
  interface Window {
    marked: {
      parse: (markdown: string) => string;
    };
  }
}

const App: React.FC = () => {
  const [rawDescription, setRawDescription] = useState<string>('parafuso sextavado 1/4" x 2", de aço inox, para maquina');
  const [standardizedResult, setStandardizedResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const handleStandardize = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setStandardizedResult('');
    try {
      const result = await standardizeDescription(rawDescription);
      setStandardizedResult(result);
    } catch (e: any) {
      setError(e.message || 'Ocorreu um erro desconhecido.');
    } finally {
      setIsLoading(false);
    }
  }, [rawDescription]);

  const handleCopy = useCallback(() => {
    if (standardizedResult) {
      navigator.clipboard.writeText(standardizedResult).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      });
    }
  }, [standardizedResult]);

  const ResultDisplay = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="flex flex-col items-center text-brand-primary">
            <svg className="animate-spin h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-4 text-lg">Padronizando...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-full p-4">
          <div className="text-center text-red-600 bg-red-100 p-4 rounded-lg border border-red-300">
            <h3 className="font-bold">Erro</h3>
            <p>{error}</p>
          </div>
        </div>
      );
    }

    if (!standardizedResult) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-gray-500">
            <p className="text-xl">Insira uma descrição e clique em "Padronizar"</p>
            <p className="mt-1">para receber uma sugestão de descrição técnica.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="p-6 relative h-full">
        <button
          onClick={handleCopy}
          className="absolute top-4 right-4 p-2 bg-gray-100 rounded-md hover:bg-gray-200 transition text-gray-600"
          title="Copiar para área de transferência"
        >
          {isCopied ? <CheckCircleIcon className="w-5 h-5 text-green-500" /> : <DocumentDuplicateIcon className="w-5 h-5" />}
        </button>
        <div
          className="prose max-w-none h-full"
          dangerouslySetInnerHTML={{ __html: window.marked.parse(standardizedResult) }}
        />
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-gray-100 font-sans flex flex-col">
      <Header />
      <main className="flex-grow p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto h-full lg:h-[calc(100vh-64px-4rem)]">
          {/* Input Panel */}
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 flex flex-col">
            <h2 className="text-xl font-bold text-brand-primary p-4 border-b border-gray-200">
              1. Inserir Descrição do Material
            </h2>
            <div className="p-6 flex-grow flex flex-col">
              <label htmlFor="raw-description" className="block text-sm font-medium text-gray-700 mb-2">
                Descrição não padronizada
              </label>
              <textarea
                id="raw-description"
                value={rawDescription}
                onChange={(e) => setRawDescription(e.target.value)}
                rows={10}
                className="w-full flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-secondary resize-none"
                placeholder="Ex: PARAFUSO ZINCADO 1/4 rosca fina"
              />
            </div>
            <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end">
              <button
                onClick={handleStandardize}
                disabled={isLoading || !rawDescription}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-brand-primary hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                <WandIcon className={`-ml-1 mr-3 h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? 'Analisando...' : 'Padronizar'}
              </button>
            </div>
          </div>

          {/* Output Panel */}
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 flex flex-col">
            <h2 className="text-xl font-bold text-brand-primary p-4 border-b border-gray-200">
              2. Visualizar Descrição Padronizada (Sugestão)
            </h2>
            <div className="flex-grow overflow-y-auto">
              <ResultDisplay />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
