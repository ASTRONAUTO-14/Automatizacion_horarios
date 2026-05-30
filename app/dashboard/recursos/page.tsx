'use client';

import { useState, useEffect } from 'react';
import styles from '../../../components/ui/styles.module.css';
import { sampleTeachers, sampleClassrooms, sampleCourses } from '../../../lib/data';
import { Teacher, Classroom, Course } from '../../../lib/types';

export default function RecursosPage() {
  const [activeTab, setActiveTab] = useState<'docentes' | 'aulas'>('docentes');
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    setTeachers(sampleTeachers());
    setClassrooms(sampleClassrooms());
    setCourses(sampleCourses());
  }, []);

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Recursos e Infraestructura</h1>
          <p className={styles.pageSubtitle}>Gestión del cuerpo docente y espacios físicos (Aulas).</p>
        </div>
      </div>

      <div className={styles.tabList} style={{ marginBottom: '24px' }}>
        <button 
          className={`${styles.tabButton} ${activeTab === 'docentes' ? styles.tabButtonActive : ''}`}
          onClick={() => setActiveTab('docentes')}
        >
          👩‍🏫 Docentes
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'aulas' ? styles.tabButtonActive : ''}`}
          onClick={() => setActiveTab('aulas')}
        >
          🏗️ Aulas
        </button>
      </div>

      {activeTab === 'docentes' && (
        <section className={styles.sectionPanel}>
          <div className={styles.panelHeaderRow}>
            <div>
              <h2 className={styles.sectionTitle}>Cuerpo Docente</h2>
              <p style={{ color: '#64748b' }}>Limita sus horas y define sus competencias para que el motor asigne materias automáticamente.</p>
            </div>
            <button className={styles.primaryButton}>+ Nuevo Docente</button>
          </div>
          <div className={styles.gridTwoColumns}>
            {teachers.map(t => (
              <div key={t.id} className={styles.cardPanel}>
                <div className={styles.cardPanelHeader}>
                  <div>
                    <h3 style={{ margin: 0, color: '#0f172a' }}>{t.name}</h3>
                    <p style={{ margin: 0, color: '#059669', fontSize: '0.9rem', fontWeight: 600 }}>Máx. {t.maxHours}h semanales</p>
                  </div>
                  <button className={styles.iconButton}>✏️</button>
                </div>
                <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '8px' }}>Competencias habilitadas:</p>
                <div className={styles.tagList}>
                  {t.competencies.map(cid => {
                    const cName = courses.find(c => c.id === cid)?.name;
                    return <span key={cid} className={`${styles.tag} ${styles.tagGreen}`}>{cName}</span>
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {activeTab === 'aulas' && (
        <section className={styles.sectionPanel}>
          <div className={styles.panelHeaderRow}>
            <div>
              <h2 className={styles.sectionTitle}>Infraestructura Física</h2>
              <p style={{ color: '#64748b' }}>Define las aulas y su capacidad instalada (Restricción dura para el CSP).</p>
            </div>
            <button className={styles.primaryButton}>+ Nueva Aula</button>
          </div>
          <div className={styles.gridTwoColumns}>
            {classrooms.map(a => (
              <div key={a.id} className={styles.cardPanel}>
                <div className={styles.cardPanelHeader}>
                  <h3 style={{ margin: 0, color: '#0f172a' }}>{a.name}</h3>
                  <button className={styles.iconButton}>✏️</button>
                </div>
                <p style={{ margin: 0, color: '#64748b' }}>Capacidad: {a.capacity} pax</p>
                <div className={styles.tagList}>
                  <span className={`${styles.tag} ${styles.tagGray}`}>{a.type}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
