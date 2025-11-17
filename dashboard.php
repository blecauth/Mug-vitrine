<?php
// dashboard.php
session_start();

if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: login.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - Admin Canecas</title>
    <style>
        /* Mesmo estilo do dashboard anterior, mas adaptado para PHP */
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
            text-align: center;
        }
        
        .header h1 {
            color: #25D366;
            font-size: 1.8rem;
            margin-bottom: 0.5rem;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
        }
        
        .welcome {
            text-align: center;
            margin-bottom: 3rem;
            padding: 2rem;
            background: #181818;
            border-radius: 10px;
            border: 1px solid #333;
        }
        
        .welcome h2 {
            color: #25D366;
            margin-bottom: 1rem;
        }
        
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-bottom: 2rem;
        }
        
        .card {
            background: #181818;
            padding: 2rem;
            border-radius: 10px;
            border: 1px solid #333;
            text-align: center;
            transition: transform 0.3s ease;
        }
        
        .card:hover {
            transform: translateY(-5px);
            border-color: #25D366;
        }
        
        .card-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
            display: block;
        }
        
        .card h3 {
            color: #25D366;
            margin-bottom: 1rem;
            font-size: 1.3rem;
        }
        
        .card p {
            color: #ccc;
            margin-bottom: 1.5rem;
            line-height: 1.5;
        }
        
        .btn {
            background: #25D366;
            color: white;
            border: none;
            padding: 0.8rem 2rem;
            border-radius: 5px;
            cursor: pointer;
            font-size: 1rem;
            text-decoration: none;
            display: inline-block;
            transition: background 0.3s ease;
        }
        
        .btn:hover {
            background: #1ebe5f;
        }
        
        .logout-btn {
            background: #ff4444;
            color: white;
            border: none;
            padding: 0.8rem 1.5rem;
            border-radius: 5px;
            cursor: pointer;
            margin-top: 1rem;
        }
        
        .user-info {
            background: rgba(37, 211, 102, 0.1);
            border: 1px solid #25D366;
            border-radius: 8px;
            padding: 1rem;
            margin: 1rem 0;
            text-align: center;
        }
    </style>
</head>
<body>
    <header class="header">
        <h1>⚡ Dashboard PHP - Admin Canecas</h1>
        <p style="color: #ccc;">Sistema administrativo completo</p>
    </header>

    <main class="container">
        <div class="user-info">
            <h4 style="color: #25D366; margin-bottom: 0.5rem;">👋 Administrador Logado</h4>
            <div style="color: #25D366; font-weight: bold;"><?= htmlspecialchars($_SESSION['admin_username'] ?? 'Admin') ?></div>
            <div style="color: #ccc; font-size: 0.9rem; margin-top: 0.5rem;">
                Sessão PHP ativa ✅
            </div>
        </div>

        <section class="welcome">
            <h2>🎯 Bem-vindo ao Painel PHP</h2>
            <p style="color: #ccc; max-width: 600px; margin: 0 auto;">
                Sistema completo em PHP sem dependências de JavaScript externo.
            </p>
        </section>

        <div class="grid">
            <div class="card">
                <div class="card-icon">🔍</div>
                <h3>Gerenciar Produtos</h3>
                <p>Visualize, edite ou exclua produtos existentes.</p>
                <a href="gerenciar-produtos.php" class="btn">Acessar</a>
            </div>

            <div class="card">
                <div class="card-icon">➕</div>
                <h3>Adicionar Produto</h3>
                <p>Adicione novos produtos ao sistema.</p>
                <a href="adicionar-produto.php" class="btn">Criar Produto</a>
            </div>

            <div class="card">
                <div class="card-icon">🌐</div>
                <h3>Ver Site</h3>
                <p>Visualize o site público.</p>
                <a href="../index.html" class="btn" target="_blank">Abrir Site</a>
            </div>
        </div>

        <div style="text-align: center; margin-top: 2rem;">
            <a href="logout.php" class="logout-btn">🚪 Sair do Sistema</a>
        </div>
    </main>
</body>
</html>
