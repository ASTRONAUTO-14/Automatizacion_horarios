import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    const fullName = body.name || body.nom_docente || ''
    const parts = fullName.trim().split(/\s+/)
    const nom_docente = body.nom_docente || parts[0] || undefined
    const ape_docente = body.ape_docente || (parts.length > 1 ? parts.slice(1).join(' ') : undefined)
    const dni_docente = body.dni_docente !== undefined ? body.dni_docente : undefined
    const nom_especialidad = body.nom_especialidad !== undefined ? body.nom_especialidad : undefined
    const disponibilidad = body.availability !== undefined ? body.availability : body.disponibilidad

    if (nom_docente === '') {
      return NextResponse.json(
        { error: 'El nombre del docente es requerido' },
        { status: 400 }
      )
    }

    const docente = await prisma.docente.update({
      where: { id_docente: id },
      data: {
        dni_docente,
        nom_docente,
        ape_docente,
        nom_especialidad,
        disponibilidad: disponibilidad !== undefined ? (disponibilidad || null) : undefined,
      },
    })

    return NextResponse.json({
      message: 'Docente actualizado exitosamente',
      data: docente
    })
  } catch (error: any) {
    console.error('Error al actualizar docente:', error)
    return NextResponse.json(
      { error: 'Error al actualizar el docente' },
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

    // Desasociar de los cursos
    await prisma.curso.updateMany({
      where: { id_docente: id },
      data: { id_docente: null }
    })

    // Eliminar horarios asociados
    await prisma.horarios.deleteMany({
      where: { id_docente: id }
    })

    // Eliminar docente
    await prisma.docente.delete({
      where: { id_docente: id },
    })

    return NextResponse.json({
      message: 'Docente eliminado exitosamente'
    })
  } catch (error: any) {
    console.error('Error al eliminar docente:', error)
    return NextResponse.json(
      { error: 'Error al eliminar el docente' },
      { status: 500 }
    )
  }
}
