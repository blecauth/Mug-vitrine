// /src/dashboard.js - VERSÃO COMPLETA COM GITHUB INTEGRADO
class Dashboard {
    constructor() {
        this.productsKey = 'canecas_products';
        this.categoriesKey = 'canecas_categories';
        this.init();
    }

    init() {
        this.initializeProducts();
        this.loadStats();
        this.loadAllProducts();
        this.setupCategories();
    }

    // 🎯 INICIALIZA PRODUTOS PADRÃO
    initializeProducts() {
        const existingProducts = this.getProducts();
        if (existingProducts.length === 0) {
            const defaultProducts = this.getDefaultProducts();
            this.saveProducts(defaultProducts);
            console.log('📦 Produtos padrão inicializados:', defaultProducts.length);
        }
    }

    // 📦 PRODUTOS PADRÃO DO SEU SITE
    getDefaultProducts() {
        return [
            {
                id: "0001",
                nome: "Caneca Teste Floral",
                categoria: "floral",
                preco: 32.00,
                descricao: "Caneca de teste com design floral",
                imageUrl: "https://i.ibb.co/7x7ZbVKQ/IMG-20251022-WA0007.jpg",
                dataCriacao: new Date().toISOString(),
                origem: "site"
            },
            {
                id: "CN0001",
                nome: "Caneca Orgulho Negro", 
                categoria: "personalizada",
                preco: 30.00,
                descricao: "Caneca de cerâmica com estampa exclusiva",
                imageUrl: "https://i.ibb.co/0jVBTx2H/IMG-20251021-WA0001.jpg",
                dataCriacao: new Date().toISOString(),
                origem: "site"
            }
        ];
    }

    // 📊 CARREGA ESTATÍSTICAS
    loadStats() {
        const products = this.getProducts();
        const categories = [...new Set(products.map(p => p.categoria))];
        
        document.getElementById('totalProducts').textContent = products.length;
        document.getElementById('totalCategories').textContent = categories.length;
    }

    // 🎴 CARREGA TODOS OS PRODUTOS
    loadAllProducts() {
        const products = this.getProducts();
        this.displayAllProducts(products);
    }

