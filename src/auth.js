// /src/auth.js - FRONTEND SEGURO
class AuthSystem {
    constructor() {
        this.tokenKey = 'admin_token_canecas';
        this.apiUrl = '/api/auth'; // URL da API serverless
        
        console.log('🔐 Sistema de auth inicializado');
        this.checkAuth();
    }

    // Verifica se o token é válido
    isAuthenticated() {
        const token = localStorage.getItem(this.tokenKey);
        if (!token) return false;

        try {
            // Decodifica o token
            const tokenStr = atob(token);
            const tokenData = JSON.parse(tokenStr);
            
            // Verifica expiração
            const now = Date.now();
            return now < tokenData.expires;
        } catch (error) {
            console.error('❌ Token inválido:', error);
            this.logout();
            return false;
        }
    }

    // Faz login via API
    async login(username, password) {
        console.log('🔐 Tentando login via API...');
        
        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username.trim(),
                    password: password
                })
            });

            const data = await response.json();
            
            if (data.success && data.token) {
                console.log('✅ Login autorizado via API');
                localStorage.setItem(this.tokenKey, data.token);
                return true;
            } else {
                console.log('❌ Login recusado:', data.error);
                return false;
            }
            
        } catch (error) {
            console.error('💥 Erro na comunicação com a API:', error);
            return false;
        }
    }

    // Faz logout
    logout() {
        localStorage.removeItem(this.tokenKey);
        console.log('👋 Logout realizado');
        window.location.href = 'login.html';
    }

    // Verifica autenticação e redireciona
    checkAuth() {
        const currentPage = window.location.pathname;
        
        if (currentPage.includes('dashboard.html')) {
            if (!this.isAuthenticated()) {
                console.log('🚫 Acesso negado - redirecionando para login');
                window.location.href = 'login.html';
            } else {
                console.log('✅ Acesso autorizado ao dashboard');
            }
            return;
        }
        
        if (currentPage.includes('login.html') && this.isAuthenticated()) {
            console.log('✅ Usuário já autenticado - redirecionando para dashboard');
            window.location.href = 'dashboard.html';
            return;
        }
    }

    // Obtém informações do usuário logado
    getUserInfo() {
        if (!this.isAuthenticated()) return null;
        
        try {
            const token = localStorage.getItem(this.tokenKey);
            const tokenStr = atob(token);
            return JSON.parse(tokenStr);
        } catch {
            return null;
        }
    }
}

// Inicializa sistema de auth
const auth = new AuthSystem();

// Configura formulário de login
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const errorMsg = document.getElementById('errorMsg');
    const loadingSpinner = document.getElementById('loadingSpinner');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const submitBtn = document.querySelector('.login-btn');
            
            // Mostra loading
            if (loadingSpinner) loadingSpinner.style.display = 'block';
            if (submitBtn) submitBtn.disabled = true;
            if (errorMsg) errorMsg.style.display = 'none';
            
            try {
                const success = await auth.login(username, password);
                
                if (success) {
                    window.location.href = 'dashboard.html';
                } else {
                    if (errorMsg) {
                        errorMsg.textContent = 'Usuário ou senha incorretos';
                        errorMsg.style.display = 'block';
                    }
                }
            } catch (error) {
                console.error('Erro no login:', error);
                if (errorMsg) {
                    errorMsg.textContent = 'Erro de conexão. Tente novamente.';
                    errorMsg.style.display = 'block';
                }
            } finally {
                // Esconde loading
                if (loadingSpinner) loadingSpinner.style.display = 'none';
                if (submitBtn) submitBtn.disabled = false;
            }
        });
    }
});

// Função global para logout
function logout() {
    auth.logout();
}

// Verificação de segurança
window.addEventListener('load', function() {
    auth.checkAuth();
});
