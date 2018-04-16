import Mn from 'backbone.marionette';
import $ from 'jquery';
import moment from 'moment';
import Template from './template.hbs';
import storage from '../../../storage';
import CollectionView from './collection-view';
import Collection from './collection';
import session from '../../../../../common/session';

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

      collection.fetch({
        data: { family_id: this.model.attributes.id },

        success(response) {
          self.processData(response.toJSON());

        }
      });

  },

  processData(collection){
    let indicators = [];
    let snapshots = [];

    $.each(collection, (index, snapshot) => {
      $.each(snapshot.indicators_survey_data, (j, indicator) => {
        if (!indicators.includes(indicator.name))  indicators.push(indicator.name);
      });
      snapshots.push(snapshot);
    });
    this.generateTable(indicators, snapshots);
    $.each(collection, (index, snapshot) => {
      $.each(snapshot.indicators_survey_data, (j, indicator) => {
          this.setValues(index+1, indicator.name , this.getCircleClass(indicator.value))
      });
    });
  },

  getCreatedAt(createdAt) {
    if (!createdAt) {
      return null;
    }
    return moment(createdAt).locale(session.get('locale')?session.get('locale'):'es').format('LL');
  },

  getUser(user) {
    if (!user) {
      return t('family.no-assignment');
    }
    return user.username;
  },

  getCircleClass(value){
    return value !== null ? value.toLowerCase() : 'gray';
  },
  getClassName(value){
    return ( {
        1: "col-md-6 col-md-offset-3",
        2: "col-md-8 col-md-offset-2",
    } )[ value ] || "col-md-12";
  },

  generateTable(indicators, snapshots){

    let header = [];
    let className = this.getClassName(snapshots.length);

    header.push(`<th style='vertical-align: middle;'><h3 class='text-blue' > &nbsp;${t('subheader.indicators')}</h3></th>`)
    $.each(snapshots, (index, element) => {
      header.push(
      `<th><h3 class="text-center text-blue" >${this.getCreatedAt(element.created_at)}</h3>
      <p><span class="text-blue">${t('family.search.organization')}: </span>${element.family.organization.name}</p>
      <p><span class="text-blue">${t('user.form.user-label')}: </span> ${this.getUser(element.user)}</p></th>`)
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
        this.$el.find('#dvSnapshotsTable').addClass(className);
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
