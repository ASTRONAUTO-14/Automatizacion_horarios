'use client';

import { useState } from 'react';
import {
  Layers, Plus, Copy, Trash2, CheckCircle2, Clock, Archive,
  ArrowRight, X, GitBranch, Zap
} from 'lucide-react';

type ScenarioStatus = 'published' | 'draft' | 'simulation';
interface Scenario {
  id: string; name: string; status: ScenarioStatus; createdAt: string;
  createdBy: string; conflicts: number; coverage: number; description: string;
}

const MOCK: Scenario[] = [
  { id: 's1', name: 'Semestre 2026-I (Publicado)', status: 'published', createdAt: '2026-05-15', createdBy: 'Admin', conflicts: 0, coverage: 100, description: 'Versión oficial aprobada por Coordinación Académica.' },
  { id: 's2', name: 'Borrador 2026-I v3', status: 'draft', createdAt: '2026-05-28', createdBy: 'Soviet', conflicts: 2, coverage: 87, description: 'Ajuste de horarios de laboratorio de electrónica.' },
  { id: 's3', name: 'Simulación: Crecimiento +20%', status: 'simulation', createdAt: '2026-05-29', createdBy: 'Soviet', conflicts: 5, coverage: 72, description: 'Prueba de capacidad ante un incremento del 20% en matrícula.' },
];

