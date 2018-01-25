/* eslint import/first: 0 */
/* eslint no-unused-vars: 0 */

import Backbone from 'backbone';
import $ from 'jquery';

Backbone.$ = $;
import Marionette from 'backbone.marionette';
import 'bootstrap';
import 'backbone.localstorage';

import printThis from './printThis';

// start the marionette inspector
if (window.__agent) {
  window.__agent.start(Backbone, Marionette);
}
