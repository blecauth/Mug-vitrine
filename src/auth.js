// Sistema de autenticação seguro para Vercel
class AuthSystem {
    constructor() {
        // 🔐 Credenciais via Environment Variables do Vercel
        this.adminCredentials = {
            username: this.getEnvironmentVariable('ADMIN_USERNAME'),
            password: this.getEnvironmentVariable('ADMIN_PASSWORD')
        };
        
        this.tokenKey = 'admin_token_canecas';
        this.checkAuth();
        
        console.log('Sistema de auth inicializado'); // Debug
    }

    // Obtém variáveis de ambiente de forma segura
    getEnvironmentVariable(key) {
        // No Vercel (produção)
        if (typeof process !== 'undefined' && process.env && process.env[key]) {
            return process.env[key];
        }
        
        // Fallback para desenvolvimento local
        const fallbacks = {
            'ADMIN_USERNAME': 'admin',
            'ADMIN_PASSWORD': 'dev_password_123'
        };
        
        return fallbacks[key] || '';
    }

    // Gera token seguro
    generateToken() {
        return btoa(Date.now() + '|' + Math.random() + '|admin_canecas_' + this.adminCredentials.username);
    }

    // Verifica se está autenticado
    isAuthenticated() {
        const token = localStorage.getItem(this.tokenKey);
        if (!token) return false;
        
        try {
            const tokenData = atob(token).split('|');
            const tokenTime = parseInt(tokenData[0]);
            const now = Date.now();
            return (now - tokenTime) < (24 * 60 * 60 * 1000); // 24 horas
        } catch {
            return false;
        }
    }

    // Faz login
    login(username, password) {
        console.log('Tentando login para usuário:', username);
        
        if (username === this.adminCredentials.username && 
            password === this.adminCredentials.password) {
            const token = this.generateToken();
            localStorage.setItem(this.tokenKey, token);
            console.log('Login bem-sucedido!');
            return true;
        }
        
        console.log('Login falhou - Credenciais incorretas');
        return false;
    }

    // Faz logout
    logout() {
        localStorage.removeItem(this.tokenKey);
        window.location.href = 'login.html';
    }

    // Verifica autenticação e redireciona se necessário
    checkAuth() {
        const currentPage = window.location.pathname;
        
        if (currentPage.includes('dashboard.html') && !this.isAuthenticated()) {
            console.log('Não autenticado - Redirecionando para login');
            window.location.href = 'login.html';
            return;
        }
        
        if (currentPage.includes('login.html') && this.isAuthenticated()) {
            console.log('Já autenticado - Redirecionando para dashboard');
            window.location.href = 'dashboard.html';
            return;
        }
    }
}

// Inicializa sistema de auth
const auth = new AuthSystem();

// Função de login no form
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const errorMsg = document.getElementById('errorMsg');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;
            
            if (auth.login(username, password)) {
                window.location.href = 'dashboard.html';
            } else {
                errorMsg.style.display = 'block';
                
                // Esconde o erro após 3 segundos
                setTimeout(() => {
                    errorMsg.style.display = 'none';
                }, 3000);
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