var express = require('express');
var router = express.Router();

/* GET Home Page. */
router.get('/', function (req, res, next) {
    res.render('index', {
        title: 'YFjs Library',
        navIndex: 1
    });
});

module.exports = router;
