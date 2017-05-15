import Ember from 'ember';
import AudioProcessorMixin from 'ember-audio-animation/mixins/audio-processor';
import { module, test } from 'qunit';

module('Unit | Mixin | audio processor');

// Replace this with your real tests.
test('it works', function(assert) {
  let AudioProcessorObject = Ember.Object.extend(AudioProcessorMixin);
  let subject = AudioProcessorObject.create();
  assert.ok(subject);
});
