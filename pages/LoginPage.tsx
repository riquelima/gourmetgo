
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ROUTES, USER_ROLES_CONFIG, IFOOD_THEME_COLORS } from '../constants';
import Input from '../components/Common/Input';
import Button from '../components/Common/Button';
import { LoginIcon, UserCircleIcon } from '../components/Common/Icons';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loadingAuth, authError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = await login(email, password);
    if (user) {
      navigate(USER_ROLES_CONFIG[user.role].redirectPath || ROUTES.HOME);
    }
  };

  // Login page now also uses a light theme for consistency
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{backgroundColor: IFOOD_THEME_COLORS.adminLightGrayBg}}>
      <div className="max-w-md w-full p-8 md:p-10 rounded-xl shadow-2xl" style={{backgroundColor: IFOOD_THEME_COLORS.white}}>
        <div className="text-center mb-8">
          {/* UserCircleIcon or a more generic "Login" icon for the theme */}
          <div className="mx-auto mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full" style={{backgroundColor: `${IFOOD_THEME_COLORS.red}1A` }}> {/* Light red background */}
            <UserCircleIcon className={`w-10 h-10 text-[${IFOOD_THEME_COLORS.red}]`} />
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold" style={{color: IFOOD_THEME_COLORS.textPrimaryDark}}>Bem-vindo!</h1>
          <p className="text-sm" style={{color: IFOOD_THEME_COLORS.textSecondaryDark}}>Acesse o painel GourmetGo.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Email"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seuemail@exemplo.com"
            required
            autoComplete="email"
          />
          <Input
            label="Senha"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Sua senha"
            required
            autoComplete="current-password"
          />
          {authError && (
            <p className="text-sm text-center" style={{color: IFOOD_THEME_COLORS.red}}>{authError}</p>
          )}
          <Button 
            type="submit" 
            variant="primary"
            size="lg" 
            fullWidth
            isLoading={loadingAuth}
            leftIcon={<LoginIcon className="w-5 h-5"/>}
          >
            {loadingAuth ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
        <p className="text-center text-sm mt-8" style={{color: IFOOD_THEME_COLORS.textSecondaryDark}}>
          Não tem uma conta? <a href="#" className="font-medium hover:underline" style={{color: IFOOD_THEME_COLORS.red}}>Contate o suporte</a>.
        </p>
         <p className="text-center text-xs mt-2" style={{color: IFOOD_THEME_COLORS.grayPlaceholder}}>
          (Login: admin@gourmetgo.com / attendant@gourmetgo.com, senha: qualquer)
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
