const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://seu-id.supabase.co'
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'sua-chave'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  console.log('Testando conexão com Supabase...')
  
  // Testar autenticação
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'teste@exemplo.com',
    password: 'senha123'
  })
  
  if (error) {
    console.log('Erro na autenticação:', error.message)
    
    // Tentar cadastrar
    const { data: signupData, error: signupError } = await supabase.auth.signUp({
      email: 'teste@exemplo.com',
      password: 'senha123'
    })
    
    if (signupError) {
      console.log('Erro no cadastro:', signupError.message)
    } else {
      console.log('Cadastro realizado:', signupData.user?.email)
    }
  } else {
    console.log('Login realizado:', data.user.email)
  }
}

testConnection()
