// Sistema de autenticação seguro para Vercel - VERSÃO CORRIGIDA
class AuthSystem {
    constructor() {
        this.adminCredentials = {
            username: this.getAdminUsername(),
            password: this.getAdminPassword()
        };
        
        this.tokenKey = 'admin_token_canecas';
        this.checkAuth();
    }

    // Obtém username de forma flexível
    getAdminUsername() {
        // 1. Tenta Environment Variable do Vercel
        if (typeof process !== 'undefined' && process.env && process.env.ADMIN_USERNAME) {
            return process.env.ADMIN_USERNAME;
        }
        
        // 2. Tenta via meta tag (fallback)
        const metaUser = document.querySelector('meta[name="admin-username"]');
        if (metaUser) return metaUser.getAttribute('content');
        
        // 3. Fallback para desenvolvimento
        return 'admin';
    }

    // Obtém password de forma flexível
    getAdminPassword() {
        // 1. Tenta Environment Variable do Vercel
        if (typeof process !== 'undefined' && process.env && process.env.ADMIN_PASSWORD) {
            return process.env.ADMIN_PASSWORD;
        }
        
        // 2. Tenta via meta tag (fallback)
        const metaPass = document.querySelector('meta[name="admin-password"]');
        if (metaPass) return metaPass.getAttribute('content');
        
        // 3. Fallback para desenvolvimento
        return 'senha_temporaria';
    }

    // ... resto do código permanece igual
    generateToken() {
        return btoa(Date.now() + '|' + Math.random() + '|admin_canecas_' + this.adminCredentials.username);
    }

    isAuthenticated() {
        const token = localStorage.getItem(this.tokenKey);
        if (!token) return false;
        
        try {
            const tokenData = atob(token).split('|');
            const tokenTime = parseInt(tokenData[0]);
            const now = Date.now();
            return (now - tokenTime) < (24 * 60 * 60 * 1000);
        } catch {
            return false;
        }
    }

    login(username, password) {
        console.log('Tentando login para:', username);
        
        if (username === this.adminCredentials.username && 
            password === this.adminCredentials.password) {
            const token = this.generateToken();
            localStorage.setItem(this.tokenKey, token);
            return true;
        }
        return false;
    }

    logout() {
        localStorage.removeItem(this.tokenKey);
        window.location.href = 'login.html';
    }

    checkAuth() {
        const currentPage = window.location.pathname;
        
        if (currentPage.includes('dashboard.html') && !this.isAuthenticated()) {
            window.location.href = 'login.html';
            return;
        }
        
        if (currentPage.includes('login.html') && this.isAuthenticated()) {
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
                setTimeout(() => {
                    errorMsg.style.display = 'none';
                }, 3000);
            }
        });
    }
});

function logout() {
    auth.logout();
}

window.addEventListener('load', function() {
    auth.checkAuth();
});
