// /api/github-delete-product.js
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
    return res.status(405).json({ success: false, error: 'Método não permitido' });
  }

  try {
    const { productHtml, commitMessage = 'Excluir produto' } = req.body;

    if (!productHtml) {
      return res.status(400).json({ success: false, error: 'HTML do produto é obrigatório' });
    }

    // 🔐 Configurações do GitHub
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const REPO_OWNER = process.env.GITHUB_OWNER;
    const REPO_NAME = process.env.GITHUB_REPO;
    const FILE_PATH = 'index.html';

    if (!GITHUB_TOKEN || !REPO_OWNER || !REPO_NAME) {
      return res.status(500).json({ 
        success: false, 
        error: 'Configuração do GitHub não encontrada' 
      });
    }

    console.log('🗑️ Excluindo produto do GitHub...');

    // 1. Busca o arquivo atual
    const fileResponse = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`,
      {
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Canecas-App'
        }
      }
    );

    if (!fileResponse.ok) {
      throw new Error(`Erro ao buscar arquivo: ${fileResponse.status}`);
    }

    const fileData = await fileResponse.json();
    let currentContent = Buffer.from(fileData.content, 'base64').toString('utf8');

    // 2. Remove o HTML do produto
    if (!currentContent.includes(productHtml)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Produto não encontrado no arquivo' 
      });
    }

    // Remove o produto e linhas em branco extras
    const newContent = currentContent.replace(productHtml, '').replace(/\n\s*\n\s*\n/g, '\n\n');

    // 3. Faz commit das alterações
    const updateResponse = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: commitMessage,
          content: Buffer.from(newContent).toString('base64'),
          sha: fileData.sha,
          branch: 'main'
        })
      }
    );

    const updateData = await updateResponse.json();

    if (!updateResponse.ok) {
      throw new Error(`Erro ao excluir: ${updateData.message}`);
    }

    console.log('✅ Produto excluído do GitHub!');
    return res.status(200).json({ 
      success: true, 
      message: 'Produto excluído com sucesso!',
      commitUrl: updateData.commit.html_url
    });

  } catch (error) {
    console.error('💥 Erro ao excluir do GitHub:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message || 'Erro interno do servidor' 
    });
  }
}
