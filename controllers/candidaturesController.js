const pool = require('../config/db.js');

exports.createCandidature = async (req, res) => {
    try {
    const userId = req.user.id; // c'est le JWT de l'utilisateur authentifié
    const { missionId } = req.body;

    if (req.user.role !== 'benevole') {
      return res.status(403).json({ message: "Accès refusé : seulement pour les bénévoles" });
    }

    const [existing] = await pool.query(
      "SELECT * FROM candidature WHERE utilisateur_id = ? AND mission_id = ?",
      [userId, missionId]
    );
    if (existing.length > 0) {
      return res.status(400).json({ message: "Vous avez déjà postulé à cette mission" });
    }

    const [result] = await pool.query(
      "INSERT INTO candidature (date_candidature, statut, utilisateur_id, mission_id) VALUES (?, 'en attente', ?, ?)",
      [new Date(), userId, missionId]
    );

    res.status(201).json({ message: "Candidature créée avec succès", candidatureId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.getCandidaturesUtilisateur = async (req, res) => {
  try {
    const userId = req.user.id; // récupéré depuis le JWT
    if (req.user.role !== 'benevole') {
      return res.status(403).json({ message: "Accès refusé : seulement pour les bénévoles" });
    }

    const [candidatures] = await pool.query(
      `SELECT c.id, c.date_candidature, c.statut, 
              m.id AS mission_id, m.titre, m.description, m.date_debut, m.date_fin
       FROM candidature c
       JOIN mission m ON c.mission_id = m.id
       WHERE c.utilisateur_id = ?`,
      [userId]
    );

    res.json(candidatures);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.getCandidaturesByMission = async (req, res) => {
  try {
    const { missionId } = req.params;
    if (req.user.role !== 'association') {
      return res.status(403).json({ message: "Accès refusé : seulement pour les associations" });
    }

    const [candidatures] = await pool.query(
      `SELECT c.*, u.nom, u.prenom, u.pseudo
       FROM candidature c
       JOIN utilisateur u ON c.utilisateur_id = u.id
       WHERE c.mission_id = ?`,
      [missionId]
    );

    res.json(candidatures);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.updateCandidatureStatus = async (req, res) => {
  try {
    const { candidatureId } = req.params;
    const { statut } = req.body;
    if (req.user.role !== 'association') {
      return res.status(403).json({ message: "Accès refusé : seulement pour les associations" });
    }

    if (!['acceptée', 'refusée'].includes(statut)) {
      return res.status(400).json({ message: "Statut invalide" });
    }

    await pool.query(
      "UPDATE candidature SET statut = ? WHERE id = ?",
      [statut, candidatureId]
    );

    res.json({ message: "Statut de la candidature mis à jour" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};