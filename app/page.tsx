'use client';
import { useState } from 'react';
import * as XLSX from 'xlsx';

export default function Home() {
  const [rawData, setRawData] = useState<any[]>([]);
  const [previewRows, setPreviewRows] = useState<any[]>([]);
  const [previewColumns, setPreviewColumns] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [missingColumns, setMissingColumns] = useState<string[]>([]);

  const requiredColumns = ['curso', 'dia', 'aula', 'inicio', 'fin', 'docente'];

  const normalizeKey = (key: string) =>
    String(key ?? '')
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_]/g, '');

  const isTimeColumn = (columnName: string) => {
    const normalized = normalizeKey(columnName);
    return normalized.includes('hora') || normalized.includes('inicio') || normalized.includes('fin');
  };

  const formatTime = (time: any) => {
    if (time == null) return '';
    if (typeof time === 'number') {
      const totalMinutes = Math.round(time * 24 * 60);
      const hours = Math.floor(totalMinutes / 60);
      const mins = totalMinutes % 60;
      return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    }
    if (typeof time === 'string') {
      const normalized = time.trim();
      if (/^\d{1,2}:\d{2}$/.test(normalized)) return normalized;
      const numeric = Number(normalized);
      if (!Number.isNaN(numeric)) {
        const totalMinutes = Math.round(numeric * 24 * 60);
        const hours = Math.floor(totalMinutes / 60);
        const mins = totalMinutes % 60;
        return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
      }
      return normalized;
    }
    return String(time);
  };

  const getPreviewValue = (col: string, value: any) => {
    if (value == null) return '';
    return isTimeColumn(col) ? formatTime(value) : String(value);
  };

  const manejarImportacion = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setErrorMessage(null);
    const reader = new FileReader();

    reader.onload = async (evt) => {
      try {
        const arrayBuffer = evt.target?.result;
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const datosRaw = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);

        const columns = Array.from(
          new Set(datosRaw.flatMap((row: any) => Object.keys(row)))
        );
        const normalizedColumns = columns.map(normalizeKey);
        const missing = requiredColumns.filter(
          (required) =>
            !normalizedColumns.some((col) => col.includes(required))
        );

        setRawData(datosRaw as any[]);
        setPreviewRows(datosRaw as any[]);
        setPreviewColumns(columns);
        setMissingColumns(missing);
        setShowPreview(true);

        if (missing.length > 0) {
          setErrorMessage(
            `Faltan columnas obligatorias: ${missing.join(', ')}. Revisa tu archivo Excel.`
          );
        } else {
          setErrorMessage(null);
        }
      } catch (err) {
        setErrorMessage('Error al leer el archivo. Asegúrate de cargar un Excel válido.');
        setShowPreview(false);
      } finally {
        setLoading(false);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const importarDatos = async () => {
    if (!rawData.length) return;
    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/horarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rawData),
      });

      if (res.ok) {
        alert('¡Importado con éxito!');
        setShowPreview(false);
        setRawData([]);
        setPreviewRows([]);
        setPreviewColumns([]);
      } else {
        const err = await res.json();
        setErrorMessage('Error al importar: ' + (err.error || 'Respuesta inválida del servidor'));
      }
    } catch (err) {
      setErrorMessage('Error de red al importar los datos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px', backgroundColor: '#f4f7f6', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* PANEL DE CARGA */}
      <div style={{ 
        backgroundColor: 'white', padding: '30px', borderRadius: '15px', 
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)', marginBottom: '30px' 
      }}>
        <h1 style={{ color: '#2c3e50', marginBottom: '10px' }}>Panel de Administración de Horarios</h1>
        <p style={{ color: '#7f8c8d', marginBottom: '20px' }}>Sube tu archivo Excel para actualizar la base de datos.</p>
        
        <label style={{
          display: 'inline-block', padding: '15px 30px', backgroundColor: '#007bff',
          color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold',
          transition: '0.3s'
        }}>
          {loading ? "⌛ Procesando..." : "📁 Seleccionar Excel e Importar"}
          <input type="file" onChange={manejarImportacion} hidden accept=".xlsx,.xls" />
        </label>
      </div>

      {showPreview ? (
        <div style={{ backgroundColor: 'white', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 24px', borderBottom: '1px solid #e5e7eb', color: '#374151' }}>
            <div>
              <strong>{previewRows.length}</strong> registros • <strong>{previewColumns.length}</strong> columnas
            </div>
            <div style={{ color: missingColumns.length ? '#b91c1c' : '#16a34a', fontWeight: 600 }}>
              {missingColumns.length > 0 ? `Faltan columnas: ${missingColumns.join(', ')}` : 'Columnas obligatorias presentes'}
            </div>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', color: '#1f2937' }}>
            <thead style={{ backgroundColor: '#2c3e50', color: 'white' }}>
              <tr>
                {(showPreview && previewColumns.length > 0 ? previewColumns : [
                  'CURSO',
                  'DÍA',
                  'AULA',
                  'INICIO',
                  'FIN',
                  'DOCENTE',
                ]).map((col) => (
                  <th key={col} style={{ padding: '15px', textAlign: 'left', fontWeight: 600 }}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {previewRows.length > 0 ? (
                previewRows.map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #eee', backgroundColor: i % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                    {previewColumns.map((col) => (
                      <td key={col} style={{ padding: '15px', color: '#111827' }}>
                        {getPreviewValue(col, row[col])}
                      </td>
                    ))}
                  </tr>
                ))
              ) : null}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ backgroundColor: '#ffffff', borderRadius: '15px', padding: '30px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', color: '#7f8c8d' }}>
          Selecciona un archivo Excel para ver su estructura exacta aquí.
        </div>
      )}
      {showPreview && (
        <div style={{ marginTop: '15px' }}>
          <button
            onClick={importarDatos}
            disabled={loading || missingColumns.length > 0}
            style={{
              marginRight: '12px',
              padding: '12px 20px',
              backgroundColor: loading || missingColumns.length > 0 ? '#94a3b8' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: loading || missingColumns.length > 0 ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Importando...' : 'Importar datos al servidor'}
          </button>
          <button
            onClick={() => setShowPreview(false)}
            disabled={loading}
            style={{
              padding: '12px 20px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            Cancelar vista previa
          </button>
        </div>
      )}
      {errorMessage && (
        <p style={{ marginTop: '15px', color: '#c0392b' }}>{errorMessage}</p>
      )}
    </div>
  );
} 