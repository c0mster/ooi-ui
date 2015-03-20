/*
 *
 * 
 * ooiui/static/js/models/common/FilterViewModel.js
 * Validation model for Alerts and Alarms Page.
 *
 * Dependencies
 * Partials
 * - ooiui/static/js/partials/compiled/alertPage.js
 * Libs
 * - ooiui/static/lib/underscore/underscore.js
 * - ooiui/static/lib/backbone/backbone.js
 * Usage
 * 
 */

Backbone.Validation.configure({
    forceUpdate: true
});

// Extend the callbacks to work with Bootstrap, as used in this example
// See: http://thedersen.com/projects/backbone-validation/#configuration/callbacks
_.extend(Backbone.Validation.callbacks, {
    valid: function (view, attr, selector) {
        var $el = view.$('[name=' + attr + ']'),
            $group = $el.closest('.form-group');

        $group.removeClass('has-error');
        $group.find('.help-block').html('').addClass('hidden');
    },
    invalid: function (view, attr, error, selector) {
        var $el = view.$('[name=' + attr + ']'),
            $group = $el.closest('.form-group');

        $group.addClass('has-error');
        $group.find('.help-block').html(error).removeClass('hidden');
    }
});

// collections are example only
var AlertCollection = Backbone.Collection.extend({
  url: '/api/array',
  parse: function(response, options){
    return response.arrays;
  }
});
//example only
var AssetTen = Backbone.Collection.extend({
  url:'json/asset_ten.json',
  parse: function(response, options){
    return response.assets[0].metaData;
  }
});
var PostCollection = Backbone.Collection.extend({
  url:'/alert',
  nextOrder: function() {
    if(!this.length){
      return 1;
    }
    return this.last().get('alert_id')+1;
  },
});

//Validations is turned off!!

