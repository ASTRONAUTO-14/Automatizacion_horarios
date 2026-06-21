'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getAulas() {
  return prisma.aula.findMany({
    orderBy: { nom_aula: 'asc' },
    select: { id_aula: true, nom_aula: true, capacidad: true }
  });
}

export async function updateSessionSlot(
  id_horario: string,
  newDay: number,
  newSlot: number,
  newRoomId: string
) {
  // 1. Obtener la sesión actual y su escenario
  const session = await prisma.horario_sesion.findUnique({
    where: { id_horario },
    include: {
      escenario: true,
      docente: true,
      asignacion: true,
    }
  });

  if (!session) throw new Error('La sesión no existe.');
  if (session.escenario?.estado !== 'draft') {
    throw new Error('Solo puedes editar sesiones en escenarios de tipo Borrador.');
  }

  // 2. Verificar colisión de docente (¿El docente ya tiene clases en ese día/bloque en este escenario?)
  const teacherCollision = await prisma.horario_sesion.findFirst({
    where: {
      id_escenario: session.id_escenario,
      id_docente: session.id_docente,
      id_dia: newDay,
      id_bloque: newSlot,
      id_horario: { not: id_horario } // Excluir la sesión actual
    },
    include: { asignacion: { include: { curso: true } } }
  });

  if (teacherCollision) {
    throw new Error(`Conflicto: El docente ya dicta "${teacherCollision.asignacion.curso.nom_curso}" en ese horario.`);
  }

  // 3. Verificar colisión de aula (¿El aula ya está ocupada en ese día/bloque en este escenario?)
  const roomCollision = await prisma.horario_sesion.findFirst({
    where: {
      id_escenario: session.id_escenario,
      id_aula: newRoomId,
      id_dia: newDay,
      id_bloque: newSlot,
      id_horario: { not: id_horario }
    },
    include: { asignacion: { include: { curso: true } } }
  });

  if (roomCollision) {
    throw new Error(`Conflicto: El aula está ocupada por "${roomCollision.asignacion.curso.nom_curso}" en ese horario.`);
  }

  // 4. Actualizar la sesión
  await prisma.horario_sesion.update({
    where: { id_horario },
    data: {
      id_dia: newDay,
      id_bloque: newSlot,
      id_aula: newRoomId,
    }
  });

  revalidatePath('/dashboard/horarios');
  return { success: true };
}
