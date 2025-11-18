// Função para inicializar os listeners do modal
function initModalListeners() {
    const modal = document.getElementById('produtoModal');
    const closeButton = document.querySelector('.close-button');
    
    console.log('Inicializando modal listeners...');
    console.log('Botões encontrados:', document.querySelectorAll('.open-modal-btn').length);
    
    // Função para abrir o modal
    function openModal(button) {
        console.log('Abrindo modal...', button);
        const name = button.getAttribute('data-name');
        const id = button.getAttribute('data-id');
        const image = button.getAttribute('data-image');
        const specs = button.getAttribute('data-specs');
        const options = JSON.parse(button.getAttribute('data-options') || '[]');
        
        console.log('Dados do produto:', { name, id, image, specs, options });
        
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
                    <img src="${option.imagem}" alt="${option.modelo}">
                    <span>${option.modelo}</span>
                `;
                
                optionElement.addEventListener('click', function() {
                    // Remover seleção anterior
                    document.querySelectorAll('.model-option').forEach(opt => {
                        opt.classList.remove('selected');
                    });
                    
                    // Selecionar esta opção
                    this.classList.add('selected');
                    
                    // Atualizar preço
                    document.getElementById('modalPrice').textContent = 
                        `R$ ${option.preco.toFixed(2).replace('.', ',')}`;
                    
                    // Atualizar imagem principal
                    document.getElementById('modalImage').src = option.imagem;
                });
                
                modalOptions.appendChild(optionElement);
            });
            
            // Definir preço inicial (primeira opção)
            const firstOption = options[0];
            document.getElementById('modalPrice').textContent = 
                `R$ ${firstOption.preco.toFixed(2).replace('.', ',')}`;
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
    }
    
    // Adicionar event listeners aos botões - DELEGAÇÃO DE EVENTOS
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('open-modal-btn')) {
            console.log('Botão clicado!', event.target);
            openModal(event.target);
        }
    });
    
    // Fechar modal
    closeButton.addEventListener('click', function() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
    
    // Fechar modal clicando fora
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
}
// Função para inicializar menu hamburguer
function initMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const menu = document.getElementById('menu');
    const menuOverlay = document.getElementById('menuOverlay');
    const categoriaToggle = document.querySelector('.categoria-toggle');
    const submenuCategorias = document.getElementById('submenuCategorias');
    
    // Menu hamburguer
    menuToggle.addEventListener('click', function() {
        menu.classList.toggle('active');
        menuOverlay.classList.toggle('active');
        document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : 'auto';
    });
    
    // Overlay para fechar menu
    menuOverlay.addEventListener('click', function() {
        menu.classList.remove('active');
        menuOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
    
    // Submenu de categorias
    if (categoriaToggle && submenuCategorias) {
        categoriaToggle.addEventListener('click', function(e) {
            e.preventDefault();
            submenuCategorias.classList.toggle('active');
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
        });
    });
}

// Função para busca
function initSearch() {
    const buscaInput = document.getElementById('buscaId');
    const galeria = document.querySelector('.galeria');
    const items = galeria.getElementsByClassName('item');
    const nenhumProduto = document.getElementById('nenhumProduto');
    
    buscaInput.addEventListener('input', function() {
        const termo = this.value.toLowerCase();
        let encontrados = 0;
        
        for (let item of items) {
            const id = item.querySelector('p').textContent.toLowerCase();
            const nome = item.querySelector('h2').textContent.toLowerCase();
            
            if (id.includes(termo) || nome.includes(termo)) {
                item.style.display = 'block';
                encontrados++;
            } else {
                item.style.display = 'none';
            }
        }
        
        // Mostrar/ocultar mensagem de nenhum produto
        nenhumProduto.style.display = encontrados === 0 ? 'block' : 'none';
    });
}

// Inicializar tudo quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    initMenu();
    initSearch();
    
    // Carregar produtos do JSON
    fetch('data/products.json')
        .then(response => response.json())
        .then(data => {
            const galeria = document.getElementById('galeria');
            const nenhumProduto = document.getElementById('nenhumProduto');
            
            if (data.produtos && data.produtos.length > 0) {
                data.produtos.forEach(produto => {
                    const item = document.createElement('div');
                    item.className = 'item';
                    item.setAttribute('data-categoria', produto.categoria || 'geral');
                    
                    // Usar a primeira opção como imagem principal
                    const primeiraOpcao = produto.opcoes && produto.opcoes.length > 0 ? produto.opcoes[0] : {};
                    
                    item.innerHTML = `
                        <img src="${primeiraOpcao.imagem || produto.imagem || ''}" alt="${produto.nome}">
                        <div class="info">
                            <h2>${produto.nome}</h2>
                            <p>ID: ${produto.id}</p>
                            <p>R$ ${primeiraOpcao.preco ? primeiraOpcao.preco.toFixed(2).replace('.', ',') : '0,00'}</p>
                            <button class="open-modal-btn"
                                data-name="${produto.nome}"
                                data-id="${produto.id}"
                                data-image="${primeiraOpcao.imagem || produto.imagem || ''}"
                                data-specs="${produto.especificacoes || ''}"
                                data-options='${JSON.stringify(produto.opcoes || [])}'>Ver Detalhes</button>
                        </div>
                    `;
                    
                    galeria.appendChild(item);
                });
                
                nenhumProduto.style.display = 'none';
                
                // Inicializar listeners do modal após carregar produtos
                initModalListeners();
            } else {
                nenhumProduto.style.display = 'block';
            }
        })
        .catch(error => {
            console.error('Erro ao carregar produtos:', error);
            document.getElementById('nenhumProduto').style.display = 'block';
        });
});