    // 🎯 EXIBE PRODUTOS NA TELA
    displayAllProducts(products) {
        const productsList = document.getElementById('productsList');
        if (!productsList) return;

        if (products.length === 0) {
            productsList.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: #888;">
                    <p style="font-size: 1.2rem; margin-bottom: 1rem;">📦 Nenhum produto cadastrado</p>
                    <button onclick="showAddProductModal()" class="action-btn">
                        ➕ Adicionar Primeiro Produto
                    </button>
                </div>
            `;
            return;
        }

        productsList.innerHTML = `
            <div class="products-header">
                <h3>📦 Todos os Produtos (${products.length})</h3>
                <div class="products-actions">
                    <button onclick="showAddProductModal()" class="action-btn">
                        ➕ Novo Produto
                    </button>
                    <button onclick="exportAllProducts()" class="action-btn" style="background: #007bff;">
                        📤 Exportar Tudo
                    </button>
                </div>
            </div>
            <div class="products-grid">
                ${products.map(product => this.createProductCard(product)).join('')}
            </div>
        `;
    }

    // 🎴 CRIA CARD DO PRODUTO
    createProductCard(product) {
        return `
            <div class="product-card">
                <div class="product-image">
                    <img src="${product.imageUrl}" alt="${product.nome}" 
                         onerror="this.src='https://via.placeholder.com/300x200/1a1a1a/666666?text=Imagem'">
                    <div class="product-badge">
                        ${product.origem === 'site' ? '🌐 Site' : '💾 Local'}
                    </div>
                </div>
                
                <div class="product-content">
                    <div class="product-header">
                        <div>
                            <h3 class="product-title">${product.nome}</h3>
                            <div class="product-tags">
                                <span class="product-tag">ID: ${product.id}</span>
                                <span class="product-tag product-category">${product.categoria}</span>
                            </div>
                        </div>
                        <div class="product-price">R$ ${parseFloat(product.preco).toFixed(2)}</div>
                    </div>
                    
                    <p class="product-description">${product.descricao || 'Sem descrição'}</p>
                    
                    <div class="product-actions">
                        <button class="action-button edit" onclick="editProduct('${product.id}')">Editar</button>
                        <button class="action-button delete" onclick="deleteProduct('${product.id}')">Excluir</button>
                    </div>
                </div>
            </div>
        `;
    }

    // ⚙️ CONFIGURA CATEGORIAS
    setupCategories() {
        const defaultCategories = [
            'Brancas', 'Coloridas', 'Dia das Mães', 'Dia dos Pais',
            'Dia dos Professores', 'Pets', 'Heróis', 'Animes',
            'Com Foto', 'Futebol', 'Personalizadas', 'Promocionais'
        ];
        
        const currentCategories = this.getCategories();
        if (currentCategories.length === 0) {
            localStorage.setItem(this.categoriesKey, JSON.stringify(defaultCategories));
        }
    }

    // 💾 GETTERS E SETTERS
    getProducts() {
        try {
            return JSON.parse(localStorage.getItem(this.productsKey)) || [];
        } catch {
            return [];
        }
    }

    getCategories() {
        try {
            return JSON.parse(localStorage.getItem(this.categoriesKey)) || [];
        } catch {
            return [];
        }
    }

    saveProducts(products) {
        localStorage.setItem(this.productsKey, JSON.stringify(products));
        this.loadStats();
        this.loadAllProducts();
    }
}

// 🎯 INICIALIZA DASHBOARD
const dashboard = new Dashboard();

// =============================================
// 🔥 FUNÇÕES DE GESTÃO DE PRODUTOS + GITHUB
// =============================================

// 🔄 FUNÇÃO PARA INSERIR NO GITHUB
async function inserirNoGitHub(produto) {
    try {
        console.log('🚀 Iniciando inserção no GitHub...');
        
        // Gera o HTML do card
        const htmlCode = `
<div class="item" data-categoria="${produto.categoria}">
  <img src="${produto.imageUrl}" alt="${produto.nome}" loading="lazy">
  <div class="info">
    <h2>${produto.nome}</h2>
    <p>ID: ${produto.id}</p>
    <p>R$ ${parseFloat(produto.preco).toFixed(2)}</p>
    <button class="open-modal-btn"
      data-name="${produto.nome}"
      data-id="${produto.id}"
      data-image="${produto.imageUrl}"
      data-specs="${produto.descricao}"
      data-options='[{"model":"Padrão","price":${produto.preco},"image":"${produto.imageUrl}"}]'>
      Ver Detalhes
    </button>
  </div>
</div>`.trim();
        
        console.log('📝 Enviando para API GitHub...');
        
        const response = await fetch('/api/github-update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                htmlCode: htmlCode,
                commitMessage: `✨ Adicionar produto: ${produto.nome} (ID: ${produto.id})`
            })
        });

        const data = await response.json();
        console.log('📨 Resposta da API GitHub:', data);
        
        if (data.success) {
            return {
                success: true,
                message: `✅ Publicado no GitHub!`,
                commitUrl: data.commitUrl
            };
        } else {
            throw new Error(data.error || 'Erro desconhecido do GitHub');
        }
        
    } catch (error) {
        console.error('💥 Erro ao inserir no GitHub:', error);
        return {
            success: false,
            message: `❌ Erro no GitHub: ${error.message}`
        };
    }
}

// 🎪 MODAL DE ADIÇÃO/EDIÇÃO DE PRODUTOS
function showAddProductModal(product = null) {
    const isEdit = !!product;
    const modalHTML = `
        <div class="modal-overlay" id="productModal">
            <div class="modal-content">
                <h2 class="modal-title">${isEdit ? '✏️ Editar' : '➕ Adicionar'} Produto</h2>
                
                <form id="productForm">
                    <div class="form-group">
                        <label class="form-label">Nome do Produto</label>
                        <input type="text" class="form-input" id="productName" value="${product?.nome || ''}" required>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">ID do Produto</label>
                        <input type="text" class="form-input" id="productId" value="${product?.id || ''}" ${isEdit ? 'readonly' : ''} required>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Categoria</label>
                        <select class="form-select" id="productCategory" required>
                            <option value="">Selecione uma categoria</option>
                            ${dashboard.getCategories().map(cat => 
                                `<option value="${cat}" ${product?.categoria === cat ? 'selected' : ''}>${cat}</option>`
                            ).join('')}
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Preço (R$)</label>
                        <input type="number" class="form-input" id="productPrice" step="0.01" value="${product?.preco || ''}" required>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Descrição</label>
                        <textarea class="form-textarea" id="productDescription" rows="3">${product?.descricao || ''}</textarea>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">URL da Imagem</label>
                        <input type="url" class="form-input" id="productImage" value="${product?.imageUrl || ''}">
                    </div>
                    
                    <!-- 🔥 NOVA SEÇÃO: OPÇÃO GITHUB -->
                    ${!isEdit ? `
                    <div class="form-group">
                        <div style="background: rgba(37, 211, 102, 0.1); padding: 1rem; border-radius: 8px; border: 1px solid #25D366;">
                            <label style="display: flex; align-items: center; gap: 0.5rem; color: #25D366; font-weight: bold;">
                                <input type="checkbox" id="addToGitHub" checked style="transform: scale(1.2);">
                                <span>🌐 Publicar no Site (GitHub)</span>
                            </label>
                            <small style="color: #888; display: block; margin-top: 0.5rem; line-height: 1.4;">
                                ✅ O produto será adicionado automaticamente ao site principal<br>
                                ✅ Atualização instantânea para todos os visitantes<br>
                                ✅ Commit automático no GitHub + Deploy no Vercel
                            </small>
                        </div>
                    </div>
                    ` : `
                    <div class="form-group">
                        <div style="background: rgba(255, 193, 7, 0.1); padding: 1rem; border-radius: 8px; border: 1px solid #ffc107;">
                            <p style="color: #ffc107; margin: 0; font-size: 0.9rem;">
                                ⚡ Edições são salvas apenas no dashboard<br>
                                Para atualizar o site, exclua e adicione novamente com "Publicar no Site"
                            </p>
                        </div>
                    </div>
                    `}
                    
                    <div class="form-buttons">
                        <button type="button" class="btn btn-cancel" onclick="closeProductModal()">Cancelar</button>
                        <button type="submit" class="btn btn-primary" id="submitBtn">
                            ${isEdit ? '💾 Salvar Alterações' : '🚀 Adicionar Produto'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // 🔥 ADICIONE ESTE EVENT LISTENER para o formulário
    const form = document.getElementById('productForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        handleProductSubmit(e, product?.id || null);
    });
}

// 🔄 FUNÇÃO DE SUBMIT DO FORMULÁRIO
async function handleProductSubmit(event, productId = null) {
    event.preventDefault();
    
    const submitBtn = document.getElementById('submitBtn');
    const originalText = submitBtn.textContent;
    
    try {
        // Mostra loading no botão
        submitBtn.disabled = true;
        submitBtn.textContent = '⏳ Processando...';
        
        // Coleta os dados do formulário
        const productData = {
            nome: document.getElementById('productName').value.trim(),
            id: document.getElementById('productId').value.trim(),
            categoria: document.getElementById('productCategory').value,
            preco: parseFloat(document.getElementById('productPrice').value),
            descricao: document.getElementById('productDescription').value.trim(),
            imageUrl: document.getElementById('productImage').value.trim(),
            dataAtualizacao: new Date().toISOString(),
            origem: "dashboard"
        };
        
        // Validação básica
        if (!productData.nome || !productData.id || !productData.categoria || isNaN(productData.preco)) {
            throw new Error('Preencha todos os campos obrigatórios corretamente');
        }
        
        const addToGitHub = document.getElementById('addToGitHub')?.checked || false;
        const products = dashboard.getProducts();
        
        if (productId) {
            // 🔄 EDITAR PRODUTO EXISTENTE
            const index = products.findIndex(p => p.id === productId);
            if (index !== -1) {
                products[index] = { 
                    ...products[index], 
                    ...productData,
                    // Mantém a data de criação original
                    dataCriacao: products[index].dataCriacao 
                };
            }
            
            dashboard.saveProducts(products);
            closeProductModal();
            alert('✅ Produto atualizado no dashboard com sucesso!');
            
        } else {
            // ➕ ADICIONAR NOVO PRODUTO
            productData.dataCriacao = new Date().toISOString();
            productData.views = 0;
            
            let githubResult = null;
            
            // 🔥 SE MARCADO, INSERE NO GITHUB PRIMEIRO
            if (addToGitHub) {
                submitBtn.textContent = '🌐 Conectando com GitHub...';
                githubResult = await inserirNoGitHub(productData);
                
                if (!githubResult.success) {
                    throw new Error(githubResult.message);
                }
            }
            
            // Salva no dashboard (localStorage)
            products.push(productData);
            dashboard.saveProducts(products);
            closeProductModal();
            
            // 🔥 MENSAGEM DE SUCESSO PERSONALIZADA
            if (addToGitHub && githubResult) {
                const userChoice = confirm(
                    `🎉 PRODUTO ADICIONADO COM SUCESSO!\n\n` +
                    `✅ "${productData.nome}" adicionado ao dashboard\n` +
                    `✅ Publicado no site (GitHub)\n` +
                    `⏱️ Site atualizando... (1-2 minutos)\n\n` +
                    `Deseja abrir o commit no GitHub?`
                );
                
                if (userChoice && githubResult.commitUrl) {
                    window.open(githubResult.commitUrl, '_blank');
                }
            } else {
                alert(`✅ Produto "${productData.nome}" adicionado ao dashboard!`);
            }
        }
        
    } catch (error) {
        console.error('❌ Erro no submit:', error);
        alert(error.message || 'Erro ao processar o produto');
    } finally {
        // Restaura o botão
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}

// =============================================
// 🔧 FUNÇÕES AUXILIARES
// =============================================

function closeProductModal() {
    const modal = document.getElementById('productModal');
    if (modal) modal.remove();
}

function editProduct(productId) {
    const products = dashboard.getProducts();
    const product = products.find(p => p.id === productId);
    if (product) {
        showAddProductModal(product);
    }
}

function deleteProduct(productId) {
    if (confirm('⚠️ Tem certeza que deseja excluir este produto?\nEsta ação não pode ser desfeita.')) {
        const products = dashboard.getProducts();
        const updatedProducts = products.filter(p => p.id !== productId);
        dashboard.saveProducts(updatedProducts);
        alert('✅ Produto excluído com sucesso!');
    }
}

function viewProductDetails(productId) {
    const products = dashboard.getProducts();
    const product = products.find(p => p.id === productId);
    
    if (product) {
        alert(`🔍 ${product.nome}\n\n📋 ID: ${product.id}\n🏷️ Categoria: ${product.categoria}\n💰 Preço: R$ ${product.preco}\n👀 Visualizações: ${product.views || 0}\n\n${product.descricao || 'Sem descrição'}`);
    }
}

function previewOnSite(productId) {
    alert('🌐 Preview do produto\n\nEsta funcionalidade abrirá uma visualização do produto no estilo do site.');
}

function exportAllProducts() {
    const products = dashboard.getProducts();
    const exportData = {
        produtos: products,
        total: products.length,
        dataExportacao: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `produtos_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    alert(`📤 Exportado ${products.length} produtos!`);
}

// 🎯 FUNÇÕES DO DASHBOARD
function adicionarProduto() { showAddProductModal(); }
function gerenciarCategorias() { alert('🎯 Gerenciar Categorias - Em desenvolvimento'); }
function verEstatisticas() { 
    const products = dashboard.getProducts();
    alert(`📊 Estatísticas:\n\n• Produtos: ${products.length}\n• Categorias: ${[...new Set(products.map(p => p.categoria))].length}`);
}
function backupDados() { exportAllProducts(); }
function logout() { 
    localStorage.removeItem('admin_token_canecas');
    window.location.href = 'login.html';
}

// Atualiza estatísticas periodicamente
setInterval(() => {
    dashboard.loadStats();
}, 30000);
