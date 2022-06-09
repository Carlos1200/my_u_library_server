const {Router} = require('express');

const router = Router();

router.get('/', async(req, res) => {
    res.json({
        message: 'Hello World'
    })
})

module.exports = router;