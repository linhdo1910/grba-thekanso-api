    const express = require('express');
    const router = express.Router();
    const customizeController = require('../controllers/customizeController');

    router.post('/', customizeController.createLayout);
    router.get('/:id', customizeController.getLayout);
    router.put('/:id', customizeController.updateLayout);
    router.delete('/:id', customizeController.deleteLayout);

    module.exports = router;