const STATUS_CFG = {
  published: { label: 'Publicado', color: '#059669', bg: '#f0fdf4', border: '#a7f3d0', dot: '#10b981', Icon: CheckCircle2 },
  draft: { label: 'Borrador', color: '#b45309', bg: '#fffbeb', border: '#fde68a', dot: '#f59e0b', Icon: Clock },
  simulation: { label: 'Simulación', color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe', dot: '#8b5cf6', Icon: GitBranch },
};

const card: React.CSSProperties = { background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' };

export default function EscenariosPage() {
  const [scenarios] = useState<Scenario[]>(MOCK);
  const [selected, setSelected] = useState<string>(MOCK[0].id);
  const [modal, setModal] = useState(false);
  const sel = scenarios.find(s => s.id === selected)!;
  const cfg = STATUS_CFG[sel.status];
  const CfgIcon = cfg.Icon;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 1280, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ ...card, padding: '20px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.4px', margin: 0 }}>Gestión de Escenarios</h1>
          <p style={{ fontSize: 13.5, color: '#64748b', margin: '4px 0 0' }}>Controla versiones de horarios, borradores, simulaciones y publicaciones.</p>
        </div>
        <button onClick={() => setModal(true)}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#0f172a', color: 'white', padding: '9px 18px', borderRadius: 10, fontSize: 13.5, fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
          <Plus style={{ width: 15, height: 15 }} /> Nuevo Escenario
        </button>
      </div>

      {/* Split View */}
      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 20, alignItems: 'start' }}>

        {/* Left: Scenario List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {scenarios.map(s => {
            const c = STATUS_CFG[s.status];
            const Icon = c.Icon;
            const isSelected = selected === s.id;
            return (
              <button key={s.id} onClick={() => setSelected(s.id)} style={{
                width: '100%', textAlign: 'left', background: 'white', border: `2px solid ${isSelected ? '#0f172a' : '#e2e8f0'}`,
                borderRadius: 14, padding: '16px 18px', cursor: 'pointer', fontFamily: 'inherit',
                boxShadow: isSelected ? '0 4px 16px rgba(0,0,0,0.10)' : '0 1px 4px rgba(0,0,0,0.04)',
                transition: 'all 0.15s',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', lineHeight: 1.35, paddingRight: 8 }}>{s.name}</div>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 9px', borderRadius: 20, background: c.bg, color: c.color, border: `1px solid ${c.border}`, fontSize: 11.5, fontWeight: 700, flexShrink: 0 }}>
                    <Icon style={{ width: 11, height: 11 }} />{c.label}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 10 }}>
                  {s.createdAt} · por {s.createdBy}
                  {s.conflicts > 0 && <span style={{ marginLeft: 8, color: '#ef4444', fontWeight: 700 }}>· {s.conflicts} conflictos</span>}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}>
                  <span>Cobertura</span><span style={{ color: s.coverage === 100 ? '#10b981' : s.coverage > 75 ? '#f59e0b' : '#ef4444' }}>{s.coverage}%</span>
                </div>
                <div style={{ height: 5, background: '#f1f5f9', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${s.coverage}%`, borderRadius: 99, background: s.coverage === 100 ? '#10b981' : s.coverage > 75 ? '#f59e0b' : '#ef4444' }} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Right: Detail Panel */}
        <div style={{ ...card, overflow: 'hidden' }}>
          {/* Detail Header */}
          <div style={{ padding: '24px 28px', borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
              <div>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>{sel.name}</div>
                <div style={{ fontSize: 13.5, color: '#64748b' }}>{sel.description}</div>
              </div>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 20, background: cfg.bg, color: cfg.color, border: `1.5px solid ${cfg.border}`, fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                <CfgIcon style={{ width: 14, height: 14 }} />{cfg.label}
              </span>
            </div>
          </div>

          <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* KPIs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
              {[
                { label: 'Cobertura', value: `${sel.coverage}%`, color: sel.coverage === 100 ? '#10b981' : '#f59e0b' },
                { label: 'Conflictos', value: sel.conflicts, color: sel.conflicts === 0 ? '#10b981' : '#ef4444' },
                { label: 'Última edición', value: sel.createdAt, color: '#0f172a' },
              ].map(k => (
                <div key={k.label} style={{ background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: 14, padding: '18px 16px', textAlign: 'center' }}>
                  <div style={{ fontSize: 28, fontWeight: 900, color: k.color, lineHeight: 1, marginBottom: 6 }}>{k.value}</div>
                  <div style={{ fontSize: 12.5, color: '#64748b', fontWeight: 500 }}>{k.label}</div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12 }}>Acciones disponibles</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {[
                  { label: 'Duplicar escenario', Icon: Copy, color: '#3b82f6', bg: '#eff6ff' },
                  { label: 'Re-optimizar (CSP)', Icon: Zap, color: '#8b5cf6', bg: '#f5f3ff' },
                  { label: 'Archivar borrador', Icon: Archive, color: '#f59e0b', bg: '#fffbeb' },
                ].map(a => {
                  const I = a.Icon;
                  return (
                    <button key={a.label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: 'white', border: '1.5px solid #e2e8f0', borderRadius: 12, cursor: 'pointer', fontSize: 13.5, fontWeight: 600, color: '#334155', fontFamily: 'inherit', transition: 'all 0.15s', textAlign: 'left' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#cbd5e1'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#e2e8f0'; (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none'; }}>
                      <div style={{ padding: 8, background: a.bg, borderRadius: 9 }}><I style={{ width: 15, height: 15, color: a.color }} /></div>
                      {a.label}
                    </button>
                  );
                })}
                {sel.status !== 'published' && (
                  <button style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: '#f0fdf4', border: '1.5px solid #a7f3d0', borderRadius: 12, cursor: 'pointer', fontSize: 13.5, fontWeight: 700, color: '#065f46', fontFamily: 'inherit', gridColumn: '1/-1' }}>
                    <div style={{ padding: 8, background: '#10b981', borderRadius: 9 }}><CheckCircle2 style={{ width: 15, height: 15, color: 'white' }} /></div>
                    Publicar este escenario como horario oficial
                    <ArrowRight style={{ width: 15, height: 15, marginLeft: 'auto' }} />
                  </button>
                )}
                <button style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: '#fef2f2', border: '1.5px solid #fecaca', borderRadius: 12, cursor: 'pointer', fontSize: 13.5, fontWeight: 600, color: '#b91c1c', fontFamily: 'inherit', gridColumn: sel.status !== 'published' ? '1/-1' : 'auto' }}>
                  <div style={{ padding: 8, background: '#fee2e2', borderRadius: 9 }}><Trash2 style={{ width: 15, height: 15, color: '#ef4444' }} /></div>
                  Eliminar escenario
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Scenario Modal */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: 'white', width: '100%', maxWidth: 480, borderRadius: 20, boxShadow: '0 24px 64px rgba(0,0,0,0.18)', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 24px', borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', margin: 0 }}>Crear Nuevo Escenario</h2>
              <button onClick={() => setModal(false)} style={{ padding: 6, border: 'none', background: '#f1f5f9', borderRadius: 8, cursor: 'pointer', display: 'flex', color: '#64748b' }}><X style={{ width: 15, height: 15 }} /></button>
            </div>
            <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { label: 'Nombre del Escenario', type: 'text', placeholder: 'Ej. Semestre 2026-II Borrador' },
              ].map(f => (
                <div key={f.label}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>{f.label}</label>
                  <input type={f.type} placeholder={f.placeholder} style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, color: '#0f172a', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                </div>
              ))}
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Tipo</label>
                <select style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, background: 'white', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}>
                  <option value="draft">Borrador (editable)</option>
                  <option value="simulation">Simulación (solo lectura)</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Descripción</label>
                <textarea rows={3} placeholder="Describe el propósito..." style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none', fontFamily: 'inherit', resize: 'none', boxSizing: 'border-box' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 14px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 10, fontSize: 13, color: '#1d4ed8' }}>
                <GitBranch style={{ width: 15, height: 15, flexShrink: 0, marginTop: 1 }} />
                El nuevo escenario se creará como una bifurcación del escenario publicado actual.
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, padding: '16px 24px', borderTop: '1px solid #f1f5f9', background: '#f8fafc' }}>
              <button onClick={() => setModal(false)} style={{ padding: '9px 18px', border: '1.5px solid #e2e8f0', borderRadius: 10, background: 'white', fontSize: 13.5, fontWeight: 600, color: '#475569', cursor: 'pointer', fontFamily: 'inherit' }}>Cancelar</button>
              <button onClick={() => setModal(false)} style={{ padding: '9px 18px', background: '#0f172a', border: 'none', borderRadius: 10, fontSize: 13.5, fontWeight: 700, color: 'white', cursor: 'pointer', fontFamily: 'inherit' }}>Crear Escenario</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
