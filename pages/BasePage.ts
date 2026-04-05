import { Page, Locator } from '@playwright/test';
// BasePage - Abstract class that provides common functionality for all page objects
export abstract class BasePage {
    protected readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // Common method to navigate to a specific URL
    async goto(url: string): Promise<void> {
        await this.page.goto(url);
    }

    // Common method to get the page title
    async getTitle(): Promise<string> {
        return await this.page.title();
    }

    async waitForPageLoad(): Promise<void> {
        await this.page.waitForLoadState('domcontentloaded');
    }

    getCurrentUrl(): string {
        return this.page.url();
    }

    async takeScreenshot(filename: string): Promise<void> {
        await this.page.screenshot({ path: filename });
    }

    async waitForElement(locator: Locator, timeout: number = 30000): Promise<void> {
        await locator.waitFor({ state: 'visible', timeout });
    }

    async clickElement(locator: Locator): Promise<void> {
        await locator.waitFor({ state: 'visible' });
        await locator.click();
    }

    async fillField(locator: Locator, text: string): Promise<void> {
        await locator.waitFor({ state: 'visible' });
        await locator.clear();
        await locator.fill(text);
    }

    async isElementVisible(locator: Locator): Promise<boolean> {
        try {
            await locator.waitFor({ state: 'visible', timeout: 5000 });
            return true;
        } catch {
            return false;
        }
    }
    async getElementText(locator: Locator): Promise<string> {
        await locator.waitFor({ state: 'visible' });
        return await locator.textContent() || '';
    }

    async wait(ms: number): Promise<void> {
        await this.page.waitForTimeout(ms);
    }
}