// noinspection JSUnresolvedReference

import * as matchers from './matchers.js';
expect.extend(matchers);

test('Environment validation', async () => {
  await page.goto(`chrome-extension://${EXTENSION_ID}/options/index.html`);

  await (await page.$('xpath///button[text() = "Create Project"]')).click();

  const $createEnvironmentButton = await page.waitForSelector('button.create-environment');
  await $createEnvironmentButton.click();

  const $dialog = await page.waitForSelector('dialog[open]', {visible: true});
  const $nameInput = await $dialog.$('xpath/div//label[text() = "Name"]//following-sibling::input[@type = "text"]');
  const $urlInput = await $dialog.$('xpath/div//label[text() = "Base URL"]//following-sibling::input[@type = "url"]');
  const $saveButton = await $dialog.$('xpath/div//button[@class = "primary" and text() = "Save"]');

  await $saveButton.click();
  await expect(await $nameInput.$('xpath/following-sibling::div[@class = "error"]')).toHaveTextContent('Please fill out this field.');
  await expect(await $urlInput.$('xpath/following-sibling::div[@class = "error"]')).toHaveTextContent('Please fill out this field.');

  await $urlInput.type('wrong');
  await $saveButton.click();
  await expect(await $urlInput.$('xpath/following-sibling::div[@class = "error"]')).toHaveTextContent('Please enter a URL.');

  await $urlInput.click({ clickCount: 3 })
  await $urlInput.type('https://local.example.com#abc');
  await $saveButton.click();
  await expect(await $urlInput.$('xpath/following-sibling::div[@class = "error"]')).toHaveTextContent('The URL should not include anchor.');

  await $urlInput.click({ clickCount: 3 })
  await $urlInput.type('https://local.example.com?foo=bar');
  await $saveButton.click();
  await expect(await $urlInput.$('xpath/following-sibling::div[@class = "error"]')).toHaveTextContent('The URL should not include query string.');

  await $urlInput.click({ clickCount: 3 })
  await $urlInput.type('https://local.example.com/foo/bar');
  await $saveButton.click();
  await expect(await $urlInput.$('xpath/following-sibling::div[@class = "error"]')).toHaveTextContent('The URL should not include path.');

  await $urlInput.click({ clickCount: 3 })
  await $urlInput.type('https://local.example.com/');
  await $saveButton.click();
  await expect(await $urlInput.$('xpath/following-sibling::div[@class = "error"]')).toHaveTextContent('The URL should not have ending slash.');

  await $nameInput.type('Localhost');
  await $urlInput.click({ clickCount: 3 })
  await $urlInput.type('https://local.example.com');
  await $saveButton.click();
  await expect($dialog).not.toBeOpen();
});

afterEach(async () => {
  await page.evaluate(() => chrome.storage.sync.clear());
});
