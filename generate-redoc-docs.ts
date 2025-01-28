import * as fs from 'node:fs/promises';
import { exec } from 'node:child_process';
import { apiVersionFileName } from '@app/main';
import * as process from 'process';
import * as util from 'util';
import { systemAdminDocs } from './docs/api-docs/open-api-builds/open-api.build';

async function generateJsonAndRedocDocs(): Promise<void> {
  const execPromise = util.promisify(exec);

  try {
    await fs.writeFile(`./docs/api_${apiVersionFileName}.json`, JSON.stringify(systemAdminDocs));

    await execPromise(`redocly build-docs ./docs/api_${apiVersionFileName}.json --output ./docs/index.html`);

    console.log(`Redoc docs was successfully generate`);
  } catch (err) {
    console.error(err);
  }
}

generateJsonAndRedocDocs().then(() => {
  process.exit(0);
});
