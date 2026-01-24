# Microsoft Dynamics 365 CRM Test Plan

## Application Overview

Microsoft Dynamics 365 CRM Application - QA Environment. This is a cloud-based customer relationship management system featuring dashboard management, sales opportunities tracking, order creation, and integration with external order management systems (Encore). The application uses Microsoft authentication and provides comprehensive sales pipeline management capabilities.

## Test Scenarios

### 1. Authentication and Login Tests

**Seed:** `tests/seed.spec.ts`

#### 1.1. Valid Login with Credentials

**File:** `tests/auth/valid-login.spec.ts`

**Steps:**
  1. Navigate to the CRM login page at https://psavcustomersqa.crm.dynamics.com/main.aspx?appid=d05771f7-d483-41b2-9672-5333d8eaa013&forceUCI=1&pagetype=dashboard&type=system&_canOverride=true
  2. Verify the Sign in page is displayed
  3. Enter username 's-tst-navi-CRM@psav.com' in the username field
  4. Click the 'Next' button
  5. Verify the password entry page is displayed with username confirmed
  6. Enter password 'Winter23$' in the password field
  7. Click the 'Sign in' button
  8. Verify 'Stay signed in?' prompt appears
  9. Click 'No' to dismiss the prompt
  10. Verify navigation to CRM dashboard
  11. Verify 'My Goals and Pace' page heading is visible

**Expected Results:**
  - User successfully authenticated
  - Redirected to CRM dashboard
  - Dashboard loads without errors
  - My Goals and Pace dashboard component is visible
  - All dashboard widgets display correctly

#### 1.2. Invalid Username Handling

**File:** `tests/auth/invalid-username.spec.ts`

**Steps:**
  1. Navigate to the CRM login page
  2. Enter invalid username 'nonexistent@psav.com'
  3. Click the 'Next' button
  4. Verify error handling response

**Expected Results:**
  - Clear error message indicating user not found
  - User remains on login page
  - No sensitive information is exposed

#### 1.3. Invalid Password Handling

**File:** `tests/auth/invalid-password.spec.ts`

**Steps:**
  1. Navigate to the CRM login page
  2. Enter username 's-tst-navi-CRM@psav.com'
  3. Click 'Next'
  4. Enter incorrect password 'WrongPassword123'
  5. Click 'Sign in'
  6. Verify error response

**Expected Results:**
  - Error message displayed for incorrect password
  - User remains on password entry page
  - No account lockout after single failed attempt

#### 1.4. Empty Credentials Validation

**File:** `tests/auth/empty-credentials.spec.ts`

**Steps:**
  1. Navigate to the CRM login page
  2. Leave username field empty
  3. Attempt to click 'Next'
  4. Verify validation message for empty username

**Expected Results:**
  - Appropriate validation message for required fields
  - User cannot proceed without entering credentials
  - Form provides clear guidance on required fields

### 2. Dashboard Navigation Tests

**Seed:** `tests/seed.spec.ts`

#### 2.1. Dashboard Load and Verification

**File:** `tests/dashboard/dashboard-load.spec.ts`

**Steps:**
  1. Complete successful login with credentials
  2. Wait for dashboard to fully load
  3. Verify 'My Goals and Pace' page title is visible
  4. Verify page contains dashboard components
  5. Check that left navigation menu is accessible
  6. Verify all dashboard sections render without errors

**Expected Results:**
  - Dashboard loads within 5 seconds
  - My Goals and Pace heading is visible
  - Dashboard components display correctly
  - Navigation menu is fully functional
  - No JavaScript errors in browser console

#### 2.2. Navigation Menu Functionality

**File:** `tests/dashboard/navigation-menu.spec.ts`

**Steps:**
  1. Login to CRM dashboard
  2. Locate the left navigation menu
  3. Verify menu contains 'Opportunities' option under 'Sales' section
  4. Verify menu contains other key sections like 'My Work', 'Customers', 'Sales', 'Forecast', 'Partners'
  5. Click on 'Opportunities' menu item
  6. Verify navigation to Opportunities list page occurs

**Expected Results:**
  - Left menu displays all expected sections
  - Menu items are properly organized and labeled
  - Navigation to Opportunities page is successful
  - Menu items are clickable and responsive
  - Page transitions complete within 3 seconds

