"use strict";


var IrmingerSeaDetailedInfrastructureView = Backbone.View.extend({

  initialize: function() {
    _.bindAll(this, "render");
    var self = this;
    self.render();
  },
  template: JST['ooiui/static/js/partials/IrmingerSeaDetailedInfrastructure.html'],
  render: function() {
    this.$el.html(this.template());
  } 
});
