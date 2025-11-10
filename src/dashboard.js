// /src/dashboard.js - VERSÃO LIMPA E ESTÁVEL
class Dashboard {
    constructor() {
        this.productsKey = 'canecas_products';
        this.categoriesKey = 'canecas_categories';
        this.init();
    }

    init() {
        this.initializeDefaultProducts();
        this.loadStats();
        this.loadAllProducts();
        this.setupCategories();
    }

    // 🎯 INICIALIZA PRODUTOS PADRÃO
    initializeDefaultProducts() {
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
                nome: "Caneca teste",
                categoria: "floral",
                preco: 32.00,
                descricao: "Caneca de teste com design floral",
                imageUrl: "https://i.ibb.co/7x7ZbVKQ/IMG-20251022-WA0007.jpg",
                specs: "Gege",
                options: [
                    {"model": "Branca", "price": 32.00, "image": "https://i.ibb.co/7x7ZbVKQ/IMG-20251022-WA0007.jpg"},
                    {"model": "Preta", "price": 25.00, "image": "https://i.ibb.co/0jVBTx2H/IMG-20251021-WA0001.jpg"}
                ],
                dataCriacao: new Date().toISOString(),
                origem: "site",
                views: 0
            },
            {
                id: "Cn0001", 
                nome: "Caneca teste",
                categoria: "floral",
                preco: 40.00,
                descricao: "Caneca teste preta",
                imageUrl: "https://i.ibb.co/0jVBTx2H/IMG-20251021-WA0001.jpg",
                specs: "Nznxn",
                options: [
                    {"model": "Branca", "price": 40.00, "image": "https://i.ibb.co/0jVBTx2H/IMG-20251021-WA0001.jpg"},
                    {"model": "Preta", "price": 42.00, "image": "https://i.ibb.co/N6c4DxfJ/IMG-20251021-WA0000.jpg"}
                ],
                dataCriacao: new Date().toISOString(),
                origem: "site",
                views: 0
            },
            {
                id: "CN0001",
                nome: "Caneca Orgulho Negro", 
                categoria: "personalizada",
                preco: 30.00,
                descricao: "Caneca de cerâmica com estampa exclusiva",
                imageUrl: "https://i.ibb.co/0jVBTx2H/IMG-20251021-WA0001.jpg",
                specs: "Caneca de cerâmica com estampa exclusiva.",
                options: [
                    {"model": "Branca", "price": 30.00, "image": "https://i.ibb.co/0jVBTx2H/IMG-20251021-WA0001.jpg"},
                    {"model": "Preta", "price": 32.00, "image": "https://i.ibb.co/PjX9108/IMG-20251021-WA0002.jpg"}
                ],
                dataCriacao: new Date().toISOString(),
                origem: "site", 
                views: 0
            }
        ];
    }

    // 📊 CARREGA ESTATÍSTICAS
    loadStats() {
        const products = this.getProducts();
        const categories = [...new Set(products.map(p => p.categoria))];
        
        const totalProducts = document.getElementById('totalProducts');
        const totalCategories = document.getElementById('totalCategories');
        
        if (totalProducts) totalProducts.textContent = products.length;
        if (totalCategories) totalCategories.textContent = categories.length;
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
        const options = product.options || [{ model: "Padrão", price: product.preco }];
        
        return `
            <div class="product-card">
                <div class="product-image">
                    <img src="${product.imageUrl}" alt="${product.nome}" 
                         onerror="this.src='https://via.placeholder.com/300x200/1a1a1a/666666?text=Imagem+Não+Encontrada'">
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
                        <div>
                            <div class="product-price">R$ ${parseFloat(product.preco).toFixed(2)}</div>
                            <div class="product-views">${product.views || 0} visualizações</div>
                        </div>
                    </div>
                    
                    <p class="product-description">${product.descricao || product.specs || 'Sem descrição'}</p>
                    
                    <div class="product-models">
                        <h4 class="models-title">Modelos disponíveis:</h4>
                        <div class="models-list">
                            ${options.map(opt => `
                                <span class="model-tag">${opt.model} - R$ ${parseFloat(opt.price).toFixed(2)}</span>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="product-actions">
                        <button class="action-button edit" onclick="editProduct('${product.id}')">✏️ Editar</button>
                        <button class="action-button details" onclick="viewProductDetails('${product.id}')">👁️ Detalhes</button>
                        <button class="action-button preview" onclick="previewOnSite('${product.id}')">🌐 Preview</button>
                        <button class="action-button delete" onclick="deleteProduct('${product.id}')">🗑️ Excluir</button>
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

// 🔧 FUNÇÕES GLOBAIS
function showAddProductModal(product = null) {
    const isEdit = !!product;
    
    const modalHTML = `
        <div class="modal-overlay" id="productModal">
            <div class="modal-content">
                <h2 class="modal-title">${isEdit ? '✏️ Editar' : '➕ Adicionar'} Produto</h2>
                
                <form id="productForm" onsubmit="handleProductSubmit(event, ${isEdit ? `'${product.id}'` : 'null'})">
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
                    
                    <div class="form-buttons">
                        <button type="button" class="btn btn-cancel" onclick="closeProductModal()">Cancelar</button>
                        <button type="submit" class="btn btn-primary">${isEdit ? '💾 Salvar' : '➕ Adicionar'}</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function closeProductModal() {
    const modal = document.getElementById('productModal');
    if (modal) modal.remove();
}

function handleProductSubmit(event, productId = null) {
    event.preventDefault();
    
    const productData = {
        nome: document.getElementById('productName').value,
        id: document.getElementById('productId').value,
        categoria: document.getElementById('productCategory').value,
        preco: parseFloat(document.getElementById('productPrice').value),
        descricao: document.getElementById('productDescription').value,
        imageUrl: document.getElementById('productImage').value,
        dataAtualizacao: new Date().toISOString(),
        origem: "local"
    };
    
    const products = dashboard.getProducts();
    
    if (productId) {
        const index = products.findIndex(p => p.id === productId);
        if (index !== -1) {
            products[index] = { ...products[index], ...productData };
        }
    } else {
        productData.dataCriacao = new Date().toISOString();
        productData.views = 0;
        products.push(productData);
    }
    
    dashboard.saveProducts(products);
    closeProductModal();
    alert(`✅ Produto ${productId ? 'atualizado' : 'adicionado'} com sucesso!`);
}

function editProduct(productId) {
    const products = dashboard.getProducts();
    const product = products.find(p => p.id === productId);
    if (product) showAddProductModal(product);
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
