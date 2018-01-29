import Mn from 'backbone.marionette';
import Bb from 'backbone';
import c3 from 'c3';
import Template from './template.hbs';


export default Mn.View.extend({
  template: Template,

  onRender() {
    setTimeout(() => {
      this.chart();

    }, 0);
  },

  chart(){
    c3.generate({
        bindto: '#bar-snapshots-taken',
        data: {
           x: 'x',
          columns: [
            ['x', 'NOVIEMBRE', 'DICIEMBRE', 'HOY'],
            ['data1', 30, 200, 100,],
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
      home: this.model.attributes
    };
  }
});
