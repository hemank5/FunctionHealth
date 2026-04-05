import { test, expect } from '../fixtures/baseFixtures';
import { STRIPE_TEST_CARDS } from '../utils/testData';

/*
Payment Processing Validation(Test Case #2)

This test case focuses on validating the payment processing functionality of the application, specifically when a card
gets declined. We need to make sure users get clear error messages and can try again.

Why I chose this test case:
1. Revenue impact- if users don't know why their payment failed, they might not try again, leading to lost sales.
2. user experience- error messages that are clear and helpful can improve user satisfaction and trust in the application.
3. integration testing- this test case helps ensure that the payment processing system is properly integrated and can handle declined transactions gracefully.
4. error handling- users should be able to retry with a different card.
5 Business continuity - don't want to lose the booking slot when payment fails

Assumptions and trade-offs:
- using stripe test cards 
- expecting consistent error messages from the payment gateway
- testing what the user sees, not the detailed stripe error codes
- user should stay on the payment page to retry
*/

test.describe('Payment Processing Validation', () => {

    test.beforeEach(async ({ page, loginPage, bookingPage }) => {
        //get to the payment page before running the actual test
        await test.step('Login and set up booking to payment step', async () => {
            //Log in first
            await loginPage.navigateToLoginPage();
            await loginPage.login(
                process.env.TEST_USER_EMAIL || '', process.env.TEST_USER_PASSWORD || ''
            );
            //start booking
            await bookingPage.navigateToBooking();

            //pick MRI scan
            await bookingPage.selectMRIScan();
            await bookingPage.clickContinue();

            //choose location
            await bookingPage.selectLocation();

            //select date and time
            await bookingPage.selectDate(0);
            await bookingPage.selectTimeSlot(0);
            await bookingPage.clickContinue();

            //should be on payment page now
            await page.waitForURL('**/reserve-appointment');
        });
    });

    test('TC02: Payment failure with declined card', async ({ bookingPage }) => {
        await test.step('Enter declined card details', async () => {
            //use a Stripe test card that simulates a declined transaction
            await bookingPage.fillPaymentDetails(STRIPE_TEST_CARDS.DECLINED);
        });

        await test.step('Submit payment', async () => {
            await bookingPage.clickContinue();
        });
        
        await test.step('Verify payment declined and error message displayed', async () => {
            //error message should show up
            const areErrorsDisplayed = await bookingPage.areErrorsDisplayed();
            expect(areErrorsDisplayed).toBeTruthy();

            //should still be on payment page( not redirected to confirmation)
            const currentURL = bookingPage.getCurrentUrl();
            expect(currentURL).toContain('reserve-appointment');

            console.log('Payment declined as expected, error message displayed, and user remains on payment page to retry.');
        });
    });
});

/*
Additional payment scenarios I'd want to test in the future:

1. Payment performance
- make sure payment completes within an acceptable time frame to avoid user frustration and potential drop-offs.
- add performance checks

2. Retry flow
- After a decline, can user enter a different card?
- Does the booking slow stay reserved during retry?

3. International cards
- Try cards from different countries
- check currency conversion if needed

4. Payment security
- card details should never be stored or logged
- everything should go over https
- no card info in url parameters

5. Concurrent payments
- multiple users trying to book the same slot and pay at the same time
- make sure only one booking goes through and others get a clear message about slot unavailability

6. refunds
- test cancellation and refund process to ensure users can get their money back if they cancel within the allowed time frame

7. edge cases
- network interruptions during payment
- user refreshers browser during payment
- double clicks on the pay button

Test Data notes:
- could use stripe test clock for time based scenarios (like card expiring during payment)

Monitoring ideas:
- Track payment failure rate in test env.

*/