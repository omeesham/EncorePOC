
import { Page } from '@playwright/test';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * Logs into the Dynamics 365 CRM application using provided credentials.
 * Navigates to the dashboard after successful login.
 *
 * @param page Playwright Page object
 */
export async function CRMLogin(page: Page) {
  const url = process.env.PWG_CRM_URL;
  const username = process.env.PWG_CRM_USERNAME;
  const password = process.env.PWG_CRM_PASSWORD;

  if (!url || !username || !password) {
    throw new Error('PWG_CRM_URL, PWG_CRM_USERNAME, or PWG_CRM_PASSWORD is not set in the .env file');
  }

  await page.goto(url);
  await page.getByRole('textbox', { name: 'username@psav.com' }).fill(username);
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('textbox', { name: 'Enter the password for s-tst-' }).fill(password);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.getByRole('button', { name: 'No' }).click();
  await page.waitForURL(/main\.aspx.*dashboard/);
  // Wait for the dashboard to finish loading and key UI to be ready
  try {
    await page.locator('role=alert[name="Loading..."]').first().waitFor({ state: 'detached', timeout: 30000 });
  } catch {}
  // Wait for a stable dashboard element (heading) to appear
  try {
    await page.getByRole('heading', { name: 'My Goals and Pace' }).first().waitFor({ state: 'visible', timeout: 30000 });
  } catch {}
  // Ensure left nav is present (Opportunities entry appears under Sales)
  await page.getByText('Opportunities').first().waitFor({ state: 'visible', timeout: 30000 });
  //await page.getByRole('button', { name: /close/i }).click();

}
