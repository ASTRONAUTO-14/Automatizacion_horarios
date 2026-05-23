import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const docentes = await prisma.docente.findMany({
      orderBy: { nom_docente: 'asc' },
    });
    return NextResponse.json(docentes);
  } catch (error) {
    console.error('Error fetching docentes:', error);
    return NextResponse.json(
      { error: 'Error al obtener docentes' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Soporte para formato de frontend e interno
    const id_docente = body.id || body.id_docente
    const fullName = body.name || body.nom_docente || ''
    const parts = fullName.trim().split(/\s+/)
    const nom_docente = body.nom_docente || parts[0] || 'Docente'
    const ape_docente = body.ape_docente || parts.slice(1).join(' ') || 'Desconocido'
    const dni_docente = body.dni_docente || '00000000'
    const nom_especialidad = body.nom_especialidad || 'General'
    const disponibilidad = body.availability !== undefined ? body.availability : body.disponibilidad

    if (!id_docente || !nom_docente) {
      return NextResponse.json(
        { error: 'El ID y el Nombre son requeridos' },
        { status: 400 }
      )
    }

    // Crear docente en la base de datos usando Prisma
    const docente = await prisma.docente.create({
      data: {
        id_docente,
        dni_docente,
        nom_docente,
        ape_docente,
        nom_especialidad,
        disponibilidad: disponibilidad || null,
      },
    })

    return NextResponse.json({ 
      message: 'Docente registrado exitosamente', 
      data: docente 
    })
  } catch (error: any) {
    console.error('Error al registrar docente:', error)
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Ya existe un docente con este ID o DNI' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    )
  }
}
