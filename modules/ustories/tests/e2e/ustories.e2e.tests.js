'use strict';

describe('Ustories E2E Tests:', function () {
  describe('Test Ustories page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/ustories');
      expect(element.all(by.repeater('ustory in ustories')).count()).toEqual(0);
    });
  });
});
