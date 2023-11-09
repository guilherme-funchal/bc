const { Router } = require('express');

const TesteController = require('./controller/TesteController');

const router = Router()

router.get('/saldo/:conta', TesteController.saldo);
router.get('/transacoes', TesteController.transacoes);
router.post('/cunhar', TesteController.cunhar);
router.post('/transferir', TesteController.transferir);

module.exports = router;
