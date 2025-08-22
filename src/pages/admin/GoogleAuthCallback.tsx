import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function GoogleAuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const urlParams = new URLSearchParams(location.search);
      const code = urlParams.get('code');
      const error = urlParams.get('error');

      if (error || !code) {
        navigate('/admin/testimonials');
        return;
      }

      // Aqui será implementada a lógica de autenticação
      navigate('/admin/testimonials');
    };

    handleAuthCallback();
  }, [location, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center bg-white p-8 rounded-lg shadow-sm">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Processando autenticação...</h2>
        <p className="text-gray-600">Redirecionando...</p>
      </div>
    </div>
  );
}

export default GoogleAuthCallback;
