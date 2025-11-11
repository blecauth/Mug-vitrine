// Configurações
const MODELOS_DISPONIVEIS = [
    'Branca', 'Preta', 'Vermelha', 'Amarela', 'Rosa', 
    'Azul Clara', 'Azul', 'Azul Escura', 'Verde Clara', 'Verde', 
    'Verde Escura', 'Laranja', 'Roxa'
];

const IMGBB_API_KEY = 'bb49178e11dff4322b7a699167535e57'; // Você vai configurar isso no environment

class ProductForm {
    constructor() {
        this.modelosSelecionados = new Map(); // Map para armazenar dados de cada modelo
        this.init();
    }

    init() {
        this.carregarModelos();
        this.configurarFormulario();
        console.log('🚀 Formulário de produto inicializado');
    }

    carregarModelos() {
        const container = document.getElementById('modelosContainer');
        const camposContainer = document.getElementById('modelosCampos');
        
        MODELOS_DISPONIVEIS.forEach(modelo => {
            // Checkbox do modelo
            const checkboxId = `modelo-${modelo.replace(/\s+/g, '-').toLowerCase()}`;
            const checkboxHTML = `
                <input type="checkbox" class="modelo-checkbox" id="${checkboxId}" value="${modelo}">
                <label class="modelo-label" for="${checkboxId}">
                    ${modelo}
                </label>
            `;
            container.innerHTML += checkboxHTML;

            // Campos do modelo (inicialmente ocultos)
            const camposHTML = `
                <div class="modelo-campos" id="campos-${modelo.replace(/\s+/g, '-').toLowerCase()}">
                    <h4 style="color: #25D366; margin-bottom: 1rem;">Configurações para ${modelo}</h4>
                    <div class="campos-grid">
                        <div>
                            <label class="form-label">Preço (R$)</label>
                            <input type="number" class="form-input" 
                                   id="preco-${modelo.replace(/\s+/g, '-').toLowerCase()}" 
                                   step="0.01" min="0" placeholder="Ex: 29.90">
                        </div>
                        <div>
                            <label class="form-label">Imagem</label>
                            <input type="file" class="form-input" 
                                   id="imagem-${modelo.replace(/\s+/g, '-').toLowerCase()}" 
                                   accept="image/*" 
                                   onchange="productForm.fazerUploadImagem(this, '${modelo}')">
                            <img id="preview-${modelo.replace(/\s+/g, '-').toLowerCase()}" 
                                 class="preview-image" style="display: none;">
                        </div>
                    </div>
                </div>
            `;
            camposContainer.innerHTML += camposHTML;
        });

        // Configurar eventos dos checkboxes
        MODELOS_DISPONIVEIS.forEach(modelo => {
            const checkbox = document.getElementById(`modelo-${modelo.replace(/\s+/g, '-').toLowerCase()}`);
            checkbox.addEventListener('change', (e) => {
                this.toggleCamposModelo(modelo, e.target.checked);
            });
        });
    }

    toggleCamposModelo(modelo, mostrar) {
        const campos = document.getElementById(`campos-${modelo.replace(/\s+/g, '-').toLowerCase()}`);
        
        if (mostrar) {
            campos.classList.add('active');
            // Inicializa dados do modelo
            this.modelosSelecionados.set(modelo, {
                preco: '',
                imagemUrl: ''
            });
        } else {
            campos.classList.remove('active');
            this.modelosSelecionados.delete(modelo);
        }
    }

    async fazerUploadImagem(input, modelo) {
        const file = input.files[0];
        if (!file) return;

        const previewId = `preview-${modelo.replace(/\s+/g, '-').toLowerCase()}`;
        const preview = document.getElementById(previewId);
        
        // Mostra preview local
        const reader = new FileReader();
        reader.onload = (e) => {
            preview.src = e.target.result;
            preview.style.display = 'block';
        };
        reader.readAsDataURL(file);

        // Faz upload para ImgBB
        await this.uploadParaImgBB(file, modelo);
    }

    async uploadParaImgBB(file, modelo) {
        const formData = new FormData();
        formData.append('image', file);

        try {
            this.mostrarLoading(true);
            
            const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            
            if (data.success) {
                const modeloData = this.modelosSelecionados.get(modelo);
                modeloData.imagemUrl = data.data.url;
                this.modelosSelecionados.set(modelo, modeloData);
                
                console.log(`✅ Imagem de ${modelo} uploadada:`, data.data.url);
                this.mostrarMensagem('✅ Imagem uploadada com sucesso!', 'success');
            } else {
                throw new Error(data.error?.message || 'Erro no upload');
            }
        } catch (error) {
            console.error('❌ Erro no upload:', error);
            this.mostrarMensagem('❌ Erro ao fazer upload da imagem', 'error');
        } finally {
            this.mostrarLoading(false);
        }
    }

    configurarFormulario() {
        const form = document.getElementById('productForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.enviarProduto();
        });

