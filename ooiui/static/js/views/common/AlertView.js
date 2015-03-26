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
  url:'http://localhost:12575/sensor/inv/CP02PMCO/WFP01/03-CTDPFK000/telemetered/ctdpf_ckl_wfp_instrument',
  parse: function(response, options){
    
    return response;
    
  }
});


var PostCollection = Backbone.Collection.extend({
  nextOrder: function() {
    if(!this.length){
      return 1;
    }
    return this.last().get('alert_id')+1;
  },
});

//Validations is turned off!!

var AlertFilterView = Backbone.View.extend({


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
                validate:false 
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
 //       '[name=ConditionsFilter]': {
 //           observe: 'ConditionsFilter',
        //    selectOptions:{
         //     collections: ['empty','s','w'],
//
 //             defaultOption:{
 //               label: 'Select To Add Filter'
 //             }  
  //          },
  //          onGet: function(val){
   //           console.log(val.selectOptions.collection);
   //           console.log('conditon get iscalled');
   //           return val.selectOptions.collection;
  //          
  //          },
 //          onSet: function(val){
   //           console.log('are you called');
  //            this.addConditions(val);
//
//              return val;
              
              
//           },

   //         setOptions: {
     //           validate: false
     //       }
     //   },
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
        _.bindAll(this, "render", "submit", "remove", "addConditions", "removeConditions", "changeArray", "changePlatform", "changeInstrument","addSelect" );
         
        this.listenTo(ooi, 'arrayItemView:arraySelect', this.changeArray);
        this.listenTo(ooi, 'platformDeploymentItemView:platformSelect',this.changePlatform);
        this.listenTo(ooi, 'instrumentDeploymentItemView:instrumentSelect', this.changeInstrument);
        this.listenTo(ooi, 'streamItemView:streamSelect', this.changeStream);
        var self = this;
        //var uFrameList= {};


        this.OptionalModel = Backbone.Model.extend({
        });
       
        this.listenTo(this.collection, 'reset', function(){

             self.render();
        });
    },
     

    render: function () {
        console.log('render called');
        
        var assetTen = ooi.collections.assetTen;
        this.stickit();
        return this;
    },
    addConditions: function(val){
      //adds a div and input under conditions on the html
      //adds bindings 

      var streamName = val.stream_name; 
      val = val.param;
      
      var value = val.replace(/\s+/g, '_');
      var value_description = value + '_description';
      var value_priority = value + '_priority';
      var value_symbol = value + '_symbol';
      var value_user= value + '_user';
 

     $('#Conditions').prepend('<div class="form-group"> <div class="form-control"  name='+value+'> '+ val +' </div> <span class="help-block hidden"></span> </div>');

     $('#SymbolInput').prepend(' <div class="form-group"><select class="form-control" id='+value_symbol+' > <option> > </option> <option> < </option> <option> = </option> </select> <span class="help-block hidden"></span></div>');
         
         
     $('#ConditionsInput').prepend('<div class="form-group"> <input class="form-control" id='+value+'></input> <span class="help-block hidden"></span></div>');
     
     $('#RemoveConditions').prepend('<div class="form-group "> <button class="btn btn-success" id='+  value   + '>'+ 'X' +' </button> <span class="help-block hidden"></span></div>');


     $('#addtionalInformation').prepend('<div name='+value+' class="row col-sm-12"> <div class="col-sm-12"> <div class="form-group"> <label for="Name" class="col-sm-3 control-label">Name</label> <div class="col-sm-9"><div class="form-control"  name='+value+'> '+ val +' </div> <span class="help-block hidden"></span> </div> </div> </div> <div class="col-sm-12"> <div class="form-group"> <label for="priority" class="col-sm-3 control-label">Priority</label> <div class="col-sm-9"> <select class="form-control" id='+value_priority+' ></select> <span class="help-block hidden"></span> </div> </div> </div> <div class="col-sm-12"> <div class="form-group"> <label for="lastname" class="col-sm-3 control-label">Description</label> <div class="col-sm-9"> <textarea type="text" class="form-control" id='+value_description+'/></textarea> <span class="help-block hidden"></span> </div> </div> </div><hr width="80%"> </div> ');

     $('#Users').prepend('<div class="form-group"><select class="form-control" id='+value_user +'> </select> <span class="help-block hidden"></span> </div>');


     var optionalModel = new this.OptionalModel();
     optionalModel.set({
       'alert':value, 
       'stream_name': streamName, 
       'alert_id': ooi.collections.post.nextOrder(),
       'user_name': ooi.models.userModel.get('user_name'),
       'user_id': ooi.models.userModel.get('user_id')
     
     
     
     });
     
     this.addBinding(optionalModel, '#'+value_description, 'description');
     this.addBinding(optionalModel, '#'+value_priority, {
       observe:'priority',
       selectOptions:{
         collection: [{name:'Low', num: 1},{name:'Normal', num: 2},{name:'High', num:3},{name:'Urgent', num:4},{name:"Immediate", num:5}],
         labelPath:'name',
         valuePath:'num'
         

       }


       });
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
       observe:'assignee',
       selectOptions: {
         collection : this.collection.pluck('user_name'),
         defaultOption: {
          label: 'Add Assignee'
           }
       },
       onSet:function(val){
         console.log(val);
         var redmineId =this.collection.findWhere({user_name: val});
         redmineId = redmineId.get(val);
         optionalModel.set('assignee_id', redmineId);

         console.log(redmineId);
         return val;
       }

       
     } );

     ooi.collections.post.add(optionalModel);
     console.log(ooi.collections.post);
     console.log(this.collection);
    },
    changeArray: function (data) {
      this.model.set('array',data.get('display_name'));   
      
            
    },
    changePlatform: function(data){
      //page should populate at platform level
      //users might not click below platform
      //fetch is used to get all children
      this.model.set('Platform', data.get('display_name'));
      var model = this.model;
      var instr = data.instrumentDeployments.fetch({
        success: function(collection, response){
          var list = collection.pluck('display_name');
          console.log(list);
          model.set('Instrument', list);
       
        }

      });
     
       
     this.addSelect();       
    },
    changeInstrument: function(data){
   //   console.log('Instrument selected');
      
    },
    addSelect: function(){
     // console.log('add select called');
      var self = this;
      $('#Filter').html('<select class="form-control" id="ConditionsFilter" name="ConditionsFilter"> </select> <span class="help-block hidden"></span>');
      var selection =ooi.collections.assetTen.fetch({

        success:function(collection, response){
          var streamName = response[0].stream_name;

          var keys = Object.keys(response[0]);  
          keys= _.map(keys, function(item){
             // console.log(item);
              var dictionary = {};
              dictionary.stream_name = streamName;
              dictionary.param = item;
              return dictionary;

          });
          self.addBinding(self.model,"#ConditionsFilter", {
            observe:'ConditionsFilter',
            selectOptions: {
              collection: keys,
              labelPath: 'param',
            defaultOption:{
              label:'Select To Add Filter'
            },
                          
              
            },
            onSet: function(val){
              self.addConditions(val);
              return val;


            }
         
        });
     
        // console.log(self.model);
      }
      });

       

    },
    changeStream: function(data){
    },


    submit: function () {
        var self = this;
        // Check if the model is valid before saving
        // See: http://thedersen.com/projects/backbone-validation/#methods/isvalid
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
      console.log(button);
      console.log(remove);
      
      button.remove();
      $('#'+remove).remove();
      $('#'+remove+'_priority').remove();
      $('#'+remove+'_description').remove();
      $('#'+remove+'_symbol').remove();
      $('[name='+remove+']').remove();
      $('#'+remove).remove();
      $('#'+remove+'_user').remove();
      
      ooi.collections.post.remove(ooi.collections.post.findWhere({'alert':remove}));
      console.log(ooi.collections.post); 
    },
  
    remove: function () {
        // Remove the validation binding
        // See: http://thedersen.com/projects/backbone-validation/#using-form-model-validation/unbinding
        Backbone.Validation.unbind(this);
        return Backbone.View.prototype.remove.apply(this, arguments);
    }
});
