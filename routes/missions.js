const express = require('express');
const router = express.Router();
const missionsController = require('../controllers/missionsController.js');
const authenticateToken = require('../middleware/authMiddleware.js');

router.get('/', authenticateToken, missionsController.getAllMissions);
router.get('/:id', authenticateToken, missionsController.getMissionById);
router.post('/', authenticateToken, missionsController.createMission);
router.put('/:id', authenticateToken, missionsController.updateMission);
router.delete('/:id', authenticateToken, missionsController.deleteMission);

module.exports = router;