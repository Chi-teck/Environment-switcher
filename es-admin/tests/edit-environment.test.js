// noinspection JSUnresolvedReference

import * as matchers from './matchers';

expect.extend(matchers);

async function assertEnvironment(name, status, url) {
  const $tds = await page.$$('table tbody tr td');
  await expect($tds[0]).toHaveTextContent(name);
  await expect($tds[1]).toHaveTextContent(status ? 'Yes' : 'No');
  await expect($tds[2]).toHaveTextContent(url);

  const data = await page.evaluate(() => chrome.storage.sync.get());
  const { environments } = data.projects[0];
  expect(environments.length).toBe(1);
  expect(environments[0].id).toHaveLength(36);
  expect(environments[0].status).toBe(status);
  expect(environments[0].name).toBe(name);
  expect(environments[0].baseUrl).toBe(url);
}

test('Edit environment', async () => {
  await page.goto(`chrome-extension://${EXTENSION_ID}/options/index.html`);

  await (await page.$('xpath///button[text() = "Create Project"]')).click();

  // -- Create new environment.
  await (await page.waitForSelector('button.create-environment')).click();
  const $createDialog = await page.waitForSelector('dialog[open]', { visible: true });
  await (await $createDialog.$('xpath/div/form//label[text() = "Name"]//following-sibling::input[@type = "text"]')).type('Localhost');
  await (await $createDialog.$('xpath/div/form//label[text() = "Base URL"]//following-sibling::input[@type = "url"]')).type('https://local.example.com');
  await (await $createDialog.$('xpath/div/form//button[@class = "primary" and text() = "Save"]')).click();
  await (await page.waitForSelector('xpath///button[text() = "Save"]', { visible: true })).click();
  await assertEnvironment('Localhost', true, 'https://local.example.com');

  // -- Edit environment.
  await (await page.$('xpath///table//button[text() = "Edit"]')).click();
  const $editDialog = await page.waitForSelector('dialog[open]', { visible: true });

  const $statusCheckbox = await $editDialog.$('xpath/div/form//label[text() = "Enabled"]//following-sibling::input[@type = "checkbox"]');
  await expect($statusCheckbox).toBeChecked();
  await $statusCheckbox.click();

  const $nameInput = await $editDialog.$('xpath/div/form//label[text() = "Name"]//following-sibling::input[@type = "text"]');
  await expect($nameInput).toHaveValue('Localhost');

  await $nameInput.focus();
  await $nameInput.click({ clickCount: 3 });
  await $nameInput.type('Dev');

  const $urlInput = await $editDialog.$('xpath/div/form//label[text() = "Base URL"]//following-sibling::input[@type = "url"]');
  await expect($urlInput).toHaveValue('https://local.example.com');
  await $urlInput.focus();
  await $urlInput.click({ clickCount: 3 });
  await $urlInput.type('https://dev.example.com');

  await (await $editDialog.$('xpath/div/form//button[text() = "Save"]')).click();
  await (await page.waitForSelector('xpath///button[text() = "Save"]', { visible: true })).click();

  await assertEnvironment('Dev', false, 'https://dev.example.com');
});

afterEach(async () => {
  await page.evaluate(() => chrome.storage.sync.clear());
});
