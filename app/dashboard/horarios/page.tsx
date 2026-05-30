'use client';

import { useState } from 'react';
import styles from '../../../components/ui/styles.module.css';

export default function HorariosPage() {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateCSP = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      alert("Simulación de conexión con OR-Tools (Python). API pendiente de integrar.");
    }, 2000);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px', height: 'calc(100vh - 100px)' }}>
      {/* Panel Izquierdo: Visualizador Principal */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.pageTitle}>Explorador de Horarios</h1>
            <p className={styles.pageSubtitle}>Visualiza el horario generado. Usa los filtros para aislar docentes o cohortes.</p>
          </div>
          <button className={styles.primaryButton} onClick={handleGenerateCSP} disabled={isGenerating}>
            {isGenerating ? 'Optimizando...' : '⚡ Lanzar Motor CSP'}
          </button>
        </div>

        {/* Filtros */}
        <div className={styles.sectionPanel} style={{ padding: '16px 24px' }}>
          <div style={{ display: 'flex', gap: '16px' }}>
            <select className={styles.formInput} style={{ flex: 1 }}>
              <option value="">Todas las Cohortes</option>
              <option value="coh1">CS-Grupo A (Sem 3)</option>
            </select>
            <select className={styles.formInput} style={{ flex: 1 }}>
              <option value="">Todos los Docentes</option>
              <option value="t1">Dr. Garcia</option>
            </select>
            <select className={styles.formInput} style={{ flex: 1 }}>
              <option value="">Todas las Aulas</option>
              <option value="r1">A-101</option>
            </select>
            <button className={styles.secondaryButton}>Filtrar</button>
          </div>
        </div>

        {/* Calendario Placeholder */}
        <div className={styles.sectionPanel} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div className={styles.emptyState} style={{ border: 'none', background: 'transparent' }}>
            <div className={styles.emptyIcon} style={{ fontSize: '4rem' }}>📅</div>
            <h3 style={{ margin: '0 0 8px' }}>Ningún horario seleccionado</h3>
            <p>Selecciona una versión del historial o lanza el Motor CSP para generar uno nuevo.</p>
          </div>
        </div>
      </div>

      {/* Panel Derecho: Historial y Notificaciones */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div className={styles.sectionPanel} style={{ padding: '24px' }}>
          <h3 className={styles.sectionTitle} style={{ fontSize: '1.2rem' }}>Historial de Versiones</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
            
            <div className={styles.cardPanel} style={{ padding: '16px', borderLeft: '4px solid #10b981' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h4 style={{ margin: 0 }}>V3 - Final</h4>
                <span className={`${styles.tag} ${styles.tagGreen}`}>Publicado</span>
              </div>
              <p style={{ margin: '8px 0 0', fontSize: '0.8rem', color: '#64748b' }}>Hace 2 días por Admin</p>
            </div>

            <div className={styles.cardPanel} style={{ padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h4 style={{ margin: 0 }}>V2 - Ajustes</h4>
                <span className={`${styles.tag} ${styles.tagGray}`}>Borrador</span>
              </div>
              <p style={{ margin: '8px 0 0', fontSize: '0.8rem', color: '#64748b' }}>Hace 3 días por Admin</p>
            </div>

          </div>
        </div>

        <div className={styles.sectionPanel} style={{ padding: '24px', flex: 1 }}>
          <h3 className={styles.sectionTitle} style={{ fontSize: '1.2rem' }}>Centro de Alertas</h3>
          <div style={{ marginTop: '16px' }}>
            <p className={styles.purposeText} style={{ fontSize: '0.85rem' }}>
              El motor CSP buscará una solución "Óptima". Si las restricciones son muy duras (ej. muy pocas aulas para demasiados alumnos), mostrará un error aquí.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
