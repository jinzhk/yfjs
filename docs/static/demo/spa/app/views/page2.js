define(['App'], function(App) {
    return App.View({
        ready: function() {
            var name = this.getCache('name');
            if (name) {
                console.log('['+this.getState('name')+'] get cache "name": ' + name);
                this.removeCache('name');
            } else {
                name = this.getState('name');
                this.setCache('name', name);
                console.log('['+name+'] set cache "name": ' + name);
            }
        },
        destroyed: function() {
            console.log('['+this.getState('name')+'] state: ' + this.getState('label'));
        }
    });
});