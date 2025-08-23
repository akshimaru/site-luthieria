import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';

const GoogleAuthCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('Processando...');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('Iniciando callback do Google...', window.location.href);
        setStatus('Verificando autorização...');
        
        const code = searchParams.get('code');
        const error = searchParams.get('error');

        console.log('Código recebido:', code ? 'Presente' : 'Ausente');
        console.log('Erro recebido:', error);

        if (error) {
          console.error('Google Auth Error:', error);
          toast.error('Erro na autenticação com Google: ' + error);
          navigate('/admin/testimonials');
          return;
        }

        if (!code) {
          console.error('Código de autorização não encontrado');
          toast.error('Código de autorização não encontrado');
          navigate('/admin/testimonials');
          return;
        }

        setStatus('Conectando com Google...');
        console.log('Importando serviço Google...');

        // Import dinâmico para evitar problemas no build
        const googleModule = await import('../../lib/googleMyBusiness');
        const googleService = googleModule.default;

        console.log('Trocando código por tokens...');
        setStatus('Obtendo tokens de acesso...');

        // Trocar código por tokens
        const tokens = await googleService.exchangeCodeForTokens(code);
        console.log('Tokens obtidos com sucesso:', tokens ? 'Sim' : 'Não');

        // Salvar tokens
        googleService.saveTokens(tokens.access_token, tokens.refresh_token);
        
        toast.success('🎉 Conectado com Google My Business!');
        console.log('Redirecionando para testimonials...');
        
        // Pequeno delay para mostrar o sucesso
        setTimeout(() => {
          navigate('/admin/testimonials');
        }, 1000);

      } catch (error) {
        console.error('Erro detalhado no callback:', error);
        setStatus('Erro na autenticação');
        
        let errorMessage = 'Erro ao processar autenticação';
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        
        toast.error(errorMessage);
        
        // Delay antes de redirecionar para mostrar o erro
        setTimeout(() => {
          navigate('/admin/testimonials');
        }, 2000);
      }
    };

    handleAuthCallback();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-sm border text-center max-w-md">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-900 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Google My Business
        </h2>
        <p className="text-gray-600 mb-4">
          {status}
        </p>
        <div className="text-sm text-gray-500">
          Por favor, aguarde...
        </div>
      </div>
    </div>
  );
};

export { GoogleAuthCallback };
