// /api/verify-admin.js
import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

// Configuração a partir das Environment Variables
const serviceAccount = {
  type: "service_account",
  project_id: "canecas-personalizadas-5c03c",
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
};

// Inicializa Firebase Admin
const app = initializeApp({
  credential: cert(serviceAccount)
});

const auth = getAuth(app);

// ⚠️ LISTA SEGURA DE ADMINS - APENAS NO SERVIDOR
// SUBSTITUA PELOS SEUS EMAILS REAIS!
const ADMIN_EMAILS = [
  'seu-email-principal@gmail.com',    // ⚠️ SEU EMAIL AQUI
  'seu-email-backup@gmail.com'        // ⚠️ EMAIL DE BACKUP (OPCIONAL)
];

export default async function handler(req, res) {
  // Habilita CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ error: 'Token não fornecido' });
    }

    console.log('🔐 Verificando token no servidor...');

    // 🔒 VERIFICAÇÃO NO SERVIDOR - IMPOSSÍVEL DE BURLAR
    const decodedToken = await auth.verifyIdToken(idToken);
    const userEmail = decodedToken.email;
    
    console.log('📧 Email verificado:', userEmail);

    // Verifica se o email está na lista de admins
    const isAdmin = ADMIN_EMAILS.includes(userEmail);
    
    if (isAdmin) {
      console.log('✅ Acesso ADMIN concedido para:', userEmail);
      
      return res.json({
        success: true,
        email: userEmail,
        isAdmin: true,
        name: decodedToken.name || userEmail.split('@')[0],
        message: 'Acesso administrativo concedido'
      });
    } else {
      console.log('🚫 Acesso negado para:', userEmail);
      
      // Log de segurança
      console.warn('🛡️ Tentativa de acesso não autorizado:', {
        email: userEmail,
        timestamp: new Date().toISOString(),
        userAgent: req.headers['user-agent']
      });
      
      return res.status(403).json({
        success: false,
        error: 'Acesso não autorizado',
        message: 'Este email não tem permissão de administrador'
      });
    }

  } catch (error) {
    console.error('💥 Erro na verificação:', error);
    
    return res.status(401).json({
      success: false,
      error: 'Token inválido ou expirado',
      message: 'Falha na verificação de segurança'
    });
  }
}
