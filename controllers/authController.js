const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

exports.register = async (req, res) => {
    const { nom, prenom, pseudo, email, password, role } = req.body;

    if (!role || !["benevole", "association"].includes(role)) {
        return res.status(400).json({ message: "Rôle invalide : choisissez 'benevole' ou 'association'" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await pool.query(
            "INSERT INTO utilisateur (nom, prenom, pseudo, email, mot_de_passe, role) VALUES (?, ?, ?, ?, ?, ?)",
            [nom, prenom, pseudo, email, hashedPassword, role]
        );

    res.status(201).json({ message: "Utilisateur créé avec succès", userId: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

exports.login = async (req, res) => {
    const { identifier, password } = req.body;

    const [rows] = await pool.query (
        "SELECT * FROM utilisateur WHERE email = ? OR pseudo = ?",
        [identifier, identifier]
    );

    if (rows.length === 0) return res.status(401).json({ message: "Identifiant ou mot de passe incorrect" });

    const user = rows[0];
    const isValid = await bcrypt.compare(password, user.mot_de_passe);
    if (!isValid) return res.status(401).json({ message: "Identifiant ou mot de passe incorrect" });

    const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
    );

    res.json({ message: "Connexion réussie", token });
};