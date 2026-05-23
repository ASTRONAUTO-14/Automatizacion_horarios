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

    const curso = await prisma.curso.update({
      where: { id_curso: id },
      data: {
        creditos,
        nom_curso,
        id_carrera,
        modalidad,
        tipo_curso,
        id_ciclo,
        horas_teoricas,
        horas_practicas,
        alumnos,
        id_docente: id_docente !== undefined ? (id_docente || null) : undefined,
      },
    })

    return NextResponse.json({
      message: 'Curso actualizado exitosamente',
      data: curso
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

    // Eliminar horarios asociados primero
    await prisma.horarios.deleteMany({
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
