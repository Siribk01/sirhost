const router = require('express').Router();
const c = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/stats',       protect, adminOnly, c.getStats);
router.get('/',            protect, adminOnly, c.getAll);
router.post('/',           protect, adminOnly, c.create);
router.put('/:id/status',  protect, adminOnly, c.updateStatus);
router.delete('/:id',      protect, adminOnly, c.remove);

module.exports = router;
