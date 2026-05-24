'use client';

import { useState } from 'react';
import LoginScreen, { User } from './LoginScreen';
import MainMenu from './MainMenu';
import styles from './Interfaz.module.css';

export default function InterfaceApp() {
  const [user, setUser] = useState<User | null>(null);

  const handleLoginSuccess = (loggedInUser: User) => setUser(loggedInUser);
  const handleLogout = () => setUser(null);

  return (
    <div className={styles.page}>
      {user ? (
        <MainMenu user={user} onLogout={handleLogout} />
      ) : (
        <LoginScreen onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}
