const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN"

    if (!token) return res.status(401).json({ message: 'Token manquant' });

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        req.user = user; // stocke l'ID et le rôle de l'utilisateur
        next(); // passe au controller
    } catch {
        return res.status(403).json({ message: 'Token invalide' });
    }
}

module.exports = authenticateToken;