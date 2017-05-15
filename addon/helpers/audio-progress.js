import Ember from 'ember';
import audioProcessor from 'ember-audio-animation/helpers/mixins/audio-processor';

const { inject: { service }, get, set } = Ember;

export default Ember.Helper.extend(audioProcessor, {
    key: null,
    timeData: null,
    
    processor(processedData){
        let key = get(this, 'key');
        let timeData = processedData['time'][key];

        if (timeData !== get(this, 'timeData')) {
            set(this, 'timeData', timeData);
            this.recompute();
        }
    },
    
    compute(params) {
        let key = params[0] || 'currentTime';
        set(this, 'key', key);

        return get(this, 'timeData');
    }
});