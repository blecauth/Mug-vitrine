const buscaInput = document.getElementById('buscaId');
    const nenhumProdutoMsg = document.getElementById('nenhumProduto');
    const modal = document.getElementById('produtoModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalSpecs = document.getElementById('modalSpecs');
    const modalPrice = document.getElementById('modalPrice');
    const modalOptions = document.getElementById('modalOptions');
    const closeButton = document.querySelector('.close-button');
    const buyButton = document.getElementById('buyButton');
    let produtoAtual = null;

    // 🔍 Filtro em tempo real
    buscaInput.addEventListener('input', () => {
      const termo = buscaInput.value.trim().toLowerCase();
      const produtos = document.querySelectorAll('.item');
      let visiveis = 0;

      produtos.forEach(prod => {
        const nome = prod.querySelector('h2')?.textContent.toLowerCase() || '';
        const idTexto = prod.querySelector('.info p')?.textContent.toLowerCase() || '';
        const exibir = nome.includes(termo) || idTexto.includes(termo) || termo === '';
        prod.style.display = exibir ? 'block' : 'none';
        if (exibir) visiveis++;
      });
      nenhumProdutoMsg.style.display = visiveis === 0 ? 'block' : 'none';
    });

    // Abrir modal
    document.querySelectorAll('.open-modal-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const nome = btn.dataset.name;
        const id = btn.dataset.id;
        const image = btn.dataset.image;
        const specs = btn.dataset.specs;
        const options = JSON.parse(btn.dataset.options);

        produtoAtual = { nome, id };

        modalTitle.textContent = nome;
        modalSpecs.textContent = specs;
        modalImage.src = image;

        modalOptions.innerHTML = "";
        options.forEach(opt => {
          const btnOpt = document.createElement("button");
          btnOpt.className = "model-option";
          btnOpt.textContent = opt.model;
          btnOpt.dataset.price = opt.price;
          btnOpt.dataset.image = opt.image;
          btnOpt.addEventListener("click", () => {
            document.querySelectorAll(".model-option").forEach(b => b.classList.remove("selected"));
            btnOpt.classList.add("selected");
            modalPrice.textContent = `R$ ${parseFloat(opt.price).toFixed(2).replace('.', ',')}`; // Corrigido para float
            modalImage.src = opt.image; // <--- CORREÇÃO APLICADA AQUI
          });
          modalOptions.appendChild(btnOpt);
        });

        // Selecionar o primeiro modelo por padrão e aplicar sua imagem
        if (options.length > 0) {
            const firstOption = modalOptions.querySelector('.model-option');
            firstOption.classList.add('selected');
            modalPrice.textContent = `R$ ${options[0].price.toFixed(2).replace('.', ',')}`;
            modalImage.src = options[0].image; // Garante que a imagem inicial seja a do primeiro modelo
        }


        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
      });
    });

    // Fechar modal
    closeButton.addEventListener('click', () => {
      modal.classList.remove('show');
      document.body.style.overflow = '';
    });

    window.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
      }
    });

    // Comprar via WhatsApp
    buyButton.addEventListener('click', () => {
      const selected = document.querySelector('.model-option.selected');
      if (!selected) return alert('Selecione um modelo antes de comprar.');
      const modelo = selected.textContent;
      const preco = selected.dataset.price;
      const msg = `Olá! Gostaria de comprar a caneca "${produtoAtual.nome}" (ID: ${produtoAtual.id}) — Modelo: ${modelo}, Preço: R$ ${parseFloat(preco).toFixed(2).replace('.', ',')}.`;
      window.open(`https://wa.me/5519993938752?text=${encodeURIComponent(msg)}`, '_blank');
    });
