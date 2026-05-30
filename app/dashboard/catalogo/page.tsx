'use client';

import { useState, useEffect } from 'react';
import styles from '../../../components/ui/styles.module.css';
import { sampleCourses, sampleCohorts } from '../../../lib/data';
import { Course, Cohort } from '../../../lib/types';

export default function CatalogoPage() {
  const [activeTab, setActiveTab] = useState<'materias' | 'cohortes'>('materias');
  const [courses, setCourses] = useState<Course[]>([]);
  const [cohorts, setCohorts] = useState<Cohort[]>([]);

  useEffect(() => {
    setCourses(sampleCourses());
    setCohorts(sampleCohorts());
  }, []);

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Catálogo Académico</h1>
          <p className={styles.pageSubtitle}>Gestión de malla curricular y grupos de estudiantes.</p>
        </div>
      </div>

      <div className={styles.tabList} style={{ marginBottom: '24px' }}>
        <button 
          className={`${styles.tabButton} ${activeTab === 'materias' ? styles.tabButtonActive : ''}`}
          onClick={() => setActiveTab('materias')}
        >
          📚 Materias Maestras
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'cohortes' ? styles.tabButtonActive : ''}`}
          onClick={() => setActiveTab('cohortes')}
        >
          👥 Cohortes (Grupos)
        </button>
      </div>

      {activeTab === 'materias' && (
        <section className={styles.sectionPanel}>
          <div className={styles.panelHeaderRow}>
            <div>
              <h2 className={styles.sectionTitle}>Catálogo de Materias</h2>
              <p style={{ color: '#64748b' }}>Define las asignaturas sin asociarlas a un profesor todavía.</p>
            </div>
            <button className={styles.primaryButton}>+ Nueva Materia</button>
          </div>
          <div className={styles.gridTwoColumns}>
            {courses.map(c => (
              <div key={c.id} className={styles.cardPanel}>
                <div className={styles.cardPanelHeader}>
                  <h3 style={{ margin: 0, color: '#0f172a' }}>{c.name}</h3>
                  <button className={styles.iconButton}>✏️</button>
                </div>
                <div className={styles.tagList}>
                  <span className={`${styles.tag} ${styles.tagBlue}`}>{c.program}</span>
                  <span className={`${styles.tag} ${styles.tagGray}`}>Semestre {c.semester}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {activeTab === 'cohortes' && (
        <section className={styles.sectionPanel}>
          <div className={styles.panelHeaderRow}>
            <div>
              <h2 className={styles.sectionTitle}>Gestión de Cohortes</h2>
              <p style={{ color: '#64748b' }}>Agrupa alumnos y define las materias obligatorias del ciclo.</p>
            </div>
            <button className={styles.primaryButton}>+ Nueva Cohorte</button>
          </div>
          <div className={styles.gridTwoColumns}>
            {cohorts.map(coh => (
              <div key={coh.id} className={styles.cardPanel}>
                <div className={styles.cardPanelHeader}>
                  <div>
                    <h3 style={{ margin: 0, color: '#0f172a' }}>{coh.name}</h3>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>{coh.students} alumnos</p>
                  </div>
                  <button className={styles.iconButton}>✏️</button>
                </div>
                <div className={styles.tagList}>
                  {coh.requiredCourses.map(req => {
                    const courseName = courses.find(c => c.id === req.courseId)?.name;
                    return <span key={req.courseId} className={`${styles.tag} ${styles.tagPurple}`}>{courseName} ({req.hours}h)</span>
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
