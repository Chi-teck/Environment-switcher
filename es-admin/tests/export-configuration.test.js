// noinspection JSUnresolvedReference

import { readFileSync, rmSync } from 'fs';
import * as matchers from './matchers';

expect.extend(matchers);

test('Export configuration', async () => {
  await page.goto(`chrome-extension://${EXTENSION_ID}/options/index.html`);

  // -- Create example 1 project.
  await (await page.$('.sidebar button.primary')).click();
  const $nameInput1 = await page.waitForSelector('xpath///input[@name = "name"]');
  await $nameInput1.click({ clickCount: 3 });
  await $nameInput1.type('Example 1');
  await (await page.$('xpath///button[text() = "+ Create environment"]')).click();
  await (await page.$('xpath///dialog[@open]//input[@name = "name"]')).type('Localhost');
  await (await page.$('xpath///dialog[@open]//input[@name = "base_url"]')).type('https://local.example.com');
  await (await page.$('xpath///dialog[@open]//button[text() = "Save"]')).click();
  await (await page.$('xpath///button[text() = "Save"]')).click();

  // -- Create example 2 project.
  await (await page.$('.sidebar button.primary')).click();
  const $nameInput2 = await page.$('xpath///input[@name = "name"]');
  await $nameInput2.click({ clickCount: 3 });
  await $nameInput2.type('Example 2');
  await (await page.$('xpath///button[text() = "Save"]')).click();

  const client = await page.createCDPSession();
  await client.send('Page.setDownloadBehavior', {
    behavior: 'allow',
    downloadPath: '/tmp',
  });

  await (await page.$('xpath///button[@title = "Export configuration"]')).click();
  // @todo Find better way to wait for download to complete.
  // eslint-disable-next-line no-promise-executor-return
  await new Promise((r) => setTimeout(r, 500));

  // -- Assert projects.
  const projects = JSON.parse(readFileSync('/tmp/es-projects.json', 'utf8'));
  expect(projects.length).toBe(2);
  expect(projects[0].name).toBe('Example 1');
  expect(projects[0].environments.length).toBe(1);
  expect(projects[0].environments[0].name).toBe('Localhost');
  expect(projects[0].environments[0].baseUrl).toBe('https://local.example.com');
  expect(projects[0].environments[0].status).toBe(true);
  expect(projects[1].name).toBe('Example 2');
  expect(projects[1].environments.length).toBe(0);
});

afterEach(async () => {
  rmSync('/tmp/es-projects.json', { force: true });
  await page.evaluate(() => chrome.storage.sync.clear());
});
