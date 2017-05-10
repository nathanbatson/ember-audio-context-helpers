import Ember from 'ember';
import layout from '../templates/components/audio-source';

const { Component, computed, get, set, inject: { service } } = Ember;

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
		const element = this.$();
		let audioContext = get(this, 'audioContext');

		element.on('durationchange', () => {
			Ember.run(() => {
				this.sendAction('durationChange', element[0].duration);
			});
		});

		element.on('loadedmetadata', () => {
			Ember.run(() => {
				this.sendAction('loadedMetadata');
			});
		});

		element.on('ended', () => {
			Ember.run(() => {
				this.sendAction('ended');
			});
		});

		element.on('timeupdate', () => {
			Ember.run(() => {
				this.sendAction('timeUpdate', element[0].currentTime);
			});
		});

		audioContext.connect(element[0]);
	},

	willDestroyElement: function() {
		this.$().off('durationchange loadedmetadata ended timeupdate');
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