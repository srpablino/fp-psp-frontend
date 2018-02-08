import Mn from 'backbone.marionette';
import Bb from 'backbone';
import c3 from 'c3';
import $ from 'jquery';
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

  getTakenData(key){
    let data = {};
    let o = this.organization.dashboard.snapshotTaken.byMonth;

    // let key = Object.keys(o)[idx];
    if (moment(key).format('MM') === moment().format('MM')) {
      data.key = 'Today'
    }else{
      data.key = moment(key).locale('en').format('MMMM');
    }
    data.value = o[key];
    return data;
  },

  generateData(){
    let snapshotTaken = this.organization.dashboard.snapshotTaken.byMonth;
    let data={};
    let keys=['x'];
    let values=['data1'];
    $.each(snapshotTaken, (i) => {
       let aux = this.getTakenData(i);
       keys.push(aux.key);
       values.push(aux.value);
    });
    data.x = keys;
    data.data1 = values;
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
