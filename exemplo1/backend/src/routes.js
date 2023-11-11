const { Router } = require('express');

const TesteController = require('./controller/TesteController');

const router = Router()

router.get('/saldo/:conta', TesteController.saldo);
router.get('/transacoes', TesteController.transacoes);
router.post('/depositar', TesteController.depositar);
router.post('/sacar', TesteController.sacar);
router.post('/transferir', TesteController.transferir);
router.get('/account/find/:user_id', TesteController.account);
router.get('/account/list', TesteController.accountlist);


module.exports = router;
