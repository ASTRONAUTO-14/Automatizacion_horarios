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

export async function GET() {
  try {
    const cursos = await prisma.curso.findMany({
      include: {
        docente: true,
        carrera: true,
        ciclo: true,
      },
      orderBy: { nom_curso: 'asc' },
    });
    return NextResponse.json(cursos);
  } catch (error) {
    console.error('Error fetching cursos:', error);
    return NextResponse.json(
      { error: 'Error al obtener cursos' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Soporte para formato de frontend e interno
    const id_curso = body.id || body.id_curso
    const nom_curso = body.name || body.nom_curso
    const tipo_curso = body.type || body.tipo_curso
    const creditos = body.creditos !== undefined ? Number(body.creditos) : 1
    const modalidad = body.modalidad || 'Presencial'
    const id_ciclo = body.semester !== undefined ? Number(body.semester) : (body.id_ciclo !== undefined ? Number(body.id_ciclo) : 1)
    const horas_teoricas = body.theoreticalHours !== undefined ? Number(body.theoreticalHours) : 0
    const horas_practicas = body.practicalHours !== undefined ? Number(body.practicalHours) : 0
    const alumnos = body.students !== undefined ? Number(body.students) : 0
    const id_docente = body.teacherId !== undefined ? body.teacherId : body.id_docente

    const id_carrera = body.id_carrera || mapProgramToCarreraId(body.program || '')

    if (!id_curso || !nom_curso || !id_carrera) {
      return NextResponse.json(
        { error: 'El ID, Nombre y Carrera son requeridos' },
        { status: 400 }
      )
    }

    const curso = await prisma.curso.create({
      data: {
        id_curso,
        creditos,
        nom_curso,
        id_carrera,
        modalidad,
        tipo_curso,
        id_ciclo,
        horas_teoricas,
        horas_practicas,
        alumnos,
        id_docente: id_docente || null,
      },
    })

    return NextResponse.json({ 
      message: 'Curso registrado exitosamente', 
      data: curso 
    })
  } catch (error: any) {
    console.error('Error al registrar curso:', error)

    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Ya existe un curso con este ID' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    )
  }
}
