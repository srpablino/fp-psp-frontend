import Mn from 'backbone.marionette';
import $ from 'jquery';
import Bn from 'backbone';
import Template from './layout-template.hbs';
import utils from '../../utils';
import SnapshotDraftColecction from '../../snapshots_drafts/collection';
import ItemView from './item/view';
import storage from '../storage';



export default Mn.View.extend({
  template: Template,
  collection:  new Bn.Collection(),
  regions: {
    list: '#snapshot-list'
  },
  events: {
    'click #submit': 'handleSubmit',
    'keypress #search': 'handleSubmit'
  },
  initialize(app) {
    this.app=app.app

  },
  onRender() {
    const headerItems = storage.getSubHeaderItems();
    this.app.updateSubHeader(headerItems);


      $(`.sub-menu-tiem > a[href$="/#surveys/drafts"]`)
        .parent()
        .addClass('subActive');


    setTimeout(() => {
      this.$el.find('#search').focus();
    }, 0);

    this.showList();

  },

  showList() {

    let element = this.$el.find('#snapshot-list');
    element.empty();

    this.collection.forEach(item => {
      let itemView = new ItemView({
        model: item,
        itemViewOptions: {
          className: "col-md-4 col-xs-6"
        },
      });

      // Render the view, and append its element
      // to the list/table
      element.append(itemView.render().el);
    });

  },
  handleSubmit(event) {
    let freeText = $('#search').val();
    if (event.which === 13 || event.which === 1) {
      if(freeText !== ''){
        $('#search').parent().removeClass('has-error');
        let self = this;
        let container = this.$el.find('.list-container').eq(0);
        const section = utils.getLoadingSection(container);

        self.collection.reset();
        this.getRegion('list').empty();
        section.loading();

       let params = {
         description: freeText
       };

        let elements = new SnapshotDraftColecction();
        elements.fetch({
          data: params,
          success(response) {
            self.collection = response;
            self.showList();
            section.reset();
          }
        });
      }else {
        $('#search').parent().addClass('has-error');
      }


    }
  }



});
