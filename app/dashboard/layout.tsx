'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import styles from './layout.module.css';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) return null; // Avoid flicker

  const navItems = [
    { name: 'Inicio', path: '/dashboard', icon: '📊' },
    { name: 'Catálogo (Materias)', path: '/dashboard/catalogo', icon: '📚' },
    { name: 'Recursos (Docentes)', path: '/dashboard/recursos', icon: '👩‍🏫' },
    { name: 'Gestor de Horarios', path: '/dashboard/horarios', icon: '📅' },
  ];

  return (
    <div className={styles.dashboardLayout}>
      
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logoIcon}>🎓</div>
          Optimizer EIS
        </div>
        
        <nav className={styles.navContainer}>
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              href={item.path} 
              className={`${styles.navLink} ${pathname === item.path ? styles.navLinkActive : ''}`}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>
        
        <div className={styles.sidebarFooter}>
          <div className={styles.userCard}>
            <div className={styles.userAvatar}>{user.name.charAt(0)}</div>
            <div className={styles.userInfo}>
              <div className={styles.userName}>{user.name}</div>
              <div className={styles.userRole}>{user.role}</div>
            </div>
            <button className={styles.logoutBtn} onClick={logout} title="Cerrar sesión">
              🚪
            </button>
          </div>
        </div>
      </aside>

      {/* Main Area */}
      <main className={styles.mainArea}>
        {/* Top Navbar */}
        <header className={styles.topbar}>
          <div className={styles.searchContainer}>
            <span className={styles.searchIcon}>🔍</span>
            <input type="text" className={styles.searchInput} placeholder="Buscar materias, docentes o cohortes (Cmd+K)" />
          </div>
          <div className={styles.topbarActions}>
            <button className={styles.iconBtn} title="Notificaciones">🔔</button>
            <button className={styles.iconBtn} title="Ajustes">⚙️</button>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className={styles.pageContent}>
          {children}
        </div>
      </main>

    </div>
  );
}
