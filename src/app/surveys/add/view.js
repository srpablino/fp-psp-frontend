import Mn from 'backbone.marionette';
import Template from './template.hbs';
import Model from './model';
import CodeMirror from 'codemirror';
import utils from '../../utils';
import FlashesService from '../../flashes/service';

import MatchBrackets from '../../../../node_modules/codemirror/addon/edit/matchbrackets';
import ContinueComment from '../../../../node_modules/codemirror/addon/comment/continuecomment';
import Comment from '../../../../node_modules/codemirror/addon/comment/comment';
import JavaScriptMode from '../../../../node_modules/codemirror/mode/javascript/javascript';
import JsonLint from '../../../../node_modules/codemirror/addon/lint/json-lint';

export default Mn.View.extend({
  template: Template,
  events: {
    'click #submit': 'handleSubmit'
  },
  initialize(options) {
    this.props = Object.assign({}, options);
    this.model = this.props.model || new Model();
  },
  onRender() {
    this.startCodeMirror();
  },
  startCodeMirror() {
    this.schema = CodeMirror.fromTextArea(this.$el.find('#schema-editor')[0], {
      matchBrackets: true,
      autoCloseBrackets: true,
      mode: 'application/ld+json',
      lineNumbers: true,
      lineWrapping: true,
      tabMode: 'indent'
    });
    this.schemaUI = CodeMirror.fromTextArea(
      this.$el.find('#schema-ui-editor')[0],
      {
        matchBrackets: true,
        autoCloseBrackets: true,
        mode: 'application/ld+json',
        lineNumbers: true,
        lineWrapping: true,
        tabMode: 'indent'
      }
    );
    this.schema.refresh();
    this.schemaUI.refresh();
  },
  serializeData() {
    return {
      survey: this.model.attributes
    };
  },
  handleSubmit(event) {
    const button = utils.getLoadingButton(this.$el.find('#submit'));
    event.preventDefault();
    button.loading();

    // We manually add form values to model,
    // the form -> model binding should ideally
    // be done automatically.
    this.$el
      .find('#form')
      .serializeArray()
      .forEach(element => {
        this.model.set(element.name, element.value);
      });

      console.log('this');
     console.log(this);
      var errors = this.model.validate(this.model.attributes);
      console.log('errors');
      console.log(errors);

      if (errors) {
        errors.forEach(error =>{
          FlashesService.request('add', {
            type: 'warning',
            title: error
          })
        });
        button.reset();
        return;

      } else {

    this.model.set('survey_schema', JSON.parse(this.schema.getValue()));
    this.model.set('survey_ui_schema', JSON.parse(this.schemaUI.getValue()));

    

    this.model
      .save()
      .then(result => {
        FlashesService.request('add', {
          type: 'info',
          title: 'The survey has been saved'
        });
        this.props.listSurveys();
      } 
      , error => {
        console.log('error');
        console.log(error);
        FlashesService.request('add', {
          type: 'warning',
          title: error.responseJSON.message
        });
      })
      .always(() => button.reset());
  }
}
});
