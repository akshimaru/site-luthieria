import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';

const GoogleAuthCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const code = searchParams.get('code');
        const error = searchParams.get('error');

        if (error) {
          console.error('Google Auth Error:', error);
          toast.error('Erro na autenticação com Google: ' + error);
          navigate('/admin/testimonials');
          return;
        }

        if (!code) {
          toast.error('Código de autorização não encontrado');
          navigate('/admin/testimonials');
          return;
        }

        // Import dinâmico para evitar problemas no build
        const googleModule = await import('../../lib/googleMyBusiness');
        const googleService = googleModule.default;

        // Trocar código por tokens
        await googleService.exchangeCodeForTokens(code);
        toast.success('🎉 Conectado com Google My Business!');
        
        // Redirecionar para testimonials
        navigate('/admin/testimonials');
      } catch (error) {
        console.error('Erro no callback:', error);
        toast.error('Erro ao processar autenticação');
        navigate('/admin/testimonials');
      }
    };

    handleAuthCallback();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-sm border text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-900 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Processando autenticação...
        </h2>
        <p className="text-gray-600">
          Conectando com Google My Business
        </p>
      </div>
    </div>
  );
};

export { GoogleAuthCallback };
