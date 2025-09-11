const express = require('express');
const router = express.Router();
const candidaturesController = require('../controllers/candidaturesController');
const authenticateToken = require('../middleware/authMiddleware');

router.get('/mes-candidatures', authenticateToken, candidaturesController.getCandidaturesUtilisateur);
router.get('/mission/:missionId', authenticateToken, candidaturesController.getCandidaturesByMission);
router.post('/', authenticateToken, candidaturesController.createCandidature);
router.put('/:candidatureId', authenticateToken, candidaturesController.updateCandidatureStatus);

module.exports = router;