
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

  return (
    <div className="min-h-screen flex items-center justify-center p-3 sm:p-4" style={{backgroundColor: IFOOD_THEME_COLORS.adminLightGrayBg}}>
      <div className="max-w-md w-full p-6 sm:p-8 md:p-10 rounded-xl shadow-xl" style={{backgroundColor: IFOOD_THEME_COLORS.white}}>
        <div className="text-center mb-6 sm:mb-8">
          <div className="mx-auto mb-3 sm:mb-4 inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full" style={{backgroundColor: `${IFOOD_THEME_COLORS.red}1A` }}> 
            <UserCircleIcon className={`w-8 h-8 sm:w-10 sm:h-10 text-[${IFOOD_THEME_COLORS.red}]`} />
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold" style={{color: IFOOD_THEME_COLORS.textPrimaryDark}}>Bem-vindo!</h1>
          <p className="text-xs sm:text-sm" style={{color: IFOOD_THEME_COLORS.textSecondaryDark}}>Acesse o painel GourmetGo.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
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
            <p className="text-xs sm:text-sm text-center" style={{color: IFOOD_THEME_COLORS.red}}>{authError}</p>
          )}
          <Button 
            type="submit" 
            variant="primary"
            size="md" 
            fullWidth
            isLoading={loadingAuth}
            leftIcon={<LoginIcon className="w-4 h-4 sm:w-5 sm:h-5"/>}
          >
            {loadingAuth ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
        <p className="text-center text-xs sm:text-sm mt-6 sm:mt-8" style={{color: IFOOD_THEME_COLORS.textSecondaryDark}}>
          Não tem uma conta? <a href="#" className="font-medium hover:underline" style={{color: IFOOD_THEME_COLORS.red}}>Contate o suporte</a>.
        </p>
         <p className="text-center text-xs mt-1 sm:mt-2" style={{color: IFOOD_THEME_COLORS.grayPlaceholder}}>
          Login: admin@gourmetgo.com / attendant@gourmetgo.com, senha: 1234
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
