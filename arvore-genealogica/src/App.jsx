import { useState, useEffect } from 'react'
import { supabase } from './services/supabase'
import MemberForm from './components/Tree/MemberForm'
import MemberList from './components/Tree/MemberList'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingMember, setEditingMember] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const handleFormSuccess = () => {
    setShowForm(false)
    setEditingMember(null)
  }

  const handleEditMember = (member) => {
    setEditingMember(member)
    setShowForm(true)
  }

  if (loading) {
    return <div className="loading">Carregando...</div>
  }

  return (
    <div className="App">
      {!user ? (
        <div className="auth-page">
          <div className="auth-card">
            <h1 className="auth-title">🌳 Minha Árvore Genealógica</h1>
            <p className="auth-subtitle">
              Sistema gratuito para criar sua árvore genealógica
            </p>
            
            <button
              className="auth-button"
              onClick={async () => {
                const randomEmail = `teste_${Date.now()}@exemplo.com`
                const { data, error } = await supabase.auth.signInWithPassword({
                  email: randomEmail,
                  password: 'senha123'
                })
                
                if (error) {
                  await supabase.auth.signUp({
                    email: randomEmail,
                    password: 'senha123'
                  })
                }
              }}
            >
              Criar Nova Conta de Teste
            </button>
            
            <p className="auth-note">
              Um email aleatório será gerado para você
            </p>
          </div>
        </div>
      ) : (
        <div style={{ padding: '1rem', maxWidth: '1200px', margin: '0 auto' }}>
          {/* Header */}
          <div className="dashboard-header">
            <div>
              <h2 style={{ color: '#334155', marginBottom: '0.25rem' }}>
                🌳 Minha Árvore Genealógica
              </h2>
              <small style={{ color: '#64748b' }}>
                Logado como: {user.email}
              </small>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => setShowForm(true)}
                style={{
                  padding: '0.5rem 1rem',
                  background: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: 'pointer'
                }}
              >
                + Adicionar Membro
              </button>
              <button
                className="logout-button"
                onClick={() => supabase.auth.signOut()}
              >
                Sair
              </button>
            </div>
          </div>

          {/* Formulário (modal) */}
          {showForm && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000
            }}>
              <div style={{
                background: 'white',
                borderRadius: '0.5rem',
                padding: '2rem',
                maxWidth: '600px',
                width: '90%',
                maxHeight: '90vh',
                overflow: 'auto'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <h3 style={{ margin: 0 }}>
                    {editingMember ? 'Editar Membro' : 'Adicionar Novo Membro'}
                  </h3>
                  <button
                    onClick={() => {
                      setShowForm(false)
                      setEditingMember(null)
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '1.5rem',
                      cursor: 'pointer',
                      color: '#64748b'
                    }}
                  >
                    ×
                  </button>
                </div>
                
                <MemberForm
                  initialData={editingMember || {}}
                  onSuccess={handleFormSuccess}
                />
              </div>
            </div>
          )}

          {/* Conteúdo principal */}
          <div className="dashboard-content">
            <MemberList
              onEdit={handleEditMember}
              onDelete={() => {}} // Já tratado no componente
            />
            
            <div className="tree-placeholder" style={{ marginTop: '2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌳</div>
              <h4>Visualização da Árvore (em breve)</h4>
              <p>Aqui aparecerá a visualização gráfica da sua árvore genealógica</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
