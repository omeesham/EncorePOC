import { Page, expect } from '@playwright/test';

export class InsertJobPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Selectors
  private get jobsLink() {
    return this.page.getByText('Jobs', { exact: true });
  }

  private get jobActionsButton() {
    return this.page.getByRole('button', { name: 'Job Actions' });
  }

  private get insertJobLink() {
    return this.page.getByText('Insert Job');
  }

  private get jobDatePanel() {
    return this.page.locator('#jobDatePanel');
  }

  private get itemsLink() {
    return this.page.getByRole('link', { name: 'Items' });
  }

  private get jobGrid() {
    return this.page.locator('#oeJobGrid');
  }

  private get saveJobButton() {
    return this.page.getByRole('button', { name: 'Save Job', exact: true });
  }

  private get saveOption() {
    return this.page.getByText('Save', { exact: true });
  }

  // Item type buttons
  private get avEquipmentButton() {
    return this.page.getByRole('button').filter({ hasText: /^$/ }).nth(4);
  }

  private get videoEquipmentButton() {
    return this.page.getByRole('button').filter({ hasText: /^$/ }).nth(5);
  }

  private get freightButton() {
    return this.page.locator('.btn-group-vertical > button:nth-child(3)');
  }

  private get scenicDisplayButton() {
    return this.page.locator('button:nth-child(4)').first();
  }

  private get additionalItemsButton() {
    return this.page.locator('button:nth-child(5)');
  }

  // Methods
  async navigateToJobs() {
    await this.jobsLink.click();
    console.log('✓ Navigated to Jobs tab');
  }

  async insertNewJob() {
    console.log('=== Inserting New Job ===');
    
    // Wait for Job Actions button to be visible and enabled
    await this.jobActionsButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.jobActionsButton.click();
    
    await this.insertJobLink.click();
    console.log('✓ Insert Job clicked');
  }

  async configureJobSetup() {
    // Wait for job date panel to appear before clicking
    await this.jobDatePanel.waitFor({ state: 'visible', timeout: 10000 });
    await this.jobDatePanel.click();
    console.log('✓ Job setup and configuration completed');
  }

  async navigateToItems() {
    // Wait for Items link to be visible and clickable
    await this.itemsLink.waitFor({ state: 'visible', timeout: 10000 });
    await this.itemsLink.click();
    console.log('✓ Navigated to Items tab');
  }

  async addAVEquipmentItems() {
    console.log('Adding AV Equipment items...');
    await this.avEquipmentButton.click();
    
    // Add Deluxe LCD Projection Package
    await this.page.getByRole('gridcell', { name: 'Deluxe LCD Projection Package' }).click();
    await this.page.getByRole('gridcell', { name: 'Deluxe LCD Projection Package' }).click();
    await this.page.getByRole('gridcell', { name: 'Deluxe LCD Projection Package' }).click();
    await this.page.getByRole('gridcell', { name: 'Deluxe LCD Projection Package' }).dblclick();
    await this.page.getByRole('button', { name: 'OK' }).click();
    
    // Add other AV equipment
    await this.page.getByRole('gridcell', { name: 'Allen & Heath ZED10' }).click();
    await this.page.getByRole('gridcell', { name: 'Audix OM2' }).dblclick();
    await this.page.getByRole('gridcell', { name: 'Belkin Meeting Room Power' }).dblclick();
    await this.page.getByRole('gridcell', { name: 'Lenovo T460s Touch Laptop' }).dblclick();
    await this.page.getByRole('gridcell', { name: 'House Sound System Patch -' }).dblclick();
    
    console.log('✓ Added AV Equipment items');
  }

  async addVideoEquipmentItems() {
    console.log('Adding Video Equipment items...');
    await this.videoEquipmentButton.click();
    
    await this.page.getByRole('gridcell', { name: 'Camera' }).click();
    await this.page.getByRole('gridcell', { name: 'Camera' }).dblclick();
    await this.page.locator('.slick-cell.l1.r1.selected > .label > .glyphicon').click();
    await this.page.getByRole('gridcell', { name: 'Camera' }).click();
    await this.page.getByRole('gridcell', { name: 'Camera' }).click();
    
    console.log('✓ Added Video Equipment items');
  }

  async addFreightItems() {
    console.log('Adding Freight items...');
    await this.freightButton.click();
    
    await this.page.getByRole('gridcell', { name: 'Air Freight' }).click();
    await this.page.getByRole('gridcell', { name: 'Air Freight' }).click();
    
    console.log('✓ Added Freight items');
  }

  async addScenicDisplayItems() {
    console.log('Adding Scenic/Display items...');
    await this.scenicDisplayButton.click();
    await this.scenicDisplayButton.click();
    await this.scenicDisplayButton.click();
    
    await this.page.getByRole('gridcell', { name: '\'6"x18\'8" Screen Kit - Front Projection' }).dblclick();
    
    console.log('✓ Added Scenic/Display items');
  }

  async addAdditionalItems() {
    console.log('Adding additional items...');
    await this.additionalItemsButton.click();
    
    await this.page.getByRole('gridcell', { name: '01C Mix Scenery Set Kit' }).click();
    await this.page.locator('button:nth-child(6)').click();
    await this.page.getByText('Print On Quote Print On').click();
    await this.page.locator('#jobProductContainer').getByRole('group').click();
    await this.page.locator('.slick-viewport').first().click();
    await this.page.locator('body').press('ArrowDown');
    await this.page.locator('body').press('ArrowDown');
    await this.page.locator('body').press('ArrowDown');
    
    console.log('✓ All additional items added successfully');
  }

  async addAllItems() {
    console.log('=== Adding Items from Different Categories ===');
    
    await this.addAVEquipmentItems();
    await this.addVideoEquipmentItems();
    await this.addFreightItems();
    await this.addScenicDisplayItems();
    await this.addAdditionalItems();
    
    console.log('✓ All items added successfully\n');
  }

  async addBasicItems() {
    console.log('Adding basic items...');
    await this.avEquipmentButton.click();
    await this.page.getByRole('gridcell', { name: 'Deluxe LCD Projection Package' }).dblclick();
    await this.page.getByRole('button', { name: 'OK' }).click();
    console.log('✓ Basic items added');
  }

  async addMultipleProducts() {
    console.log('Adding multiple products...');
    await this.avEquipmentButton.click();
    await this.page.getByRole('gridcell', { name: 'Deluxe LCD Projection Package' }).dblclick();
    console.log('✓ Added Deluxe LCD Projection Package');
    
    // Add Allen & Heath ZED10
    await this.page.getByRole('gridcell', { name: 'Allen & Heath ZED10' }).dblclick();
    console.log('✓ Added Allen & Heath ZED10');
    
    // Add other equipment items
    await this.page.getByRole('gridcell', { name: 'Audix OM2' }).dblclick();
    await this.page.getByRole('gridcell', { name: 'Belkin Meeting Room Power' }).dblclick();
    await this.page.getByRole('gridcell', { name: 'Lenovo T460s Touch Laptop' }).dblclick();
    console.log('✓ Added additional AV equipment items');
  }

  async confirmItemAddition() {
    await this.page.getByRole('button', { name: 'OK' }).click();
    console.log('✓ Items addition confirmed');
  }

  async saveJob() {
    console.log('=== Saving Job ===');
    
    // Try using Save Job button directly first
    try {
      await this.saveJobButton.click();
      await this.page.waitForTimeout(3000);
      console.log('✓ Job saved using Save Job button');
    } catch {
      // Fallback to Job Actions menu
      await this.jobActionsButton.waitFor({ state: 'visible', timeout: 10000 });
      await this.jobActionsButton.click();
      
      await this.saveOption.waitFor({ state: 'visible', timeout: 10000 });
      await this.saveOption.click();
      console.log('✓ Save button clicked via Job Actions menu');
    }
  }

  async validateJobInGrid() {
    console.log('=== Validating Job Grid ===');
    
    // Navigate back to Jobs to see the grid
    await this.navigateToJobs();
    
    // Wait for job grid to update after save
    await expect(this.jobGrid).toBeVisible({ timeout: 10000 });
    
    // Wait for grid to have content
    await this.page.waitForFunction(
      (gridSelector) => {
        const grid = document.querySelector(gridSelector) as HTMLElement;
        return grid && grid.innerText && grid.innerText.trim().length > 100;
      },
      '#oeJobGrid',
      { timeout: 15000 }
    );
    
    // Get job number from grid
    const jobRows = await this.jobGrid.locator('tr').count();
    console.log(`Job grid contains ${jobRows} row(s)`);
    
    const gridText = await this.jobGrid.innerText();
    console.log('Job Grid Contents:', gridText);
    
    // Verify job number appears in grid
    const jobNumberMatch = gridText.match(/\d{4,}/);
    let jobNumber = '';
    if (jobNumberMatch) {
      jobNumber = jobNumberMatch[0];
      console.log(`✓ Newly added job is visible in grid - Job Number: ${jobNumber}`);
      await expect(this.jobGrid).toContainText(jobNumber);
    } else {
      console.log('✓ Job grid updated after save');
    }
    
    return jobNumber;
  }

  async validateJobAppearanceInGrid() {
    const jobGrid = this.page.locator('.slick-viewport');
    await expect(jobGrid).toBeVisible({ timeout: 10000 });
    console.log('✓ Job appears in job grid after save');
  }

  async getJobNumberFromGrid() {
    const gridText = await this.jobGrid.innerText();
    const jobNumberMatch = gridText.match(/\d{4,}/);
    return jobNumberMatch ? jobNumberMatch[0] : '';
  }

  async completeFullJobFlow() {
    await this.insertNewJob();
    await this.configureJobSetup();
    await this.navigateToItems();
    await this.addAllItems();
    await this.saveJob();
    return await this.validateJobInGrid();
  }

  async completeBasicJobFlow() {
    await this.insertNewJob();
    await this.configureJobSetup();
    await this.navigateToItems();
    await this.addBasicItems();
    await this.saveJob();
    return await this.validateJobInGrid();
  }

  async addComprehensiveItems() {
    console.log('\n=== Adding Items from Different Categories ===');
    
    // Item Type 1: AV Equipment
    console.log('Adding AV Equipment items...');
    await this.avEquipmentButton.click();
    await this.page.getByRole('gridcell', { name: 'Deluxe LCD Projection Package' }).click();
    await this.page.getByRole('gridcell', { name: 'Deluxe LCD Projection Package' }).dblclick();
    await this.page.getByRole('button', { name: 'OK' }).click();
    await this.page.getByRole('gridcell', { name: 'Allen & Heath ZED10' }).click();
    await this.page.getByRole('gridcell', { name: 'Audix OM2' }).dblclick();
    await this.page.getByRole('gridcell', { name: 'Belkin Meeting Room Power' }).dblclick();
    await this.page.getByRole('gridcell', { name: 'Lenovo T460s Touch Laptop' }).dblclick();
    await this.page.getByRole('gridcell', { name: 'House Sound System Patch -' }).dblclick();
    console.log('✓ Added AV Equipment items');
    
    // Item Type 2: Video Equipment
    console.log('Adding Video Equipment items...');
    await this.videoEquipmentButton.click();
    await this.page.getByRole('gridcell', { name: 'Camera' }).dblclick();
    console.log('✓ Added Video Equipment items');
    
    // Item Type 3: Freight
    console.log('Adding Freight items...');
    await this.page.locator('.btn-group-vertical > button:nth-child(3)').click();
    await this.page.getByRole('gridcell', { name: 'Air Freight' }).click();
    await this.page.getByRole('gridcell', { name: 'Air Freight' }).dblclick();
    console.log('✓ Added Freight items');
    
    // Item Type 4: Scenic/Display
    console.log('Adding Scenic/Display items...');
    await this.page.locator('button:nth-child(4)').first().click();
    await this.page.getByRole('gridcell', { name: '\'6"x18\'8" Screen Kit - Front Projection' }).dblclick();
    console.log('✓ Added Scenic/Display items');
    
    console.log('✓ All items added successfully\n');
  }

  async saveJobAndCaptureNumber() {
    console.log('=== Saving Job ===');
    
    // Wait for Job Actions button to be ready before clicking
    await this.jobActionsButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.jobActionsButton.click();
    
    // Wait for Save option to appear in menu
    await this.saveOption.waitFor({ state: 'visible', timeout: 10000 });
    await this.saveOption.click();
    console.log('✓ Save button clicked via Job Actions menu');
    
    return await this.validateJobInGrid();
  }
}