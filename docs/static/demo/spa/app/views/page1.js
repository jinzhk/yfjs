define(['App'], function(App) {
    return App.View({
        beforeDestroy: function() {
            return "离开 Page 1？";
        },
        destroyed: function() {
            console.log('['+this.getState('name')+'] state: ' + this.getState('label'));
        }
    });
});