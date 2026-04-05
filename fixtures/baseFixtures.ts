import { test as base, Page } from '@playwright/test';
import { LoginPage, BookingPage } from '../pages';
import { TEST_USERS } from '../utils/testData';

// Define custom fixtures for the test suite
type CustomFixtures = {
    loginPage: LoginPage;
    bookingPage: BookingPage;
    authenticatedPage: Page;
};

export const test = base.extend<CustomFixtures>({

    //LoginPage fixture to create an instance of the LoginPage class
    loginPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await use(loginPage);
    },
    //BookingPage fixture to create an instance of the BookingPage class
    bookingPage: async ({ page }, use) => {
        const bookingPage = new BookingPage(page);
        await use(bookingPage);
    },
    //AuthenticatedPage fixture to log in before using the page object
    authenticatedPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await loginPage.navigateToLoginPage();
        await loginPage.login(TEST_USERS.VALID_USER.email, TEST_USERS.VALID_USER.password);
        // Wait for the page to load after login
        await page.waitForLoadState('networkidle');
        await use(page);
    }
});

export { expect } from '@playwright/test';