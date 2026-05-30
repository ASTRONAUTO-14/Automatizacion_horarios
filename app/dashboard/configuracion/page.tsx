'use client';

import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  User, Lock, Bell, Palette, Shield, Globe, Eye, EyeOff,
  Save, Check, ChevronRight, Sun, Moon, Monitor, Mail, Phone, Building2, AlertTriangle
} from 'lucide-react';

type Section = 'perfil' | 'seguridad' | 'notificaciones' | 'apariencia' | 'sistema';

const SECTIONS: { id: Section; label: string; desc: string; Icon: React.ElementType }[] = [
  { id: 'perfil', label: 'Perfil de Usuario', desc: 'Nombre, correo e información personal', Icon: User },
  { id: 'seguridad', label: 'Seguridad', desc: 'Contraseña y verificación', Icon: Lock },
  { id: 'notificaciones', label: 'Notificaciones', desc: 'Alertas y preferencias de aviso', Icon: Bell },
  { id: 'apariencia', label: 'Apariencia', desc: 'Tema, idioma y visualización', Icon: Palette },
  { id: 'sistema', label: 'Sistema CSP', desc: 'Configuración avanzada del motor', Icon: Shield },
];

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '11px 14px', border: '1.5px solid #e2e8f0', borderRadius: 11,
  fontSize: 14, color: '#0f172a', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', background: 'white',
};

const labelStyle: React.CSSProperties = {
  fontSize: 13, fontWeight: 600, color: '#374151', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 7,
};

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button type="button" onClick={onChange}
      style={{ width: 44, height: 24, borderRadius: 99, background: on ? '#10b981' : '#e2e8f0', border: 'none', cursor: 'pointer', position: 'relative', flexShrink: 0, transition: 'background 0.2s' }}>
      <span style={{ position: 'absolute', top: 3, left: on ? 23 : 3, width: 18, height: 18, borderRadius: '50%', background: 'white', boxShadow: '0 1px 4px rgba(0,0,0,0.2)', transition: 'left 0.2s' }} />
    </button>
  );
}

