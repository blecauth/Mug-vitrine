// api/update.js - Para GitHub Pages + Vercel/Netlify
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    try {
        const { produtos, action } = req.body;
        
        // Aqui você integraria com GitHub API para atualizar o JSON
        // Ou salvaria em um serviço como Firebase, MongoDB, etc.
        
        console.log('📦 Dados recebidos:', produtos.length, 'produtos');
        
        // Simulação de sucesso
        res.status(200).json({ 
            success: true, 
            message: 'Produtos atualizados com sucesso',
            count: produtos.length 
        });
        
    } catch (error) {
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}
