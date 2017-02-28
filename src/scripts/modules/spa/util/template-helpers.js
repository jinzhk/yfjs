define('yfjs/spa/util/template-helpers', ['./helpers'], function(_) {

    var JSON = _.JSON;

    return {
        trim: function(s) {
            return _.trim(s);
        },
        trimLeft: function(s) {
            return _.trimLeft(s);
        },
        trimRight: function(s) {
            return _.trimRight(s);
        },
        // types
        otype: function(o) {
            return _.otype(o);
        },
        is$: function(o) {
            return _.is$(o);
        },
        isUndef: function(o) {
            return _.isUndef(o);
        },
        eqNull: function(o) {
            return _.eqNull(o);
        },
        isNull: function(o) {
            return _.isNull(o);
        },
        notNull: function(o) {
            return _.notNull(o);
        },
        isNumber: function(o) {
            return _.isNumber(o);
        },
        isBoolean: function(o) {
            return _.isBoolean(o);
        },
        isString: function(o) {
            return _.isString(o);
        },
        isObject: function(o) {
            return _.isObject(o);
        },
        isPlainObject: function(o) {
            return _.isPlainObject(o);
        },
        isArray: function(o) {
            return _.isArray(o);
        },
        isFunction: function(o) {
            return _.isFunction(o);
        },
        isEmpty: function(o) {
            return _.isEmpty(o);
        },
        inArray: function(o, array) {
            return _.inArray(o, array);
        },
        // json
        stringify: function(o) {
            if (!_.notNull(o)) return '';
            if (!_.isObject(o)) return _.trim(o);
            return JSON.stringify(o);
        },
        parseJSON: function(os) {
            os = _.trim(os);
            if (!os.length) return {};
            return JSON.parse(os);
        }
    };
});