export default function ConfiguracionPage() {
  const { user } = useAuth();
  const [section, setSection] = useState<Section>('perfil');
  const [showPw, setShowPw] = useState(false);
  const [saved, setSaved] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light');
  const [notifs, setNotifs] = useState({ conflictos: true, publicacion: true, semanal: false, email: true });
  const [csp, setCsp] = useState({ maxTime: 60, hardConflict: true, softConflict: true, balanceLoad: true, preferMorning: false });

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2800); };

  // Sanitize display name — avoid showing raw UUIDs
  const displayName = user?.name && user.name.length > 30 ? 'Usuario' : (user?.name ?? 'Usuario');
  const displayUser = user?.username && user.username.length > 20 ? 'admin' : (user?.username ?? 'admin');

  const card: React.CSSProperties = { background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', overflow: 'hidden' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 1100, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ ...card, padding: '20px 28px' }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.4px', margin: 0 }}>Configuración</h1>
        <p style={{ fontSize: 13.5, color: '#64748b', margin: '4px 0 0' }}>Administra tu cuenta, seguridad y preferencias del sistema.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 20, alignItems: 'start' }}>

        {/* Sidebar Nav */}
        <div style={{ ...card, padding: 8, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {SECTIONS.map(s => {
            const Icon = s.Icon;
            const active = section === s.id;
            return (
              <button key={s.id} onClick={() => setSection(s.id)} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '11px 12px', borderRadius: 10,
                border: 'none', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', transition: 'all 0.15s',
                background: active ? '#0f172a' : 'transparent',
              }}
                onMouseEnter={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.background = '#f1f5f9'; }}
                onMouseLeave={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}>
                <Icon style={{ width: 16, height: 16, flexShrink: 0, color: active ? '#10b981' : '#94a3b8' }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: active ? 'white' : '#334155', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.label}</div>
                  <div style={{ fontSize: 11.5, color: active ? 'rgba(255,255,255,0.45)' : '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.desc}</div>
                </div>
                <ChevronRight style={{ width: 13, height: 13, color: active ? '#10b981' : '#cbd5e1', flexShrink: 0 }} />
              </button>
            );
          })}
        </div>

        {/* Content Panel */}
        <div style={card}>

          {/* ── PERFIL ── */}
          {section === 'perfil' && (
            <>
              <div style={{ padding: '20px 28px', borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>Perfil de Usuario</div>
                <div style={{ fontSize: 13, color: '#64748b', marginTop: 3 }}>Tu información personal y de contacto.</div>
              </div>
              <div style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 22 }}>
                {/* Avatar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '18px 20px', background: '#f8fafc', borderRadius: 14, border: '1px solid #f1f5f9' }}>
                  <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg, #475569, #0f172a)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 22, flexShrink: 0 }}>
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>{displayName}</div>
                    <div style={{ fontSize: 13, color: '#64748b', textTransform: 'capitalize', marginTop: 2 }}>{user?.role ?? 'user'}</div>
                  </div>
                  <button style={{ fontSize: 13.5, fontWeight: 600, color: '#3b82f6', border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: 'inherit' }}>Cambiar foto</button>
                </div>

                {/* Fields */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={labelStyle}><User style={{ width: 14, height: 14, color: '#94a3b8' }} />Nombre Completo</label>
                    <input type="text" defaultValue={displayName} style={inputStyle}
                      onFocus={e => { e.target.style.borderColor = '#10b981'; e.target.style.boxShadow = '0 0 0 3px rgba(16,185,129,0.1)'; }}
                      onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }} />
                  </div>
                  <div>
                    <label style={labelStyle}><User style={{ width: 14, height: 14, color: '#94a3b8' }} />Nombre de Usuario</label>
                    <input type="text" defaultValue={displayUser} style={inputStyle}
                      onFocus={e => { e.target.style.borderColor = '#10b981'; e.target.style.boxShadow = '0 0 0 3px rgba(16,185,129,0.1)'; }}
                      onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }} />
                  </div>
                  <div>
                    <label style={labelStyle}><Mail style={{ width: 14, height: 14, color: '#94a3b8' }} />Correo Electrónico</label>
                    <input type="email" defaultValue={`${displayUser}@uni.edu`} style={inputStyle}
                      onFocus={e => { e.target.style.borderColor = '#10b981'; e.target.style.boxShadow = '0 0 0 3px rgba(16,185,129,0.1)'; }}
                      onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }} />
                  </div>
                  <div>
                    <label style={labelStyle}><Phone style={{ width: 14, height: 14, color: '#94a3b8' }} />Teléfono (opcional)</label>
                    <input type="tel" placeholder="+52 555 000 0000" style={inputStyle}
                      onFocus={e => { e.target.style.borderColor = '#10b981'; e.target.style.boxShadow = '0 0 0 3px rgba(16,185,129,0.1)'; }}
                      onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }} />
                  </div>
                  <div style={{ gridColumn: '1/-1' }}>
                    <label style={labelStyle}><Building2 style={{ width: 14, height: 14, color: '#94a3b8' }} />Departamento / Área</label>
                    <input type="text" placeholder="Ej. Coordinación Académica" style={inputStyle}
                      onFocus={e => { e.target.style.borderColor = '#10b981'; e.target.style.boxShadow = '0 0 0 3px rgba(16,185,129,0.1)'; }}
                      onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }} />
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px 28px', borderTop: '1px solid #f1f5f9', background: '#f8fafc' }}>
                <button onClick={save} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#0f172a', color: 'white', padding: '10px 22px', borderRadius: 11, fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                  <Save style={{ width: 15, height: 15 }} />Guardar Cambios
                </button>
              </div>
            </>
          )}

          {/* ── SEGURIDAD ── */}
          {section === 'seguridad' && (
            <>
              <div style={{ padding: '20px 28px', borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>Seguridad y Contraseña</div>
                <div style={{ fontSize: 13, color: '#64748b', marginTop: 3 }}>Actualiza tus credenciales de acceso.</div>
              </div>
              <div style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div>
                  <label style={labelStyle}><Lock style={{ width: 14, height: 14, color: '#94a3b8' }} />Contraseña Actual</label>
                  <div style={{ position: 'relative' }}>
                    <input type={showPw ? 'text' : 'password'} placeholder="••••••••" style={{ ...inputStyle, paddingRight: 44 }}
                      onFocus={e => { e.target.style.borderColor = '#10b981'; e.target.style.boxShadow = '0 0 0 3px rgba(16,185,129,0.1)'; }}
                      onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }} />
                    <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex' }}>
                      {showPw ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Nueva Contraseña</label>
                  <input type="password" placeholder="Mín. 8 caracteres" style={inputStyle}
                    onFocus={e => { e.target.style.borderColor = '#10b981'; e.target.style.boxShadow = '0 0 0 3px rgba(16,185,129,0.1)'; }}
                    onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }} />
                </div>
                <div>
                  <label style={labelStyle}>Confirmar Nueva Contraseña</label>
                  <input type="password" placeholder="Repite la contraseña" style={inputStyle}
                    onFocus={e => { e.target.style.borderColor = '#10b981'; e.target.style.boxShadow = '0 0 0 3px rgba(16,185,129,0.1)'; }}
                    onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }} />
                </div>
                <div style={{ display: 'flex', gap: 10, padding: '14px 16px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 12, fontSize: 13, color: '#1d4ed8' }}>
                  <Shield style={{ width: 15, height: 15, flexShrink: 0, marginTop: 1 }} />
                  <span>Usa mínimo 12 caracteres con mayúsculas, números y símbolos para mayor seguridad.</span>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px 28px', borderTop: '1px solid #f1f5f9', background: '#f8fafc' }}>
                <button onClick={save} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#0f172a', color: 'white', padding: '10px 22px', borderRadius: 11, fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                  <Lock style={{ width: 15, height: 15 }} />Actualizar Contraseña
                </button>
              </div>
            </>
          )}

          {/* ── NOTIFICACIONES ── */}
          {section === 'notificaciones' && (
            <>
              <div style={{ padding: '20px 28px', borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>Preferencias de Notificaciones</div>
                <div style={{ fontSize: 13, color: '#64748b', marginTop: 3 }}>Controla qué alertas recibes y cómo.</div>
              </div>
              <div style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {([
                  { key: 'conflictos' as const, label: 'Alertas de Conflictos', desc: 'Avisos cuando el motor CSP detecte colisiones de horario.' },
                  { key: 'publicacion' as const, label: 'Publicación de Escenarios', desc: 'Notificación al publicar un borrador como horario oficial.' },
                  { key: 'semanal' as const, label: 'Resumen Semanal', desc: 'Reporte de métricas enviado cada lunes por la mañana.' },
                  { key: 'email' as const, label: 'Notificaciones por Email', desc: 'Enviar alertas también al correo registrado.' },
                ]).map(n => (
                  <div key={n.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '16px 18px', background: '#f8fafc', borderRadius: 12, border: '1px solid #f1f5f9' }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', marginBottom: 3 }}>{n.label}</div>
                      <div style={{ fontSize: 12.5, color: '#64748b' }}>{n.desc}</div>
                    </div>
                    <Toggle on={notifs[n.key]} onChange={() => setNotifs(p => ({ ...p, [n.key]: !p[n.key] }))} />
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px 28px', borderTop: '1px solid #f1f5f9', background: '#f8fafc' }}>
                <button onClick={save} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#0f172a', color: 'white', padding: '10px 22px', borderRadius: 11, fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                  <Save style={{ width: 15, height: 15 }} />Guardar Preferencias
                </button>
              </div>
            </>
          )}

          {/* ── APARIENCIA ── */}
          {section === 'apariencia' && (
            <>
              <div style={{ padding: '20px 28px', borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>Apariencia e Idioma</div>
                <div style={{ fontSize: 13, color: '#64748b', marginTop: 3 }}>Personaliza la interfaz según tus preferencias.</div>
              </div>
              <div style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 22 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 12 }}>Tema de Interfaz</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                    {([
                      { id: 'light' as const, label: 'Claro', Icon: Sun },
                      { id: 'dark' as const, label: 'Oscuro', Icon: Moon },
                      { id: 'system' as const, label: 'Sistema', Icon: Monitor },
                    ]).map(t => {
                      const Icon = t.Icon;
                      const active = theme === t.id;
                      return (
                        <button key={t.id} type="button" onClick={() => setTheme(t.id)}
                          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: '20px 16px', border: `2px solid ${active ? '#0f172a' : '#e2e8f0'}`, borderRadius: 14, background: active ? '#f8fafc' : 'white', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}>
                          <Icon style={{ width: 24, height: 24, color: active ? '#0f172a' : '#94a3b8' }} />
                          <span style={{ fontSize: 13.5, fontWeight: 600, color: active ? '#0f172a' : '#64748b' }}>{t.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <label style={{ ...labelStyle, marginBottom: 8 }}><Globe style={{ width: 14, height: 14, color: '#94a3b8' }} />Idioma de la Interfaz</label>
                  <select style={{ ...inputStyle, width: 240 }}>
                    <option value="es">Español</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px 28px', borderTop: '1px solid #f1f5f9', background: '#f8fafc' }}>
                <button onClick={save} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#0f172a', color: 'white', padding: '10px 22px', borderRadius: 11, fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                  <Save style={{ width: 15, height: 15 }} />Aplicar Cambios
                </button>
              </div>
            </>
          )}

          {/* ── SISTEMA CSP ── */}
          {section === 'sistema' && (
            <>
              <div style={{ padding: '20px 28px', borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>Configuración del Motor CSP</div>
                <div style={{ fontSize: 13, color: '#64748b', marginTop: 3 }}>Parámetros avanzados del algoritmo de optimización.</div>
              </div>
              <div style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div style={{ display: 'flex', gap: 10, padding: '14px 16px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 12, fontSize: 13, color: '#92400e' }}>
                  <AlertTriangle style={{ width: 15, height: 15, flexShrink: 0, marginTop: 1 }} />
                  <span>Cambios en estos parámetros afectan la calidad y velocidad de la generación de horarios.</span>
                </div>
                <div>
                  <label style={labelStyle}>Tiempo Máximo de Búsqueda (segundos)</label>
                  <input type="number" value={csp.maxTime} min={10} max={300}
                    onChange={e => setCsp(p => ({ ...p, maxTime: +e.target.value }))} style={{ ...inputStyle, width: 180 }}
                    onFocus={e => { e.target.style.borderColor = '#10b981'; e.target.style.boxShadow = '0 0 0 3px rgba(16,185,129,0.1)'; }}
                    onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }} />
                  <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 6 }}>El solucionador se detendrá al alcanzar este límite y retornará la mejor solución encontrada.</div>
                </div>
                {([
                  { key: 'hardConflict' as const, label: 'Restricciones Duras (Hard)', desc: 'Nunca asignar un docente a dos clases simultáneas. No negociable.' },
                  { key: 'softConflict' as const, label: 'Restricciones Suaves (Soft)', desc: 'Preferir que los docentes no tengan huecos de más de 2 horas.' },
                  { key: 'balanceLoad' as const, label: 'Balancear Carga Docente', desc: 'Distribuir equitativamente las horas entre todos los docentes.' },
                  { key: 'preferMorning' as const, label: 'Preferir Horario Matutino', desc: 'Dar prioridad a asignaciones en turnos de mañana.' },
                ]).map(s => (
                  <div key={s.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '16px 18px', background: '#f8fafc', borderRadius: 12, border: '1px solid #f1f5f9' }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', marginBottom: 3 }}>{s.label}</div>
                      <div style={{ fontSize: 12.5, color: '#64748b' }}>{s.desc}</div>
                    </div>
                    <Toggle on={csp[s.key]} onChange={() => setCsp(p => ({ ...p, [s.key]: !p[s.key] }))} />
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px 28px', borderTop: '1px solid #f1f5f9', background: '#f8fafc' }}>
                <button onClick={save} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#0f172a', color: 'white', padding: '10px 22px', borderRadius: 11, fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                  <Save style={{ width: 15, height: 15 }} />Guardar Configuración
                </button>
              </div>
            </>
          )}

        </div>
      </div>

      {/* Toast */}
      <div style={{
        position: 'fixed', bottom: 28, left: '50%', transform: `translateX(-50%) translateY(${saved ? 0 : 12}px)`,
        display: 'flex', alignItems: 'center', gap: 10, background: '#0f172a', color: 'white',
        padding: '12px 22px', borderRadius: 14, boxShadow: '0 8px 32px rgba(0,0,0,0.2)', zIndex: 200,
        opacity: saved ? 1 : 0, transition: 'all 0.3s', pointerEvents: saved ? 'auto' : 'none', fontSize: 14, fontWeight: 600,
      }}>
        <Check style={{ width: 15, height: 15, color: '#10b981' }} />
        Cambios guardados correctamente.
      </div>
    </div>
  );
}
