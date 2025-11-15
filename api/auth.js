// api/auth.js
export default async function handler(req, res) {
  // Habilita CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Método não permitido' 
    });
  }

  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: 'Usuário e senha são obrigatórios'
      });
    }

    // Environment variables do Vercel
    const validUsername = process.env.ADMIN_USERNAME;
    const validPassword = process.env.ADMIN_PASSWORD;

    console.log('🔐 Tentativa de login para:', username);

    // Se não configurado no Vercel, usa fallback
    if (!validUsername || !validPassword) {
      console.log('🛠️ Usando fallback - env vars não configuradas');
      // Fallback para desenvolvimento
      if (username === 'admin' && password === 'admin123') {
        return res.status(200).json({
          success: true,
          message: 'Login autorizado (fallback)'
        });
      }
    } else {
      // Verifica com environment variables
      if (username === validUsername && password === validPassword) {
        console.log('✅ Login autorizado via env vars');
        return res.status(200).json({
          success: true,
          message: 'Login autorizado'
        });
      }
    }

    console.log('❌ Login recusado para:', username);
    return res.status(401).json({
      success: false,
      error: 'Credenciais inválidas'
    });

  } catch (error) {
    console.error('💥 Erro no servidor de auth:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
}
