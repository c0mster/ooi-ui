"use strict";


var PioneerInfrastructureTablesView = Backbone.View.extend({

  initialize: function() {
    _.bindAll(this, "render");
    var self = this;
    self.render();
  },
  template: JST['ooiui/static/js/partials/PioneerInfrastructureTables.html'],
  render: function() {
    this.$el.html(this.template());
  } 
});
