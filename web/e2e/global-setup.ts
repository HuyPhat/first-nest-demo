// Creates the API's test database and applies its migrations (shared with the API's own tests).
import setup from '../../api/test/global-setup';

export default async function globalSetup() {
  process.chdir('../api'); // the API's setup reads ./drizzle relative to its own folder
  try {
    await setup();
  } finally {
    process.chdir('../web');
  }
}
