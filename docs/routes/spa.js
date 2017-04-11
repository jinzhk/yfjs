var express = require('express');
var router = express.Router();

/* GET YFjs SPA. */
router.get('/', function (req, res, next) {
    res.render('spa', {
        title: 'YFjs SPA',
        navIndex: 5
    });
});

/* GET YFjs SPA Demo. */
router.get('/demo', function (req, res, next) {
    res.render('spa/index', {
        title: 'YFjs SPA Demo',
        layout: false
    });
});

module.exports = router;