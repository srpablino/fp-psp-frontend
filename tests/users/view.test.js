import chai from 'chai';
import UsersView from '../../src/app/users/view';
import UserModel from '../../src/app/users/model';

const expect = chai.expect;
const model = new UserModel();
const view = new UsersView({ model });

describe('UsersView', () => {
  // Workaround to avoid PhantomJS error:
  // 'Some of your tests did a full page reload'
  // source: https://stackoverflow.com/questions/29352578/some-of-your-tests-did-a-full-page-reload-error-when-running-jasmine-tests
  beforeEach(() => {
    window.onbeforeunload = () => 'Oh no!';
  });

  it('should have properties', () => {
    expect(view.template).to.exist;
    expect(view.collection).to.exist;
  });

  it('should have methods', () => {
    expect(view.serializeData).to.be.an('function');
  });

  it('should render', () => {
    view.render();
    expect(view.$el.find('#search')).to.exist;
  });
});
