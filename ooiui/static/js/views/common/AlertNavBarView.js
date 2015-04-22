var AlertNavBarCollection= Backbone.Collection.extend({
  url:'api/get_mock_alerts',
  parse:function(response){
    if(response){
      return response.Alerts;
    }
    return [];
  }
  
});
var AlertsNavBarView = Backbone.View.extend({
  initialize: function(){
    _.bindAll(this, "render");
    var self = this;
    self.$el.find('#alertList').html('');
    this.collection.fetch({
    success:function(response){
      self.render();
     }
   });
  },
  render: function(){
    var self =this;
    if(this.collection.length !==0){
    this.collection.each(function(model){
      if(model.get("priority") >= 5){
        ooi.trigger('Alert:Level', model);
      }
      var alertNavBarView = new AlertNavBarView({
        model:model
      });
      self.$el.find("#alertList").append(alertNavBarView.el);
     });
    }else{
      self.$el.find('#alertList').html('You have no Alerts');
    }
   },
});

var AlertNavBarView = Backbone.View.extend({
  initialize: function(){
    _.bindAll(this,'render');
    this.render();
  },
  template: JST['ooiui/static/js/partials/AlertDropdownLoggedIn.html'],
  render:function(){
    var self= this;
    this.$el.html(this.template({model:this.model}));
  }
});

var AlertLevelModal = Backbone.View.extend({
    hide: function() {
    this.$el.modal('hide');
  },
  initialize: function() {
    _.bindAll(this, "render", "show" );
    console.log('alert modal');
    this.render();
  },
  show: function() {
    this.$el.find('#modal-alert').modal('show');
  },
  template: JST['ooiui/static/js/partials/AlertLevel.html'],
  render: function() {
      this.$el.html(this.template({model:this.model}));
  }
});


