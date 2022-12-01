const { createConfig } = require('@banez/npm-tool');
const { createFS } = require('@banez/fs');
const { ChildProcess } = require('@banez/child_process');

const fs = createFS({
  base: process.cwd(),
});
const cacheName = 'docker-cache';
let installModules = true;

module.exports = createConfig({
  bundle: {
    override: [
      {
        title: 'Restore cache',
        task: async () => {
          if (!(await fs.exist(cacheName))) {
            await fs.mkdir(cacheName);
          }
          if (await fs.exist([cacheName, 'package.json'], true)) {
            const packageJson = await fs.readString('package.json');
            const packageJsonCache = await fs.readString([
              cacheName,
              'package.json',
            ]);
            if (packageJson !== packageJsonCache) {
              installModules = true;
            } else {
              await fs.deleteDir('node_modules');
              await fs.copy([cacheName, 'node_modules'], 'node_modules');
              installModules = false;
            }
          }
        },
      },
      {
        title: 'Install modules',
        task: async () => {
          if (installModules) {
            await ChildProcess.spawn('npm', ['i']);
          }
        },
      },
      {
        title: 'Nuxt Generate',
        task: async () => {
          await ChildProcess.spawn('npm', ['run', 'generate']);
        },
      },
      {
        title: 'Save cache',
        task: async () => {
          if (installModules) {
            if (await fs.exist([cacheName, 'node_modules'])) {
              await fs.deleteDir([cacheName, 'node_modules']);
            }
            if (await fs.exist([cacheName, 'package.json'])) {
              await fs.deleteFile([cacheName, 'package.json']);
            }
            await fs.copy('node_modules', [cacheName, 'node_modules']);
            await fs.copy('package.json', [cacheName, 'package.json']);
          }
        },
      },
    ],
  },
});
