import Mn from 'backbone.marionette';
import $ from 'jquery';
import moment from 'moment';

import Template from './template.hbs';
import storage from '../../../storage';
import CollectionView from './collection-view';
import Collection from './collection';

export default Mn.View.extend({
  template: Template,
  collection: CollectionView,

  regions: {
    list: '#family-snapshots'
  },
  initialize(options) {
    this.app = options.app;
    this.snapshotId = options.snapshotId;
    this.collection = options.collection;
  },
  onRender() {
    const headerItems = storage.getSubHeaderItems(this.model);
    this.app.updateSubHeader(headerItems);


    $('a.sub-menu-item[href$="snapshots"]')
      .parent()
      .addClass('subActive');


    this.showList();
  },
  showList() {
    let self = this;
    let collection = new Collection();


    let indicators = [];
    let snapshots = [];

      collection.fetch({
        data: { family_id: this.model.attributes.id },

        success(response) {
          self.collection = response.toJSON();
          $.each(self.collection, (index, snapshot) => {
            $.each(snapshot.indicators_survey_data, (j, indicator) => {
              if (!indicators.includes(indicator.name))  indicators.push(indicator.name);
            });
            snapshots.push(snapshot);
          });
          self.generateTable(indicators, snapshots);
          $.each(self.collection, (index, snapshot) => {
            $.each(snapshot.indicators_survey_data, (j, indicator) => {
                self.setValues(index+1, indicator.name , self.getCircleClass(indicator.value))
            });
          });

        }
      });

  },

  getCreatedAt(createdAt) {
    if (!createdAt) {
      return null;
    }
    return moment(createdAt).format('YYYY-MM-DD');
  },

  getUser(user) {
    if (!user) {
      return null;
    }
    return user.username;
  },

  getCircleClass(value){
    return value !== null ? value.toLowerCase() : 'gray';
  },

  generateTable(indicators, snapshots){
    let header = [];
    header.push("<th style='vertical-align: middle;'><h3 class='text-blue text-center' >Indicators</h3></th>")
    $.each(snapshots, (index, element) => {
      header.push(
      `<th><h3 class="text-center text-blue" >${this.getCreatedAt(element.created_at)}</h3>
      <p class="text-center"><span class="text-blue">Organizacion: </span>${element.family.organization.name}&nbsp;&nbsp;&nbsp;&nbsp;
      <span class="text-blue">Usuario: </span> ${this.getUser(element.user)}</p></th>`)
    });

    let data = [];
        data.push(header);
        $.each(indicators, (index, element) => {
          let firstColumn = [];
          firstColumn.push(element)
          data.push(firstColumn);
        });

        let table = $('<table/>', {
                                    class: 'table table-striped table-bordered',
                                    id: 'snapshotsTable',
                                  }).append(
                                          $('<thead/>'),
                                          $('<tbody/>')
                                          );

        for (let i = 0; i < header.length; i++) {
            $("thead", table).append(header[i]);
        }

        for (let i = 1; i < data.length; i++) {
            let row = $(table[0].insertRow(-1));
            for (let j = 0; j < header.length; j++) {
                let cell = $('<td  class="" style="vertical-align: middle;"><p class=""></p></td>');
                cell.html(data[i][j]);
                row.append(cell);
            }
        }

        this.$el.find('#dvSnapshotsTable').append(table);


  },
  setValues(index, name , value){
    $('#snapshotsTable tr').each(function () {
        if($(this).find("td").eq(0).html() === name){
          $(this).find("td").eq(index).html(`<div id="circle" class="circle-content center-block ${value.toLowerCase()}"  style="width: 45px; height: 45px;"/>`);
        }

      });
  }
});
