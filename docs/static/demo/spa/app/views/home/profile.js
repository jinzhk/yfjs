define(['App'], function(App) {
    return App.View({
        // 数据源
        data: function() {
            var user = App.cookie.get('user') || {};
            return {
                username: user.username,
                password: user.password
            };
        }
    });
});