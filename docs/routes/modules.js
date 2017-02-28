var express = require('express');
var router = express.Router();

/* GET YFjs Modules. */
router.get('/', function (req, res, next) {
    res.render('modules', {
        title: 'YFjs Modules',
        navIndex: 4
    });
});

module.exports = router;