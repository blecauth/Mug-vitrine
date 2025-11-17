<?php
// gerenciar-produtos.php
session_start();

// 🔐 VERIFICAÇÃO DE SEGURANÇA
function checkAdminAuth() {
    if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
        header('Location: login.php');
        exit;
    }
}

checkAdminAuth();

// 📦 CARREGA PRODUTOS DO ARQUIVO
function loadProducts() {
    $productsFile = 'data/produtos.json';
    if (file_exists($productsFile)) {
        $json = file_get_contents($productsFile);
        return json_decode($json, true) ?: [];
    }
    return [];
}

// 💾 SALVA PRODUTOS NO ARQUIVO
function saveProducts($products) {
    $dir = 'data';
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
    
    file_put_contents($dir . '/produtos.json', json_encode($products, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

// 🎯 PROCESSAMENTO DE AÇÕES
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';
    
    switch ($action) {
        case 'delete':
            $productId = $_POST['product_id'] ?? '';
            $products = loadProducts();
            $products = array_filter($products, function($product) use ($productId) {
                return $product['id'] !== $productId;
            });
            saveProducts(array_values($products));
            $_SESSION['message'] = '✅ Produto excluído com sucesso!';
            break;
            
        case 'edit':
            // Aqui você pode implementar a edição
            $_SESSION['message'] = '✏️ Edição em desenvolvimento...';
            break;
    }
    
    header('Location: gerenciar-produtos.php');
    exit;
}

$products = loadProducts();
$message = $_SESSION['message'] ?? '';
unset($_SESSION['message']);
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gerenciar Produtos - Admin Canecas</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: Arial, sans-serif;
        }
        
        body {
            background: #0d0d0d;
            color: #fff;
            min-height: 100vh;
        }
        
        .header {
            background: #181818;
            padding: 1rem 2rem;
            border-bottom: 2px solid #25D366;
        }
        
        .header-content {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .header h1 {
            color: #25D366;
            font-size: 1.5rem;
        }
        
        .btn {
            background: #25D366;
            color: white;
            border: none;
            padding: 0.6rem 1.2rem;
            border-radius: 5px;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
            margin-left: 0.5rem;
            transition: background 0.3s;
        }
        
        .btn-back {
            background: #666;
        }
        
        .btn:hover {
            opacity: 0.9;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
        }
        
        .search-section {
            background: #181818;
            padding: 2rem;
            border-radius: 10px;
            border: 1px solid #333;
            margin-bottom: 2rem;
            text-align: center;
        }
        
        .search-title {
            color: #25D366;
            margin-bottom: 1rem;
            font-size: 1.3rem;
        }
        
        .search-box {
            position: relative;
            max-width: 500px;
            margin: 0 auto;
        }
        
        .search-input {
            width: 100%;
            padding: 0.8rem 1rem;
            border-radius: 25px;
            border: 2px solid #25D366;
            background: #1a1a1a;
            color: white;
            font-size: 1rem;
            outline: none;
        }
        
        .search-input:focus {
            box-shadow: 0 0 10px rgba(37, 211, 102, 0.3);
        }
        
        .search-info {
            color: #ccc;
            font-size: 0.9rem;
            margin-top: 0.5rem;
        }
        
        .products-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 1.5rem;
        }
        
        .product-card {
            background: #181818;
            border: 1px solid #333;
            border-radius: 10px;
            overflow: hidden;
            transition: transform 0.3s ease, border-color 0.3s ease;
        }
        
        .product-card:hover {
            transform: translateY(-5px);
            border-color: #25D366;
        }
        
        .product-image {
            height: 200px;
            overflow: hidden;
        }
        
        .product-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        .product-content {
            padding: 1rem;
        }
        
        .product-title {
            color: #25D366;
            font-size: 1.1rem;
            margin-bottom: 0.5rem;
        }
        
        .product-tags {
            display: flex;
            gap: 0.5rem;
            margin-bottom: 0.5rem;
            flex-wrap: wrap;
        }
        
        .product-tag {
            background: #333;
            color: #ccc;
            padding: 0.2rem 0.5rem;
            border-radius: 10px;
            font-size: 0.8rem;
        }
        
        .product-category {
            background: #25D366 !important;
            color: white !important;
        }
        
        .product-price {
            color: #25D366;
            font-weight: bold;
            font-size: 1.2rem;
            margin-bottom: 0.5rem;
        }
        
        .product-description {
            color: #ccc;
            margin-bottom: 1rem;
            font-size: 0.9rem;
            line-height: 1.4;
        }
        
        .product-actions {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0.5rem;
        }
        
        .action-btn {
            background: #25D366;
            color: white;
            border: none;
            padding: 0.5rem;
            border-radius: 5px;
            cursor: pointer;
            font-size: 0.8rem;
            transition: background 0.3s;
        }
        
        .action-edit {
            background: #007bff;
        }
        
        .action-delete {
            background: #ff4444;
        }
        
        .action-btn:hover {
            opacity: 0.9;
        }
        
        .empty-state {
            text-align: center;
            padding: 3rem;
            color: #888;
            grid-column: 1 / -1;
        }
        
        .empty-state h3 {
            margin-bottom: 1rem;
            color: #25D366;
        }
        
        .message {
            padding: 1rem;
            margin-bottom: 1rem;
            border-radius: 5px;
            text-align: center;
        }
        
        .message.success {
            background: rgba(37, 211, 102, 0.1);
            border: 1px solid #25D366;
            color: #25D366;
        }
        
        .message.error {
            background: rgba(255, 68, 68, 0.1);
            border: 1px solid #ff4444;
            color: #ff4444;
        }

        @media (max-width: 768px) {
            .container {
                padding: 1rem;
            }
            
            .products-grid {
                grid-template-columns: 1fr;
            }
            
            .header-content {
                flex-direction: column;
                gap: 1rem;
                text-align: center;
            }
        }
    </style>
</head>
<body>
    <header class="header">
        <div class="header-content">
            <h1>🔍 Gerenciar Produtos (PHP)</h1>
            <div>
                <a href="dashboard.php" class="btn btn-back">← Voltar</a>
                <a href="adicionar-produto.php" class="btn">➕ Novo Produto</a>
            </div>
        </div>
    </header>

    <main class="container">
        <?php if ($message): ?>
            <div class="message success"><?= htmlspecialchars($message) ?></div>
        <?php endif; ?>

        <section class="search-section">
            <h2 class="search-title">Pesquisar Produtos</h2>
            <div class="search-box">
                <input type="text" id="searchInput" class="search-input" placeholder="🔍 Digite para buscar produtos...">
            </div>
            <p class="search-info">Digite o nome, ID ou categoria do produto - resultados aparecem automaticamente</p>
        </section>

        <div id="productsContainer">
            <?php if (empty($products)): ?>
                <div class="empty-state">
                    <h3>📦 Nenhum produto cadastrado</h3>
                    <p>Comece adicionando seu primeiro produto!</p>
                    <a href="adicionar-produto.php" class="btn" style="margin-top: 1rem;">➕ Adicionar Primeiro Produto</a>
                </div>
            <?php else: ?>
                <div class="products-grid">
                    <?php foreach ($products as $product): ?>
                        <div class="product-card" data-search="<?= strtolower(htmlspecialchars($product['nome'] . ' ' . $product['id'] . ' ' . $product['categoria'])) ?>">
                            <div class="product-image">
                                <img src="<?= htmlspecialchars($product['imageUrl']) ?>" alt="<?= htmlspecialchars($product['nome']) ?>">
                            </div>
                            <div class="product-content">
                                <h3 class="product-title"><?= htmlspecialchars($product['nome']) ?></h3>
                                <div class="product-tags">
                                    <span class="product-tag">ID: <?= htmlspecialchars($product['id']) ?></span>
                                    <span class="product-tag product-category"><?= htmlspecialchars($product['categoria']) ?></span>
                                    <span class="product-tag"><?= count($product['modelos'] ?? []) ?> modelos</span>
                                </div>
                                <div class="product-price">R$ <?= number_format($product['preco'], 2, ',', '.') ?></div>
                                <p class="product-description"><?= htmlspecialchars($product['descricao'] ?? 'Sem descrição') ?></p>
                                <div class="product-actions">
                                    <button class="action-btn action-edit" onclick="editProduct('<?= $product['id'] ?>')">
                                        ✏️ Editar
                                    </button>
                                    <form method="POST" style="display: inline;">
                                        <input type="hidden" name="action" value="delete">
                                        <input type="hidden" name="product_id" value="<?= $product['id'] ?>">
                                        <button type="submit" class="action-btn action-delete" onclick="return confirm('Tem certeza que deseja excluir este produto?')">
                                            🗑️ Excluir
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>
        </div>
    </main>

    <script>
        // 🔍 PESQUISA EM TEMPO REAL SIMPLES
        document.getElementById('searchInput').addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase().trim();
            const products = document.querySelectorAll('.product-card');
            
            products.forEach(product => {
                const searchData = product.getAttribute('data-search');
                if (searchData.includes(searchTerm) || searchTerm === '') {
                    product.style.display = 'block';
                } else {
                    product.style.display = 'none';
                }
            });
            
            // Mostra mensagem se nenhum produto for encontrado
            const visibleProducts = document.querySelectorAll('.product-card[style="display: block"]');
            const container = document.getElementById('productsContainer');
            
            if (visibleProducts.length === 0 && searchTerm !== '') {
                if (!document.querySelector('.no-results')) {
                    const noResults = document.createElement('div');
                    noResults.className = 'empty-state no-results';
                    noResults.innerHTML = `
                        <h3>🔍 Nenhum produto encontrado</h3>
                        <p>Tente buscar por nome, ID ou categoria</p>
                    `;
                    container.appendChild(noResults);
                }
            } else {
                const noResults = document.querySelector('.no-results');
                if (noResults) {
                    noResults.remove();
                }
            }
        });

        function editProduct(productId) {
            alert('✏️ Editar produto: ' + productId + '\n\nEsta funcionalidade será implementada em breve!');
        }
    </script>
</body>
</html>
