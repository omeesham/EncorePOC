# Specs

Here are the test steps derived from the test in tests/seed.spec.ts:

Navigate to "https://psavcustomersqa.crm.dynamics.com/main.aspx?appid=d05771f7-d483-41b2-9672-5333d8eaa013&forceUCI=1&pagetype=dashboard&type=system&_canOverride=true"  login page.
Enter the username "s-tst-navi-CRM@psav.com" and click "Next".
Enter the password "Winter23$" and click "Sign in".
Click "No" on the stay signed in prompt.
Navigate to the CRM dashboard.
Verify "My Goals and Pace" text is visible.
Click "Opportunities" from the left menu.
Navigate to the Opportunities entity list.
Verify "My Opportunities | Open" text is visible.
Click and fill the search box with the opportunity number OP15296451.
Press Enter from keyboard to search.
Verify the opportunity text is visible and click it.
Navigate to the opportunity record.
Verify and click the "Orders" tab.
Open the Orders iframe and click "Add new Order".
Handle the popup, navigate to the new order page, and verify order type/path.
Click "Create Order" and handle navigation.
Replace https://navigator6.training.psav.com/ to https://navigator.training.psav.com/
Navigated to Encore order creation page 
handle else error message as "Verify error message for loading room details."

