define(['App', 'bs/tab'], function(App) {
    return App.View({
        // 配置项 layout
        layout: "default",
        // 配置项 ready
        ready: function() {
            console.log(
                this.doSomething()
            );
            var $tab = this.$('#tab-profile');
            this.bind("shown.bs.tab", $('a[data-toggle="tab"]', $tab), function(e) {
                var $this = $(e.currentTarget),
                    href = $this.attr('href');
                if (/#list$/.test(href)) {
                    var $tabPane = this.$("#list");
                    this.load($tabPane);
                }
            });
        },
        // 扩展功能
        doSomething: function() {
            return App.doSomething();
        }
    });
});