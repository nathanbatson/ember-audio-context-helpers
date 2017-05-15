import Ember from 'ember';

const { inject: { service }, get, set } = Ember;

export default Ember.Mixin.create({
    audioContext: service(),
    helperId: null,

    init(){
        let helperId = get(this, 'audioContext').addProcessor(this.processor.bind(this));
        set(this, 'helperId', helperId);
        this._super();
    },

    willDestroy(){
        get(this, 'audioContext').removeProcessor(get(this, 'helperId'));
    },
});