### 3. Opportunities Management Tests

**Seed:** `tests/seed.spec.ts`

#### 3.1. Opportunities List View

**File:** `tests/opportunities/list-view.spec.ts`

**Steps:**
  1. Login to CRM dashboard
  2. Click 'Opportunities' from left navigation menu
  3. Verify page loads with title 'My Opportunities | Open'
  4. Verify opportunities list/table is displayed
  5. Verify table contains columns: Event Start Date, Event End Date, Event Name, End User Account, End User Contact, Est. Revenue
  6. Verify list contains multiple opportunity records
  7. Verify search functionality is available

**Expected Results:**
  - Opportunities page loads successfully
  - Page title shows 'My Opportunities | Open'
  - List displays current open opportunities
  - All expected columns are visible
  - Search box is present and functional
  - Records display with correct data

#### 3.2. Search Opportunities by ID

**File:** `tests/opportunities/search-by-id.spec.ts`

**Steps:**
  1. Navigate to Opportunities list page
  2. Locate the searchbox havng id GlobalSearchBox
  3. Enter opportunity number 'OP15296451'
  4. Trigger search (Enter key or search button)
  5. Verify search results display matching opportunity
  6. Verify opportunity 'JBS Automation POC For Jan' is found
  7. Click on the opportunity result to view details

**Expected Results:**
  - Search executes successfully
  - Correct opportunity record is found and displayed
  - Opportunity details page loads
  - All relevant tabs and information are accessible
  - Search is case-insensitive

#### 3.3. Search with No Results

**File:** `tests/opportunities/search-no-results.spec.ts`

**Steps:**
  1. Navigate to Opportunities list page
  2. Enter non-existent opportunity number 'OP99999999'
  3. Trigger search
  4. Verify no results message

**Expected Results:**
  - Clear 'No results found' message is displayed
  - User is provided option to clear search or modify criteria
  - No errors or broken UI elements appear

#### 3.4. Opportunity Details Page

**File:** `tests/opportunities/details-page.spec.ts`

**Steps:**
  1. Search for and open opportunity 'OP15296451'
  2. Verify opportunity details page loads
  3. Verify main opportunity information is displayed
  4. Verify tabs are visible including 'Orders' tab
  5. Verify opportunity summary information shows correctly
  6. Check that all tabs are accessible and clickable

**Expected Results:**
  - Opportunity details page loads completely
  - All relevant tabs are accessible
  - Opportunity information displays accurately
  - Orders tab is visible and ready to click
  - Page layout matches expected structure

### 4. Orders Management Tests

**Seed:** `tests/seed.spec.ts`

#### 4.1. Orders Tab Navigation

**File:** `tests/orders/orders-tab.spec.ts`

**Steps:**
  1. Navigate to an opportunity detail page
  2. Locate and click the 'Orders' tab
  3. Verify Orders section loads
  4. Verify Orders iframe is displayed
  5. Look for 'Add new Order' button or action

**Expected Results:**
  - Orders tab opens successfully
  - Orders iframe loads properly
  - Add new Order button is visible and clickable
  - No errors loading Orders content

#### 4.2. Create New Order Process

**File:** `tests/orders/create-order.spec.ts`

**Steps:**
  1. Navigate to opportunity Orders tab
  2. Click 'Add new Order' button
  3. Handle any popup dialogs that appear
  4. Verify navigation to order creation form
  5. Verify order creation page displays order type and path information
  6. Click 'Create Order' button to initiate order creation
  7. Handle navigation events and popups

**Expected Results:**
  - Order creation process initiates successfully
  - Popup dialogs function correctly
  - Navigation to order creation page works
  - Order form displays all required fields
  - Create Order button is functional

#### 4.3. URL Replacement and External System Integration

**File:** `tests/orders/url-replacement.spec.ts`

**Steps:**
  1. During order creation, monitor URL changes
  2. Verify URL replacement occurs from 'navigator6.training.psav.com' to 'navigator.training.psav.com'
  3. Confirm navigation to Encore order creation page
  4. Verify successful handoff to external system

**Expected Results:**
  - URL replacement functions correctly
  - Navigation to correct Encore system URL occurs
  - External system loads successfully
  - No broken links or redirection errors
  - Integration between CRM and external system is seamless

#### 4.4. Order Creation Error Handling

