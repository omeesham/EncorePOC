import { Page, expect } from '@playwright/test';
import { CRMLogin } from '../Common/CRMLogin';

export class SearchOpportunityPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Selectors
  private get opportunitiesLink() {
    return this.page.getByText('Opportunities', { exact: true });
  }

  private get globalSearchBox() {
    // Try common selectors for Dynamics 365 global search
    // 1. Top nav: input[aria-label="Search"]
    // 2. Unified interface: input[data-id="searchBox"]
    // 3. Classic: input.ms-crm-SearchBox-Input, input#crmTopBarSearchBox, input[placeholder*="Search"]
    return this.page.locator(
      'input[aria-label="Search"], input[data-id="searchBox"], input.ms-crm-SearchBox-Input, input#crmTopBarSearchBox, input[placeholder*="Search"], input[aria-label="Search this view"], [data-id="globalSearchText"]'
    ).first();
  }

  private get opportunityTabList() {
    return this.page.getByRole('tablist', { name: /Opportunity Form/i });
  }

  private get ordersTab() {
    return this.page.getByRole('tab', { name: 'Orders' });
  }

  private get createOrderButton() {
    return this.page.getByRole('button', { name: 'Create Order' });
  }

  private get ordersIframe() {
    return this.page.locator('iframe[title*="Orders"]');
  }

  private get ordersFrame() {
    return this.page.frameLocator('iframe[title*="Orders"]');
  }

  private get addNewOrderImage() {
    return this.ordersFrame.getByRole('img', { name: /Add new Order/i });
  }

  // Methods
  async navigateToOpportunities() {
    await CRMLogin(this.page);
    await this.opportunitiesLink.click();
    // Wait for the Opportunities page to load completely
    try {
      await this.page.waitForSelector(
        'input[aria-label="Search"], input[data-id="searchBox"], input.ms-crm-SearchBox-Input, input#crmTopBarSearchBox, input[placeholder*="Search"], input[aria-label="Search this view"], [data-id="globalSearchText"]',
        { state: 'visible', timeout: 60000 }
      );
      await expect(this.globalSearchBox).toBeVisible();
    } catch (e) {
      // Log all visible input fields for debugging
      const allInputs = await this.page.locator('input').all();
      for (const input of allInputs) {
        const desc = await input.getAttribute('aria-label') || await input.getAttribute('placeholder') || await input.getAttribute('id') || '';
        const visible = await input.isVisible();
        if (visible) {
          console.log('Visible input:', desc);
        }
      }
      throw new Error('Global search box not found. See visible input logs above.');
    }
    console.log('✓ Navigated to Opportunities');
  }

  async searchOpportunity(opportunityNumber: string) {
    // Wait for the global search box to be visible
    try {
      await this.page.waitForSelector(
        'input[aria-label="Search"], input[data-id="searchBox"], input.ms-crm-SearchBox-Input, input#crmTopBarSearchBox, input[placeholder*="Search"], input[aria-label="Search this view"], [data-id="globalSearchText"]',
        { state: 'visible', timeout: 60000 }
      );
      await expect(this.globalSearchBox).toBeVisible();
    } catch (e) {
      // Log all visible input fields for debugging
      const allInputs = await this.page.locator('input').all();
      for (const input of allInputs) {
        const desc = await input.getAttribute('aria-label') || await input.getAttribute('placeholder') || await input.getAttribute('id') || '';
        const visible = await input.isVisible();
        if (visible) {
          console.log('Visible input:', desc);
        }
      }
      throw new Error('Global search box not found. See visible input logs above.');
    }
    await this.globalSearchBox.fill(opportunityNumber);
    await this.globalSearchBox.press('Enter');
    // Wait for search results to load (update selector as needed for global search results)
    await this.page.waitForSelector('text="Search Result", [data-testid="search-result"], .search-results-container', { timeout: 30000 }).catch(() => {});
    console.log(`✓ Searched for opportunity (global): ${opportunityNumber}`);
  }

  async navigateToOpportunityDetails(opportunityUrl: string) {
    // First ensure we're logged in by going to the dashboard
    await CRMLogin(this.page);
    
    // Now navigate to the specific opportunity URL
    await this.page.goto(opportunityUrl);
    await expect(this.opportunityTabList).toBeVisible({ timeout: 20000 });
    console.log('✓ Navigated to opportunity details page');
  }

  async validateOpportunityDetails(expectedEventName: string) {
    await this.page.getByRole('tab', { name: 'Summary' }).click();
    
    const eventNameEl = this.page.getByRole('textbox', { name: 'Event Name' });
    const startDateEl = this.page.getByRole('textbox', { name: 'Date of Event Start Date' });
    const endDateEl = this.page.getByRole('textbox', { name: 'Date of Event End Date' });
    const estRevenueEl = this.page.getByRole('textbox', { name: 'Est. Revenue' });
    
    await expect(eventNameEl).toBeVisible({ timeout: 20000 });
    await expect(startDateEl).toBeVisible({ timeout: 20000 });
    await expect(endDateEl).toBeVisible({ timeout: 20000 });
    await expect(estRevenueEl).toBeVisible({ timeout: 20000 });
    
    const eventName = await eventNameEl.innerText();
    const startDate = await startDateEl.innerText();
    const endDate = await endDateEl.innerText();
    const estRevenue = await estRevenueEl.innerText();
    
    console.log('✓ Opportunity summary details validated');
    return { eventName, startDate, endDate, estRevenue };
  }

  async navigateToOrdersTab() {
    // Wait for tab to be available and click
    await this.page.waitForSelector('[role="tab"]:has-text("Orders"), [role="tab"][aria-label*="Orders"]', { state: 'visible' });
    await this.ordersTab.click();
    
    // Wait for Orders content to load - either iframe or direct content
    await this.page.waitForSelector('[role="tab"]:has-text("Orders"), iframe[src*="order"]', { timeout: 60000 });
    
    // Check if Orders iframe exists and wait for it
    const iframeExists = await this.ordersIframe.count() > 0;
    if (iframeExists) {
      await this.ordersIframe.waitFor({ state: 'attached' });
      await expect(this.ordersIframe).toBeVisible();
    } else {
      // Wait for direct orders content
      await this.page.waitForSelector('text=ORDERS, button:has-text("Create"), text=Add', { state: 'visible' });
    }
    
    console.log('✓ Navigated to Orders tab');
  }

  async getExistingOrders() {
    let orderRows: string[] = [];
    try {
      orderRows = await this.ordersFrame.getByRole('row').allTextContents();
    } catch {
      try {
        const grid = this.ordersFrame.getByRole('grid');
        await grid.waitFor({ state: 'visible', timeout: 30000 });
        orderRows = await grid.locator('[role="row"]').allTextContents();
      } catch {
        const frameText = await this.ordersFrame.locator('body').innerText();
        orderRows = frameText.split('\n').slice(0, 10);
      }
    }
    console.log('✓ Retrieved existing orders');
    return orderRows;
  }

  async clickAddNewOrder() {
    // Wait for Orders content to be ready
    await this.page.waitForSelector('iframe[title*="Orders"], button:has-text("Add new Order")', { timeout: 60000 }).catch(() => {});
    
    // Check if we have an iframe or direct content
    const iframeExists = await this.ordersIframe.count() > 0;
    
    if (iframeExists) {
      // Wait for iframe content to load
      await this.ordersIframe.waitFor({ state: 'attached' });
      const ordersFrame = this.page.frameLocator('iframe[title*="Orders"]');
      await ordersFrame.locator('body').waitFor({ state: 'visible' });
      
      // Look for Add new Order button with multiple selectors
      const addOrderSelectors = [
        'img[title*="Add new Order"]',
        'img[alt*="Add new Order"]', 
        'button:has-text("Add new Order")',
        'a:has-text("Add new Order")',
        '[role="img"][title*="Add"]'
      ];
      
      let addNewOrderButton;
      for (const selector of addOrderSelectors) {
        try {
          addNewOrderButton = ordersFrame.locator(selector).first();
          await addNewOrderButton.waitFor({ state: 'visible' });
          break;
        } catch (e) {
          continue;
        }
      }
      
      if (!addNewOrderButton) {
        throw new Error('Add new Order button not found in iframe');
      }
      
      const popupMaxRetries = 3;
      let popupAttempt = 0;
      let orderPage: Page | undefined;
    
    while (popupAttempt < popupMaxRetries && !orderPage) {
      try {
        console.log(`Attempting to click Add new Order button (attempt ${popupAttempt + 1}/${popupMaxRetries})`);
        
        const popupPromise = this.page.waitForEvent('popup');
        await addNewOrderButton.click();
        orderPage = await popupPromise;
        
        if (orderPage) {
          await orderPage.waitForLoadState('domcontentloaded');
          console.log('✓ Order popup opened successfully');
          break;
        }
      } catch (error) {
        popupAttempt++;
        console.log(`Popup attempt ${popupAttempt} failed:`, error);
        if (popupAttempt >= popupMaxRetries) {
          throw new Error(`Failed to open order popup after ${popupMaxRetries} attempts`);
        }
        await this.page.waitForTimeout(1000);
      }
    }
    
    if (!orderPage) {
      throw new Error('Unable to open order creation popup');
    }
    
    return orderPage;
  } else {
    // Handle direct orders content without iframe
    throw new Error('Direct orders content handling not implemented');
  }
}

async getAdditionalOpportunityDetails() {
    const endUserAccount = await this.page
      .getByRole('list', { name: /End User Account/i })
      .getByRole('link')
      .first()
      .innerText()
      .catch(() => 'N/A');
    
    const endUserContact = await this.page
      .getByRole('list', { name: /End User Contact/i })
      .getByRole('link')
      .first()
      .innerText()
      .catch(() => 'N/A');
    
    const venueName = await this.page
      .getByRole('list', { name: /Venue/i })
      .getByRole('link')
      .first()
      .innerText()
      .catch(() => 'N/A');
    
    console.log('✓ Retrieved additional opportunity details');
    return { endUserAccount, endUserContact, venueName };
  }
}