import { useState, useEffect } from 'react'
import { FamilyService } from '../../services/family'

const MemberList = ({ onEdit, onDelete }) => {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadMembers = async () => {
    try {
      setLoading(true)
      const { data, error } = await FamilyService.getMembers()
      
      if (error) throw error
      
      setMembers(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMembers()
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este membro?')) return
    
    try {
      const { error } = await FamilyService.deleteMember(id)
      if (error) throw error
      
      loadMembers() // Recarregar lista
    } catch (err) {
      alert('Erro ao excluir: ' + err.message)
    }
  }

  if (loading) return <div>Carregando membros...</div>
  if (error) return <div style={{ color: 'red' }}>Erro: {error}</div>

  return (
    <div>
      <h3>Membros da Família ({members.length})</h3>
      
      {members.length === 0 ? (
        <p>Nenhum membro cadastrado ainda.</p>
      ) : (
        <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
          {members.map(member => (
            <div
              key={member.id}
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: '0.5rem',
                padding: '1rem',
                background: 'white'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <h4 style={{ margin: 0 }}>{member.name}</h4>
                  <p style={{ margin: '0.5rem 0 0 0', color: '#64748b' }}>
                    {member.gender && (
                      <span style={{ marginRight: '1rem' }}>
                        {member.gender === 'male' ? '♂' : member.gender === 'female' ? '♀' : '⚧'}
                      </span>
                    )}
                    {member.birth_date && (
                      <span>Nascimento: {new Date(member.birth_date).toLocaleDateString('pt-BR')}</span>
                    )}
                  </p>
                  {member.notes && (
                    <p style={{ marginTop: '0.5rem' }}>{member.notes}</p>
                  )}
                </div>
                
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => onEdit(member)}
                    style={{
                      padding: '0.25rem 0.5rem',
                      background: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.25rem',
                      cursor: 'pointer'
                    }}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(member.id)}
                    style={{
                      padding: '0.25rem 0.5rem',
                      background: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.25rem',
                      cursor: 'pointer'
                    }}
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MemberList
