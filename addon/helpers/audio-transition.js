import Ember from 'ember';

const { inject: { service }, computed, get, set } = Ember;

export default Ember.Helper.extend({
    threshold: null,
    tripped: false,
    audioContext: service(),

    init(){
        this._super();
        get(this, 'audioContext').addProcessor(this.processor.bind(this));
    },
    
    processor(processedData){
        let shouldTrip = false;
        let tripped = get(this, 'tripped');
        let filter = get(this, 'filter');
        let sample = get(this, 'sample');
        let threshold = get(this, 'threshold');

        shouldTrip = get(processedData, filter + '.' + sample) >= threshold;

        if (filter) {
            Ember.run.join(() => {
                set(this, 'tripped', shouldTrip);

                if(tripped !== shouldTrip) {
                    this.recompute();
                }      
            });
        }
    },
    
    compute(params, hash) {
        let filter = params[0] || 'allpass';
        let threshold = get(hash, 'threshold') || 150;
        let sample = get(hash, 'sample') || 'average';

        set(this, 'threshold', threshold);
        set(this, 'filter', filter);
        set(this, 'sample', sample);

        return get(this, 'tripped') ? get(hash, 'onClass') : get(hash, 'offClass');
    }
});