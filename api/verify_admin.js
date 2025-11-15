import { initializeApp } from 'firebase/app';
import { getAuth, verifyIdToken } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCMsa3SDt1ACXY3_S5Rx_xPq0_zUvwAzq0",
  // ... suas credenciais
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default async function handler(req, res) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    const decodedToken = await verifyIdToken(auth, token);
    const userEmail = decodedToken.email;
    
    // ⚠️ LISTA DE EMAILS PERMITIDOS - SEGURO NO SERVIDOR
    const allowedEmails = [
      'andre.matioli92@gmail.com',
    ];
    
    if (allowedEmails.includes(userEmail)) {
      return res.json({ 
        success: true, 
        email: userEmail,
        isAdmin: true 
      });
    } else {
      return res.status(403).json({ 
        error: 'Acesso não autorizado' 
      });
    }
    
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
}
