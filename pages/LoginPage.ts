import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
    // Define locators for the login page elements
    private readonly emailInput: Locator;
    private readonly passwordInput: Locator;
    private readonly submitButton: Locator;

    constructor(page: Page) {
        super(page);

        // Initialize locators using Playwright's locator strategy
        this.emailInput = page.getByRole('textbox', { name: 'Email' });
        this.passwordInput = page.getByRole('textbox', { name: 'Password' });
        this.submitButton = page.getByRole('button', { name: 'Submit' });
    }

    async navigateToLoginPage(): Promise<void> {
        const loginUrl = process.env.BASE_URL || '';
        await this.goto(loginUrl);
        await this.waitForPageLoad();
    }

    async enterEmail(email: string) {
        await this.fillField(this.emailInput, email);
    }

    async enterPassword(password: string) {
        await this.fillField(this.passwordInput, password);
    }

    async clickSubmit() {
        await this.clickElement(this.submitButton);
    }

    async login(email: string, password: string) {
        await this.navigateToLoginPage();
        await this.enterEmail(email);
        await this.enterPassword(password);
        await this.clickSubmit();
        await this.waitForPageLoad();
    }
}