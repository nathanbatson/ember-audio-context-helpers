import Ember from 'ember';

const { inject: { service }, computed, get, set } = Ember;

export default Ember.Helper.extend({
    key: null,
    timeData: null,
    audioContext: service(),

    init(){
        this._super();
        get(this, 'audioContext').addProcessor(this.processor.bind(this));
    },
    
    processor(processedData){
        let key = get(this, 'key');
        let timeData = processedData['time'][key];

        if (timeData !== get(this, 'timeData')) {
            // console.log('timedata');

            // Ember.run.join(() => {
                set(this, 'timeData', timeData);
                this.recompute();
            // });
        }
    },
    
    compute(params, hash) {
        let key = params[0] || 'currentTime';
        set(this, 'key', key);

        return get(this, 'timeData');
    }
});