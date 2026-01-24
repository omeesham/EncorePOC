import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://psavcustomersqa.crm.dynamics.com/main.aspx?appid=d05771f7-d483-41b2-9672-5333d8eaa013&forceUCI=1&pagetype=dashboard&type=system&_canOverride=true');
  await page.getByRole('textbox', { name: 'username@psav.com' }).fill('s-tst-navi-CRM@psav.com');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.locator('#i0118').fill('7zsHhW0CvUmR3s');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.getByRole('button', { name: 'No' }).click();
  //await page.goto('https://psavcustomersqa.crm.dynamics.com/main.aspx?appid=d05771f7-d483-41b2-9672-5333d8eaa013&forceUCI=1&pagetype=dashboard&type=system&_canOverride=true');
  await expect(page.getByLabel('Goals by Owner')).toBeVisible({ timeout: 60000 });
  await expect(page.getByRole('button', { name: 'My Goals and Pace' })).toBeVisible();
  await expect(page.getByText('Opportunities', { exact: true })).toBeVisible();
  await page.getByText('Opportunities', { exact: true }).click();
  //await page.goto('https://psavcustomersqa.crm.dynamics.com/main.aspx?appid=d05771f7-d483-41b2-9672-5333d8eaa013&forceUCI=1&pagetype=entitylist&etn=opportunity&viewid=00000000-0000-0000-00aa-000010003000&viewType=1039');
  await expect(page.getByRole('button', { name: 'My Opportunities | Open' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Event Start Date' })).toBeVisible();
  await expect(page.getByRole('searchbox', { name: 'Search' })).toBeVisible();
  await page.getByRole('searchbox', { name: 'Search' }).click();
  await page.getByRole('searchbox', { name: 'Search' }).fill('OP15296451');
  await page.getByRole('searchbox', { name: 'Search' }).press('Enter');
  //await page.goto('https://psavcustomersqa.crm.dynamics.com/main.aspx?appid=d05771f7-d483-41b2-9672-5333d8eaa013&forceUCI=1&pagetype=search&searchText=OP15296451&searchType=0');
  await expect(page.getByRole('button', { name: 'JBS Automation POC For Jan' })).toBeVisible();
  await expect(page.locator('.ag-center-cols-viewport')).toBeVisible();
  await page.getByRole('button', { name: 'JBS Automation POC For Jan' }).click();
  //await page.goto('https://psavcustomersqa.crm.dynamics.com/main.aspx?appid=d05771f7-d483-41b2-9672-5333d8eaa013&forceUCI=1&pagetype=entityrecord&etn=opportunity&id=c1520d06-03d4-4019-a223-30b02a8f81da');
  await expect(page.getByRole('heading', { name: 'JBS Automation POC For' })).toBeVisible();
  await expect(page.locator('#formHeaderTitle_7')).toContainText('JBS Automation POC For Jan');
  await page.getByRole('textbox', { name: 'Event Name' }).click();
  await expect(page.getByRole('tab', { name: 'Orders' })).toBeVisible();
  await page.getByRole('tab', { name: 'Orders' }).click();
  await expect(page.getByRole('heading', { name: 'ORDERS' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Invoice Account Name' })).toBeVisible();
  await expect(page.locator('iframe[title="Orders"]').contentFrame().locator('html')).toBeVisible();
  await expect(page.getByRole('tabpanel', { name: 'Orders' })).toBeVisible();
  await page.getByRole('tabpanel', { name: 'Orders' }).click();

});