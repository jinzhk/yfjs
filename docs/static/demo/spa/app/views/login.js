define(['App', 'bs/popover'], function(App) {
    return App.View({
        style: "login.css",
        ready: function() {
            this.bind('click', '#btn-submit', this.doSubmit);
            this.bind('focus', '#username,#password', this.destroyTip);
        },
        doSubmit: function() {
            var $username = this.$("#username"),
                $password = this.$("#password");

            var formData = {
                username: $username.val(),
                password: $password.val()
            };

            if (!formData.username) {
                this.errorTip($username, "请输入用户名！");
                return this;
            }

            if (!formData.password) {
                this.errorTip($password, "请输入密码！");
                return this;
            }

            var self = this;

            self.ajax.get("/data/login.json", formData, function(err, resp) {
                App.cookie.set('user', formData);
                App.go(self.getParam('callback') || "/");
            });
        },
        errorTip: function($tar, msg) {
            $tar.popover({
                className: "popover-danger",
                placement: "left top",
                content: '<i class="glyphicon glyphicon-exclamation-sign"></i> ' + (msg || ''),
                trigger: 'manual',
                html: true
            }).popover("show");
        },
        destroyTip: function(e) {
            $(e.currentTarget).popover("destroy");
        }
    });
});