// noinspection JSUnresolvedReference

import * as matchers from './matchers';

expect.extend(matchers)

test('Edit project', async () => {
  await page.goto(`chrome-extension://${EXTENSION_ID}/options/index.html`);
  await (await page.$('.sidebar button.primary')).click();

  const $sidebarLink = await page.waitForSelector('.sidebar li a.active', { visible: true });
  const $saveButton = await page.$('.actions button.primary');
  const $revertButton = await page.$('.actions button.secondary');
  const $header = await page.$('h1');

  const editProject = async function editProject() {
    await expect($sidebarLink).toHaveTextContent('New project');
    await expect($revertButton).toBeDisabled();
    await expect($header).toHaveTextContent('New project');

    const $nameInput = await page.$('#name');
    await $nameInput.focus();
    await $nameInput.click({ clickCount: 3 });
    await $nameInput.type('abc');

    await expect($sidebarLink).toHaveTextContent('New project*');
    await expect($header).toHaveTextContent('abc *');
    await expect($revertButton).not.toBeDisabled();
  };

  await editProject();
  await $revertButton.click();

  await editProject();
  await $saveButton.click();

  await page.waitForSelector('h1 sup', { hidden: true });
  await expect($sidebarLink).toHaveTextContent('abc');
  await expect($header).toHaveTextContent('abc');
  await expect($revertButton).toBeDisabled();

  const data = await page.evaluate(() => chrome.storage.sync.get());
  expect(data.projects.length).toBe(1);
  expect(data.projects[0].environments).toStrictEqual([]);
  expect(data.projects[0].name).toBe('abc');
});

afterEach(async () => {
  await page.evaluate(() => chrome.storage.sync.clear());
});
