import Ember from 'ember';

export default Ember.Controller.extend({
    demoArray: Ember.computed('size', function(){
        return new Array(25);
    })
});
