// noinspection JSUnresolvedReference

import * as matchers from './matchers';

expect.extend(matchers);

test('Delete environment', async () => {
  await page.goto(`chrome-extension://${EXTENSION_ID}/options/index.html`);

  await (await page.$('xpath///button[text() = "Create Project"]')).click();

  // -- Create new environment.
  await (await page.waitForSelector('button.create-environment')).click();
  const $dialog = await page.waitForSelector('dialog[open]', { visible: true });
  await (await $dialog.$('xpath/div/form//label[text() = "Name"]//following-sibling::input[@type = "text"]')).type('Localhost');
  await (await $dialog.$('xpath/div/form//label[text() = "Base URL"]//following-sibling::input[@type = "url"]')).type('https://local.example.com');
  await (await $dialog.$('xpath/div/form//button[@class = "primary" and text() = "Save"]')).click();
  await (await page.waitForSelector('xpath///button[text() = "Save"]', { visible: true })).click();

  // -- Test dialog cancel button.
  await (await page.$('xpath///table//button[text() = "Delete"]')).click();
  await page.waitForSelector('dialog[open]', { visible: true });
  await (await page.$('xpath///dialog[@open]//button[text() = "Cancel"]')).click();
  await page.waitForSelector('dialog[open]', { hidden: true });

  // -- Test dialog delete button
  await (await page.$('xpath///table//button[text() = "Delete"]')).click();
  await page.waitForSelector('dialog[open]', { visible: true });
  await (await page.$('xpath///dialog[@open]//button[text() = "Delete"]')).click();
  await expect(await page.$('table tbody')).toHaveTextContent('The are no environments yet.');
  await (await page.waitForSelector('xpath///button[text() = "Save"]', { visible: true })).click();

  const data = await page.evaluate(() => chrome.storage.sync.get());
  const { environments } = data.projects[0];
  expect(environments.length).toBe(0);
});

afterEach(async () => {
  await page.evaluate(() => chrome.storage.sync.clear());
});