var AlertFilterView = Backbone.View.extend({
           
 
 // template: JST['ooiui/static/js/partials/AlertFilter.html'],

 


   events: {
        'click #saveAlert': function (e) {
            e.preventDefault();
            this.submit();
        },
        'click #RemoveConditions':function(e) {
          e.preventDefault();
          this.removeConditions(e);
        },
            },

    // Use stickit to perform binding between
    // the model and the view
    // See: https://github.com/NYTimes/backbone.stickit
    bindings: {
        '[name=array]': {
            observe: 'array',
            selectOptions: {
                collection: []
            },

            setOptions: {
                validate:true 
            }
        },
        '[name=Platform]': {
            observe: 'Platform',
            setOptions: {
                validate: false
            }
        },
        '[name=Instrument]': {
            observe: 'Instrument',
            selectOptions:{
              collections: []
            },
            setOptions: {
                validate: false
            }
        },
        '[name=ConditionsFilter]': {
            observe: 'ConditionsFilter',
            selectOptions:{
              collections: [],
              valuePath:'key',
              valueLabel:'Select To Add Filter',

              defaultOption:{
                label: 'Select To Add Filter'
              }  
            },
            onSet: function(val){
              this.addConditions(val);

              return val;
              
              
            },

            setOptions: {
                validate: false
            }
        },
         '[name=Email]': {
            observe: 'Email',
            setOptions: {
                validate: false
            }
          },
           '[name=Redmine]': {
            observe: 'Redmine',
            setOptions: {
                validate: false
            }
          },

           '[name=PhoneCall]': {
            observe: 'PhoneCall',
            setOptions: {
                validate: true
            }
          },

           '[name=TextMessage]': {
            observe: 'TextMessage',
            setOptions: {
                validate: false
            }
          },
            '[name=LogEvent]': {
            observe: 'LogEvent',
            setOptions: {
                validate: false
            }
          },





        
    },

    initialize: function () {
        // This hooks up the validation
        // See: http://thedersen.com/projects/backbone-validation/#using-form-model-validation/validation-binding
        Backbone.Validation.bind(this);
        _.bindAll(this, "render", "submit", "remove", "addConditions", "removeConditions" );
        //Cannot listen for a change, easily. All html elems are linked to the model
        //any event will be heard and then change the DOM, 
        //
        //
        //I need to create a collection that holds all of the alert data. alerts table
        //{id: 1, asset_id:10, user_id : 70, user_name: Bob, assignee_id: 64, assignee_name: Dan, symbot: >, alert: Longitude, priority:5, date: 12-12-12} 
        var self = this;


        this.OptionalModel = Backbone.Model.extend();
          //example only
         //collections will be moved to main html page
          ooi.collections.assetTen.fetch({
            success: function(collection, response){
             
              return this;
            }
          });
         this.collection.fetch({
             success: function(collection, response){
             self.render();

             return this ; 
             }
          });
         return this;
    },

    render: function () {
        
        var assetTen = ooi.collections.assetTen;
        this.bindings["[name=ConditionsFilter]"].selectOptions.collection = (ooi.collections.assetTen.pluck('key'));
        this.bindings["[name=array]"].selectOptions.collection = this.collection.pluck('display_name');
        this.bindings["[name=Instrument]"].selectOptions.collection = [ "Mooring", "Sensor", "Sensor Part", "Coastal Glider", "Open Ocean Glider"]; 

        this.stickit();
        return this;
    },
    addConditions: function(val){
      //adds a div and input under conditions on the html
      //adds bindings 
      var value = val.replace(/\s+/g, '_');
      var value_description = value + '_description';
      var value_priority = value + '_priority';
      var value_symbol = value + '_symbol';
      var value_user= value + '_user';
 

     $('#Conditions').prepend('<div class="form-group"> <div class="form-control"  name='+value+'> '+ val +' </div> <span class="help-block hidden"></span> </div>');

     $('#SymbolInput').prepend(' <div class="form-group"><select class="form-control" id='+value_symbol+' > <option> > </option> <option> < </option> <option> = </option> </select> <span class="help-block hidden"></span></div>');
         
         
     $('#ConditionsInput').prepend('<div class="form-group"> <input class="form-control" id='+value+'></input> <span class="help-block hidden"></span></div>');
     
     $('#RemoveConditions').append('<div class="form-group "> <button class="btn btn-success" id='+  value   + '>'+ 'X' +' </button> <span class="help-block hidden"></span></div>');


     $('#addtionalInformation').prepend('<div name='+value+' class="row col-sm-12"> <div class="col-sm-12"> <div class="form-group"> <label for="Name" class="col-sm-3 control-label">Name</label> <div class="col-sm-9"><div class="form-control"  name='+value+'> '+ val +' </div> <span class="help-block hidden"></span> </div> </div> </div> <div class="col-sm-12"> <div class="form-group"> <label for="priority" class="col-sm-3 control-label">Priority</label> <div class="col-sm-9"> <select class="form-control" id='+value_priority+' > <option>Low</option> <option>Normal</option> <option>High</option> <option>Urgent</option> <option>Immediate</option> </select> <span class="help-block hidden"></span> </div> </div> </div> <div class="col-sm-12"> <div class="form-group"> <label for="lastname" class="col-sm-3 control-label">Description</label> <div class="col-sm-9"> <textarea type="text" class="form-control" id='+value_description+'/></textarea> <span class="help-block hidden"></span> </div> </div> </div><hr width="80%"> </div> ');

     $('#Users').prepend('<div class="form-group"><select class="form-control" id='+value_user +'> </select> <span class="help-block hidden"></span> </div>');


     var optionalModel = new this.OptionalModel();
     optionalModel.set({'alert':value, 'alert_id': ooi.collections.post.nextOrder()});
     
     this.addBinding(optionalModel, '#'+value_description, 'description');
     this.addBinding(optionalModel, '#'+value_priority, 'priority');
     this.addBinding(optionalModel, '#'+value, 'alert_input');
     this.addBinding(optionalModel, '#'+value_symbol, {
       observe:'symbol',
       selectOptions:{
         collection: ['<', '>', '='],
         defaultOption:{
           label:"Select Symbol"
         }
       }
     });
     this.addBinding(optionalModel, '#'+value_user, {
       observe:'user',
       selectOptions: {
         collection : ['Administrator','Operator', 'Science User','Current User'],
         defaultOption: {
          label: 'Select To Add Filter'
           }
       }

       
     } );
     //console.log(this.model.validate(value));

     ooi.collections.post.add(optionalModel);
     console.log(ooi.collections.post);
    },
    submit: function () {
        var self = this;
        // Check if the model is valid before saving
        // See: http://thedersen.com/projects/backbone-validation/#methods/isvalid
        //console.log(this.model.validate();
        console.log(this.model);
       // this.model.save();
        console.log(ooi.collections.post);
        console.log(this.model.isValid());
       // if (this.model.isValid(false)) {
            this.model.save(null, {
              success: function(model, response) {
               },
              error: function(model, response) {
                try {
                  var errMessage = JSON.parse(response.responseText).error;
                } catch(err) {
                  console.error(err);
                  var errMessage = "Unable to submit user";
                }
                console.error(model);
                console.error(response.responseText);
              }
            });
        //}
    },
     conditionsFilter: function(e){
     // I use onSet in the above binding
    },
    removeConditions: function(e){
      //need some assertions or check...
      //clicking too fast messes everything up.
      var remove = e.target.id;
      var button = e.target;
      
      
      button.remove();
      $('#'+remove).remove();
      $('#'+remove+'_priority').remove();
      $('#'+remove+'_description').remove();
      $('#'+remove+'_symbol').remove();
      $('[name='+remove+']').remove();
      $('#'+remove).remove();
      $('#'+remove+'_user').remove();

      this.model.unset(remove);
    
    },
    removeUsers: function(e){
      //need assertions and checks in future.
      var remove = e.target.id;
      $('#'+remove).remove();
      $('#'+remove).remove();
      //not dynamic User is defined with adding a user
      this.model.unset('User');
    },
  
    remove: function () {
        // Remove the validation binding
        // See: http://thedersen.com/projects/backbone-validation/#using-form-model-validation/unbinding
        Backbone.Validation.unbind(this);
        return Backbone.View.prototype.remove.apply(this, arguments);
    }
});
