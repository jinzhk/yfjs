define(['App'], function(App) {
    return App.View({
        statechange: function(prevState) {
            var curState = this.getState();
            if (!curState) {
                curState = prevState;
                prevState = null;
            }
            console.log('['+curState.name+'] statechange - current: [' + curState.label + ']' + (prevState ? ', previous: [' + prevState.label +']' : ''));
        },
        beforeCreate: function(state) {
            console.log('['+state.name+'] state: ' + state.label);
        },
        created: function() {
            console.log('['+this.getState('name')+'] state: ' + this.getState('label'));
        },
        beforeLoad: function() {
            console.log('['+this.getState('name')+'] state: ' + this.getState('label'));
        },
        loaded: function() {
            console.log('['+this.getState('name')+'] state: ' + this.getState('label'));
        },
        beforeReady: function() {
            console.log('['+this.getState('name')+'] state: ' + this.getState('label'));
        },
        ready: function() {
            console.log('['+this.getState('name')+'] state: ' + this.getState('label'));
        },
        beforeDestroy: function() {
            console.log('['+this.getState('name')+'] state: ' + this.getState('label'));
        },
        destroyed: function() {
            console.log('['+this.getState('name')+'] state: ' + this.getState('label'));
        }
    });
});