**File:** `tests/orders/error-handling.spec.ts`

**Steps:**
  1. Attempt order creation with incomplete or invalid data
  2. Simulate or encounter loading room details error
  3. Verify error message is displayed
  4. Check error message clarity and user guidance
  5. Verify user can retry or navigate back

**Expected Results:**
  - Clear error message displayed for failures
  - Error messages are user-friendly and actionable
  - System handles errors gracefully
  - Users provided with alternative actions
  - No data loss or corruption on error

#### 5.1. Encore Order Creation, Item Addition, and Report Preview
**File:**  `tests/orders/encore-order.spec.ts`

**Steps:**

1. From the CRM Orders tab, click 'Add new Order' and handle the popup to navigate to the Encore order creation page.
2. Verify the Encore order creation form loads with correct opportunity and customer details (e.g., 'OP15296451', 'JBS Automation POC For Jan').
3. Click the 'Create Order' button to initiate order creation.
4. On the order details page, verify order summary, contacts, and job information are displayed.
5. Click 'Jobs', then 'Job Actions', then 'Insert Job', select job date, and go to 'Items'.
6. Add multiple products (e.g., 'Deluxe LCD Projection Package', 'Allen & Heath ZED10', etc.) by clicking and double-clicking as required.
7. Click 'OK' to confirm item addition.
8. Click 'Save' to save the order and verify confirmation (e.g., order number '8695' is visible in the job grid).

**Expected Results:**

- Encore order creation form loads with correct data from CRM.
- Order is created and saved successfully.
- Order details and job items are displayed accurately.

#### 5.2. Print and Report Preview Validation
**File:**  `tests/orders/print-report-preview.spec.ts`

**Steps:**

1. Complete the order creation process up to job setup with items added (prerequisite: order exists with saved job and items).
2. Navigate to the order details page in Encore system.
3. Locate and verify the 'Print' button is visible and accessible.
4. Click the 'Print' button to initiate report generation process.
5. Wait for the print dialog/modal to appear and verify it loads properly.
6. Verify the print dialog contains relevant order information and settings.
7. Navigate to the 'Report Preview' tab within the print dialog.
8. Verify the 'Report Preview' tab is accessible and clickable.
9. Click on 'Preview Report' or equivalent action to generate the report preview.
10. Wait for the report preview to load and verify it displays without errors.
11. Validate that the report preview displays correct order information including:
    - Opportunity number (e.g., 'OP15296451')
    - Event name (e.g., 'JBS Automation POC For Jan')
    - Customer details and contact information
    - Event dates (e.g., '01/20/2026 - 01/30/2026')
    - Venue information (e.g., 'Hilton Dallas/Park Cities')
12. Verify pricing information is displayed correctly including:
    - Individual line item costs
    - Equipment rental charges
    - Labor costs (if applicable)
    - Total estimate amount (e.g., '$2,445.96 Total Estimate Ext.')
    - Tax calculations (if applicable)
13. Validate that all relevant tabs within the print dialog are accessible:
    - 'Report Preview' tab
    - 'Parameters' tab (if available)
    - Any additional configuration tabs
14. Verify report actions and controls are functional:
    - Print button functionality
    - Export options (if available)
    - Report format selections
    - Page navigation controls (if multi-page report)
15. Test report responsiveness and formatting:
    - Verify text is readable and properly formatted
    - Check that tables and data align correctly
    - Ensure no data truncation or overflow issues
16. Validate report header and footer information:
    - Company branding and logos
    - Report generation date/time
    - Page numbering (if applicable)
    - Report type identification

**Expected Results:**

- Print button is easily accessible and clearly labeled.
- Print dialog opens smoothly without errors or delays.
- Report Preview tab loads within 10 seconds of clicking.
- All order details from CRM are accurately reflected in the report preview.
- Customer information, event details, and venue data display correctly.
- Pricing calculations are accurate and properly formatted.
- Total estimate matches expected calculations from added items.
- All tabs within print dialog are functional and responsive.
- Report preview displays professional formatting suitable for client presentation.
- No missing data, broken formatting, or system errors occur during report generation.
- Report actions (print, export, etc.) are clearly visible and functional.
- Report content is comprehensive and includes all necessary business information.
- Page layout is optimized for printing with proper margins and spacing.

