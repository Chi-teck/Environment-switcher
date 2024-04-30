// noinspection JSUnresolvedReference

import * as matchers from './matchers.js';
expect.extend(matchers);

async function assertDialog() {
  const $dialog = await page.waitForSelector('dialog[open]', {visible: true});
  await expect(await $dialog.$('h2')).toHaveTextContent('Delete project?');
  await expect(await $dialog.$('button.close')).toHaveAriaLabel('Close');
  await expect(await $dialog.$('form p')).toHaveTextContent('This action cannot be undone.');
  await expect(await $dialog.$('form .actions button.danger')).toHaveTextContent('Delete');
  await expect(await $dialog.$('form .actions button[data-close-modal]')).toHaveTextContent('Cancel');
}

test('Delete project', async () => {
  await page.goto(`chrome-extension://${EXTENSION_ID}/options/index.html`);
  await (await page.$('.sidebar button.primary')).click();

  const $deleteLink = await page.waitForSelector('.actions button.danger', {visible: true});

  await $deleteLink.click();
  await assertDialog();

  await (await page.$('dialog[open] button.close')).click();
  await page.waitForSelector('dialog[open] ', {hidden: true});

  await $deleteLink.click();
  await assertDialog();

  await (await page.$('dialog[open] button[data-close-modal]')).click();
  await page.waitForSelector('dialog[open] ', {hidden: true});

  await $deleteLink.click();
  await assertDialog();

  await page.keyboard.press('Escape');
  await page.waitForSelector('dialog[open] ', {hidden: true});

  await $deleteLink.click();
  await assertDialog();

  await (await page.$('dialog[open] button.danger')).click();
  await page.waitForSelector('dialog[open] ', {hidden: true});

  expect(page.url()).toBe(`chrome-extension://${EXTENSION_ID}/options/index.html#/`);
  await expect(await page.$('h1')).toHaveTextContent('Environment Switcher');

  const data = await page.evaluate(() => chrome.storage.sync.get());
  expect(data.projects.length).toBe(0);
});
