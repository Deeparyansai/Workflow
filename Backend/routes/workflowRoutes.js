const express = require('express');
const workflowController = require('../controllers/workflowController');
const router = express.Router();
const multer = require('multer');
const requireSignIn = require('../middlewares/authMiddleware');


const upload = multer({ dest: 'uploads/' }); 


// Save workflow route
router.post('/save', requireSignIn , workflowController.saveWorkflow);

// List workflows route
router.get('/list', requireSignIn , workflowController.listWorkflows);

// Route to execute workflow
router.post('/execute', requireSignIn , upload.single('file'), workflowController.executeWorkflowEndpoint);


module.exports = router;
