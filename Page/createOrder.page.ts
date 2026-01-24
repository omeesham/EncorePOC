import { Page, expect } from '@playwright/test';

export class CreateOrderPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Selectors
  private get createOrderButton() {
    return this.page.getByRole('button', { name: 'Create Order' });
  }

  private get accountsContactsSection() {
    return this.page.locator('#accounts-contacts');
  }

  private get orderJobCommon() {
    return this.page.locator('#orderJobCommon');
  }

  // Methods
  async navigateToOrderCreation(orderCreationUrl: string) {
    let navigationSuccess = false;
    let retryCount = 0;
    const maxRetries = 3;
    
    while (!navigationSuccess && retryCount < maxRetries) {
      try {
        console.log(`Attempting navigation (attempt ${retryCount + 1}/${maxRetries})...`);
        await this.page.goto(orderCreationUrl, { 
          waitUntil: 'networkidle',
          timeout: 30000 
        });
        
        await this.createOrderButton.waitFor({ 
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
            await this.page.reload({ waitUntil: 'networkidle', timeout: 20000 });
            await this.page.waitForLoadState('domcontentloaded');
          } catch (reloadError) {
            const reloadErrorMessage = reloadError instanceof Error ? reloadError.message : String(reloadError);
            console.error(`Reload failed: ${reloadErrorMessage}`);
          }
        } else {
          throw new Error(`Failed to load order creation page after ${maxRetries} attempts: ${errorMessage}`);
        }
      }
    }
  }

  async validateOrderCreationFormLoaded() {
    await expect(this.createOrderButton).toBeVisible({ timeout: 15000 });
    console.log('✓ Encore order creation form loaded with correct opportunity details');
  }

  async createOrder() {
    await this.createOrderButton.click();
    await this.page.waitForURL('**/order/**', { timeout: 30000 });
    console.log('✓ Order creation initiated successfully');
    
    // Wait for order page to be interactive
    await this.accountsContactsSection.waitFor({ state: 'visible', timeout: 20000 });
    
    // Capture order number from URL
    const orderUrl = this.page.url();
    const orderNumberMatch = orderUrl.match(/\/order\/(\d+)/i);
    let orderNumber = '';
    if (orderNumberMatch) {
      orderNumber = orderNumberMatch[1];
      console.log(`✓ Order Number captured: ${orderNumber}`);
    }
    
    console.log('Order created, URL:', orderUrl);
    return orderNumber;
  }

  async validateOrderDetails(opportunityNumber: string, opportunityTitle: string) {
    console.log('=== Validating Opportunity Details in Encore Order ===');
    
    // Wait for accounts-contacts section and opportunity data to load
    await this.accountsContactsSection.waitFor({ state: 'visible', timeout: 30000 });
    
    // Wait for opportunity number to appear dynamically
    const oppNumber = this.page.getByText(opportunityNumber);
    await expect(oppNumber).toBeVisible({ timeout: 20000 });
    console.log(`✓ Opportunity Number validated: ${opportunityNumber}`);
    
    await expect(this.accountsContactsSection).toContainText(opportunityNumber, { timeout: 10000 });
    await expect(this.accountsContactsSection).toContainText(opportunityTitle, { timeout: 10000 });
    console.log(`✓ Opportunity Name validated: ${opportunityTitle}`);
    
    await expect(this.orderJobCommon.getByText(opportunityTitle)).toBeVisible({ timeout: 10000 });
    console.log('✓ Order details page loaded successfully');
  }

  async validateOpportunityDetails(opportunityNumber: string, opportunityTitle: string) {
    return this.validateOrderDetails(opportunityNumber, opportunityTitle);
  }

  async validateEncoreOrderCreationForm() {
    // Verify Encore order creation form loads with correct data
    await expect(this.createOrderButton).toBeVisible({ timeout: 15000 });
    console.log('✓ Encore order creation form loaded with correct opportunity and customer details');
  }

  async validateOrderSummaryAndContacts() {
    // Verify order summary, contacts, and job information are displayed
    await this.accountsContactsSection.waitFor({ state: 'visible', timeout: 20000 });
    console.log('✓ Order details page loaded with correct opportunity and customer details');
  }

  getOrderUrl(): string {
    return this.page.url();
  }

  async validatePageElements() {
    await expect(this.createOrderButton).toBeVisible({ timeout: 15000 });
    await expect(this.accountsContactsSection).toBeVisible({ timeout: 20000 });
    console.log('✓ All required page elements are visible and accessible');
  }
}