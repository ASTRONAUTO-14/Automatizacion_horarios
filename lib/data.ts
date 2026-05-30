'use client';

import { DemoUser, Course, Cohort, Teacher, Classroom, CourseTypeValue, RoomTypeValue } from './types';

export const DAYS = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'] as const;
export const DAY_SHORT = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie'] as const;
export const SLOTS = [
  { label: '7:00 – 9:00', short: '7-9' },
  { label: '9:00 – 11:00', short: '9-11' },
  { label: '11:00 – 13:00', short: '11-1' },
  { label: '14:00 – 16:00', short: '2-4' },
  { label: '16:00 – 18:00', short: '4-6' }
] as const;

export const COURSE_TYPES: Array<{ value: CourseTypeValue; label: string; color: string; bg: string }> = [
  { value: 'theoretical', label: 'Teorica', color: '#065F46', bg: '#D1FAE5' },
  { value: 'programming', label: 'Programacion', color: '#1D4ED8', bg: '#DBEAFE' },
  { value: 'electronics', label: 'Electronica / Mecanica', color: '#B45309', bg: '#FEF3C7' },
  { value: 'nursing', label: 'Enfermeria', color: '#BE123C', bg: '#FFE4E6' }
];

export const ROOM_TYPES: Array<{ value: RoomTypeValue; label: string }> = [
  { value: 'classroom', label: 'Aula Estandar' },
  { value: 'computer-lab', label: 'Laboratorio de Computacion' },
  { value: 'workshop', label: 'Taller' },
  { value: 'practical-lab', label: 'Laboratorio Practico' }
];

export const PROGRAMS = ['Ciencias de la Computacion', 'Ingenieria Electronica', 'Enfermeria'] as const;

export const DEMO_USERS: DemoUser[] = [
  { username: 'admin', password: 'admin123', name: 'Administrador', role: 'admin' },
  { username: 'docente', password: 'docente123', name: 'Dr. Garcia', role: 'docente' },
  { username: 'demo', password: 'demo', name: 'Usuario Demo', role: 'demo' }
];

export function sampleCourses(): Course[] {
  return [
    { id: 'c1', name: 'Estructura de Datos', type: 'programming', theoreticalHours: 2, practicalHours: 2, program: 'Ciencias de la Computacion', semester: 3 },
    { id: 'c2', name: 'Algoritmos', type: 'programming', theoreticalHours: 2, practicalHours: 2, program: 'Ciencias de la Computacion', semester: 3 },
    { id: 'c3', name: 'Matematicas Discretas', type: 'theoretical', theoreticalHours: 3, practicalHours: 0, program: 'Ciencias de la Computacion', semester: 3 },
    { id: 'c4', name: 'Bases de Datos', type: 'programming', theoreticalHours: 2, practicalHours: 2, program: 'Ciencias de la Computacion', semester: 5 },
    { id: 'c5', name: 'Electronica Digital', type: 'electronics', theoreticalHours: 2, practicalHours: 2, program: 'Ingenieria Electronica', semester: 3 },
    { id: 'c6', name: 'Analisis de Circuitos', type: 'electronics', theoreticalHours: 2, practicalHours: 2, program: 'Ingenieria Electronica', semester: 3 },
    { id: 'c7', name: 'Senales y Sistemas', type: 'theoretical', theoreticalHours: 3, practicalHours: 0, program: 'Ingenieria Electronica', semester: 5 },
    { id: 'c8', name: 'Microcontroladores', type: 'electronics', theoreticalHours: 1, practicalHours: 3, program: 'Ingenieria Electronica', semester: 5 },
    { id: 'c9', name: 'Anatomia', type: 'nursing', theoreticalHours: 2, practicalHours: 3, program: 'Enfermeria', semester: 3 },
    { id: 'c10', name: 'Farmacologia', type: 'theoretical', theoreticalHours: 3, practicalHours: 0, program: 'Enfermeria', semester: 5 },
    { id: 'c11', name: 'Practica Clinica I', type: 'nursing', theoreticalHours: 1, practicalHours: 4, program: 'Enfermeria', semester: 5 },
    { id: 'c12', name: 'Cuidado al Paciente', type: 'nursing', theoreticalHours: 2, practicalHours: 3, program: 'Enfermeria', semester: 3 }
  ];
}

