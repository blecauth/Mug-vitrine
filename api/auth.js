// /api/auth.js - SERVERLESS FUNCTION
export default async function handler(req, res) {
    // Habilita CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Apenas POST permitido
    if (req.method !== 'POST') {
        return res.status(405).json({ 
            success: false, 
            error: 'Método não permitido' 
        });
    }

    try {
        const { username, password } = req.body;

        // Validação básica
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                error: 'Usuário e senha são obrigatórios'
            });
        }

        console.log('🔐 Tentativa de login para:', username);
        
        // 🔒 AQUI SIM - process.env FUNCIONA no Vercel!
        const validUsername = process.env.ADMIN_USERNAME;
        const validPassword = process.env.ADMIN_PASSWORD;

        // Debug seguro (não loga a senha real)
        console.log('Credenciais esperadas:', {
            username: validUsername,
            password: validPassword ? '***' : 'NÃO CONFIGURADA'
        });

        // Verifica credenciais
        if (username === validUsername && password === validPassword) {
            console.log('✅ Login autorizado para:', username);
            
            // Gera token seguro para o front-end
            const tokenData = {
                user: username,
                timestamp: Date.now(),
                expires: Date.now() + (24 * 60 * 60 * 1000) // 24 horas
            };
            
            const token = Buffer.from(JSON.stringify(tokenData)).toString('base64');
            
            return res.status(200).json({
                success: true,
                token: token,
                user: username
            });
        } else {
            console.log('❌ Login recusado para:', username);
            return res.status(401).json({
                success: false,
                error: 'Credenciais inválidas'
            });
        }

    } catch (error) {
        console.error('💥 Erro no servidor de auth:', error);
        return res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
}