        // Atualizar preços em tempo real
        MODELOS_DISPONIVEIS.forEach(modelo => {
            const precoInput = document.getElementById(`preco-${modelo.replace(/\s+/g, '-').toLowerCase()}`);
            if (precoInput) {
                precoInput.addEventListener('input', (e) => {
                    const modeloData = this.modelosSelecionados.get(modelo);
                    if (modeloData) {
                        modeloData.preco = e.target.value;
                        this.modelosSelecionados.set(modelo, modeloData);
                    }
                });
            }
        });
    }

    validarFormulario() {
        const nome = document.getElementById('productName').value.trim();
        const id = document.getElementById('productId').value.trim();
        const descricao = document.getElementById('productDescription').value.trim();

        if (!nome || !id || !descricao) {
            throw new Error('Preencha todos os campos básicos do produto');
        }

        if (this.modelosSelecionados.size === 0) {
            throw new Error('Selecione pelo menos um modelo');
        }

        // Validar dados de cada modelo selecionado
        for (const [modelo, dados] of this.modelosSelecionados) {
            if (!dados.preco || isNaN(parseFloat(dados.preco))) {
                throw new Error(`Preço inválido para o modelo ${modelo}`);
            }
            if (!dados.imagemUrl) {
                throw new Error(`Faça upload da imagem para o modelo ${modelo}`);
            }
        }

        return true;
    }

    gerarHTMLProduto() {
        const nome = document.getElementById('productName').value.trim();
        const id = document.getElementById('productId').value.trim();
        const descricao = document.getElementById('productDescription').value.trim();
        
        // Gerar array de opções para o modal
        const opcoes = Array.from(this.modelosSelecionados).map(([modelo, dados]) => ({
            model: modelo,
            price: parseFloat(dados.preco),
            image: dados.imagemUrl
        }));

        const opcoesJSON = JSON.stringify(opcoes).replace(/'/g, "\\'");

        return `
<div class="item" data-categoria="personalizada">
    <img src="${opcoes[0].image}" alt="${nome}" loading="lazy">
    <div class="info">
        <h2>${nome}</h2>
        <p>ID: ${id}</p>
        <p>R$ ${opcoes[0].price.toFixed(2)}</p>
        <button class="open-modal-btn"
            data-name="${nome}"
            data-id="${id}"
            data-image="${opcoes[0].image}"
            data-specs="${descricao}"
            data-options='${opcoesJSON}'>
            Ver Detalhes
        </button>
    </div>
</div>`.trim();
    }

    async enviarProduto() {
        try {
            this.mostrarLoading(true);
            this.limparMensagens();

            // Validar formulário
            this.validarFormulario();

            // Gerar HTML do produto
            const htmlProduto = this.gerarHTMLProduto();
            const nomeProduto = document.getElementById('productName').value.trim();

            console.log('🚀 Enviando produto para GitHub...');

            // Enviar para GitHub
            const response = await fetch('/api/github-update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    htmlCode: htmlProduto,
                    commitMessage: `✨ Adicionar produto: ${nomeProduto}`
                })
            });

            const data = await response.json();

            if (data.success) {
                this.mostrarMensagem(
                    `🎉 Produto "${nomeProduto}" publicado com sucesso!<br>
                    ⏱️ O site será atualizado em 1-2 minutos.`,
                    'success'
                );
                
                // Limpar formulário
                this.limparFormulario();
                
                // Opcional: abrir commit no GitHub
                setTimeout(() => {
                    if (confirm('Deseja ver o commit no GitHub?')) {
                        window.open(data.commitUrl, '_blank');
                    }
                }, 1000);
                
            } else {
                throw new Error(data.error || 'Erro desconhecido');
            }

        } catch (error) {
            console.error('❌ Erro ao publicar produto:', error);
            this.mostrarMensagem(`❌ ${error.message}`, 'error');
        } finally {
            this.mostrarLoading(false);
        }
    }

    previewProduto() {
        try {
            this.validarFormulario();
            const htmlProduto = this.gerarHTMLProduto();
            
            document.getElementById('previewContent').innerHTML = htmlProduto;
            document.getElementById('previewModal').style.display = 'flex';
            
        } catch (error) {
            this.mostrarMensagem(`❌ ${error.message}`, 'error');
        }
    }

    // Métodos auxiliares
    mostrarLoading(mostrar) {
        document.getElementById('loadingSpinner').style.display = mostrar ? 'block' : 'none';
        document.getElementById('submitBtn').disabled = mostrar;
    }

    mostrarMensagem(mensagem, tipo) {
        const element = document.getElementById(tipo === 'success' ? 'successMessage' : 'errorMessage');
        element.innerHTML = mensagem;
        element.style.display = 'block';
        
        // Auto-esconder mensagens de sucesso
        if (tipo === 'success') {
            setTimeout(() => {
                element.style.display = 'none';
            }, 5000);
        }
    }

    limparMensagens() {
        document.getElementById('successMessage').style.display = 'none';
        document.getElementById('errorMessage').style.display = 'none';
    }

    limparFormulario() {
        document.getElementById('productForm').reset();
        this.modelosSelecionados.clear();
        
        // Limpar todos os campos de modelo
        MODELOS_DISPONIVEIS.forEach(modelo => {
            const campos = document.getElementById(`campos-${modelo.replace(/\s+/g, '-').toLowerCase()}`);
            if (campos) campos.classList.remove('active');
            
            const preview = document.getElementById(`preview-${modelo.replace(/\s+/g, '-').toLowerCase()}`);
            if (preview) preview.style.display = 'none';
        });
    }
}

// Funções globais
function fecharPreview() {
    document.getElementById('previewModal').style.display = 'none';
}

function voltarDashboard() {
    window.location.href = 'dashboard.html';
}

// Inicializar quando a página carregar
let productForm;
document.addEventListener('DOMContentLoaded', () => {
    productForm = new ProductForm();
});

// Expor para uso global
window.productForm = productForm;
window.previewProduto = () => productForm.previewProduto();
