// noinspection JSUnresolvedReference

import * as matchers from './matchers.js';
expect.extend(matchers);

async function assertEnvironment(name, status, url) {
  const $table = await page.$('table');
  const $tds_local = await $table.$$('tbody tr:first-child td');
  await expect($tds_local[0]).toHaveTextContent(name);
  await expect($tds_local[1]).toHaveTextContent(status ? 'Enabled' : 'Disabled');
  await expect($tds_local[2]).toHaveTextContent(url);

  const data = await page.evaluate(() => chrome.storage.sync.get());
  const environments = data.projects[0].environments;
  expect(environments.length).toBe(1);
  expect(environments[0].status).toBe(status);
  expect(environments[0].name).toBe(name);
  expect(environments[0].baseUrl).toBe(url);
}

test('Edit environment', async () => {
  await page.goto(`chrome-extension://${EXTENSION_ID}/options/index.html`);

  await (await page.$('xpath///button[text() = "Create Project"]')).click();

  // -- Create new environment.
  await (await page.waitForSelector('button.create-environment')).click();
  const $create_dialog = await page.waitForSelector('dialog[open]', {visible: true});
  await (await $create_dialog.$('xpath/div/form//label[text() = "Name"]//following-sibling::input[@type = "text"]')).type('Localhost');
  await (await $create_dialog.$('xpath/div/form//label[text() = "Base URL"]//following-sibling::input[@type = "url"]')).type('https://local.example.com');
  await (await $create_dialog.$('xpath/div/form//button[@class = "primary" and text() = "Save"]')).click();
  await (await page.waitForSelector('xpath///button[text() = "Save"]', {visible: true})).click();
  await assertEnvironment('Localhost', true, 'https://local.example.com');

  // -- Edit environment.
  await (await page.$('xpath///table//button[text() = "Edit"]')).click();
  const $edit_dialog = await page.waitForSelector('dialog[open]', {visible: true});

  const $statusCheckbox = await $edit_dialog.$('xpath/div/form//label[text() = "Enabled"]//following-sibling::input[@type = "checkbox"]')
  await expect($statusCheckbox).toBeChecked();
  await $statusCheckbox.click();

  const $nameInput = await $edit_dialog.$('xpath/div/form//label[text() = "Name"]//following-sibling::input[@type = "text"]');
  await expect($nameInput).toHaveValue('Localhost');
  await $nameInput.focus();
  for (let i = 'Localhost'.length; i > 0; i--) {
    await page.keyboard.press('Backspace');
  }
  await $nameInput.type('Dev');

  const $urlInput = await $edit_dialog.$('xpath/div/form//label[text() = "Base URL"]//following-sibling::input[@type = "url"]');
  await expect($urlInput).toHaveValue('https://local.example.com');
  await $urlInput.focus();
  for (let i = 'https://local.example.com'.length; i > 0; i--) {
    await page.keyboard.press('Backspace');
  }
  await $urlInput.type('https://dev.example.com');

  await (await $edit_dialog.$('xpath/div/form//button[text() = "Save"]')).click();
  await (await page.waitForSelector('xpath///button[text() = "Save"]', {visible: true})).click();

  await assertEnvironment('Dev', false, 'https://dev.example.com');
});

afterEach(async () => {
  await page.evaluate(() => chrome.storage.sync.clear());
});
