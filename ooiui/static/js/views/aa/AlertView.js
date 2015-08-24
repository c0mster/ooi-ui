"use strict";
/*
 *
 * ooiui/static/js/models/aa/AlertFilterView.js
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

var AlertFilterView = Backbone.View.extend({
  events: {
    /*'click #saveAlert': function (e) {
     e.preventDefault();
     this.submit();
     }*/
  },

  // Use stickit to perform binding between
  // the model and the view
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
    }
  },
  initialRender: function() {
    this.$el.html('<i class="fa fa-spinner fa-spin" style="margin-top:50px;margin-left:50%;font-size:90px;color:#337ab7;"> </i>');
  },
  initialize: function () {
    Backbone.Validation.bind(this);
    _.bindAll(this, "render","filterOptionsbyInstrument","showtypeoptions","showenabledoptions" );


    //this.listenTo(ooi, 'arrayItemView:arraySelect', this.triggerTOCClickA);
    //this.listenTo(ooi, 'platformDeploymentItemView:platformSelect',this.triggerTOCClickP);
    //this.listenTo(ooi, 'InstrumentItemView:instrumentSelect', this.triggerTOCClickI);
    //this.listenTo(ooi, 'streamItemView:streamSelect', this.changeStream);
    var self = this;


    self.modalDialog = new ModalDialogView();
    //this.listenTo(this.collection, 'reset', function(){
    self.render();
    //});
  },

  render: function () {
    var self = this;

    var AlertsFullCollectionPage = Backbone.PageableCollection.extend({
      model: AlertModel,
      url:"/api/aa/alerts",
      state: {
        pageSize: 20
      },
      mode: "client",
      parse: function(response, options) {
        //for the response after asset query
        if(response.alert_alarm_definition){
          return response.alert_alarm_definition;
        }
        else{
          return response
        }
      }
    });

    var pageablealerts = new AlertsFullCollectionPage();
    self.collection = pageablealerts;

    var HtmlCell = Backgrid.HtmlCell = Backgrid.Cell.extend({
      className: "html-cell",
      initialize: function () {
        Backgrid.Cell.prototype.initialize.apply(this, arguments);
      },
      render: function () {
        this.$el.empty();
        var rawValue = this.model.get(this.column.get("name"));
        var formattedValue = this.formatter.fromRaw(rawValue, this.model);
        this.$el.append(formattedValue);
        this.delegateEvents();
        return this;
      }
    });

    var columns = [
      {
        name: "uframe_filter_id", // The key of the model attribute
        label: "ID", // The name to display in the header
        editable: false, // By default every cell in a column is editable, but *ID* shouldn't be
        cell: "string"
      },
      {
        name: "array_name", // The key of the model attribute
        label: "Array", // The name to display in the header
        editable: false, // By default every cell in a column is editable, but *ID* shouldn't be
        cell: "string"
      },
      {
        name: "instrument_name",
        label: "Instrument",
        editable: false,
        cell: "string",
        sortValue: function (model, colName) {
          return model.attributes[colName]['instrument_name'];
        }
      },
      {
        name: "severity",
        label: "Severity",
        editable: false,
        cell: "string",
        formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
          fromRaw: function (rawValue, model) {
            return rawValue;
          }
        })
      },
      {
        name: "created_time",
        label: "Created",
        editable: false,
        cell: "string"
      },
      {
        name: "stream",
        label: "Stream Name",
        editable: false,
        cell: "string"
      },
      {
        name: "description",
        label: "Description",
        editable: false,
        cell: "string"
      },
      {
        name: "event_type",
        editable: false,
        label: "Type",
        cell: HtmlCell,
        formatter: _.extend({}, Backgrid.Cell.prototype, {
          fromRaw: function (rawValue, model) {
            //place holder right now for triggered events
            if(rawValue =='alarm'){
              return "Alarm";
            }
            else if(rawValue =='alert'){
              return "Alert";
            }
          }
        })
      },
      {
        name: "active",
        editable: false,
        label: "Active",
        cell: HtmlCell,
        formatter: _.extend({}, Backgrid.Cell.prototype, {
          fromRaw: function (rawValue, model) {
            //console.log(rawValue);
            //place holder right now for triggered events
            if(rawValue == 1){
              //return "Active";
              return "<i id='active_def' style='font-size:20px;float:right;padding-right: 20px;color:#3c763d' class='fa fa-thumbs-up'>Active</i>";
            }
            else if(rawValue == 0){
              //return "Disabled";
              return "<i id='active_def' style='font-size:20px;float:right;padding-right: 20px;color:#3c763d' class='fa fa-thumbs-down'>Disabled</i>";
            }
          }
        })
      },
      {
        name: "active",
        editable: false,
        label: "O/I",
        cell: HtmlCell,
        formatter: _.extend({}, Backgrid.Cell.prototype, {
          fromRaw: function (rawValue, model) {
            console.log('Active Field');
            console.log(rawValue);
            console.log(model.attributes.retired);
            //place holder right now for triggered events
            if (model.attributes.retired == 0) {
              if (rawValue == 1) {
                return "<button type=\"button\" id=\"toggleActiveBtn\" class=\"btn btn-primary\">" +
                  "<i class=\"fa fa-plus-square\"></i> Disable Alert/Alarm" +
                  "</button>";
              }
              else if (rawValue == 0) {
                return "<button type=\"button\" id=\"toggleActiveBtn\" class=\"btn btn-primary\">" +
                  "<i class=\"fa fa-plus-square\"></i> Enable Alert/Alarm" +
                  "</button>";
              }
            }
            else {
              return "Retired";
            }
          }
        })
      },
      {
        name: "retired",
        editable: false,
        label: "Retire",
        cell: HtmlCell,
        formatter: _.extend({}, Backgrid.Cell.prototype, {
          fromRaw: function (rawValue, model) {
            console.log('Retired Field');
            console.log(rawValue);
            //console.log(rawValue);
            //place holder right now for triggered events
            if(rawValue == 1){
              return "Retired";
            }
            else {
              return "<button type=\"button\" id=\"toggleRetireBtn\" class=\"btn btn-primary\">" +
                "<i class=\"fa fa-plus-square\"></i> Retire" +
                "</button>";
            }
          }
        })
      }
    ];

    //add click event
    var ClickableRow = Backgrid.Row.extend({
      highlightColor: "#eee",
      events: {
        "click": "onClick",
        mouseover: "rowFocused",
        mouseout: "rowLostFocus"
      },
      onClick: function (e) {
        Backbone.trigger("deployrowclicked", this.model);
        this.el.style.backgroundColor = this.highlightColor;

        // Clicked the toggle active/inactive button
        if (e.target.id=='toggleActiveBtn') {
          console.log('clicked toggle active btn for def id: ' + this.model.attributes.id);
          ooi.trigger('alertToggleActiveFormViewTrigger:onClick',
            {
              model: this.model,
              active: this.model.attributes.active
            }
          );
        }

        //check to see if the condtion met item has ben clicked and open triggered events
        if(e.target.id=='condition_met'){
          this.triggeredalertView = new TriggeredAlertDialogView();
          $('.container-fluid').first().append(this.triggeredalertView.el);

          this.triggeredalertView.show({
            instrument: "Instrument Name: "  + this.model.attributes.Instrument,
            recent: "<i>None at this time</i>",
            history: "<i style='color:#337ab7;' class='fa fa-spinner fa-spin fa-5x'></i>",
            variable: this.model.attributes.reference_designator,
            //ctype: "alert",
            //title: this.model.attributes.display_name,
            ack: function() { console.log("Closed");}
          });
        }
        /*            if(e.target.id=='active_def'){
         console.log('Clicked active thumb');
         console.log(this.model.attributes.uframe_filter_id);
         document.getElementById('toggleActiveBtn').innerHTML = '<i class="fa fa-plus-square"></i> Disable Alert/Alarm ' + this.model.attributes.uframe_filter_id;
         document.getElementById('toggleActiveBtn').style.display = "inline";
         }*/
      },
      rowFocused: function() {
        this.el.style.backgroundColor = this.highlightColor;
      },
      rowLostFocus: function() {
        this.el.style.backgroundColor = '#FFF';
        //document.getElementById('toggleActiveBtn').style.display = "none";
      }
    });

    // Set up a grid to use the pageable collection
    var pageableGrid = new Backgrid.Grid({
      columns: columns,
      collection: pageablealerts,
      row: ClickableRow
    });

    // Render the grid and attach the root to your HTML document
    $("#alertslist").append(pageableGrid.render().el);

    // Initialize the paginator
    var paginator = new Backgrid.Extension.Paginator({
      collection: pageablealerts
    });

    // Render the paginator
    $("#alertslist").after(paginator.render().el);

    var AssetFilter = Backgrid.Extension.ClientSideFilter.extend({
      placeholder: "Search Alerts and Alarms",
      makeMatcher: function(query){
        var q = '';
        if(query!=""){
          q = String(query).toUpperCase();
        }
        return function (model) {
          var queryhit= false;
          if(model.attributes['instrument_name']){
            if(String(model.attributes['instrument_name']).toUpperCase().search(q)>-1){
              queryhit= true;
            }
          }
          if(model.attributes['description']){
            if(String(model.attributes['description']).toUpperCase().search(q)>-1){
              queryhit= true;
            }
          }
          if(model.attributes['array_name']){
            if(String(model.attributes['array_name']).toUpperCase().search(q)>-1){
              queryhit= true;
            }
          }
          if(model.attributes['priority']){
            if(String(model.attributes['priority']).toUpperCase().search(q)>-1){
              queryhit= true;
            }
          }
          return queryhit;
        };
      }
    });

    var filter = new AssetFilter({
      collection: pageablealerts
    });
    self.filter = filter;

    // Render the filter
    $("#alertslist").before(filter.render().el);
    // Add some space to the filter and move it to the right
    $(filter.el).css({float: "right", margin: "0px 0px 25px 0px"});
    $(filter.el).find("input").attr('id', 'alert_search_box');

    pageablealerts.fetch({reset: true,
      error: (function (e) {
        alert(' Service request failure: ' + e);
      }),
      complete: (function (e) {
        $('#loading_alerts').html('');
      })
    });

    //move clicked row to edit panel
    Backbone.on("deployrowclicked", function (model) {
      //self.addConditions(model);
      console.log('Clicked row');
    });

    /*
     $('#resetAlarms').click(function(row) {
     $('#loading_alerts').html('<i style="color:#337ab7" class="fa fa-spinner fa-spin"></i>  Loading Alerts and Alarms');
     self.collection.url = "/api/aa/alerts";

     self.collection.fetch({reset: false,
     error: (function (e) {
     self.modalDialog.show({
     message: "Error Requesting Alerts for this Asset.",
     type: "danger",
     });
     }),
     complete: (function (e) {
     $('#loading_alerts').html('');
     })
     });
     });
     */

    /*
     //save data
     $('#saveAlarm').click(function(row) {
     //get total number or rows in the table - two headers
     var numofrows = document.getElementById("alert_table").rows.length-2;

     //loop through and save each row
     //temp -- do more asyncho in future
     if(numofrows>0){
     //there also should be a save with ID for the put but it is not inplace
     $('#loading_alerts').html('<i style="color:#337ab7" class="fa fa-spinner fa-spin"></i>  Saving Changes...');
     for(var i=0; i<numofrows;i++){
     var saveModel = new AlertModel();
     saveModel.set('instrument_name',self.instrumenet_reference);
     saveModel.set('values',$('#val'+i+'').val());
     saveModel.set('instrument_parameter',$('#conditions_dd'+i+'').val());
     var savedate = new Date();
     saveModel.set('created_time',savedate.toJSON());
     saveModel.set('priority',$('#type_dd'+i+'').val());
     saveModel.set('active',$('#enabled_dd'+i+'').val());
     saveModel.set('description',$('#desc'+i+'').val());
     saveModel.set('operator',$('#operator_dd'+i+'').val());
     saveModel.set('reference_designator',self.instrumenet_reference);

     saveModel.set('platform_name','platform a');
     saveModel.set('array_name','array a');
     saveModel.set('uframe_definition_id',234);

     //this allows a put to edit the exisitng alerts using reference id
     if(i==0){
     saveModel.url = '/api/aa/alerts/'+self.alert_id;
     saveModel.set('id',self.alert_id);
     }

     saveModel.save(null, {
     success: function(model, response) {
     if(String(response).search('ERROR')>-1||String(response).search('BAD')>-1){
     $('#loading_alerts').html('Instrument: '+self.instru);
     self.modalDialog.show({
     message: "Unable to Save Alert. Make sure all fields are valid.",
     type: "danger",
     });
     }
     else{
     $('#alert_table tbody').empty();
     $('#loading_alerts').html('');
     $("#delete_row").hide();
     self.modalDialog.show({
     message: "Alert Row successfully saved.",
     type: "success",
     ack: function() {
     //refresh()
     window.location = "/alerts/dashboard/"
     }
     });
     }
     },
     error: function(model, response) {
     $('#loading_alerts').html('Instrument: '+self.instru);
     self.modalDialog.show({
     message: "There was a problem with saving the Alert. Make sure all fields are valid.",
     type: "danger",
     });
     }
     });
     }
     }
     else{
     self.modalDialog.show({
     message: "Please Select an Instrument to apply new Alert(s)",
     type: "danger",
     });
     }
     });
     */


    self.rownum = 1;
    //add row
    /*
     $('#newAlert').click(function(row) {
     //add new line
     if($('#loading_alerts').html() == ''){
     self.modalDialog.show({
     message: "Please Select an Instrument to apply new Alert(s)",
     type: "danger",
     });
     }
     else{
     $('#alert_table').append('<tr id="addr'+(self.rownum+1)+'"></tr>');
     $('#addr'+self.rownum).html("<td>"+self.filterOptionsbyInstrument()+"</td><td>"+self.showenabledoperators()+"</td><td style=''><input id='val"+self.rownum+"' type='text' placeholder='where condition is' class='form-control'></td><td style=''><input type='text' id='desc"+self.rownum+"'  class='form-control'></td><td style=''><input id='owner"+self.rownum+"' class='form-control'></td><td style=''>"+self.showtypeoptions()+"</td><td style=''>"+self.showenabledoptions()+"</td>").attr('data','new');

     $('#conditions_dd'+self.rownum+'').selectpicker();
     $('#conditions_dd'+self.rownum+'').selectpicker('refresh');
     $('#type_dd'+self.rownum+'').selectpicker();
     $('#type_dd'+self.rownum+'').selectpicker('refresh');
     $('#enabled_dd'+self.rownum+'').selectpicker();
     $('#enabled_dd'+self.rownum+'').selectpicker('refresh');
     $('#operator_dd'+self.rownum+'').selectpicker();
     $('#operator_dd'+self.rownum+'').selectpicker('refresh');
     self.rownum++;
     $("#delete_row").show();
     }
     });
     */

    //remove row
    $("#delete_row").click(function(){
      if(self.rownum == 2){
        $("#delete_row").hide();
      }
      if(self.rownum>1){
        $("#addr"+(self.rownum-1)).html('');
        self.rownum--;
      }
    });

    //needs model to stickit not using right now
    //this.stickit();
  },

  /*
   addConditions: function(val){
   //backgrid extentsions
   //https://github.com/twatson83/Backgrid.Extensions

   //could use this for table http://vitalets.github.io/x-editable/
   this.rownum = 0;
   this.instrumenet_reference = val.attributes.reference_designator;
   this.instrument_name = val.attributes.Instrument;
   this.alert_id = val.attributes.uframe_definition_id;

   $('#loading_alerts').html('Instrument: '+val.attributes.Instrument);
   $('#alert_table tbody').empty();
   //$('#alert_table').editableTable();
   var filteroptions = this.filterOptionsbyInstrument(val.attributes.reference_designator,val.attributes.Instrument);
   //<td><span id="A3" contenteditable></span></td>
   $('#alert_table tbody').append("<tr id='addr0' data="+val.attributes.uframe_definition_id+"><td style='max-width:160px'>"+this.filterOptionsbyInstrument()+"</td><td style='max-width:100px'>"+this.showenabledoperators()+"</td><td style=''><input type='text' id='val0' placeholder='"+val.attributes.values+"' value='"+val.attributes.values+"' class='form-control'></td><td style=''><input type='text' id='desc0' placeholder='"+val.attributes.description+"' value='"+val.attributes.description+"' class='form-control'></td><td style=''><input id='owner0' value='John Smith - WHOI'  class='form-control'></td><td style=''>"+this.showtypeoptions()+"</td><td style=''>"+this.showenabledoptions()+"</td></tr><tr id='addr1'></tr>");

   //stupid hack to make the columns match
   $('.fixed-table-container').css('padding-bottom','0px');
   $('#alert_table').css('margin-top','0px');
   $('.fixed-table-header').css('display','none');

   $('#conditions_dd'+this.rownum+'').selectpicker();
   $('#conditions_dd'+this.rownum+'').selectpicker('val',val.attributes.instrument_parameter);
   $('#conditions_dd'+this.rownum+'').selectpicker('refresh');
   $('#type_dd'+this.rownum+'').selectpicker();
   $('#type_dd'+this.rownum+'').selectpicker('val',val.attributes.priority);
   $('#type_dd'+this.rownum+'').selectpicker('refresh');
   $('#enabled_dd'+this.rownum+'').selectpicker();
   $('#enabled_dd'+this.rownum+'').selectpicker('val',String(val.attributes.active));
   $('#enabled_dd'+this.rownum+'').selectpicker('refresh');
   $('#operator_dd'+this.rownum+'').selectpicker();
   $('#operator_dd'+this.rownum+'').selectpicker('val',String(val.attributes.operator));
   $('#operator_dd'+this.rownum+'').selectpicker('refresh');

   this.rownum = 1;
   $('#alert_table tr').click(function(row) {
   });
   },
   */

  filterOptionsbyInstrument: function(instru_id,name){

    var self = this;
    return "<select class='form-control' data-container='body' id='conditions_dd"+this.rownum+"'><option value='m_lon'>Longitude</option><option value='m_lat'>Latitude</option><option value='sci_salinity'>Salinity</option><option value='sci_water_temp'>Temperature</option><option  value='sci_water_cond'>Water Speed</option><option value='sci_wave_height'>Wave Height</option><option value='sci_water_pressure'>Water Pressure</option></select>";
  },

  showtypeoptions:function(){
    return "<select data-show-icon='true' data-container='body' class='form-control' id='type_dd"+this.rownum+"'><option  data-icon='glyphicon-flag' value='alert'>Alert</option><option data-icon='glyphicon-exclamation-sign' value='alarm'> Alarm</option></select>";
  },

  showenabledoptions:function(){
    return "<select data-show-icon='true' data-container='body' class='form-control' id='enabled_dd"+this.rownum+"'><option data-icon='glyphicon-ok-sign' value='true'>True</option><option data-icon='glyphicon-minus-sign' value='false'> False</option></select>";
  },

  showenabledoperators:function(){
    return "<select data-show-icon='true' data-container='body' class='form-control' id='operator_dd"+this.rownum+"'><option value='>'>></option><option  value='<'> <</option><option  value='='> =</option><option  value='<>'> <></option><option  value='>='> >=</option><option  value='<='> <=</option><option  value='outside'> outside</option><option  value='inside'> inside</option></select>";
  }


  /*click on the left hand side of the TOC
   triggerTOCClickP:function(tocitem){
   $('#listTitle').html('Showing Alerts for Mooring: <b>'+ tocitem.attributes['mooring_display_name']);
   //tocitem.attributes.reference_designator
   $('#loading_alerts').html('<i style="color:#337ab7" class="fa fa-spinner fa-spin"></i>  Loading Alerts and Alarms');
   this.triggernewAlertList('platform_name='+tocitem.attributes['reference_designator'],false);
   },
   triggerTOCClickI:function(tocitem){

   $('#listTitle').html('Showing Alerts for Platform: <b>'+ tocitem.attributes['platform_display_name']);
   $('#loading_alerts').html('<i style="color:#337ab7" class="fa fa-spinner fa-spin"></i>  Loading Alerts and Alarms');
   this.triggernewAlertList('instrument_name='+tocitem.attributes['reference_designator'],true);
   },
   triggerTOCClickA:function(tocitem){
   $('#listTitle').html('Showing Alerts for Array: <b>'+ tocitem.attributes.display_name);
   $('#loading_alerts').html('<i style="color:#337ab7" class="fa fa-spinner fa-spin"></i>  Loading Alerts and Alarms');
   this.triggernewAlertList('array_name='+tocitem.attributes['reference_designator'],false)
   },

   triggernewAlertList:function(id_val,instr){
   //this is for later for filtering alerts on certain platforms, arrays, instruments
   var self = this;
   self.instru = instr;
   self.name = id_val;
   this.collection.url = '/api/aa/'+id_val;
   $('#alert_table tbody').empty();

   this.collection.fetch({reset: false,
   error: (function (e) {
   self.modalDialog.show({
   message: "Error Requesting Alerts for this Asset.",
   type: "danger",
   });
   }),
   complete: (function (e) {
   if(self.instru == true){
   $('#loading_alerts').html(''+ self.name);
   }
   else{
   $('#loading_alerts').html('');
   }
   })
   });
   }
   */
});
