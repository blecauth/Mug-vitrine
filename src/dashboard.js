// DASHBOARD SIMPLES E FUNCIONAL
class Dashboard {
    constructor() {
        this.productsKey = 'canecas_products';
        this.init();
    }

    init() {
        this.loadStats();
        this.loadProducts();
    }

    loadStats() {
        const products = this.getProducts();
        const categories = [...new Set(products.map(p => p.categoria))];
        
        document.getElementById('totalProducts').textContent = products.length;
        document.getElementById('totalCategories').textContent = categories.length;
    }

    loadProducts() {
        const products = this.getProducts();
        this.displayProducts(products);
    }

    displayProducts(products) {
        const container = document.getElementById('productsList');
        
        if (products.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: #888;">
                    <p style="margin-bottom: 1rem;">📦 Nenhum produto cadastrado</p>
                    <button class="action-btn" onclick="adicionarProduto()">
                        ➕ Adicionar Primeiro Produto
                    </button>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div class="products-header">
                <h3>📦 Todos os Produtos (${products.length})</h3>
                <div class="products-actions">
                    <button class="action-btn" onclick="adicionarProduto()">➕ Novo Produto</button>
                    <button class="action-btn" style="background: #007bff;" onclick="exportAllProducts()">📤 Exportar</button>
                </div>
            </div>
            <div class="products-grid">
                ${products.map(product => this.createProductCard(product)).join('')}
            </div>
        `;
    }

    createProductCard(product) {
        return `
            <div class="product-card">
                <div class="product-image">
                    <img src="${product.imageUrl}" alt="${product.nome}" 
                         onerror="this.src='https://via.placeholder.com/300x200/1a1a1a/666666?text=Imagem'">
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

    getProducts() {
        try {
            const products = JSON.parse(localStorage.getItem(this.productsKey)) || [];
            // Se não há produtos, cria alguns exemplos
            if (products.length === 0) {
                const defaultProducts = [
                    {
                        id: "0001",
                        nome: "Caneca Teste",
                        categoria: "Geral",
                        preco: 32.00,
                        descricao: "Caneca de exemplo",
                        imageUrl: "https://i.ibb.co/7x7ZbVKQ/IMG-20251022-WA0007.jpg"
                    }
                ];
                this.saveProducts(defaultProducts);
                return defaultProducts;
            }
            return products;
        } catch {
            return [];
        }
    }

    saveProducts(products) {
        localStorage.setItem(this.productsKey, JSON.stringify(products));
        this.loadStats();
        this.loadProducts();
    }
}

// Inicializa o dashboard
const dashboard = new Dashboard();

// Funções globais
function adicionarProduto() {
    const nome = prompt('Nome do produto:');
    if (!nome) return;
    
    const id = prompt('ID do produto:');
    if (!id) return;
    
    const categoria = prompt('Categoria:') || 'Geral';
    const preco = parseFloat(prompt('Preço:') || '0');
    const descricao = prompt('Descrição:') || '';
    const imageUrl = prompt('URL da imagem:') || '';
    
    const products = dashboard.getProducts();
    products.push({
        id,
        nome,
        categoria,
        preco,
        descricao,
        imageUrl,
        dataCriacao: new Date().toISOString()
    });
    
    dashboard.saveProducts(products);
    alert('✅ Produto adicionado!');
}

function editProduct(productId) {
    const products = dashboard.getProducts();
    const product = products.find(p => p.id === productId);
    
    if (product) {
        const novoNome = prompt('Novo nome:', product.nome);
        if (!novoNome) return;
        
        const novaCategoria = prompt('Nova categoria:', product.categoria) || product.categoria;
        const novoPreco = parseFloat(prompt('Novo preço:', product.preco) || product.preco);
        const novaDescricao = prompt('Nova descrição:', product.descricao) || product.descricao;
        const novaImagem = prompt('Nova URL da imagem:', product.imageUrl) || product.imageUrl;
        
        product.nome = novoNome;
        product.categoria = novaCategoria;
        product.preco = novoPreco;
        product.descricao = novaDescricao;
        product.imageUrl = novaImagem;
        
        dashboard.saveProducts(products);
        alert('✅ Produto atualizado!');
    }
}

function deleteProduct(productId) {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
        const products = dashboard.getProducts();
        const novosProdutos = products.filter(p => p.id !== productId);
        dashboard.saveProducts(novosProdutos);
        alert('✅ Produto excluído!');
    }
}

function gerenciarCategorias() {
    alert('📂 Gerenciar Categorias\n\nEm breve...');
}

function verEstatisticas() {
    const products = dashboard.getProducts();
    alert(`📊 Estatísticas:\n\n• Produtos: ${products.length}\n• Categorias: ${[...new Set(products.map(p => p.categoria))].length}`);
}

function backupDados() {
    const products = dashboard.getProducts();
    const data = JSON.stringify(products, null, 2);
    const blob = new Blob([data], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'produtos_backup.json';
    a.click();
    alert('💾 Backup realizado!');
}

function exportAllProducts() {
    backupDados();
}

function logout() {
    localStorage.removeItem('admin_token_canecas');
    window.location.href = 'login.html';
}
