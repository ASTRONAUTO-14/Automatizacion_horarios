import { prisma } from './prisma';

interface OptimizationRequest {
  teachers: any[];
  classes: any[];
  rooms: any[];
  days: number;
  slots_per_day: number;
}

export class SchedulerService {
  /**
   * Recopila los datos de la base de datos y los envía al solucionador CSP en Python.
   */
  static async optimizeSchedule(userId: string) {
    // 1. Obtener datos crudos de Prisma
    const [docentesDB, aulasDB, materiasCohorteDB] = await Promise.all([
      prisma.docente.findMany({
        where: { id_usuario: userId },
        include: {
          disponibilidad_docente: true,
          competencia_docente: true
        }
      }),
      prisma.aula.findMany({
        where: { id_usuario: userId }
      }),
      prisma.materia_cohorte.findMany({
        where: { cohorte: { id_usuario: userId } },
        include: {
          curso: true,
          cohorte: true
        }
      })
    ]);

    if (docentesDB.length === 0 || aulasDB.length === 0 || materiasCohorteDB.length === 0) {
      throw new Error('Faltan datos maestros (Docentes, Aulas o Cohortes) para generar el horario.');
    }

    // 2. Transformar al formato del Microservicio Python (OptimizationRequest)
    const teachers = docentesDB.map(d => ({
      id: d.id_docente,
      max_hours: d.max_horas_semanales || 40,
      availabilities: d.disponibilidad_docente.map(disp => ({
        day: disp.id_dia,
        slot: disp.id_bloque
      })),
      competencies: d.competencia_docente.map(comp => comp.id_curso)
    }));

    const rooms = aulasDB.map(a => ({
      id: a.id_aula,
      capacity: a.capacidad
    }));

    const classes = materiasCohorteDB.map(mc => ({
      id: mc.id_materia_cohorte,
      course_id: mc.id_curso,
      cohort_id: mc.id_cohorte,
      required_hours: mc.horas_requeridas,
      students_count: mc.cohorte.num_alumnos
    }));

    const payload: OptimizationRequest = {
      teachers,
      rooms,
      classes,
      days: 5,
      slots_per_day: 5
    };

    // 3. Llamar al Microservicio
    console.log('Enviando datos al motor CSP (OR-Tools)...');
    const cspUrl = process.env.CSP_SOLVER_URL || 'http://localhost:8000';
    const response = await fetch(`${cspUrl}/optimize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error en el motor CSP: ${response.status} ${errorText}`);
    }

    const data = await response.json();

    if (data.status === 'INFEASIBLE') {
      throw new Error('No existe una combinación factible que satisfaga todas las restricciones. Revisa la disponibilidad de los docentes o la capacidad de las aulas.');
    }

    if (data.status !== 'SUCCESS') {
      throw new Error(`El solucionador finalizó con estado desconocido: ${data.status}`);
    }

    // 4. Procesar el resultado y guardar en Prisma (Transacción)
    const sessions = data.sessions;

    await prisma.$transaction(async (tx) => {
      // Opcional: Limpiar horarios anteriores para este periodo/usuario
      await tx.horario_sesion.deleteMany({
        where: { id_usuario: userId }
      });

      // Crear las nuevas sesiones asignadas por el solucionador
      const newSessions = sessions.map((s: any) => ({
        id_horario: crypto.randomUUID(),
        id_materia_cohorte: s.class_id,
        id_docente: s.teacher_id,
        id_aula: s.room_id,
        id_dia: s.day,
        id_bloque: s.slot,
        id_periodo: 'Actual', 
        tipo_sesion: 'theoretical', 
        id_usuario: userId,
      }));

      await tx.horario_sesion.createMany({
        data: newSessions
      });
    });

    return {
      message: data.message,
      total_sessions_assigned: sessions.length
    };
  }
}
