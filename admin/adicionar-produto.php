<?php
// admin/adicionar-produto.php
session_start();

if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: login.php');
    exit;
}

// Carrega produtos existentes
function loadProducts() {
    $productsFile = 'data/produtos.json';
    if (file_exists($productsFile)) {
        $json = file_get_contents($productsFile);
        return json_decode($json, true) ?: [];
    }
    return [];
}

// Salva produtos
function saveProducts($products) {
    $dir = 'data';
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
    file_put_contents($dir . '/produtos.json', json_encode($products, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

// Processa o formulário
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $product = [
        'id' => $_POST['product_id'] ?? '',
        'nome' => $_POST['product_name'] ?? '',
        'categoria' => $_POST['product_category'] ?? 'personalizada',
        'preco' => floatval($_POST['product_price'] ?? 0),
        'descricao' => $_POST['product_description'] ?? '',
        'imageUrl' => $_POST['product_image'] ?? '',
        'modelos' => []
    ];
    
    // Adiciona modelos se existirem
    if (isset($_POST['model_names']) && is_array($_POST['model_names'])) {
        foreach ($_POST['model_names'] as $index => $modelName) {
            if (!empty($modelName)) {
                $product['modelos'][] = [
                    'model' => $modelName,
                    'price' => floatval($_POST['model_prices'][$index] ?? 0),
                    'image' => $_POST['model_images'][$index] ?? $product['imageUrl']
                ];
            }
        }
    }
    
    $products = loadProducts();
    $products[] = $product;
    saveProducts($products);
    
    $_SESSION['message'] = '✅ Produto adicionado com sucesso!';
    header('Location: gerenciar-produtos.php');
    exit;
}

$message = $_SESSION['message'] ?? '';
unset($_SESSION['message']);
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Adicionar Produto - Admin</title>
    <style>
        /* Estilos similares ao gerenciar-produtos.php */
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: Arial, sans-serif; }
        body { background: #0d0d0d; color: #fff; min-height: 100vh; padding: 1rem; }
        .container { max-width: 800px; margin: 0 auto; background: #181818; padding: 1.5rem; border-radius: 15px; border: 1px solid #333; }
        .header { text-align: center; margin-bottom: 1.5rem; border-bottom: 2px solid #25D366; padding-bottom: 1rem; }
        .header h1 { color: #25D366; font-size: 1.5rem; margin-bottom: 0.5rem; }
        .form-group { margin-bottom: 1rem; }
        .form-label { display: block; margin-bottom: 0.5rem; color: #ccc; font-weight: bold; }
        .form-input, .form-textarea { width: 100%; padding: 0.8rem; border-radius: 8px; border: 1px solid #333; background: #1a1a1a; color: white; font-size: 1rem; }
        .form-input:focus, .form-textarea:focus { border-color: #25D366; outline: none; }
        .form-textarea { resize: vertical; min-height: 80px; }
        .btn { padding: 0.8rem 1.5rem; border: none; border-radius: 8px; font-size: 0.9rem; cursor: pointer; margin: 0.5rem; }
        .btn-primary { background: #25D366; color: white; }
        .btn-back { background: #666; color: white; text-decoration: none; display: inline-block; }
        .message { padding: 1rem; border-radius: 8px; margin-bottom: 1rem; text-align: center; }
        .message.success { background: rgba(37, 211, 102, 0.1); border: 1px solid #25D366; color: #25D366; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>➕ Adicionar Produto</h1>
            <p>Preencha os dados do novo produto</p>
        </div>
        
        <?php if ($message): ?>
            <div class="message success"><?= htmlspecialchars($message) ?></div>
        <?php endif; ?>
        
        <form method="POST">
            <div class="form-group">
                <label class="form-label">Nome do Produto *</label>
                <input type="text" class="form-input" name="product_name" required>
            </div>
            
            <div class="form-group">
                <label class="form-label">ID do Produto *</label>
                <input type="text" class="form-input" name="product_id" required>
            </div>
            
            <div class="form-group">
                <label class="form-label">Categoria</label>
                <select class="form-input" name="product_category">
                    <option value="personalizada">Personalizada</option>
                    <option value="floral">Floral</option>
                    <option value="animes">Animes</option>
                    <option value="herois">Heróis</option>
                    <option value="pets">Pets</option>
                    <option value="futebol">Futebol</option>
                </select>
            </div>
            
            <div class="form-group">
                <label class="form-label">Preço (R$) *</label>
                <input type="number" class="form-input" name="product_price" step="0.01" min="0" required>
            </div>
            
            <div class="form-group">
                <label class="form-label">Descrição</label>
                <textarea class="form-textarea" name="product_description"></textarea>
            </div>
            
            <div class="form-group">
                <label class="form-label">URL da Imagem</label>
                <input type="url" class="form-input" name="product_image">
            </div>
            
            <div style="display: flex; gap: 1rem; margin-top: 2rem;">
                <a href="gerenciar-produtos.php" class="btn btn-back">← Voltar</a>
                <button type="submit" class="btn btn-primary">💾 Salvar Produto</button>
            </div>
        </form>
    </div>
</body>
</html>
