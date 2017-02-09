import { MyMapsProjectPage } from './app.po';

describe('my-maps-project App', function() {
  let page: MyMapsProjectPage;

  beforeEach(() => {
    page = new MyMapsProjectPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
