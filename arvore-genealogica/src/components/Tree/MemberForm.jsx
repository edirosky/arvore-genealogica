import { useState } from 'react'
import { FamilyService } from '../../services/family'

const MemberForm = ({ onSuccess, initialData = {} }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [form, setForm] = useState({
    name: initialData.name || '',
    birth_date: initialData.birth_date || '',
    death_date: initialData.death_date || '',
    gender: initialData.gender || '',
    father_id: initialData.father_id || '',
    mother_id: initialData.mother_id || '',
    spouse_id: initialData.spouse_id || '',
    notes: initialData.notes || '',
  })

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Preparar dados - converter strings vazias para null
      const dataToSend = { ...form }
      
      // Converter datas vazias para null
      if (dataToSend.birth_date === '') dataToSend.birth_date = null
      if (dataToSend.death_date === '') dataToSend.death_date = null
      
      // Converter UUIDs vazios para null
      if (dataToSend.father_id === '') dataToSend.father_id = null
      if (dataToSend.mother_id === '') dataToSend.mother_id = null
      if (dataToSend.spouse_id === '') dataToSend.spouse_id = null
      
      // Log para debug
      console.log('📤 Enviando dados:', dataToSend)
      
      let result
      
      if (initialData.id) {
        // Atualizar
        result = await FamilyService.updateMember(initialData.id, dataToSend)
      } else {
        // Criar novo
        result = await FamilyService.addMember(dataToSend)
      }
      
      if (result.error) throw result.error
      
      onSuccess()
    } catch (err) {
      setError(`Erro: ${err.message}`)
      console.error('❌ Erro no formulário:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '500px', margin: '0 auto' }}>
      <h3>{initialData.id ? 'Editar' : 'Adicionar'} Membro</h3>
      
      {error && (
        <div style={{ 
          background: '#fee2e2', 
          color: '#dc2626', 
          padding: '0.75rem',
          borderRadius: '0.375rem',
          marginBottom: '1rem'
        }}>
          {error}
        </div>
      )}
      
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
          Nome *
        </label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          style={{ 
            width: '100%', 
            padding: '0.5rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem'
          }}
        />
      </div>
      
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
          Gênero
        </label>
        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
          style={{ 
            width: '100%', 
            padding: '0.5rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem'
          }}
        >
          <option value="">Selecione</option>
          <option value="male">Masculino</option>
          <option value="female">Feminino</option>
          <option value="other">Outro</option>
        </select>
      </div>
      
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
          Data de Nascimento
        </label>
        <input
          type="date"
          name="birth_date"
          value={form.birth_date}
          onChange={handleChange}
          style={{ 
            width: '100%', 
            padding: '0.5rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem'
          }}
        />
      </div>
      
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
          Data de Falecimento (se aplicável)
        </label>
        <input
          type="date"
          name="death_date"
          value={form.death_date}
          onChange={handleChange}
          style={{ 
            width: '100%', 
            padding: '0.5rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem'
          }}
        />
      </div>
      
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
          Notas
        </label>
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          rows="3"
          style={{ 
            width: '100%', 
            padding: '0.5rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem'
          }}
        />
      </div>
      
      <button
        type="submit"
        disabled={loading}
        style={{
          padding: '0.75rem 1.5rem',
          background: loading ? '#9ca3af' : '#667eea',
          color: 'white',
          border: 'none',
          borderRadius: '0.375rem',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontWeight: '500',
          width: '100%'
        }}
      >
        {loading ? 'Salvando...' : initialData.id ? 'Atualizar' : 'Adicionar'}
      </button>
    </form>
  )
}

export default MemberForm
