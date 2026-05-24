'use client';

import { FormEvent, useState } from 'react';
import styles from './Interfaz.module.css';

export interface User {
  id: string;
  name: string;
}

interface LoginScreenProps {
  onLoginSuccess: (user: User) => void;
}

const initialErrors = {
  username: '',
  password: '',
  name: '',
};

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState(initialErrors);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const validate = () => {
    const nextErrors = { ...initialErrors };

    if (!username.trim()) {
      nextErrors.username = 'Ingresa tu correo electrónico';
    }
    if (!password) {
      nextErrors.password = 'Ingresa tu contraseña';
    }
    if (isRegistering && !name.trim()) {
      nextErrors.name = 'Ingresa tu nombre completo';
    }

    setErrors(nextErrors);
    return !nextErrors.username && !nextErrors.password && (!isRegistering || !nextErrors.name);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setServerError('');
    if (!validate()) return;
    
    setLoading(true);
    
    try {
      const endpoint = isRegistering ? '/api/auth/register' : '/api/auth/login';
      const body = isRegistering 
        ? { username, password, name } 
        : { username, password };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.error || 'Ocurrió un error');
      } else {
        onLoginSuccess({ id: data.id, name: data.name });
      }
    } catch (error) {
      setServerError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePassword = () => setShowPassword((current) => !current);

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setErrors(initialErrors);
    setServerError('');
  };

  return (
    <div className={styles.loginScreen}>
      <div className={styles.loginWave} />
      <div className={styles.loginCard}>
        <div className={styles.loginLogo} aria-hidden="true">🎓</div>
        <h1 className={styles.heading}>{isRegistering ? 'Crear Cuenta' : 'Bienvenido'}</h1>
        <p className={styles.subheading}>{isRegistering ? 'Regístrate para comenzar' : 'Ingresa tus credenciales para continuar'}</p>

        <form className={styles.loginForm} onSubmit={handleSubmit} noValidate autoComplete="off">
          
          {isRegistering && (
            <>
              <div className={styles.loginInputWrap}>
                <span className={styles.inputIcon}>👤</span>
                <input
                  id="register-name"
                  type="text"
                  className={`${styles.loginInput} ${errors.name ? styles.hasError : ''}`}
                  placeholder="Nombre completo"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  autoFocus
                />
              </div>
              <div className={`${styles.inputError} ${errors.name ? styles.visible : ''}`}>
                {errors.name}
              </div>
            </>
          )}

          <div className={styles.loginInputWrap}>
            <span className={styles.inputIcon}>📧</span>
            <input
              id="login-user"
              type="email"
              className={`${styles.loginInput} ${errors.username ? styles.hasError : ''}`}
              placeholder="Correo electrónico"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoFocus={!isRegistering}
            />
          </div>
          <div className={`${styles.inputError} ${errors.username ? styles.visible : ''}`}>
            {errors.username}
          </div>

          <div className={styles.loginInputWrap}>
            <span className={styles.inputIcon}>🔒</span>
            <input
              id="login-pass"
              type={showPassword ? 'text' : 'password'}
              className={`${styles.loginInput} ${errors.password ? styles.hasError : ''}`}
              placeholder="Contraseña"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <button
              type="button"
              className={styles.togglePw}
              onClick={handleTogglePassword}
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
          <div className={`${styles.inputError} ${errors.password ? styles.visible : ''}`}>
            {errors.password}
          </div>

          {serverError && (
            <div className={styles.inputError} style={{ opacity: 1, maxHeight: 'none', marginBottom: '10px' }}>
              {serverError}
            </div>
          )}

          {!isRegistering && (
            <div className={styles.formFooterRow}>
              <label className={styles.customCheck}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                />
                <span className={styles.checkboxBox}>{rememberMe && <span className={styles.checkboxIcon}>✓</span>}</span>
                Recordarme
              </label>
              <button type="button" className={styles.loginLink}>
                Olvidé mi contraseña
              </button>
            </div>
          )}

          <button type="submit" className={`${styles.loginBtn} ${loading ? styles.loading : ''}`}>
            <span className={styles.btnText}>{isRegistering ? 'Registrarse' : 'Iniciar sesión'}</span>
            {loading && <span className={styles.spinner} aria-hidden="true" />}
          </button>
        </form>

        <div className={styles.dividerRow}>
          <div className={styles.dividerLine} />
          <span className={styles.dividerText}>o</span>
          <div className={styles.dividerLine} />
        </div>

        <button type="button" className={styles.demoButton} onClick={toggleMode}>
          {isRegistering ? 'Ya tengo una cuenta. Iniciar sesión' : '¿No tienes cuenta? Regístrate'}
        </button>

        <p className={styles.footerText}>Sistema Inteligente de Horarios Académicos v2.0</p>
      </div>
    </div>
  );
}
