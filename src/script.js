// Função para inicializar os listeners do modal
function initModalListeners() {
    const modal = document.getElementById('produtoModal');
    const closeButton = document.querySelector('.close-button');
    
    console.log('🔧 Inicializando listeners do modal...');

    // Função para abrir o modal
    function openModal(button) {
        console.log('🎯 Abrindo modal...', button);
        
        const name = button.getAttribute('data-name');
        const id = button.getAttribute('data-id');
        const image = button.getAttribute('data-image');
        const specs = button.getAttribute('data-specs');
        const options = JSON.parse(button.getAttribute('data-options') || '[]');
        
        console.log('📦 Dados do produto:', { name, id, image, specs, options });

        // Preencher modal com os dados
        document.getElementById('modalImage').src = image;
        document.getElementById('modalImage').alt = name;
        document.getElementById('modalTitle').textContent = name;
        document.getElementById('modalSpecs').textContent = specs;
        
        // Limpar e preencher opções
        const modalOptions = document.getElementById('modalOptions');
        modalOptions.innerHTML = '';
        
        if (options.length > 0) {
            options.forEach((option, index) => {
                const optionElement = document.createElement('div');
                optionElement.className = 'model-option';
                if (index === 0) optionElement.classList.add('selected');
                
                optionElement.innerHTML = `
                    <img src="${option.imagem || option.image}" alt="${option.modelo || option.model}">
                    <span>${option.modelo || option.model}</span>
                `;
                
                optionElement.addEventListener('click', function() {
                    // Remover seleção anterior
                    document.querySelectorAll('.model-option').forEach(opt => {
                        opt.classList.remove('selected');
                    });
                    
                    // Selecionar esta opção
                    this.classList.add('selected');
                    
                    // Atualizar preço
                    const price = option.preco || option.price;
                    document.getElementById('modalPrice').textContent = 
                        `R$ ${parseFloat(price).toFixed(2).replace('.', ',')}`;
                    
                    // Atualizar imagem principal
                    document.getElementById('modalImage').src = option.imagem || option.image;
                });
                
                modalOptions.appendChild(optionElement);
            });
            
            // Definir preço inicial (primeira opção)
            const firstOption = options[0];
            const firstPrice = firstOption.preco || firstOption.price;
            document.getElementById('modalPrice').textContent = 
                `R$ ${parseFloat(firstPrice).toFixed(2).replace('.', ',')}`;
        }
        
        // Configurar botão do WhatsApp
        const buyButton = document.getElementById('buyButton');
        buyButton.onclick = function() {
            const selectedOption = document.querySelector('.model-option.selected');
            let selectedModel = '';
            let selectedPrice = '';
            
            if (selectedOption) {
                selectedModel = selectedOption.querySelector('span').textContent;
                selectedPrice = document.getElementById('modalPrice').textContent;
            }
            
            const message = `Olá! Gostaria de comprar a ${name} (${selectedModel}) - ${selectedPrice}`;
            const encodedMessage = encodeURIComponent(message);
            window.open(`https://wa.me/5511999999999?text=${encodedMessage}`, '_blank');
        };
        
        // Mostrar modal
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        console.log('✅ Modal aberto com sucesso!');
    }
    
    // DELEGAÇÃO DE EVENTOS - Funciona com elementos dinâmicos
    document.addEventListener('click', function(event) {
        // Verifica se o clique foi em um botão de abrir modal
        if (event.target.classList.contains('open-modal-btn')) {
            console.log('🎯 Botão de modal clicado!', event.target);
            openModal(event.target);
            return;
        }
        
        // Verifica se o clique foi em um elemento dentro do botão
        if (event.target.closest('.open-modal-btn')) {
            console.log('🎯 Elemento dentro do botão clicado!');
            openModal(event.target.closest('.open-modal-btn'));
            return;
        }
    });
    
    // Fechar modal
    closeButton.addEventListener('click', function() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        console.log('❌ Modal fechado');
    });
    
    // Fechar modal clicando fora
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            console.log('❌ Modal fechado (clique fora)');
        }
    });
    
    console.log('✅ Listeners do modal configurados!');
}

// Função para inicializar menu hamburguer
function initMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const menu = document.getElementById('menu');
    const menuOverlay = document.getElementById('menuOverlay');
    const categoriaToggle = document.querySelector('.categoria-toggle');
    const submenuCategorias = document.getElementById('submenuCategorias');
    
    console.log('🔧 Inicializando menu...');

    // Menu hamburguer
    menuToggle.addEventListener('click', function() {
        menu.classList.toggle('active');
        menuOverlay.classList.toggle('active');
        document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : 'auto';
        console.log('🍔 Menu ' + (menu.classList.contains('active') ? 'aberto' : 'fechado'));
    });
    
    // Overlay para fechar menu
    menuOverlay.addEventListener('click', function() {
        menu.classList.remove('active');
        menuOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
        console.log('❌ Menu fechado (overlay)');
    });
    
    // Submenu de categorias
    if (categoriaToggle && submenuCategorias) {
        categoriaToggle.addEventListener('click', function(e) {
            e.preventDefault();
            submenuCategorias.classList.toggle('active');
            console.log('📂 Submenu categorias ' + (submenuCategorias.classList.contains('active') ? 'aberto' : 'fechado'));
        });
    }
    
    // Fechar menu ao clicar em um link
    const menuLinks = document.querySelectorAll('.menu-link');
    menuLinks.forEach(link => {
        link.addEventListener('click', function() {
            menu.classList.remove('active');
            menuOverlay.classList.remove('active');
            document.body.style.overflow = 'auto';
            
            // Fechar submenu se estiver aberto
            if (submenuCategorias) {
                submenuCategorias.classList.remove('active');
            }
            
            console.log('🔗 Menu fechado (link clicado)');
        });
    });
    
    console.log('✅ Menu inicializado!');
}

