import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const mapProgramToCarreraId = (program: string): string => {
  if (!program) return "C01";
  const norm = program.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  if (norm.includes("computa")) return "C02";
  if (norm.includes("electron")) return "C03";
  if (norm.includes("enferm")) return "C04";
  return "C01";
};

const sanitizeTipoCurso = (type: string): string => {
  const t = String(type ?? '').trim().toLowerCase();
  if (['theoretical', 'programming', 'electronics', 'nursing'].includes(t)) {
    return t;
  }
  if (t.includes('teoric') || t.includes('obligatorio') || t.includes('general')) {
    return 'theoretical';
  }
  if (t.includes('program') || t.includes('computa')) {
    return 'programming';
  }
  if (t.includes('electron')) {
    return 'electronics';
  }
  if (t.includes('enferm')) {
    return 'nursing';
  }
  return 'theoretical';
};

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // Soporte para formato de frontend e interno
    const nom_curso = body.name || body.nom_curso
    const tipo_curso = body.type !== undefined ? body.type : body.tipo_curso
    const creditos = body.creditos !== undefined ? Number(body.creditos) : undefined
    const modalidad = body.modalidad !== undefined ? body.modalidad : undefined
    const id_ciclo = body.semester !== undefined ? Number(body.semester) : (body.id_ciclo !== undefined ? Number(body.id_ciclo) : undefined)
    const horas_teoricas = body.theoreticalHours !== undefined ? Number(body.theoreticalHours) : undefined
    const horas_practicas = body.practicalHours !== undefined ? Number(body.practicalHours) : undefined
    const alumnos = body.students !== undefined ? Number(body.students) : undefined
    const id_docente = body.teacherId !== undefined ? body.teacherId : body.id_docente

    const id_carrera = body.id_carrera || (body.program !== undefined ? mapProgramToCarreraId(body.program) : undefined)

    if (nom_curso === '') {
      return NextResponse.json(
        { error: 'El nombre del curso es requerido' },
        { status: 400 }
      )
    }

    const curso = await prisma.$transaction(async (tx) => {
      const sanitizedTipoCurso = tipo_curso !== undefined ? sanitizeTipoCurso(tipo_curso) : undefined;
      const c = await tx.curso.update({
        where: { id_curso: id },
        data: {
          creditos,
          nom_curso,
          id_carrera,
          modalidad,
          tipo_curso: sanitizedTipoCurso,
          id_ciclo,
          horas_teoricas,
          horas_practicas,
          alumnos,
          id_plan: body.id_plan !== undefined ? body.id_plan : undefined,
        },
      });

      if (id_docente !== undefined) {
        // Remove existing assignment for this course in the current period
        await tx.asignacion.deleteMany({
          where: {
            id_curso: id,
            id_periodo: 'Actual'
          }
        });

        // Add new assignment if teacherId was specified
        if (id_docente) {
          await tx.asignacion.create({
            data: {
              id_asignacion: `${id}-Actual`,
              id_docente,
              id_curso: id,
              id_periodo: 'Actual'
            }
          });
        }
      }

      return c;
    });

    return NextResponse.json({
      message: 'Curso actualizado exitosamente',
      data: {
        ...curso,
        id_docente: id_docente !== undefined ? (id_docente || null) : undefined
      }
    })
  } catch (error: any) {
    console.error('Error al actualizar curso:', error)
    return NextResponse.json(
      { error: 'Error al actualizar el curso' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Eliminar asignaciones del curso (esto también eliminará los horario_sesion asociados por cascade)
    await prisma.asignacion.deleteMany({
      where: { id_curso: id }
    })

    // Eliminar curso
    await prisma.curso.delete({
      where: { id_curso: id },
    })

    return NextResponse.json({
      message: 'Curso eliminado exitosamente'
    })
  } catch (error: any) {
    console.error('Error al eliminar curso:', error)
    return NextResponse.json(
      { error: 'Error al eliminar el curso' },
      { status: 500 }
    )
  }
}
