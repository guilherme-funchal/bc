const { Router } = require('express');

const TesteController = require('./controller/TesteController');

const router = Router()

router.get('/listar', TesteController.listar);
router.get('/buscar/:id', TesteController.buscar);
router.post('/inserir', TesteController.inserir);
router.delete('/excluir/:id', TesteController.excluir);
router.patch('/atualizar', TesteController.atualizar);

module.exports = router;