// Função para busca
function initSearch() {
    const buscaInput = document.getElementById('buscaId');
    const galeria = document.querySelector('.galeria');
    const nenhumProduto = document.getElementById('nenhumProduto');
    
    console.log('🔧 Inicializando busca...');

    buscaInput.addEventListener('input', function() {
        const termo = this.value.toLowerCase();
        const items = galeria.getElementsByClassName('item');
        let encontrados = 0;
        
        console.log('🔍 Buscando por:', termo);

        for (let item of items) {
            const idElement = item.querySelector('p');
            const nomeElement = item.querySelector('h2');
            
            if (!idElement || !nomeElement) continue;
            
            const id = idElement.textContent.toLowerCase();
            const nome = nomeElement.textContent.toLowerCase();
            
            if (id.includes(termo) || nome.includes(termo)) {
                item.style.display = 'block';
                encontrados++;
            } else {
                item.style.display = 'none';
            }
        }
        
        // Mostrar/ocultar mensagem de nenhum produto
        if (nenhumProduto) {
            nenhumProduto.style.display = encontrados === 0 ? 'block' : 'none';
        }
        
        console.log('📊 Produtos encontrados:', encontrados);
    });
    
    console.log('✅ Busca inicializada!');
}

// Carregar produtos do JSON
async function loadProducts() {
    try {
        console.log('🔄 Carregando produtos do JSON...');
        
        const response = await fetch('data/products.json');
        if (!response.ok) {
            throw new Error('Erro ao carregar JSON');
        }

        const data = await response.json();
        const galeria = document.getElementById('galeria');
        const nenhumProduto = document.getElementById('nenhumProduto');
        
        if (data.produtos && data.produtos.length > 0) {
            galeria.innerHTML = '';
            
            data.produtos.forEach(produto => {
                const item = document.createElement('div');
                item.className = 'item';
                item.setAttribute('data-categoria', produto.categoria || 'geral');
                
                // Usar a primeira opção como imagem principal
                const primeiraOpcao = produto.opcoes && produto.opcoes.length > 0 ? produto.opcoes[0] : {};
                
                // Converter opções para o formato esperado pelo modal
                const opcoesParaModal = produto.opcoes ? produto.opcoes.map(opcao => ({
                    modelo: opcao.modelo,
                    preco: opcao.preco,
                    imagem: opcao.imagem
                })) : [];
                
                item.innerHTML = `
                    <img src="${primeiraOpcao.imagem || ''}" alt="${produto.nome}" loading="lazy">
                    <div class="info">
                        <h2>${produto.nome}</h2>
                        <p>ID: ${produto.id}</p>
                        <p>R$ ${primeiraOpcao.preco ? parseFloat(primeiraOpcao.preco).toFixed(2).replace('.', ',') : '0,00'}</p>
                        <button class="open-modal-btn"
                            data-name="${produto.nome}"
                            data-id="${produto.id}"
                            data-image="${primeiraOpcao.imagem || ''}"
                            data-specs="${produto.especificacoes || ''}"
                            data-options='${JSON.stringify(opcoesParaModal)}'>Ver Detalhes</button>
                    </div>
                `;
                
                galeria.appendChild(item);
            });
            
            if (nenhumProduto) {
                nenhumProduto.style.display = 'none';
            }
            
            console.log(`✅ ${data.produtos.length} produtos carregados do JSON`);
            
        } else {
            if (nenhumProduto) {
                nenhumProduto.style.display = 'block';
            }
            console.log('📭 Nenhum produto encontrado no JSON');
        }
        
    } catch (error) {
        console.error('❌ Erro ao carregar produtos:', error);
        const nenhumProduto = document.getElementById('nenhumProduto');
        if (nenhumProduto) {
            nenhumProduto.style.display = 'block';
            nenhumProduto.textContent = 'Erro ao carregar produtos 🔧';
        }
    }
}

// Inicializar tudo quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Inicializando aplicação...');
    
    // Inicializar funcionalidades básicas
    initMenu();
    initSearch();
    
    // Carregar produtos e depois inicializar modal
    loadProducts().then(() => {
        console.log('🎯 Inicializando modal após carregar produtos...');
        initModalListeners();
    });
    
    console.log('✅ Aplicação inicializada!');
});

// Função global para debug
window.debugModal = function() {
    console.log('🔍 Debug do Modal:');
    console.log('- Botões encontrados:', document.querySelectorAll('.open-modal-btn').length);
    console.log('- Modal element:', document.getElementById('produtoModal'));
    console.log('- Últimos produtos carregados:', document.querySelectorAll('.item').length);
};
