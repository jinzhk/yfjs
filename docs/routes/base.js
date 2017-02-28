var express = require('express');
var router = express.Router();

/* GET base css. */
router.get('/', function (req, res, next) {
    res.render('base', {
        title: 'YFjs Base CSS',
        navIndex: 2
    });
});

module.exports = router;