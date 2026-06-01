import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request, props: { params: Promise<{ tipo: string }> }) {
  try {
    const data = await req.json();
    const params = await props.params;
    const tipo = params.tipo;

    let result;

    switch (tipo) {
      case 'facultad':
        result = await prisma.facultad.create({ data });
        break;
      case 'carrera':
        result = await prisma.carrera.create({ data });
        break;
      case 'ciclo':
        result = await prisma.ciclo.create({
          data: {
            id_ciclo: parseInt(data.id_ciclo),
            nom_ciclo: data.nom_ciclo
          }
        });
        break;
      case 'plan-estudio':
        result = await prisma.plan_estudio.create({ data });
        break;
      case 'tipo-sesion':
        result = await prisma.tipo_sesion.create({ data });
        break;
      default:
        return NextResponse.json({ error: 'Tipo de catálogo no válido' }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error(`Error al crear en catálogo:`, error);
    return NextResponse.json(
      { error: 'Error al crear el registro. Es posible que el ID ya exista.' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, props: { params: Promise<{ tipo: string }> }) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const params = await props.params;
    const tipo = params.tipo;

    if (!id) {
      return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
    }

    let result;

    switch (tipo) {
      case 'facultad':
        result = await prisma.facultad.delete({ where: { id_facultad: id } });
        break;
      case 'carrera':
        result = await prisma.carrera.delete({ where: { id_carrera: id } });
        break;
      case 'ciclo':
        result = await prisma.ciclo.delete({ where: { id_ciclo: parseInt(id) } });
        break;
      case 'plan-estudio':
        result = await prisma.plan_estudio.delete({ where: { id_plan: id } });
        break;
      case 'tipo-sesion':
        result = await prisma.tipo_sesion.delete({ where: { id_tipo_sesion: id } });
        break;
      default:
        return NextResponse.json({ error: 'Tipo de catálogo no válido' }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error(`Error al eliminar en catálogo ${params.tipo}:`, error);
    return NextResponse.json(
      { error: 'Error al eliminar el registro. Puede que esté siendo utilizado en otras partes del sistema.' },
      { status: 500 }
    );
  }
}
