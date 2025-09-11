const pool = require('../config/db.js');

exports.getAllMissions = async (req, res) => {
    try {
        const [missions] = await pool.query (
            "SELECT m.*, u.nom AS association_nom, u.pseudo AS association_pseudo, u.email AS association_email " +
            "FROM mission m " +
            "JOIN utilisateur u ON m.utilisateur_id = u.id"
        );
    res.json(missions);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

exports.getMissionById = async (req, res) => {
    try {
        const { id } = req.params;
        const [missions] = await pool.query(
        "SELECT * FROM mission WHERE id = ?",
        [id]
    );

    if (missions.length === 0) {
      return res.status(404).json({ message: "Mission non trouvée" });
    }

    res.json(missions[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

exports.createMission = async (req, res) => {
    try {
        if (req.user.role !== 'association') {
            return res.status(403).json({ message: "Accès refusé : seulement pour les associations" });
        }

        const { titre, description, date_debut, date_fin } = req.body;
        const utilisateur_id = req.user.id;

        const [result] = await pool.query(
            "INSERT INTO mission (titre, description, date_debut, date_fin, utilisateur_id) VALUES (?, ?, ?, ?, ?)",
            [titre, description, date_debut, date_fin, utilisateur_id]
        );

    res.status(201).json({ message: "Mission créée avec succès", missionId: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

exports.updateMission = async (req, res) => {
    try {
        if (req.user.role !== 'association') {
            return res.status(403).json({ message: "Accès refusé : seulement pour les associations" });
        }

    const { id } = req.params;
    const { titre, description, date_debut, date_fin } = req.body;

    const [result] = await pool.query(
        "UPDATE mission SET titre = ?, description = ?, date_debut = ?, date_fin = ? WHERE id = ? AND utilisateur_id = ?",
        [titre, description, date_debut, date_fin, id, req.user.id]
    );

    if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Mission non trouvée ou non autorisée" });
    }

    res.json({ message: "Mission mise à jour avec succès" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

exports.deleteMission = async (req, res) => {
    try {
        if (req.user.role !== 'association') {
        return res.status(403).json({ message: "Accès refusé : seulement pour les associations" });
    }

    const { id } = req.params;

    const [result] = await pool.query(
        "DELETE FROM mission WHERE id = ? AND utilisateur_id = ?",
        [id, req.user.id]
    );

    if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Mission non trouvée ou non autorisée" });
    }

    res.json({ message: "Mission supprimée avec succès" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur serveur" });
    }
};