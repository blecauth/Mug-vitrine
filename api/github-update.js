// /api/github-update.js
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
    const { htmlCode, commitMessage = 'Adicionar novo produto' } = req.body;

    if (!htmlCode) {
      return res.status(400).json({ success: false, error: 'Código HTML é obrigatório' });
    }

    // 🔐 Configurações do GitHub (Environment Variables)
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const REPO_OWNER = process.env.GITHUB_OWNER || 'seu-usuario';
    const REPO_NAME = process.env.GITHUB_REPO || 'seu-repositorio';
    const FILE_PATH = 'index.html';

    if (!GITHUB_TOKEN) {
      return res.status(500).json({ success: false, error: 'Token do GitHub não configurado' });
    }

    console.log('🔄 Atualizando GitHub...');

    // 1. Busca o arquivo atual
    const fileResponse = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`,
      {
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    );

    if (!fileResponse.ok) {
      throw new Error(`Erro ao buscar arquivo: ${fileResponse.status}`);
    }

    const fileData = await fileResponse.json();
    const currentContent = Buffer.from(fileData.content, 'base64').toString('utf8');

    // 2. Insere o novo card na galeria
    const galeriaStart = currentContent.indexOf('<section class="galeria">');
    if (galeriaStart === -1) {
      return res.status(400).json({ success: false, error: 'Seção galeria não encontrada' });
    }

    const insertPosition = currentContent.indexOf('>', galeriaStart) + 1;
    const newContent = 
      currentContent.slice(0, insertPosition) + 
      '\n    ' + htmlCode.trim() + '\n    ' + 
      currentContent.slice(insertPosition);

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

    if (!updateResponse.ok) {
      const errorData = await updateResponse.json();
      throw new Error(`Erro ao atualizar: ${JSON.stringify(errorData)}`);
    }

    console.log('✅ GitHub atualizado com sucesso!');
    return res.status(200).json({ 
      success: true, 
      message: 'Produto adicionado ao site com sucesso!',
      commitUrl: `https://github.com/${REPO_OWNER}/${REPO_NAME}/commit/main`
    });

  } catch (error) {
    console.error('💥 Erro na atualização do GitHub:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message || 'Erro interno do servidor' 
    });
  }
}
