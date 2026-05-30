'use client';

import { useState, useEffect } from 'react';
import styles from '../../components/ui/styles.module.css';
import { sampleCohorts, sampleTeachers, sampleClassrooms } from '../../lib/data';
import { Cohort, Teacher, Classroom } from '../../lib/types';
import Link from 'next/link';

export default function DashboardPage() {
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);

  useEffect(() => {
    // Simulando fetch
    setCohorts(sampleCohorts());
    setTeachers(sampleTeachers());
    setClassrooms(sampleClassrooms());
  }, []);

  const totalStudents = cohorts.reduce((acc, c) => acc + c.students, 0);
  const totalCapacity = classrooms.reduce((acc, c) => acc + c.capacity, 0);
  const demandVsCapacityRatio = totalCapacity > 0 ? (totalStudents / (totalCapacity * 5 * 5)) * 100 : 0; 
  
  const totalTeacherHours = teachers.reduce((acc, t) => acc + t.maxHours, 0);
  const requiredCohortHours = cohorts.reduce((acc, c) => acc + c.requiredCourses.reduce((sum, req) => sum + req.hours, 0), 0);
  const teacherLoadRatio = totalTeacherHours > 0 ? (requiredCohortHours / totalTeacherHours) * 100 : 0;

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Dashboard Ejecutivo</h1>
          <p className={styles.pageSubtitle}>Resumen del estado actual del sistema y alertas de capacidad.</p>
        </div>
        <Link href="/dashboard/horarios" className={styles.primaryButton}>
          Ir al Generador CSP
        </Link>
      </div>

      <div className={styles.heroGrid}>
         <Link href="/dashboard/catalogo" className={styles.bigHeroButton} style={{ textDecoration: 'none' }}>
            <div className={styles.heroIcon}>📚</div>
            <h3>Catálogo de Materias</h3>
            <p>Gestionar currícula y cohortes.</p>
         </Link>
         <Link href="/dashboard/recursos" className={styles.bigHeroButton} style={{ textDecoration: 'none' }}>
            <div className={styles.heroIcon}>👩‍🏫</div>
            <h3>Cuerpo Docente</h3>
            <p>Competencias y disponibilidades.</p>
         </Link>
         <Link href="/dashboard/horarios" className={styles.bigHeroButton} style={{ textDecoration: 'none' }}>
            <div className={styles.heroIcon}>⚙️</div>
            <h3>Motor CSP</h3>
            <p>Lanzar optimización con OR-Tools.</p>
         </Link>
      </div>
      
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h4 className={styles.statHead}>Cohortes Activas</h4>
          <div className={styles.statValue}>{cohorts.length}</div>
          <p className={styles.statCaption}>Agrupando {totalStudents} alumnos</p>
        </div>
        
        <div className={styles.statCard}>
          <h4 className={styles.statHead}>Demanda de Aulas</h4>
          <div className={styles.statValue}>{Math.round(demandVsCapacityRatio)}%</div>
          <div className={`${styles.cssProgressBar}`}>
            <div className={`${styles.cssProgressFill} ${demandVsCapacityRatio > 80 ? styles.overloaded : styles.optimal}`} style={{ width: `${Math.min(100, demandVsCapacityRatio)}%` }}></div>
          </div>
          <p className={`${styles.statInsight} ${demandVsCapacityRatio > 100 ? styles.statInsightError : ''}`}>
            {demandVsCapacityRatio > 100 ? 'ALERTA: Faltan aulas para satisfacer la demanda.' : 'La capacidad instalada es suficiente.'}
          </p>
        </div>

        <div className={styles.statCard}>
          <h4 className={styles.statHead}>Ocupación Docente</h4>
          <div className={styles.statValue}>{Math.round(teacherLoadRatio)}%</div>
          <div className={`${styles.cssProgressBar}`}>
            <div className={`${styles.cssProgressFill} ${teacherLoadRatio > 90 ? styles.overloaded : styles.optimal}`} style={{ width: `${Math.min(100, teacherLoadRatio)}%` }}></div>
          </div>
          <p className={`${styles.statInsight} ${teacherLoadRatio > 100 ? styles.statInsightError : ''}`}>
            {teacherLoadRatio > 100 ? 'ALERTA: Faltan docentes para cubrir horas requeridas.' : 'El pool de horas docentes es saludable.'}
          </p>
        </div>
      </div>
    </div>
  );
}
