import { supabase } from './supabase'

export const FamilyService = {
  // Adicionar um novo membro
  async addMember(memberData) {
    console.log('📤 Enviando dados para adicionar membro:', memberData)
    
    const { data: user, error: userError } = await supabase.auth.getUser()
    
    if (userError) {
      console.error('❌ Erro ao obter usuário:', userError)
      return { data: null, error: userError }
    }
    
    console.log('👤 ID do usuário:', user.user.id)
    
    // Remover campos vazios que deveriam ser null
    const cleanData = { ...memberData }
    
    // Remover campos vazios que são UUIDs
    if (cleanData.father_id === '') delete cleanData.father_id
    if (cleanData.mother_id === '') delete cleanData.mother_id
    if (cleanData.spouse_id === '') delete cleanData.spouse_id
    
    // Remover campos vazios de texto
    if (cleanData.notes === '') delete cleanData.notes
    
    console.log('🧹 Dados limpos:', cleanData)
    
    const { data, error } = await supabase
      .from('family_members')
      .insert([{
        ...cleanData,
        user_id: user.user.id
      }])
      .select()
    
    if (error) {
      console.error('❌ Erro do Supabase ao adicionar:', error)
    } else {
      console.log('✅ Membro adicionado com sucesso:', data)
    }
    
    return { data, error }
  },

  // Buscar todos os membros do usuário atual
  async getMembers() {
    const { data: user, error: userError } = await supabase.auth.getUser()
    
    if (userError) {
      return { data: null, error: userError }
    }
    
    const { data, error } = await supabase
      .from('family_members')
      .select('*')
      .eq('user_id', user.user.id)
      .order('created_at', { ascending: true })
    
    return { data, error }
  },

  // Atualizar um membro
  async updateMember(id, updates) {
    console.log('📤 Atualizando membro', id, 'com dados:', updates)
    
    // Limpar dados
    const cleanUpdates = { ...updates }
    if (cleanUpdates.father_id === '') delete cleanUpdates.father_id
    if (cleanUpdates.mother_id === '') delete cleanUpdates.mother_id
    if (cleanUpdates.spouse_id === '') delete cleanUpdates.spouse_id
    if (cleanUpdates.notes === '') delete cleanUpdates.notes
    
    const { data, error } = await supabase
      .from('family_members')
      .update(cleanUpdates)
      .eq('id', id)
      .select()
    
    if (error) {
      console.error('❌ Erro ao atualizar:', error)
    } else {
      console.log('✅ Membro atualizado:', data)
    }
    
    return { data, error }
  },

  // Excluir um membro
  async deleteMember(id) {
    const { error } = await supabase
      .from('family_members')
      .delete()
      .eq('id', id)
    
    return { error }
  },

  // Upload de foto
  async uploadPhoto(file) {
    const { data: user } = await supabase.auth.getUser()
    const fileName = `${user.user.id}/${Date.now()}-${file.name}`
    
    const { data, error } = await supabase.storage
      .from('family-photos')
      .upload(fileName, file)
    
    if (error) return { error }
    
    // Obter URL pública
    const { data: urlData } = supabase.storage
      .from('family-photos')
      .getPublicUrl(fileName)
    
    return { url: urlData.publicUrl, error: null }
  }
}
