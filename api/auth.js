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
    }
    
    .login-title {
      text-align: center;
      color: #25D366;
      margin-bottom: 1.5rem;
      font-size: 1.8rem;
    }
    
    .login-input {
      width: 100%;
      padding: 1rem;
      margin-bottom: 1rem;
      border: 1px solid #333;
      border-radius: 8px;
      background: #1a1a1a;
      color: white;
      font-size: 1rem;
    }
    
    .login-input:focus {
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
      transition: background 0.3s;
      margin-top: 0.5rem;
    }
    
    .login-btn:hover {
      background: #1ebe5f;
    }

    .login-btn:disabled {
      background: #666;
      cursor: not-allowed;
    }
    
    .error-msg {
      color: #ff4444;
      text-align: center;
      margin-top: 1rem;
      display: none;
      padding: 0.5rem;
      background: rgba(255, 68, 68, 0.1);
      border-radius: 5px;
    }
    
    .back-link {
      display: block;
      text-align: center;
      margin-top: 1.5rem;
      color: #888;
      text-decoration: none;
    }
    
    .back-link:hover {
      color: #25D366;
    }

    .loading {
      display: none;
      text-align: center;
      margin: 1rem 0;
    }

    .spinner {
      border: 3px solid #f3f3f3;
      border-top: 3px solid #25D366;
      border-radius: 50%;
      width: 30px;
      height: 30px;
      animation: spin 1s linear infinite;
      margin: 0 auto;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .success-msg {
      color: #25D366;
      text-align: center;
      margin-top: 1rem;
      display: none;
      padding: 0.5rem;
      background: rgba(37, 211, 102, 0.1);
      border-radius: 5px;
    }

    .warning-msg {
      color: #ffa500;
      text-align: center;
      margin-top: 1rem;
      display: none;
      padding: 0.5rem;
      background: rgba(255, 165, 0, 0.1);
      border-radius: 5px;
      font-size: 0.9rem;
    }

    .dev-info {
      background: rgba(37, 211, 102, 0.1);
      border: 1px solid #25D366;
      border-radius: 8px;
      padding: 1rem;
      margin-top: 1rem;
      font-size: 0.8rem;
    }

    .dev-info h4 {
      color: #25D366;
      margin: 0 0 0.5rem 0;
    }

    .dev-info p {
      margin: 0.3rem 0;
      color: #ccc;
    }
  </style>
</head>
<body>
  <div class="login-container">
    <div class="login-box">
      <h1 class="login-title">🔐 Área Admin</h1>
      
      <form id="loginForm">
        <input type="text" class="login-input" id="username" placeholder="Usuário" required value="admin">
        <input type="password" class="login-input" id="password" placeholder="Senha" required value="admin123">
        
        <div class="loading" id="loadingSpinner">
          <div class="spinner"></div>
          <p style="color: #25D366; margin-top: 0.5rem;">Verificando credenciais...</p>
        </div>
        
        <button type="submit" class="login-btn" id="submitBtn">Entrar no Dashboard</button>
      </form>
      
      <div class="error-msg" id="errorMsg">Usuário ou senha incorretos!</div>
      <div class="warning-msg" id="warningMsg">API não disponível. Usando modo desenvolvimento.</div>
      <div class="success-msg" id="successMsg">Login realizado com sucesso! Redirecionando...</div>

      <!-- Informações para desenvolvimento -->
      <div class="dev-info" id="devInfo">
        <h4>💡 Modo Desenvolvimento</h4>
        <p><strong>Usuário:</strong> admin</p>
        <p><strong>Senha:</strong> admin123</p>
        <p style="margin-top: 0.5rem; color: #888; font-size: 0.7rem;">
          Configure ADMIN_USERNAME e ADMIN_PASSWORD no Vercel para produção
        </p>
      </div>
      
      <a href="index.html" class="back-link">← Voltar ao Site Principal</a>
    </div>
  </div>

  <script>
    // Sistema de autenticação CORRIGIDO
    console.log('🔐 Sistema de login carregado!');

    class AuthSystem {
      constructor() {
        this.tokenKey = 'admin_token_canecas';
        this.apiUrl = '/api/auth';
        this.apiAvailable = true;
        this.checkAuth();
      }

      isAuthenticated() {
        const token = localStorage.getItem(this.tokenKey);
        if (!token) return false;
        
        try {
          const tokenData = JSON.parse(atob(token));
          const tokenTime = tokenData.timestamp;
          const now = Date.now();
          return (now - tokenTime) < (24 * 60 * 60 * 1000);
        } catch (error) {
          console.error('💥 Erro ao verificar token:', error);
          this.logout();
          return false;
        }
      }

      generateToken() {
        const tokenData = {
          timestamp: Date.now(),
          random: Math.random().toString(36).substring(2),
          origin: 'canecas_admin'
        };
        return btoa(JSON.stringify(tokenData));
      }

      async login(username, password) {
        console.log('🔐 Tentando login para:', username);
        
        // Tenta API primeiro se estiver disponível
        if (this.apiAvailable) {
          const apiResult = await this.tryApiLogin(username, password);
          if (apiResult.success) return apiResult;
          if (apiResult.apiExists === false) this.apiAvailable = false;
        }
        
        // Fallback para desenvolvimento
        return await this.fallbackLogin(username, password);
      }

      async tryApiLogin(username, password) {
        try {
          console.log('📡 Chamando API...');
          const response = await fetch(this.apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: username.trim(), password })
          });

          console.log('📨 Status:', response.status);
          
          // Se API não existe (404), usa fallback
          if (response.status === 404) {
            console.log('❌ API não encontrada - usando fallback');
            return { 
              success: false, 
              apiExists: false,
              message: 'API não configurada' 
            };
          }

          const data = await response.json();
          console.log('📨 Resposta:', data);
          
          if (data.success) {
            const token = this.generateToken();
            localStorage.setItem(this.tokenKey, token);
            return { success: true, message: 'Login realizado!' };
          } else {
            return { success: false, message: data.error || 'Credenciais inválidas' };
          }
          
        } catch (error) {
          console.error('💥 Erro API:', error);
          return { 
            success: false, 
            message: 'Erro de conexão',
            networkError: true 
          };
        }
      }

      async fallbackLogin(username, password) {
        console.log('🔧 Usando fallback...');
        
        // Credenciais de desenvolvimento
        const validCredentials = [
          { user: 'admin', pass: 'admin123' },
          { user: 'test', pass: 'test123' }
        ];
        
        const isValid = validCredentials.some(cred => 
          cred.user === username.trim() && cred.pass === password
        );
        
        if (isValid) {
          console.log('✅ Login via fallback');
          const token = this.generateToken();
          localStorage.setItem(this.tokenKey, token);
          return { 
            success: true, 
            message: 'Login realizado (modo desenvolvimento)',
            source: 'fallback'
          };
        }
        
        return { 
          success: false, 
          message: 'Usuário ou senha incorretos',
          source: 'fallback'
        };
      }

      logout() {
        localStorage.removeItem(this.tokenKey);
        window.location.href = 'login.html';
      }

      checkAuth() {
        const currentPage = window.location.pathname;
        
        // Redireciona para login se não autenticado em páginas admin
        if ((currentPage.includes('dashboard.html') || 
             currentPage.includes('adicionar-produto.html') ||
             currentPage.includes('gerenciar-produtos.html')) && 
            !this.isAuthenticated()) {
          window.location.href = 'login.html';
        }
        
        // Redireciona para dashboard se já autenticado
        if (currentPage.includes('login.html') && this.isAuthenticated()) {
          window.location.href = 'dashboard.html';
        }
      }
    }

    // Inicialização
    let auth;
    document.addEventListener('DOMContentLoaded', function() {
      auth = new AuthSystem();
      setupLoginForm();
    });

    function setupLoginForm() {
      const loginForm = document.getElementById('loginForm');
      const errorMsg = document.getElementById('errorMsg');
      const warningMsg = document.getElementById('warningMsg');
      const successMsg = document.getElementById('successMsg');
      const loadingSpinner = document.getElementById('loadingSpinner');
      const submitBtn = document.getElementById('submitBtn');
      
      loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        if (!username || !password) {
          showError('Preencha todos os campos');
          return;
        }

        showLoading();
        
        try {
          const result = await auth.login(username, password);
          
          if (result.success) {
            if (result.source === 'fallback') {
              showWarning(result.message);
            } else {
              showSuccess(result.message);
            }
            
            setTimeout(() => {
              window.location.href = 'dashboard.html';
            }, 1000);
            
          } else {
            if (result.apiExists === false) {
              showWarning('API não configurada. Usando modo desenvolvimento.');
            } else {
              showError(result.message);
            }
          }
        } catch (error) {
          console.error('💥 Erro:', error);
          showError('Erro inesperado');
        } finally {
          hideLoading();
        }
      });
    }

    function showLoading() {
      document.getElementById('loadingSpinner').style.display = 'block';
      document.getElementById('submitBtn').disabled = true;
      document.getElementById('errorMsg').style.display = 'none';
      document.getElementById('warningMsg').style.display = 'none';
      document.getElementById('successMsg').style.display = 'none';
    }

    function hideLoading() {
      document.getElementById('loadingSpinner').style.display = 'none';
      document.getElementById('submitBtn').disabled = false;
    }

    function showError(message) {
      const el = document.getElementById('errorMsg');
      el.textContent = message;
      el.style.display = 'block';
      el.scrollIntoView({ behavior: 'smooth' });
    }

    function showWarning(message) {
      const el = document.getElementById('warningMsg');
      el.textContent = message;
      el.style.display = 'block';
      el.scrollIntoView({ behavior: 'smooth' });
    }

    function showSuccess(message) {
      const el = document.getElementById('successMsg');
      el.textContent = message;
      el.style.display = 'block';
    }

    window.logout = function() {
      if (auth) auth.logout();
      else window.location.href = 'login.html';
    };
  </script>
</body>
</html>
