var express = require('express');
var router = express.Router();

/* GET YFjs SPA. */
router.get('/', function (req, res, next) {
    res.render('spa', {
        title: 'YFjs SPA',
        navIndex: 5
    });
});

module.exports = router;