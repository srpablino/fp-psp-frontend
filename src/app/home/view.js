import Mn from 'backbone.marionette';
import Bb from 'backbone';
import c3 from 'c3';
import $ from 'jquery';
import _ from 'lodash';
import moment from 'moment';
import Template from './template.hbs';

export default Mn.View.extend({
  template: Template,

  initialize() {
    if (this.model) {
      this.organization = this.model.attributes;
      setTimeout(() => {
      if(!$.isEmptyObject(this.organization.dashboard.snapshotTaken.byMonth)){
          $('.no-data').hide();
          this.chart();
        }
      }, 0);
    }
  },

  onRender() {
    this.months = ["","January", "February", "March", "April", "May", "June","July",
     "August","September","October","November","December"]
  },

  formatDate(key){
    if(moment(key).isSame(moment(), 'month')){
      return 'Today';
    }
    return moment(key).locale('en').format('MMMM');    
  },

  generateData(){
     let snapshots = this.organization.dashboard.snapshotTaken.byMonth;
     let data={};
     data.x = [ 
      'x', 
       ... _.keys(snapshots).map(key => this.formatDate(key))
    ]; 
    data.data1 = [ 
        'data1',
        ... _.values(snapshots)
    ];
    return data;
  },

  chart(){
    const data = this.generateData();
    c3.generate({
        bindto: '#bar-snapshots-taken',
        data: {
           x: 'x',
          columns: [
            data.x,
            data.data1,
          ],
          names: {
            data1: 'Snapshots Taken',
          },
          colors:{
                data1: '#60b4ef',
              },
          type: 'bar',
          labels: true,
          empty: {
            label: {
              text: "No Data"
            }
          }
        },
        axis: {
            x: {
                type: 'category'
            },
            y: {
               show: false
             }
        },
        bar: {
         width: {
             ratio: 0.6
            }
         },
        size: {
            height: 200
          },
        legend: {
            show: false
          }
    });
  },

  serializeData() {
    if (!this.model) {
      this.model = new Bb.Model();
    }
    return {
      organization: this.model.attributes
    };
  }
});
