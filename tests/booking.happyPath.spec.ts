import { test, expect } from '../fixtures/baseFixtures';
import { STRIPE_TEST_CARDS, TEST_USERS } from '../utils/testData';

/*
Test Suite: Complete Booking Flow - Happy Path(Test Case #1)
This is the most importand test as it validates the entire revenue-generating flow.
We're testing the full end to end booking, login, picking a service, scheduling, and payment.

Why I chose this for automation:
1. High Business Impact: This flow directly impacts revenue, so it's crucial to ensure it works flawlessly.
2. User Experience: A smooth booking process is essential for customer satisfaction and retention.
3. Regression Testing: Automating this test ensures that any future changes don't break the core functionality of the booking process.
4. ROI: High Value test that should run before every deployment

Some assumptions and trade-offs:
- Staging env. needs to be up and stable
- Stripe is in test mode
- Available time slots vary, so using flexible selectors
- Test might fail if there are no available slots, but this is a real-world scenario that we want to catch.
*/

test.describe('Complete Booking Flow - End to End Happy Path', () => {
    test('TC01: Complete booking with valid payment', async ({ page, loginPage, bookingPage }) => {

        // Step 1: Login
        await test.step('User logs in successfully', async () => {
            await loginPage.navigateToLoginPage();
            await loginPage.login(TEST_USERS.VALID_USER.email, TEST_USERS.VALID_USER.password);
        });

        // Step 2: Start booking flow
        await test.step('Navigate to booking page and fill initial information', async () => {
            await bookingPage.navigateToBooking();

            // DOB and Sex Fields are commented out - not needed for current flow
            //await bookingPage.fillDateOfBirth(BOOKING_DATA.VALID_BOOKING.dateOfBirth);
            //await bookingPage.selectSexAtBirth(BOOKING_DATA.VALID_BOOKING.sex);
        });

        // Step 3: Pick the service
        await test.step('Select scan/service type', async () => {
            await bookingPage.selectMRIScan();
            await bookingPage.clickContinue();
        });

        // Step 4: Choose location, date and time
        await test.step('Select location and appointment date/time', async () => {
            // pick first available location
            await bookingPage.selectLocation(0);

            // pick first available date
            await bookingPage.selectDate(0);

            //pick first available time slot
            await bookingPage.selectTimeSlot(0);
            
            //Make sure time slot got selected
            const isSlotSelected = await bookingPage.isTimeSlotSelected();
            expect(isSlotSelected).toBeTruthy();

            await bookingPage.clickContinue();

            // Should land on payment page
            await page.waitForURL('**/reserve-appointment');
        });
        // Step 5: Pay
        await test.step('Complete payment with valid card', async () => {
            await bookingPage.completePayment(STRIPE_TEST_CARDS.VALID);
        });

        // Step 6: Check confirmation
        await test.step('Verify booking confirmation', async () => {
            // Confirmation message should show up
            const isConfirmationDisplayed = await bookingPage.isConfirmationDisplayed();
            expect(isConfirmationDisplayed).toBeTruthy();

            // Check the confirmation title
            const confirmationTitle = await bookingPage.getConfirmationTitle();
            expect(confirmationTitle).toContain("You\'re almost done");

            //check the description
            const confirmationDescription = await bookingPage.getConfirmationDescription();
            expect(confirmationDescription).toContain("medical questionnaire");

            console.log('Booking flow completed successfully. Message: ${confirmationTitle}');
        });
    });
});

/*Notes on Scalability and Future improvements:
1. Data Driven Testing: right now using test data from utils/testData.ts, but we can easily extend this to pull from external sources like JSON/CSV.
2. Page Object Model: Already implemented, but as the app grows we can further modularize and create more specific page objects for different sections of the booking flow.
3. Step Annotations: Using test.step for better reporting and readability, which will help as we add more test cases.
4. Fixtures: Custom Fixtures for setup and reusable contexts, could add more for different user roles, test data variations, etc.
5. Environment Config: Currently pointing to staging, should use environment variables to easily switch between staging, production, and other environments without code changes.

Ideas for Future Enhancements:
- Add visual regression testing with playwright screenshots
- Use test data factorires for dynamic test data generation
- Collected performance metrics(page load times, etc.)
- Add retry logic for flaky network issues
- verify confirmation email actually arrive
- check database to confirm booking was saved
- run tests in parallel with different user accounts
*/
