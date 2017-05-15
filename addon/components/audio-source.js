import Ember from 'ember';
import layout from '../templates/components/audio-source';

const { Component, computed, get, inject: { service } } = Ember;

export default Component.extend({
	audioContext: service(),
	layout,
	src: null,
	tagName: 'audio',
	attributeBindings: ['cleanSrc:src', 'controls:controls'],
	controls: false,

	cleanSrc: computed('src', function() {
		return this.get('src') || '';
	}),

	didInsertElement: function() {
		get(this, 'audioContext').connect(this.$()[0]);
	},

	actions: {
		play: function() {
			this.$()[0].play();
		},

		pause: function() {
			this.$()[0].pause();
		},

		seek: function(position) {
			this.$()[0].currentTime = position;
		}
	}
});