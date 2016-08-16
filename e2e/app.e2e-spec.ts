import { FLASHMEMBERSHIPPage } from './app.po';

describe('flash-membership App', function() {
  let page: FLASHMEMBERSHIPPage;

  beforeEach(() => {
    page = new FLASHMEMBERSHIPPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
