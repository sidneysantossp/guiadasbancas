'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function SessionDebugPage() {
  const { data: session, status } = useSession();
  const [serverSession, setServerSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/debug/session-info')
      .then(res => res.json())
      .then(data => {
        setServerSession(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Erro:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace', fontSize: '12px' }}>
      <h1>🔍 Diagnóstico de Sessão</h1>
      
      <div style={{ marginTop: '20px', padding: '15px', background: '#f0f0f0', borderRadius: '5px' }}>
        <h2>📱 Cliente (useSession hook):</h2>
        <p><strong>Status:</strong> {status}</p>
        <pre>{JSON.stringify(session, null, 2)}</pre>
      </div>

      <div style={{ marginTop: '20px', padding: '15px', background: '#f0f0f0', borderRadius: '5px' }}>
        <h2>🖥️ Servidor (NextAuth auth()):</h2>
        {loading ? (
          <p>Carregando...</p>
        ) : (
          <pre>{JSON.stringify(serverSession, null, 2)}</pre>
        )}
      </div>

      <div style={{ marginTop: '20px', padding: '15px', background: serverSession?.authenticated ? '#d4edda' : '#f8d7da', borderRadius: '5px' }}>
        <h2>🎯 Diagnóstico:</h2>
        {status === 'authenticated' && serverSession?.authenticated ? (
          <p>✅ Sessão OK em cliente E servidor</p>
        ) : status === 'authenticated' && !serverSession?.authenticated ? (
          <p>🚨 Cliente tem sessão MAS servidor não reconhece (problema de cookie/JWT)</p>
        ) : !status === 'authenticated' && serverSession?.authenticated ? (
          <p>⚠️ Servidor tem sessão MAS cliente não (problema de hydration)</p>
        ) : (
          <p>❌ Sem sessão em cliente E servidor</p>
        )}
      </div>

      <div style={{ marginTop: '20px' }}>
        <h2>🔧 Ações:</h2>
        <button 
          onClick={() => {
            localStorage.clear();
            sessionStorage.clear();
            document.cookie.split(";").forEach(c => {
              document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
            });
            alert('✅ Cache limpo! Atualize a página.');
          }}
          style={{ padding: '10px 20px', marginRight: '10px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          Limpar Tudo
        </button>
        
        <button 
          onClick={() => window.location.href = '/jornaleiro'}
          style={{ padding: '10px 20px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          Ir para Login
        </button>
      </div>
    </div>
  );
}
