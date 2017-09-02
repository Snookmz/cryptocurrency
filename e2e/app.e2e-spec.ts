import { BtcmarketsuiPage } from './app.po';

describe('btcmarketsui App', () => {
  let page: BtcmarketsuiPage;

  beforeEach(() => {
    page = new BtcmarketsuiPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
