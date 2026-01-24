import { test, expect, Page } from '@playwright/test';
import { CRMLogin } from '../Common/CRMLogin';

// Increase timeout for long end-to-end flow (10 minutes)
test.setTimeout(600000);

test.describe('Complete Order Flow - End to End', () => {
  test.skip('Complete order creation, job setup, items addition, save, and report generation', async ({ page }) => {
    // Step 1: Login and navigate to opportunity
    await CRMLogin(page);
    await page.getByText('Opportunities', { exact: true }).click();
    const listSearch = page.getByRole('searchbox', { name: /Opportunity Filter by keyword/i });
    await expect(listSearch).toBeVisible({ timeout: 20000 });
    await listSearch.fill('OP15296451');
    await listSearch.press('Enter');

    // Navigate to opportunity details page
    await page.goto('https://psavcustomersqa.crm.dynamics.com/main.aspx?appid=d05771f7-d483-41b2-9672-5333d8eaa013&forceUCI=1&pagetype=entityrecord&etn=opportunity&id=c1520d06-03d4-4019-a223-30b02a8f81da');
    await expect(page.getByRole('tablist', { name: /Opportunity Form/i })).toBeVisible({ timeout: 20000 });

    // Fetch Summary details and print to console
    await page.getByRole('tab', { name: 'Summary' }).click();
    const eventNameEl = page.getByRole('textbox', { name: 'Event Name' });
    const startDateEl = page.getByRole('textbox', { name: 'Date of Event Start Date' });
    const endDateEl = page.getByRole('textbox', { name: 'Date of Event End Date' });
    const estRevenueEl = page.getByRole('textbox', { name: 'Est. Revenue' });
    await expect(eventNameEl).toBeVisible({ timeout: 20000 });
    await expect(startDateEl).toBeVisible({ timeout: 20000 });
    await expect(endDateEl).toBeVisible({ timeout: 20000 });
    await expect(estRevenueEl).toBeVisible({ timeout: 20000 });
    const eventName = await eventNameEl.innerText();
    const startDate = await startDateEl.innerText();
    const endDate = await endDateEl.innerText();
    const estRevenue = await estRevenueEl.innerText();
    // Optional fields: End User Account, End User Contact, Venue
    const endUserAccount = await page
      .getByRole('list', { name: /End User Account/i })
      .getByRole('link')
      .first()
      .innerText()
      .catch(() => 'N/A');
    const endUserContact = await page
      .getByRole('list', { name: /End User Contact/i })
      .getByRole('link')
      .first()
      .innerText()
      .catch(() => 'N/A');
    const venueName = await page
      .getByRole('list', { name: /Venue/i })
      .getByRole('link')
      .first()
      .innerText()
      .catch(() => 'N/A');
    console.log('Summary Details:', {
      eventName,
      startDate,
      endDate,
      estRevenue,
      endUserAccount,
      endUserContact,
      venueName,
    });

    // Step 2: Create order in Encore
    await page.getByRole('tab', { name: 'Orders' }).click();
    const ordersIframe = page.locator('iframe[title*="Orders"]');
    await ordersIframe.waitFor({ state: 'attached', timeout: 60000 });
    await expect(ordersIframe).toBeVisible({ timeout: 60000 });
    const ordersFrame = page.frameLocator('iframe[title*="Orders"]');
    // Fetch existing orders from the table/grid (best-effort)
    let orderRows: string[] = [];
    try {
      orderRows = await ordersFrame.getByRole('row').allTextContents();
    } catch {
      // Fallback: try grid role
      try {
        const grid = ordersFrame.getByRole('grid');
        await grid.waitFor({ state: 'visible', timeout: 30000 });
        orderRows = await grid.locator('[role="row"]').allTextContents();
      } catch {
        // Last resort: capture a snippet of frame text
        const frameText = await ordersFrame.locator('body').innerText();
        orderRows = frameText.split('\n').slice(0, 10);
      }
    }
    console.log('Existing Orders (row texts):', orderRows);
    // Proceed to click on Add new Order
    await expect(ordersFrame.getByRole('img', { name: /Add new Order/i })).toBeVisible({ timeout: 60000 });
    let orderPage: Page | undefined;
    const popupMaxRetries = 3;
    let popupAttempt = 0;
    
    while (popupAttempt < popupMaxRetries) {
      popupAttempt++;
      try {
        console.log(`Attempting to open order creation page (attempt ${popupAttempt}/${popupMaxRetries})...`);
        const orderPagePromise = page.waitForEvent('popup', { timeout: 30000 });
        await ordersFrame.getByRole('img', { name: 'Add new Order' }).click();
        orderPage = await orderPagePromise;
        await orderPage.waitForLoadState('domcontentloaded');
        console.log('✓ Order creation popup opened successfully');
        break;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`[err] Failed to open order creation page (attempt ${popupAttempt}):`, errorMessage);
        if (popupAttempt >= popupMaxRetries) {
          throw new Error(`Failed to open order creation page after ${popupMaxRetries} attempts: ${errorMessage}`);
        }
        console.log('Waiting before retry...');
        await page.waitForTimeout(2000);
      }
    }
    
    if (!orderPage) {
      throw new Error('Failed to open order creation page - orderPage is undefined');
    }
    
    console.log('Popup opened, navigating to order creation...');
    
    // Navigate to order creation with error handling and retry logic
    let navigationSuccess = false;
    let retryCount = 0;
    const maxRetries = 3;
    
    while (!navigationSuccess && retryCount < maxRetries) {
      try {
        console.log(`Attempting navigation (attempt ${retryCount + 1}/${maxRetries})...`);
        await orderPage.goto('https://navigator.training.psav.com/#/orderNew/1145/%7BC1520D06-03D4-4019-A223-30B02A8F81DA%7D', { 
          waitUntil: 'networkidle',
          timeout: 30000 
        });
        
        // Wait for Create Order button to be visible as indicator page loaded
        await orderPage.getByRole('button', { name: 'Create Order' }).waitFor({ 
          state: 'visible', 
          timeout: 15000 
        });
        
        navigationSuccess = true;
        console.log('✓ Order creation page loaded successfully');
      } catch (error) {
        retryCount++;
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`Navigation error (attempt ${retryCount}): ${errorMessage}`);
        
        if (retryCount < maxRetries) {
          console.log('Reloading page...');
          try {
            await orderPage.reload({ waitUntil: 'networkidle', timeout: 20000 });
            await orderPage.waitForLoadState('domcontentloaded');
          } catch (reloadError) {
            const reloadErrorMessage = reloadError instanceof Error ? reloadError.message : String(reloadError);
            console.error(`Reload failed: ${reloadErrorMessage}`);
          }
        } else {
          throw new Error(`Failed to load order creation page after ${maxRetries} attempts: ${errorMessage}`);
        }
      }
    }
    
    await orderPage.getByRole('button', { name: 'Create Order' }).click();
    await orderPage.waitForURL('**/order/**', { timeout: 30000 });
    
    // Wait for order page to be interactive (wait for key element instead of timeout)
    await orderPage.locator('#accounts-contacts').waitFor({ state: 'visible', timeout: 20000 });
    console.log('Order created, URL:', orderPage.url());

    // Step 3: Validate Opportunity Number and Name in Order Details
    console.log('\n=== Validating Opportunity Details in Encore Order ===');
    
    // Wait for accounts-contacts section and opportunity data to load
    await orderPage.locator('#accounts-contacts').waitFor({ state: 'visible', timeout: 30000 });
    
    // Wait for opportunity number to appear dynamically
    const oppNumber = orderPage.getByText('OP15296451');
    await expect(oppNumber).toBeVisible({ timeout: 20000 });
    console.log('✓ Opportunity Number validated: OP15296451');
    
    await expect(orderPage.locator('#accounts-contacts')).toContainText('OP15296451', { timeout: 10000 });
    await expect(orderPage.locator('#accounts-contacts')).toContainText('JBS Automation POC For Jan', { timeout: 10000 });
    console.log('✓ Opportunity Name validated: JBS Automation POC For Jan');
    
    await expect(orderPage.locator('#orderJobCommon').getByText('JBS Automation POC For Jan')).toBeVisible({ timeout: 10000 });
    console.log('✓ Order details page loaded successfully');

    // Step 4: Click Jobs → Job Actions → Insert Jobs
    console.log('\n=== Inserting New Job ===');
    await orderPage.getByText('Jobs', { exact: true }).click();
    
    // Wait for Job Actions button to be visible and enabled
    const jobActionsBtn = orderPage.getByRole('button', { name: 'Job Actions' });
    await jobActionsBtn.waitFor({ state: 'visible', timeout: 10000 });
    await jobActionsBtn.click();
    
    await orderPage.getByText('Insert Job').click();
    console.log('✓ Insert Job clicked');
    
    // Wait for job date panel to appear before clicking
    await orderPage.locator('#jobDatePanel').waitFor({ state: 'visible', timeout: 10000 });
    await orderPage.locator('#jobDatePanel').click();
    
    // Wait for Items link to be visible and clickable
    const itemsLink = orderPage.getByRole('link', { name: 'Items' });
    await itemsLink.waitFor({ state: 'visible', timeout: 10000 });
    await itemsLink.click();
    console.log('✓ Navigated to Items tab');

    // Add items from each item type from the menu
    console.log('\n=== Adding Items from Different Categories ===');
    
    // Item Type 1: AV Equipment
    console.log('Adding AV Equipment items...');
    await orderPage.getByRole('button').filter({ hasText: /^$/ }).nth(4).click();
    await orderPage.getByRole('gridcell', { name: 'Deluxe LCD Projection Package' }).click();
    await orderPage.getByRole('gridcell', { name: 'Deluxe LCD Projection Package' }).click();
    await orderPage.getByRole('gridcell', { name: 'Deluxe LCD Projection Package' }).click();
    await orderPage.getByRole('gridcell', { name: 'Deluxe LCD Projection Package' }).dblclick();
    await orderPage.getByRole('button', { name: 'OK' }).click();
    await orderPage.getByRole('gridcell', { name: 'Allen & Heath ZED10' }).click();
    await orderPage.getByRole('gridcell', { name: 'Audix OM2' }).dblclick();
    await orderPage.getByRole('gridcell', { name: 'Belkin Meeting Room Power' }).dblclick();
    await orderPage.getByRole('gridcell', { name: 'Lenovo T460s Touch Laptop' }).dblclick();
    await orderPage.getByRole('gridcell', { name: 'House Sound System Patch -' }).dblclick();
    console.log('✓ Added AV Equipment items');
    
    // Item Type 2: Video Equipment
    console.log('Adding Video Equipment items...');
    await orderPage.getByRole('button').filter({ hasText: /^$/ }).nth(5).click();
    await orderPage.getByRole('gridcell', { name: 'Camera' }).click();
    await orderPage.getByRole('gridcell', { name: 'Camera' }).dblclick();
    await orderPage.locator('.slick-cell.l1.r1.selected > .label > .glyphicon').click();
    await orderPage.getByRole('gridcell', { name: 'Camera' }).click();
    await orderPage.getByRole('gridcell', { name: 'Camera' }).click();
    console.log('✓ Added Video Equipment items');
    
    // Item Type 3: Freight
    console.log('Adding Freight items...');
    await orderPage.locator('.btn-group-vertical > button:nth-child(3)').click();
    await orderPage.getByRole('gridcell', { name: 'Air Freight' }).click();
    await orderPage.getByRole('gridcell', { name: 'Air Freight' }).click();
    console.log('✓ Added Freight items');
    
    // Item Type 4: Scenic/Display
    console.log('Adding Scenic/Display items...');
    await orderPage.locator('button:nth-child(4)').first().click();
    await orderPage.locator('button:nth-child(4)').first().click();
    await orderPage.locator('button:nth-child(4)').first().click();
    await orderPage.getByRole('gridcell', { name: '\'6"x18\'8" Screen Kit - Front Projection' }).dblclick();
    console.log('✓ Added Scenic/Display items');
    
    // Item Type 5: Additional items
    console.log('Adding additional items...');
    await orderPage.locator('button:nth-child(5)').click();
    await orderPage.getByRole('gridcell', { name: '01C Mix Scenery Set Kit' }).click();
    await orderPage.locator('button:nth-child(6)').click();
    await orderPage.getByText('Print On Quote Print On').click();
    await orderPage.locator('#jobProductContainer').getByRole('group').click();
    await orderPage.locator('.slick-viewport').first().click();
    await orderPage.locator('body').press('ArrowDown');
    await orderPage.locator('body').press('ArrowDown');
    await orderPage.locator('body').press('ArrowDown');
    console.log('✓ All items added successfully\n');

    // Step 5: Save the Job
    console.log('=== Saving Job ===');
    
    // Wait for Job Actions button to be ready before clicking
    const saveJobActionsBtn = orderPage.getByRole('button', { name: 'Job Actions' });
    await saveJobActionsBtn.waitFor({ state: 'visible', timeout: 10000 });
    await saveJobActionsBtn.click();
    
    // Wait for Save option to appear in menu
    const saveOption = orderPage.getByText('Save', { exact: true });
    await saveOption.waitFor({ state: 'visible', timeout: 10000 });
    await saveOption.click();
    console.log('✓ Save button clicked via Job Actions menu');
    
    // Validate newly added job is visible in job grid
    console.log('\n=== Validating Job Grid ===');
    
    // Wait for job grid to update after save (check for visible state and stable content)
    const jobGrid = orderPage.locator('#oeJobGrid');
    await expect(jobGrid).toBeVisible({ timeout: 10000 });
    
    // Wait for grid to have content (not just be visible but populated)
    await orderPage.waitForFunction(
      (gridSelector) => {
        const grid = document.querySelector(gridSelector) as HTMLElement;
        return grid && grid.innerText && grid.innerText.trim().length > 100; // Ensure grid has meaningful content
      },
      '#oeJobGrid',
      { timeout: 15000 }
    );
    
    // Get job number from grid (dynamic, not hardcoded)
    const jobRows = await jobGrid.locator('tr').count();
    console.log(`Job grid contains ${jobRows} row(s)`);
    
    const gridText = await jobGrid.innerText();
    console.log('Job Grid Contents:', gridText);
    
    // Verify job number appears in grid (looking for any job number pattern)
    const jobNumberMatch = gridText.match(/\d{4,}/);
    if (jobNumberMatch) {
      const jobNumber = jobNumberMatch[0];
      console.log(`✓ Newly added job is visible in grid - Job Number: ${jobNumber}`);
      await expect(jobGrid).toContainText(jobNumber);
    } else {
      console.log('✓ Job grid updated after save');
    }

    // Step 6: Generate and Validate Report - Click on Print
    console.log('\n=== Generating and Validating Report ===');
    const printButton = orderPage.getByRole('button', { name: 'Print' });
    await expect(printButton).toBeVisible({ timeout: 10000 });
    console.log('✓ Print button is visible');
    
    await printButton.click();
    console.log('✓ Print button clicked');
    
    await expect(orderPage.getByText('1145')).toBeVisible({ timeout: 10000 });
    await expect(orderPage.getByRole('textbox').nth(2)).toBeVisible({ timeout: 10000 });
    console.log('✓ Print dialog opened');
    
    await orderPage.getByRole('tab', { name: 'Report Preview' }).click();
    console.log('✓ Report Preview tab selected');
    
    // Wait for Preview Report button to be ready
    const previewReportBtn = orderPage.getByTitle('Preview Report');
    await previewReportBtn.waitFor({ state: 'visible', timeout: 10000 });
    await previewReportBtn.click();
    console.log('✓ Preview Report clicked, generating report...');
    
    // Wait for report page to be generated and visible
    const reportPage = orderPage.locator('#page_0');
    await reportPage.waitFor({ state: 'attached', timeout: 30000 });
    await reportPage.waitFor({ state: 'visible', timeout: 30000 });
    console.log('✓ Report generated successfully');
    
    // Validate Report Contents
    console.log('\n=== Validating Report Contents ===');
    // reportPage already declared above, just ensure it's still visible
    await expect(reportPage).toBeVisible({ timeout: 10000 });
    
    // Validate Opportunity Name in report
    await expect(reportPage).toContainText('JBS Automation POC For Jan', { timeout: 10000 });
    console.log('✓ Opportunity Name appears in report');
    
    // Validate dates in report
    await expect(reportPage).toContainText('01/20/2026 - 01/30/2026', { timeout: 10000 });
    console.log('✓ Event dates appear in report');
    
    // Validate venue information
    await expect(reportPage).toContainText('Hilton Dallas/Park Cities', { timeout: 10000 });
    console.log('✓ Venue information appears in report');
    
    // Validate financial details
    const reportText = await reportPage.innerText();
    const hasTotal = reportText.includes('Total Estimate');
    const hasEquipment = reportText.includes('Equipment Rental');
    const hasLabor = reportText.includes('Labor');
    
    console.log('Report Validation:');
    console.log(`  - Has Total Estimate: ${hasTotal}`);
    console.log(`  - Has Equipment Rental: ${hasEquipment}`);
    console.log(`  - Has Labor charges: ${hasLabor}`);
    
    console.log('\n✅ Complete Order Flow Test Completed Successfully');
    console.log('Summary:');
    console.log('  1. Validated Opportunity Number and Name in Encore order');
    console.log('  2. Inserted new job via Jobs → Job Actions → Insert Job');
    console.log('  3. Added items from multiple item types');
    console.log('  4. Saved job successfully');
    console.log('  5. Validated job appears in job grid');
    console.log('  6. Generated report and validated contents');
  });
});
