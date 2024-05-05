// noinspection JSUnresolvedReference

import { resolve } from 'path';
import * as matchers from './matchers';

expect.extend(matchers);

test('Import configuration', async () => {
  await page.goto(`chrome-extension://${EXTENSION_ID}/options/index.html`);

  const [fileChooser] = await Promise.all([
    page.waitForFileChooser(),
    page.click('xpath///button[@title = "Import configuration"]'),
  ]);
  await fileChooser.accept([resolve('./tests/example.json')]);

  await (await page.waitForSelector('xpath///div[contains(@class, "sidebar")]//a/div[text() = "Example"]')).click();

  const $table = await page.waitForSelector('table');
  const $tds = await $table.$$('tbody tr td');
  await expect($tds[0]).toHaveTextContent('Localhost');
  await expect($tds[1]).toHaveTextContent('Yes');
  await expect($tds[2]).toHaveTextContent('https://local.example.com');
});

afterEach(async () => {
  await page.evaluate(() => chrome.storage.sync.clear());
});
