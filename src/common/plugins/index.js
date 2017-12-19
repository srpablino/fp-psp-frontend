import Backbone from 'backbone';
import $ from 'jquery';
import printJS from 'print-js';

Backbone.$ = $;
import Marionette from 'backbone.marionette';
import 'bootstrap';
import 'backbone.localstorage';
import printThis from 'print-this';

// start the marionette inspector
if (window.__agent) {
  window.__agent.start(Backbone, Marionette);
}
