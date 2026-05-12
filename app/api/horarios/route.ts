import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { prisma } from '../../../lib/prisma';

export async function POST(request: Request) {
  try {
    const datos = await request.json();

    if (!Array.isArray(datos)) {
      return NextResponse.json({ error: 'Formato inválido. El cuerpo debe ser un arreglo de filas de Excel.' }, { status: 400 });
    }

    if (datos.length === 0) {
      return NextResponse.json({ message: 'No hay filas para importar.' });
    }

    const normalize = (value: any) => String(value ?? '').trim();
    const normalizeRow = (row: any) => {
      const normalized: Record<string, any> = {};
      for (const key of Object.keys(row)) {
        normalized[key.trim().toLowerCase()] = row[key];
      }
      return normalized;
    };
    const pick = (row: any, ...keys: string[]) => {
      for (const key of keys) {
        const value = row[key.toLowerCase()];
        if (value !== undefined && value !== null && String(value).trim() !== '') {
          return String(value).trim();
        }
      }
      return '';
    };

    await prisma.facultad.upsert({
      where: { id_facultad: 'F01' },
      update: {},
      create: { id_facultad: 'F01', nom_facultad: 'General' },
    });

    await prisma.carrera.upsert({
      where: { id_carrera: 'C01' },
      update: {},
      create: { id_carrera: 'C01', nom_carrera: 'General', id_facultad: 'F01' },
    });

    await prisma.ciclo.upsert({
      where: { id_ciclo: 1 },
      update: {},
      create: { id_ciclo: 1, nom_ciclo: '1' },
    });

    await prisma.tipo_aula.upsert({
      where: { id_tipo_aula: 'T1' },
      update: {},
      create: { id_tipo_aula: 'T1', nom_tipo_aula: 'General' },
    });

    for (const [index, filaRaw] of datos.entries()) {
      const fila = normalizeRow(filaRaw);
      const idCurso = normalize(pick(fila, 'id_curso', 'curso')) || `curso-${index + 1}`;
      const cursoName = normalize(pick(fila, 'nom_curso', 'curso', 'CURSO', 'Curso')) || idCurso;
      const idAula = normalize(pick(fila, 'id_aula', 'aula', 'AULA', 'Aula')) || `AULA-${index + 1}`;
      const aulaName = normalize(pick(fila, 'nom_aula', 'aula', 'AULA', 'Aula')) || idAula;
      const idDocente = normalize(pick(fila, 'id_docente', 'docente', 'DOCENTE', 'Docente')) || `DOC-${index + 1}`;
      const docenteName = normalize(pick(fila, 'nom_docente', 'docente', 'DOCENTE', 'Docente')) || idDocente;
      const dia = normalize(pick(fila, 'dia', 'DÍA', 'Dia', 'DIA')) || 'Día no definido';
      const horario_inicio_raw = pick(fila, 'horario_inicio', 'INICIO', 'inicio');
      const horario_fin_raw = pick(fila, 'horario_fin', 'FIN', 'fin');

      const parseTimeValue = (value: any) => {
        const normalized = String(value ?? '').trim();
        if (!normalized) return '';
        if (/^\d{1,2}:\d{2}$/.test(normalized)) return normalized;
        const numeric = Number(normalized);
        if (!Number.isNaN(numeric)) {
          const totalMinutes = Math.round(numeric * 24 * 60);
          const hours = Math.floor(totalMinutes / 60);
          const mins = totalMinutes % 60;
          return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
        }
        return normalized;
      };

      const horario_inicio = parseTimeValue(horario_inicio_raw);
      const horario_fin = parseTimeValue(horario_fin_raw);

      await prisma.curso.upsert({
        where: { id_curso: idCurso },
        update: { nom_curso: cursoName },
        create: {
          id_curso: idCurso,
          nom_curso: cursoName,
          creditos: 1,
          id_carrera: 'C01',
          modalidad: 'Presencial',
          tipo_curso: 'Obligatorio',
          id_ciclo: 1,
        },
      });

      await prisma.aula.upsert({
        where: { id_aula: idAula },
        update: { nom_aula: aulaName },
        create: {
          id_aula: idAula,
          nom_aula: aulaName,
          id_tipo_aula: 'T1',
          capacidad: 30,
        },
      });

      await prisma.docente.upsert({
        where: { id_docente: idDocente },
        update: { nom_docente: docenteName },
        create: {
          id_docente: idDocente,
          dni_docente: '00000000',
          nom_docente: docenteName,
          ape_docente: 'Desconocido',
          nom_especialidad: 'General',
        },
      });

      await prisma.horarios.create({
        data: {
          id_horario: randomUUID(),
          dia,
          horario_inicio,
          horario_fin,
          id_curso: idCurso,
          id_aula: idAula,
          id_docente: idDocente,
        },
      });
    }

    return NextResponse.json({ message: 'Importado con éxito' });
  } catch (error: any) {
    console.error('Error al importar:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const horarios = await prisma.horarios.findMany({
      include: {
        curso: true,
        aula: true,
        docente: true,
      },
    });
    return NextResponse.json(horarios);
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener datos" }, { status: 500 });
  }
}