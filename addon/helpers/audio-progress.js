import Ember from 'ember';

const { inject: { service }, get, set } = Ember;

export default Ember.Helper.extend({
    audioContext: service(),

    key: null,
    timeData: null,

    init(){
        this._super();
        get(this, 'audioContext').addProcessor(this.processor.bind(this));
    },
    
    processor(processedData){
        let key = get(this, 'key');
        let timeData = processedData['time'][key];

        if (timeData !== get(this, 'timeData')) {
            set(this, 'timeData', timeData);
            this.recompute();
        }
    },
    
    compute(params, hash) {
        let key = params[0] || 'currentTime';
        set(this, 'key', key);

        return get(this, 'timeData');
    }
});