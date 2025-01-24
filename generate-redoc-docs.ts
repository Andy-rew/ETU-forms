import * as fs from 'node:fs/promises';
import { exec } from 'node:child_process';
import { apiVersionFileName } from '@app/main';
import * as process from 'process';
import * as util from 'util';
import { systemAdminDocs } from '@app/docs/open-api-builds/open-api-system-admin.build';
import { processAdminDocs } from '@app/docs/open-api-builds/open-api-process-admin.build';
import { userDocs } from '@app/docs/open-api-builds/open-api-user.build';
import * as path from 'path';

async function generateJsonAndRedocDocs(): Promise<void> {
  const execPromise = util.promisify(exec);

  const docPath = path.resolve(__dirname, 'redoc-docs');
  await fs.rm(docPath, { recursive: true, force: true });
  await fs.mkdir(docPath, { recursive: true });

  try {
    await fs.writeFile(`./redoc-docs/user_api_${apiVersionFileName}.json`, JSON.stringify(userDocs));
    await fs.writeFile(`./redoc-docs/process_admin_api_${apiVersionFileName}.json`, JSON.stringify(processAdminDocs));
    await fs.writeFile(`./redoc-docs/system_admin_api_${apiVersionFileName}.json`, JSON.stringify(systemAdminDocs));

    await fs.writeFile(`./redoc-docs/system_new_api_${apiVersionFileName}.json`, JSON.stringify(systemAdminDocs));

    await execPromise(
      `redocly build-docs ./redoc-docs/user_api_${apiVersionFileName}.json --output ./redoc-docs/user_api_${apiVersionFileName}.html`,
    );

    await execPromise(
      `redocly build-docs ./redoc-docs/process_admin_api_${apiVersionFileName}.json --output ./redoc-docs/process_admin_api_${apiVersionFileName}.html`,
    );

    await execPromise(
      `redocly build-docs ./redoc-docs/system_admin_api_${apiVersionFileName}.json --output ./redoc-docs/system_admin_api_${apiVersionFileName}.html`,
    );

    console.log(`Redoc docs was successfully generate for user_${apiVersionFileName}`);
    console.log(`Redoc docs was successfully generate for system_admin_${apiVersionFileName}`);
    console.log(`Redoc docs was successfully generate for process_admin_${apiVersionFileName}`);
  } catch (err) {
    console.error(err);
  }
}

generateJsonAndRedocDocs().then(() => {
  process.exit(0);
});
