// noinspection JSUnresolvedReference

import * as matchers from './matchers';

expect.extend(matchers);

test('Create environment', async () => {
  await page.goto(`chrome-extension://${EXTENSION_ID}/options/index.html`);

  await (await page.$('.sidebar button.primary')).click();

  const $createEnvironmentButton = await page.waitForSelector('button.create-environment');
  await $createEnvironmentButton.click();

  // -- Assert environment form.
  let $dialog = await page.waitForSelector('dialog[open]', { visible: true });
  await expect(await $dialog.$('h2')).toHaveTextContent('Create Environment');
  const $form = await $dialog.$('form');
  const $statusCheckbox = await $form.$('xpath/div/label[text() = "Enabled"]//following-sibling::input[@type = "checkbox"]');
  await expect($statusCheckbox).toBeChecked();
  const $nameInput = await $form.$('xpath/div/label[text() = "Name"]//following-sibling::input[@type = "text"]');
  await expect($nameInput).toBeTruthy();
  const $urlInput = await $form.$('xpath/div/label[text() = "Base URL"]//following-sibling::input[@type = "url"]');
  await expect($urlInput).toBeTruthy();
  const $saveButton = await $form.$('xpath/div/button[@class = "primary" and text() = "Save"]');
  await expect($saveButton).toBeTruthy();

  // -- Assert the form state is reset after closing the dialog.
  await $statusCheckbox.click();
  await $nameInput.type('Temp');
  await $urlInput.type('https://temp.example.com');
  await (await $dialog.$('button.close')).click();
  await $createEnvironmentButton.click();
  await page.waitForSelector('dialog[open]', { visible: true });
  await expect($statusCheckbox).toBeChecked();
  await expect($nameInput).toHaveValue('');
  await expect($urlInput).toHaveValue('');

  // -- Assert that environments are created.
  await $nameInput.type('Localhost');
  await $urlInput.type('https://local.example.com');
  await $saveButton.click();

  const $table = await page.$('table');
  const $tdsLocal = await $table.$$('tbody tr:first-child td');
  await expect($tdsLocal[0]).toHaveTextContent('Localhost');
  await expect($tdsLocal[1]).toHaveTextContent('Yes');
  await expect($tdsLocal[2]).toHaveTextContent('https://local.example.com');
  await expect($tdsLocal[3]).toHaveTextContent('EditDelete');

  await $createEnvironmentButton.click();
  await $statusCheckbox.click();
  await $nameInput.type('Dev');
  await $urlInput.type('https://dev.example.com');
  await $saveButton.click();

  const $tdsDev = await $table.$$('tbody tr:last-child td');
  await expect($tdsDev[0]).toHaveTextContent('Dev');
  await expect($tdsDev[1]).toHaveTextContent('No');
  await expect($tdsDev[2]).toHaveTextContent('https://dev.example.com');
  await expect($tdsDev[3]).toHaveTextContent('EditDelete');

  await (await page.$('xpath///form//button[text() = "Save"]')).click();

  const data = await page.evaluate(() => chrome.storage.sync.get());
  const { environments } = data.projects[0];
  expect(environments.length).toBe(2);
  expect(environments[0].name).toBe('Localhost');
  expect(environments[0].baseUrl).toBe('https://local.example.com');
  expect(environments[0].status).toBe(true);
  expect(environments[1].name).toBe('Dev');
  expect(environments[1].baseUrl).toBe('https://dev.example.com');
  expect(environments[1].status).toBe(false);
});

afterEach(async () => {
  await page.evaluate(() => chrome.storage.sync.clear());
});
