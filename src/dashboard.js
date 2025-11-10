// /src/dashboard.js - SISTEMA COMPLETA DE VISUALIZAÇÃO
class Dashboard {
    constructor() {
        this.productsKey = 'canecas_products';
        this.categoriesKey = 'canecas_categories';
        this.init();
    }

    init() {
        this.loadStats();
        this.loadProductsFromSite(); // 🔄 Carrega do site + localStorage
        this.setupCategories();
        this.setupEventListeners();
    }

    // 🔄 CARREGA PRODUTOS DO SITE (index.html) + LOCALSTORAGE
    loadProductsFromSite() {
        const storedProducts = this.getProducts();
        const siteProducts = this.extractProductsFromSite();
        
        // Combina produtos (evita duplicatas)
        const allProducts = this.mergeProducts(storedProducts, siteProducts);
        
        // Atualiza localStorage se necessário
        if (siteProducts.length > 0 && storedProducts.length !== allProducts.length) {
            this.saveProducts(allProducts);
        }
        
        this.displayAllProducts(allProducts);
    }

    // 📖 EXTRAI PRODUTOS DO index.html
    extractProductsFromSite() {
        console.log('🔍 Extraindo produtos do site...');
        const products = [];
        
        try {
            // Se estiver no dashboard, não pode acessar index.html diretamente
            // Então vamos simular os produtos que você tem no site
            const siteProducts = [
                {
                    id: "0001",
                    nome: "Caneca teste",
                    categoria: "floral",
                    preco: 32.00,
                    descricao: "Caneca de teste com design floral",
                    imageUrl: "https://i.ibb.co/7x7ZbVKQ/IMG-20251022-WA0007.jpg",
                    dataCriacao: new Date().toISOString(),
                    origem: "site"
                },
                {
                    id: "Cn0001",
                    nome: "Caneca teste",
                    categoria: "floral", 
                    preco: 40.00,
                    descricao: "Caneca teste preta",
                    imageUrl: "https://i.ibb.co/0jVBTx2H/IMG-20251021-WA0001.jpg",
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
            
            return siteProducts;
            
        } catch (error) {
            console.error('Erro ao extrair produtos do site:', error);
            return [];
        }
    }

    // 🔄 COMBINA PRODUTOS (evita duplicatas por ID)
    mergeProducts(storedProducts, siteProducts) {
        const merged = [...storedProducts];
        
        siteProducts.forEach(siteProduct => {
            const exists = merged.find(p => p.id === siteProduct.id);
            if (!exists) {
                merged.push(siteProduct);
            }
        });
        
        return merged;
    }

    // 🎯 EXIBE TODOS OS PRODUTOS NO DASHBOARD
    displayAllProducts(products) {
        const productsList = document.getElementById('productsList');
        
        if (products.length === 0) {
            productsList.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: #888;">
                    <p>📦 Nenhum produto cadastrado</p>
                    <button onclick="showAddProductModal()" class="action-btn" style="margin-top: 1rem;">
                        ➕ Adicionar Primeiro Produto
                    </button>
                </div>
            `;
            return;
        }

        productsList.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
                <h3>📦 Todos os Produtos (${products.length})</h3>
                <div style="display: flex; gap: 1rem;">
                    <button onclick="showAddProductModal()" class="action-btn" style="background: #25D366;">
                        ➕ Novo Produto
                    </button>
                    <button onclick="exportAllProducts()" class="action-btn" style="background: #007bff;">
                        📤 Exportar Tudo
                    </button>
                </div>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 1.5rem;">
                ${products.map(product => this.createProductCard(product)).join('')}
            </div>
        `;
    }

    // 🎴 CRIA CARD COMPLETO DO PRODUTO
    createProductCard(product) {
        const options = product.options || [
            { model: "Branca", price: product.preco, image: product.imageUrl },
            { model: "Preta", price: product.preco + 2, image: product.imageUrl.replace('0007', '0001') }
        ];
        
        const specs = product.specs || product.descricao || "Caneca de cerâmica de alta qualidade";
        
        return `
            <div class="product-card" style="background: #1a1a1a; border: 1px solid #333; border-radius: 12px; overflow: hidden; transition: transform 0.3s ease, box-shadow 0.3s ease;">
                <!-- IMAGEM -->
                <div style="position: relative; height: 200px; overflow: hidden;">
                    <img src="${product.imageUrl}" 
                         alt="${product.nome}"
                         style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s ease;">
                    <div style="position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.7); color: white; padding: 0.3rem 0.6rem; border-radius: 20px; font-size: 0.8rem;">
                        ${product.origem === 'site' ? '🌐 Site' : '💾 Local'}
                    </div>
                </div>
                
                <!-- INFORMAÇÕES -->
                <div style="padding: 1.5rem;">
                    <!-- CABEÇALHO -->
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                        <div>
                            <h3 style="color: #25D366; margin: 0 0 0.3rem 0; font-size: 1.2rem;">${product.nome}</h3>
                            <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                                <span style="background: #333; color: #ccc; padding: 0.2rem 0.6rem; border-radius: 12px; font-size: 0.8rem;">
                                    ID: ${product.id}
                                </span>
                                <span style="background: #25D366; color: white; padding: 0.2rem 0.6rem; border-radius: 12px; font-size: 0.8rem;">
                                    ${product.categoria}
                                </span>
                            </div>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-size: 1.5rem; color: #25D366; font-weight: bold;">
                                R$ ${parseFloat(product.preco).toFixed(2)}
                            </div>
                            <div style="font-size: 0.8rem; color: #888;">
                                ${product.views || 0} visualizações
                            </div>
                        </div>
                    </div>
                    
                    <!-- DESCRIÇÃO -->
                    <div style="margin-bottom: 1rem;">
                        <p style="color: #ccc; margin: 0; font-size: 0.9rem; line-height: 1.4;">
                            ${product.descricao || specs}
                        </p>
                    </div>
                    
                    <!-- MODELOS DISPONÍVEIS -->
                    <div style="margin-bottom: 1.5rem;">
                        <h4 style="color: #fff; margin: 0 0 0.5rem 0; font-size: 0.9rem;">Modelos:</h4>
                        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                            ${options.map(opt => `
                                <span style="background: #333; color: #ccc; padding: 0.3rem 0.6rem; border-radius: 8px; font-size: 0.8rem;">
                                    ${opt.model} - R$ ${parseFloat(opt.price).toFixed(2)}
                                </span>
                            `).join('')}
                        </div>
                    </div>
                    
                    <!-- METADADOS -->
                    <div style="border-top: 1px solid #333; padding-top: 1rem; margin-bottom: 1.5rem;">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; font-size: 0.8rem; color: #888;">
                            <div>📅 Criado: ${new Date(product.dataCriacao).toLocaleDateString()}</div>
                            <div>🔄 Atualizado: ${new Date(product.dataAtualizacao || product.dataCriacao).toLocaleDateString()}</div>
                        </div>
                    </div>
                    
                    <!-- BOTÕES DE AÇÃO -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
                        <button onclick="editProduct('${product.id}')" 
                                style="background: #25D366; color: white; border: none; padding: 0.6rem; border-radius: 6px; cursor: pointer; font-size: 0.9rem;">
                            ✏️ Editar
                        </button>
                        <button onclick="viewProductDetails('${product.id}')" 
                                style="background: #007bff; color: white; border: none; padding: 0.6rem; border-radius: 6px; cursor: pointer; font-size: 0.9rem;">
                            👁️ Detalhes
                        </button>
                        <button onclick="previewOnSite('${product.id}')" 
                                style="background: #6f42c1; color: white; border: none; padding: 0.6rem; border-radius: 6px; cursor: pointer; font-size: 0.9rem;">
                            🌐 Ver no Site
                        </button>
                        <button onclick="deleteProduct('${product.id}')" 
                                style="background: #ff4444; color: white; border: none; padding: 0.6rem; border-radius: 6px; cursor: pointer; font-size: 0.9rem;">
                            🗑️ Excluir
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // ... (mantenha o resto das funções igual: getProducts, saveProducts, etc.)
}

// 🆕 NOVAS FUNÇÕES GLOBAIS
function viewProductDetails(productId) {
    const products = dashboard.getProducts();
    const product = products.find(p => p.id === productId);
    
    if (product) {
        const detailsHTML = `
            <div style="background: #1a1a1a; padding: 2rem; border-radius: 10px; max-width: 600px; margin: 2rem auto;">
                <h2 style="color: #25D366; margin-bottom: 1rem;">🔍 Detalhes do Produto</h2>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
                    <div><strong>ID:</strong> ${product.id}</div>
                    <div><strong>Categoria:</strong> ${product.categoria}</div>
                    <div><strong>Nome:</strong> ${product.nome}</div>
                    <div><strong>Preço:</strong> R$ ${parseFloat(product.preco).toFixed(2)}</div>
                    <div><strong>Visualizações:</strong> ${product.views || 0}</div>
                    <div><strong>Origem:</strong> ${product.origem || 'local'}</div>
                </div>
                
                <div style="margin-bottom: 1.5rem;">
                    <strong>Descrição:</strong>
                    <p style="color: #ccc; margin-top: 0.5rem;">${product.descricao || 'Sem descrição'}</p>
                </div>
                
                ${product.imageUrl ? `
                <div style="margin-bottom: 1.5rem;">
                    <strong>Imagem:</strong>
                    <img src="${product.imageUrl}" style="max-width: 200px; border-radius: 8px; margin-top: 0.5rem;">
                </div>
                ` : ''}
                
                <div style="display: flex; gap: 1rem; justify-content: flex-end;">
                    <button onclick="closeModal()" 
                            style="padding: 0.6rem 1.2rem; border: 1px solid #666; background: transparent; color: #ccc; border-radius: 5px; cursor: pointer;">
                        Fechar
                    </button>
                    <button onclick="editProduct('${product.id}')" 
                            style="padding: 0.6rem 1.2rem; background: #25D366; color: white; border: none; border-radius: 5px; cursor: pointer;">
                        ✏️ Editar
                    </button>
                </div>
            </div>
        `;
        
        showModal(detailsHTML);
    }
}

function previewOnSite(productId) {
    // Simula a abertura no site (em uma nova aba)
    const products = dashboard.getProducts();
    const product = products.find(p => p.id === productId);
    
    if (product) {
        const previewWindow = window.open('', '_blank');
        previewWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Preview: ${product.nome}</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 2rem; background: #0d0d0d; color: white; }
                    .preview-card { max-width: 400px; margin: 0 auto; background: #181818; border-radius: 1rem; overflow: hidden; }
                    .preview-card img { width: 100%; height: 300px; object-fit: cover; }
                    .preview-info { padding: 1.5rem; }
                    .preview-price { color: #25D366; font-size: 1.5rem; font-weight: bold; }
                </style>
            </head>
            <body>
                <div class="preview-card">
                    <img src="${product.imageUrl}" alt="${product.nome}">
                    <div class="preview-info">
                        <h2>${product.nome}</h2>
                        <p>ID: ${product.id} | ${product.categoria}</p>
                        <p>${product.descricao}</p>
                        <div class="preview-price">R$ ${parseFloat(product.preco).toFixed(2)}</div>
                        <button style="background: #25D366; color: white; border: none; padding: 1rem 2rem; border-radius: 30px; margin-top: 1rem; cursor: pointer;">
                            Comprar via WhatsApp
                        </button>
                    </div>
                </div>
                <p style="text-align: center; margin-top: 2rem; color: #888;">🔍 Preview do produto no site</p>
            </body>
            </html>
        `);
    }
}

function exportAllProducts() {
    const products = dashboard.getProducts();
    const exportData = {
        produtos: products,
        total: products.length,
        dataExportacao: new Date().toISOString(),
        categorias: [...new Set(products.map(p => p.categoria))]
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `export_produtos_completo_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    alert(`📤 Exportado ${products.length} produtos!`);
}

function showModal(html) {
    const modal = document.createElement('div');
    modal.id = 'detailsModal';
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
        background: rgba(0,0,0,0.8); display: flex; justify-content: center; 
        align-items: center; z-index: 2000; padding: 2rem;
    `;
    modal.innerHTML = html;
    document.body.appendChild(modal);
}

function closeModal() {
    const modal = document.getElementById('detailsModal');
    if (modal) modal.remove();
}

// ... (mantenha as outras funções: editProduct, deleteProduct, etc.)
