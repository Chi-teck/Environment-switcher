const EXTENSION_PATH = '../.';

export default {
  launch: {
    headless: false,
    defaultViewport: null,
    slowMo: process.env.SLOWMO ? process.env.SLOWMO : 0,
    devtools: false,
    args: [
      `--disable-extensions-except=${EXTENSION_PATH}`,
      `--load-extension=${EXTENSION_PATH}`,
      '--start-maximized',
    ],
  },
};
