<?php
// login.php
session_start();

// Credenciais do admin (em produção, use banco de dados)
$admin_username = 'admin';
$admin_password = 'admin123';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';
    
    if ($username === $admin_username && $password === $admin_password) {
        $_SESSION['admin_logged_in'] = true;
        $_SESSION['admin_username'] = $username;
        header('Location: dashboard.php');
        exit;
    } else {
        $error = 'Credenciais inválidas!';
    }
}

// Se já está logado, redireciona
if (isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true) {
    header('Location: dashboard.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Admin Canecas</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: Arial, sans-serif;
        }
        
        body {
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            background: #0d0d0d;
            padding: 2rem;
        }
        
        .login-container {
            width: 100%;
            max-width: 400px;
        }
        
        .login-box {
            background: #181818;
            padding: 2.5rem;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            border: 1px solid #333;
            text-align: center;
        }
        
        .login-title {
            color: #25D366;
            margin-bottom: 0.5rem;
            font-size: 1.8rem;
        }
        
        .login-subtitle {
            color: #aaa;
            margin-bottom: 2rem;
            font-size: 1rem;
        }
        
        .form-group {
            margin-bottom: 1rem;
            text-align: left;
        }
        
        .form-label {
            display: block;
            margin-bottom: 0.5rem;
            color: #ccc;
        }
        
        .form-input {
            width: 100%;
            padding: 0.8rem;
            border-radius: 8px;
            border: 1px solid #333;
            background: #1a1a1a;
            color: white;
            font-size: 1rem;
        }
        
        .form-input:focus {
            border-color: #25D366;
            outline: none;
        }
        
        .login-btn {
            width: 100%;
            padding: 1rem;
            background: #25D366;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 1rem;
            cursor: pointer;
            margin-top: 1rem;
        }
        
        .login-btn:hover {
            background: #1ebe5f;
        }
        
        .error-msg {
            color: #ff4444;
            margin-bottom: 1rem;
            padding: 0.8rem;
            background: rgba(255, 68, 68, 0.1);
            border-radius: 5px;
            border: 1px solid #ff4444;
        }
    </style>
</head>
<body>
    <div class="login-container">
        <div class="login-box">
            <h1 class="login-title">🔐 Área Admin</h1>
            <p class="login-subtitle">Acesso restrito ao administrador</p>
            
            <?php if (isset($error)): ?>
                <div class="error-msg"><?= $error ?></div>
            <?php endif; ?>
            
            <form method="POST">
                <div class="form-group">
                    <label class="form-label">Usuário</label>
                    <input type="text" class="form-input" name="username" required>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Senha</label>
                    <input type="password" class="form-input" name="password" required>
                </div>
                
                <button type="submit" class="login-btn">🚀 Entrar no Sistema</button>
            </form>
            
            <div style="margin-top: 2rem; padding: 1rem; background: rgba(37, 211, 102, 0.1); border-radius: 8px;">
                <p style="color: #25D366; font-size: 0.9rem;">
                    <strong>Credenciais de teste:</strong><br>
                    Usuário: <strong>admin</strong><br>
                    Senha: <strong>admin123</strong>
                </p>
            </div>
        </div>
    </div>
</body>
</html>
