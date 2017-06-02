define('yfjs/spa/util/remote', ['../version', './helpers'], function(Version, _) {

    var Remote = function() {
        return new Remote.Constructor(_.__aslice.call(arguments));
    };

    Remote.NAMESPACE = "Remote";

    Remote.VERSION = Version(Remote.NAMESPACE);

    Remote.instanceof = function(o) {
        return o && o instanceof Remote.Constructor;
    };

    Remote.Constructor = function(args) {
        if (this instanceof Remote.Constructor) {
            this.args = args || [];
            this.length = args.length;
        } else {
            return new Remote.Constructor(args);
        }
    };

    Remote.Constructor.prototype = {
        get: function(index) {
            if (this.length < 1) return;
            if (this.length == 1) {
                return this.args[0];
            }
            if (typeof index === "number") {
                return this.args[index];
            }
            return this.args;
        }
    };

    return Remote;
});