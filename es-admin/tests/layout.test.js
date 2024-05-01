// noinspection JSUnresolvedReference

import { toHaveTextContent, toHaveTitle, toHaveHref } from './matchers';

expect.extend({ toHaveTextContent, toHaveTitle, toHaveHref });

test('Layout', async () => {
  await page.goto(`chrome-extension://${EXTENSION_ID}/options/index.html`);

  const $title = await page.$('title');
  expect($title).toHaveTextContent('Environment switcher');

  const $createProjectButton = await page.$('.sidebar button.primary');
  expect($createProjectButton).toHaveTextContent('Create Project');

  const $header = await page.$('.main h1');
  expect($header).toHaveTextContent('Environment Switcher');

  const $help = await page.$('.main p');
  expect($help).toHaveTextContent('Select a project from the left sidebar or create a new one.');

  const $tools = await page.$('.tools');

  const $importAction = await $tools.$('li button.action.import');
  expect($importAction).toHaveTitle('Import configuration');

  const $exportAction = await $tools.$('li button.action.export');
  expect($exportAction).toHaveTitle('Export configuration');

  const $sourceCodeAction = await $tools.$('li a.action.source');
  expect($sourceCodeAction).toHaveTitle('Source code');
  expect($sourceCodeAction).toHaveHref('https://github.com/Chi-teck/environment-switcher');
});
