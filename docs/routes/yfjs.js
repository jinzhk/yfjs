var express = require('express');
var router = express.Router();

/* GET YFjs tools. */
router.get('/', function (req, res, next) {
    res.render('yfjs', {
        title: 'YFjs Base CSS',
        navIndex: 3
    });
});

module.exports = router;