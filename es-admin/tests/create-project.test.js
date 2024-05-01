// noinspection JSUnresolvedReference

import * as matchers from './matchers';

expect.extend(matchers);

test('Create project', async () => {
  await page.goto(`chrome-extension://${EXTENSION_ID}/options/index.html`);

  const $createProjectButton = await page.$('.sidebar button.primary');
  await $createProjectButton.click();
  const $sidebarLink = await page.waitForSelector('.sidebar li a.active', { visible: true });
  await expect($sidebarLink).toHaveTextContent('New project');

  const href = await $sidebarLink.evaluate((el) => el.href);
  expect(page.url()).toBe(href);
  expect(page.url()).toContain(`chrome-extension://${EXTENSION_ID}/options/index.html#/project`);

  const $header = await page.$('.main h1');
  await expect($header).toHaveTextContent('New project');

  const $form = await page.$('form');
  await expect(await $form.$('label[for="name"]')).toHaveTextContent('Project name');
  await expect(await $form.$('label[for="name"] + input')).toHaveValue('New project');

  const $table = await $form.$('table');
  await expect(await $table.$('caption')).toHaveTextContent('Environments');
  await expect(await $table.$('thead')).toHaveTextContent('NameStatusBase URLOperations');
  await expect(await $table.$('tbody')).toHaveTextContent('The are no environments yet.');

  const $actions = await $form.$('.actions');
  await expect(await $actions.$('button.primary')).toHaveTextContent('Save');
  await expect(await $actions.$('button.secondary')).toHaveTextContent('Revert');
  await expect(await $actions.$('button.danger')).toHaveTextContent('Delete');
  await expect(await $actions.$('button.create-environment')).toHaveTextContent('+ Create environment');

  const data = await page.evaluate(() => chrome.storage.sync.get());
  expect(data.projects.length).toBe(1);
  expect(data.projects[0].environments).toStrictEqual([]);
  expect(data.projects[0].name).toBe('New project');
});

afterEach(async () => {
  await page.evaluate(() => chrome.storage.sync.clear());
});
