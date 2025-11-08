// Sistema do Dashboard - Versão Segura
class Dashboard {
    constructor() {
        this.productsKey = 'canecas_products';
        this.statsKey = 'canecas_stats';
        this.init();
    }

    init() {
        this.loadStats();
        this.loadProducts();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Atualiza stats quando visibility change (volta para a página)
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.loadStats();
            }
        });
    }

    // Carrega estatísticas
    loadStats() {
        const products = this.getProducts();
        const categories = new Set(products.map(p => p.categoria));
        const stats = this.getStats();
        
        document.getElementById('totalProducts').textContent = products.length;
        document.getElementById('totalCategories').textContent = categories.size;
        document.getElementById('totalViews').textContent = stats.totalViews || 0;
    }

    // Carrega lista de produtos
    loadProducts() {
        const products = this.getProducts();
        const productsList = document.getElementById('productsList');
        
        if (products.length === 0) {
            productsList.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: #888;">
                    <p>📦 Nenhum produto cadastrado</p>
                    <button onclick="adicionarProduto()" class="action-btn" style="margin-top: 1rem;">
                        ➕ Adicionar Primeiro Produto
                    </button>
                </div>
            `;
            return;
        }

        productsList.innerHTML = products.map(product => `
            <div class="product-item" style="background: #1a1a1a; border: 1px solid #333; padding: 1.5rem; margin: 1rem 0; border-radius: 10px;">
                <div style="display: flex; justify-content: between; align-items: start;">
                    <div style="flex: 1;">
                        <h3 style="color: #25D366; margin-bottom: 0.5rem;">${product.nome}</h3>
                        <p><strong>ID:</strong> ${product.id} | <strong>Categoria:</strong> ${product.categoria}</p>
                        <p><strong>Preço:</strong> R$ ${parseFloat(product.preco).toFixed(2)}</p>
                        <p><strong>Visualizações:</strong> ${product.views || 0}</p>
                    </div>
                    <div style="display: flex; gap: 0.5rem;">
                        <button onclick="editarProduto('${product.id}')" style="background: #25D366; color: white; border: none; padding: 0.5rem 1rem; border-radius: 5px; cursor: pointer;">
                            ✏️ Editar
                        </button>
                        <button onclick="excluirProduto('${product.id}')" style="background: #ff4444; color: white; border: none; padding: 0.5rem 1rem; border-radius: 5px; cursor: pointer;">
                            🗑️ Excluir
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Obtém produtos do localStorage
    getProducts() {
        try {
            return JSON.parse(localStorage.getItem(this.productsKey)) || [];
        } catch {
            return [];
        }
    }

    // Obtém estatísticas
    getStats() {
        try {
            return JSON.parse(localStorage.getItem(this.statsKey)) || { totalViews: 0 };
        } catch {
            return { totalViews: 0 };
        }
    }

    // Salva produtos no localStorage
    saveProducts(products) {
        localStorage.setItem(this.productsKey, JSON.stringify(products));
        this.loadStats();
        this.loadProducts();
    }

    // Salva estatísticas
    saveStats(stats) {
        localStorage.setItem(this.statsKey, JSON.stringify(stats));
    }
}

// Inicializa dashboard
const dashboard = new Dashboard();

// Funções globais do dashboard
function adicionarProduto() {
    const nome = prompt('Nome do produto:');
    if (!nome) return;
    
    const id = prompt('ID do produto:');
    if (!id) return;
    
    const categoria = prompt('Categoria:');
    const preco = prompt('Preço (ex: 35.00):');
    
    const products = dashboard.getProducts();
    products.push({
        id,
        nome,
        categoria: categoria || 'Geral',
        preco: parseFloat(preco) || 0,
        views: 0,
        dataCriacao: new Date().toISOString()
    });
    
    dashboard.saveProducts(products);
    alert('✅ Produto adicionado com sucesso!');
}

function gerenciarCategorias() {
    alert('🎯 Gerenciar Categorias\n\nFuncionalidade em desenvolvimento...');
}

function verEstatisticas() {
    const stats = dashboard.getStats();
    const products = dashboard.getProducts();
    const totalVendas = products.reduce((sum, p) => sum + (p.views || 0), 0);
    
    alert(`📊 Estatísticas do Site:\n\n• Produtos: ${products.length}\n• Visualizações: ${stats.totalViews}\n• Engajamento: ${totalVendas} cliques`);
}

function backupDados() {
    const products = dashboard.getProducts();
    const stats = dashboard.getStats();
    
    const backupData = {
        produtos: products,
        estatisticas: stats,
        dataBackup: new Date().toISOString(),
        totalRegistros: products.length
    };
    
    const dataStr = JSON.stringify(backupData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `backup_canecas_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    alert('💾 Backup realizado com sucesso!');
}

function editarProduto(productId) {
    alert(`✏️ Editar Produto: ${productId}\n\nFuncionalidade em desenvolvimento...`);
}

function excluirProduto(productId) {
    if (confirm('⚠️ Tem certeza que deseja excluir este produto?\nEsta ação não pode ser desfeita.')) {
        const products = dashboard.getProducts();
        const updatedProducts = products.filter(p => p.id !== productId);
        dashboard.saveProducts(updatedProducts);
        alert('✅ Produto excluído com sucesso!');
    }
}

// Atualiza estatísticas periodicamente
setInterval(() => {
    dashboard.loadStats();
}, 30000); // Atualiza a cada 30 segundos