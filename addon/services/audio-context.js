import Ember from 'ember';

const { Service, computed, get, set } = Ember;
const freqRanges = [
    {
        name: 'lowpass',
        low: 0,
        high: 10
    },
    {
        name: 'bandpass',
        low: 11,
        high: 64
    },
    {
        name: 'highpass',
        low: 65,
        high: 128
    },
    {
        name: 'volume',
        low: 0,
        high: 128
    }
]

export default Service.extend({
    ctx: null,
    analyser: null,
    bufferLength: 0,
    frequencyData: null,
    sourceElement: null,
    audioElement: null,
    processors: [],

    init() {
        this._super(...arguments);
        let ctx = new (window.AudioContext || window.webkitAudioContext)();
        let analyser = ctx.createAnalyser();

        set(this, 'ctx', ctx);
        set(this, 'analyser', analyser);
    },

    connect(audioElement) {
        let ctx = get(this, 'ctx');
        let analyser = get(this, 'analyser');
        let source = ctx.createMediaElementSource(audioElement);

        source.connect(analyser);
        analyser.connect(ctx.destination);
        analyser.fftSize = 1024;

        let bufferLength = analyser.frequencyBinCount;
        console.log(bufferLength);
        let frequencyData = new Uint8Array(bufferLength);

        set(this, 'bufferLength', bufferLength);
        set(this, 'frequencyData', frequencyData);
        set(this, 'audioElement', audioElement)
        requestAnimationFrame(this.process.bind(this));
    },

    addProcessor(func) {
        let processors = get(this, 'processors');
        processors.push(func);
    },

    /* TODO: wire up multiple analysers with BiquadFilterNodes for better quality values */ 

    process() {
        let animationFrame = requestAnimationFrame(this.process.bind(this));
        set(this, 'animationFrame', animationFrame);
        
        let audioElement = get(this, 'audioElement');
        let processors = get(this, 'processors');
        let bufferLength = get(this, 'bufferLength');
        let frequencyData = get(this, 'frequencyData');
        let analyser = get(this, 'analyser');
        let processedData = {};

        analyser.getByteFrequencyData(frequencyData);

        freqRanges.forEach(function(freqRange){
            let sampleTotal = 0;
            let sampleAvg = 0;
            let sampleHigh = 0;

            for(let i=freqRange.low; i<freqRange.high; i++){
                let sample = frequencyData[i];
                
                sampleTotal += sample;
                sampleHigh = sampleHigh < sample ? sample : sampleHigh;
            }

            processedData[freqRange.name] = {
                total: sampleTotal,
                average: sampleTotal/(freqRange.high - freqRange.low),
                high: sampleHigh
            }
        });

        processedData['time'] = {
            duration: audioElement.duration,
            currentTime: audioElement.currentTime,
            percentComplete: Math.round((audioElement.currentTime/audioElement.duration) * 10000) / 10000
        }

        Ember.run.join(() => {
            processors.forEach(function(callback){
                callback(processedData);
            });
        });
    }
});
