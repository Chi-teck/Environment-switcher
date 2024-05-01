// noinspection JSUnresolvedReference

import * as matchers from './matchers';

expect.extend(matchers);

test('Source code link', async () => {
  await page.goto(`chrome-extension://${EXTENSION_ID}/options/index.html`);

  await Promise.all([
    page.click('xpath///a[@title = "Source code"]'),
    page.waitForNavigation(),
  ]);

  expect(page.url()).toBe('https://github.com/Chi-teck/environment-switcher');
  expect(await page.$('title')).toHaveTextContent('GitHub - Chi-teck/environment-switcher');
});
