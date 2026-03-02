const router = require('express').Router();
const c = require('../controllers/contactController');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/',            c.submit);
router.get('/',             protect, adminOnly, c.getAll);
router.put('/:id',          protect, adminOnly, c.updateStatus);
router.post('/:id/reply',   protect, adminOnly, c.reply);
router.delete('/:id',       protect, adminOnly, c.remove);

module.exports = router;
