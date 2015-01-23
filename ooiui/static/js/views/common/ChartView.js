/* global google, Backbone, _, console */
"use strict";
/*
 * ooiui/static/js/views/common/ChartView.js
 * View definitions for charts
 *
 * Dependencies
 * Partials
 * - ooiui/static/js/partials/Chart.html
 * Libs
 * - ooiui/static/lib/underscore/underscore.js
 * - ooiui/static/lib/backbone/backbone.js
 * - ooiui/static/js/ooi.js
 *
 * Usage
 */

var FakeChartCollection = Backbone.Collection.extend({
  url: '/api/get_data?norm=25&start_time=2015-02-02&end_time=2015-02-02T00:01',
  // url: '/api/faketable'
  parse: function(response, options) {
    console.log('FakeChartCollection');
    console.log(response.rows);
    // var adict = {};
    // var X = response.x;
    // var Y = response.y;
    // adict.x = X;
    // adict.y = Y;
    // this.push(adict);
    return response.rows;
  }

});    



var ChartView = Backbone.View.extend({
    className: "col-sm-12",
    initialize: function() {
      _.bindAll(this, "render", "drawChart");
    
      var self = this;
      this.fakeChart= new FakeChartCollection();
      console.log("Fetching collection");
      this.fakeChart.fetch({
        success: function(collection, response, options) {
          self.render(); 
        }  
      });  

  
    },
    drawChart: function() {
      console.log("drawChart called");
      
      var data = new google.visualization.DataTable();
      data.addColumn('string', 'Time');
      data.addColumn('number', 'X');
      data.addColumn({id:'i0', type:'number', role:'interval'});
      data.addColumn({id:'i1', type:'number', role:'interval'});

      this.fakeChart.map(function(chart){
        console.log(chart.get(0));
        var date = chart.get(0);
        var date = new Date(date * 1000);
        var date = date.toLocaleDateString(); 
        console.log(date);

        var row = [date, chart.get(1),chart.get(1), chart.get(2)];
        data.addRows([row]);
      });


      
     // var gdate = new google.visualization.DateFormat({pattern: "M, dd, yy"});
   
      // data.addRow([new Date(2013, 1, 26), 1, 1, 0.5]);
      // data.addRow([new Date(2013, 1, 27), 1, 0.5, 1]);
      //gdate.format(data,0);

  // Create and draw the visualization.
      var options_points = {
        title:'Bars, default',
        curveType:'function',
        lineWidth: 0,
        series: [{'color': '#D3362D'}],
        intervals: { style:'sticks'},
        legend: 'none',
      };

      this.chart = new google.visualization.LineChart(this.el);

      console.log("Before draw");

      this.chart.draw(data, options_points);
    
      console.log("After draw");

    },
    template: JST['ooiui/static/js/partials/Chart.html'],
    render: function() {
      console.log("Render called");
      this.$el.html(this.template());
      console.log("Calling drawChart");
      this.drawChart();
    }
});