export function sampleCohorts(): Cohort[] {
  return [
    {
      id: 'coh1',
      name: 'CS-Grupo A (Sem 3)',
      program: 'Ciencias de la Computacion',
      semester: 3,
      students: 40,
      requiredCourses: [
        { courseId: 'c1', hours: 4 },
        { courseId: 'c2', hours: 4 },
        { courseId: 'c3', hours: 3 }
      ]
    },
    {
      id: 'coh2',
      name: 'ENF-Grupo B (Sem 3)',
      program: 'Enfermeria',
      semester: 3,
      students: 35,
      requiredCourses: [
        { courseId: 'c9', hours: 5 },
        { courseId: 'c12', hours: 5 }
      ]
    }
  ];
}

export function sampleTeachers(): Teacher[] {
  return [
    { id: 't1', name: 'Dr. Garcia', maxHours: 40, competencies: ['c1', 'c2', 'c4'], availability: { 0: [0, 1, 2], 1: [0, 1], 2: [0, 1, 2], 3: [0, 1], 4: [0] } },
    { id: 't2', name: 'Ing. Lopez', maxHours: 20, competencies: ['c1', 'c2'], availability: { 0: [2, 3, 4], 1: [2, 3, 4], 2: [], 3: [2, 3, 4], 4: [2, 3, 4] } },
    { id: 't3', name: 'Dr. Martinez', maxHours: 40, competencies: ['c5', 'c8'], availability: { 0: [0, 1], 1: [0, 1, 2, 3], 2: [0, 1], 3: [0, 1, 2, 3], 4: [] } },
    { id: 't4', name: 'Ing. Rodriguez', maxHours: 20, competencies: ['c6'], availability: { 0: [3, 4], 1: [3, 4], 2: [3, 4], 3: [3, 4], 4: [3, 4] } },
    { id: 't5', name: 'Lic. Hernandez', maxHours: 30, competencies: ['c9'], availability: { 0: [0, 1, 2], 1: [0, 1, 2], 2: [0, 1, 2], 3: [0, 1, 2], 4: [] } },
    { id: 't6', name: 'Lic. Flores', maxHours: 40, competencies: ['c10', 'c12'], availability: { 0: [3, 4], 1: [0, 1], 2: [3, 4], 3: [0, 1], 4: [0, 1, 2] } },
    { id: 't7', name: 'Dr. Sanchez', maxHours: 20, competencies: ['c3', 'c7'], availability: { 0: [0, 1], 1: [2, 3], 2: [0, 1], 3: [2, 3], 4: [0, 1] } },
    { id: 't8', name: 'Lic. Torres', maxHours: 40, competencies: ['c11'], availability: { 0: [2, 3, 4], 1: [3, 4], 2: [2, 3, 4], 3: [3, 4], 4: [3, 4] } }
  ];
}

export function sampleClassrooms(): Classroom[] {
  return [
    { id: 'r1', name: 'A-101', type: 'classroom', capacity: 50 },
    { id: 'r2', name: 'A-102', type: 'classroom', capacity: 45 },
    { id: 'r3', name: 'A-201', type: 'classroom', capacity: 40 },
    { id: 'r4', name: 'B-101', type: 'computer-lab', capacity: 40 },
    { id: 'r5', name: 'B-102', type: 'computer-lab', capacity: 35 },
    { id: 'r6', name: 'C-101', type: 'workshop', capacity: 35 },
    { id: 'r7', name: 'C-102', type: 'workshop', capacity: 30 },
    { id: 'r8', name: 'D-101', type: 'practical-lab', capacity: 50 },
    { id: 'r9', name: 'D-102', type: 'practical-lab', capacity: 30 },
    { id: 'r10', name: 'D-103', type: 'practical-lab', capacity: 25 }
  ];
}
