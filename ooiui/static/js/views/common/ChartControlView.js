"use strict";
/*
 * ooiui/static/js/views/common/CharControlView.js
 * An extension of Backbone.Model that manages relations with a back-ref id
 *
 * Dependencies
 * Libs
 * - ooiui/static/lib/underscore/underscore.js
 * - ooiui/static/lib/backbone/backbone.js
 * - ooiui/static/js/ooi.js
 * Usage
 */

var ChartControlView = Backbone.View.extend({
  events: {
    'click button' : 'onClick'
  },
  initialize: function() {
    _.bindAll(this, "render", "onClick");
    this.render();
  },
  onClick: function(e) {
    console.log("Button clicked");
    this.trigger('button:click');
  },
  render: function() {
    this.$el.html('<button type="button" class="btn btn-default navbar-btn">I hate facebook and twitter and all that crap</button>');
  }
});
