define(['yfjs/spa'], function(SPA) {
    SPA.create({
        // 配置项 baseUrl
        baseUrl: {
            style: "/assets/css",
            resource: "/assets"
        },
        View: {
            layout: "default"
        },
        filter: {
            name: "login",
            access: function() {
                var loginFilter = this.getFilter('login');
                return loginFilter.exclude(this.getPath()) || this.hasLogin();
            },
            do: function() {
                var curUrl = this.getState('url');
                this.go(this.getUrl('/login', {callback: curUrl}));
            },
            includes: ['*'],
            excludes: ['/login$']
        },
        // 扩展功能
        doSomething: function() {
            return "do " + this.getSomething();
        },
        getSomething: function() {
            return "something.";
        },
        hasLogin: function() {
            return !!this.cookie.get('user');
        },
        // 生命周期
        statechange: function(prevState) {
            var curState = this.getState();
            if (!curState) {
                curState = prevState;
                prevState = null;
            }
            console.log('app statechange - current: [' + curState.label + ']' + (prevState ? ', previous: [' + prevState.label +']' : ''));
        },
        beforeCreate: function(state) {
            console.log('app state: ' + state.label);
        },
        created: function() {
            console.log('app state: ' + this.getState('label'));
        },
        beforeReady: function() {
            console.log('app state: ' + this.getState('label'));
        },
        ready: function() {
            console.log('app state: ' + this.getState('label'));
        },
        beforeLoad: function() {
            console.log('app state: ' + this.getState('label'));
        },
        loaded: function() {
            console.log('app state: ' + this.getState('label'));
        },
        beforeDestroy: function() {
            console.log('app state: ' + this.getState('label'));
        },
        destroyed: function() {
            console.log('app state: ' + this.getState('label'));
        }
    });
});