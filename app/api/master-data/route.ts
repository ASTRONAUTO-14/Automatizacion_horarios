import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // 1. Verificar y pre-poblar facultad
    const facultadesCount = await prisma.facultad.count();
    if (facultadesCount === 0) {
      await prisma.facultad.create({
        data: { id_facultad: 'F01', nom_facultad: 'Facultad General' }
      });
    }

    // 2. Verificar y pre-poblar carreras
    const carrerasCount = await prisma.carrera.count();
    if (carrerasCount === 0) {
      await prisma.carrera.createMany({
        data: [
          { id_carrera: 'C01', nom_carrera: 'General', id_facultad: 'F01' },
          { id_carrera: 'C02', nom_carrera: 'Ciencias de la Computacion', id_facultad: 'F01' },
          { id_carrera: 'C03', nom_carrera: 'Ingenieria Electronica', id_facultad: 'F01' },
          { id_carrera: 'C04', nom_carrera: 'Enfermeria', id_facultad: 'F01' },
        ]
      });
    }

    // 3. Verificar y pre-poblar ciclos (1 al 10)
    const ciclosCount = await prisma.ciclo.count();
    if (ciclosCount === 0) {
      const dataCiclos = [];
      for (let i = 1; i <= 10; i++) {
        dataCiclos.push({ id_ciclo: i, nom_ciclo: `${i}` });
      }
      await prisma.ciclo.createMany({
        data: dataCiclos
      });
    }

    // 4. Verificar y pre-poblar tipos de aula
    const tiposAulaCount = await prisma.tipo_aula.count();
    if (tiposAulaCount === 0) {
      await prisma.tipo_aula.createMany({
        data: [
          { id_tipo_aula: 'T1', nom_tipo_aula: 'General' },
          { id_tipo_aula: 'classroom', nom_tipo_aula: 'Aula Estandar' },
          { id_tipo_aula: 'computer-lab', nom_tipo_aula: 'Laboratorio de Computacion' },
          { id_tipo_aula: 'workshop', nom_tipo_aula: 'Taller' },
          { id_tipo_aula: 'practical-lab', nom_tipo_aula: 'Laboratorio Practico' },
        ]
      });
    }

    const [carreras, ciclos, tiposAula] = await Promise.all([
      prisma.carrera.findMany({
        orderBy: { nom_carrera: 'asc' },
      }),
      prisma.ciclo.findMany({
        orderBy: { id_ciclo: 'asc' },
      }),
      prisma.tipo_aula.findMany({
        orderBy: { nom_tipo_aula: 'asc' },
      }),
    ])

    return NextResponse.json({
      carreras,
      ciclos,
      tiposAula,
    })
  } catch (error) {
    console.error('Error fetching master data:', error)
    return NextResponse.json(
      { error: 'Error al obtener datos maestros' },
      { status: 500 }
    )
  }
}
