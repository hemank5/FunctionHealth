import { Page, Locator, FrameLocator } from '@playwright/test'
import { BasePage } from './BasePage';

export class BookingPage extends BasePage {
    // Initial Navigation 
    private readonly bookScanButton: Locator;

    // Select Plan Page Locators
    private readonly dateOfBirthInput: Locator;
    private readonly sexAtBirthDropdown: Locator;
    private readonly mriScanOption: Locator;
    private readonly continueButton: Locator;

    // Appointment Selection Locators
    private readonly locationcards: Locator;
    private readonly availableDateCells: Locator;
    private readonly selectedDateCell: Locator;
    private readonly timeSlots: Locator;
    private readonly selectedTimeSlot: Locator;

    // Payment Locators - Stripe
    private readonly iframeSelector: FrameLocator; // Generic selector for Stripe iframes
    private readonly cardNumber: Locator;
    private readonly cardExpiry: Locator;
    private readonly cardCvc: Locator;
    private readonly zipCodeInput: Locator;
    private readonly completePaymentButton: Locator;

    // Confirmation Locators
    private readonly confirmationTitle: Locator;
    private readonly confirmationDescription: Locator;

    // Error/Validation Locators
    private readonly errorMessages: Locator;

    constructor(page: Page) {
        super(page);
        // Initial Navigation 
        this.bookScanButton = page.getByRole('button', { name: 'Book a scan' });

        // Select Plan Page 
        this.dateOfBirthInput = page.getByRole('textbox', { name: 'Date of birth (MM-DD-YYYY)' });
        this.sexAtBirthDropdown = page.locator('.multiselect');
        this.mriScanOption = page.getByText('MRI Scan', { exact: true });
        this.continueButton = page.getByRole('button', { name: 'Continue', exact: true });

        //Appointment Selection
        this.locationcards = page.locator('.location-card');

        // Date picker - only select enabled dates (not disabled)
        this.availableDateCells = page.locator('.vuecal__cell:not(.vuecal__cell--disabled):not(.vuecal__cell--before-min)');
        this.selectedDateCell = page.locator('.vuecal_cell--selected');

        // Time slots - actual time selection after date is chosen
        this.timeSlots = page.locator('.appointments__individual-appointment label');
        this.selectedTimeSlot = page.locator('.appointments__individual-appointment input[type="radio"]:checked');

        // Payment - Stripe iframes
        this.iframeSelector = page.frameLocator('iframe[title="Secure payment input frame"]').last();
        this.cardNumber = this.iframeSelector.getByRole('textbox', { name: 'Card number' });
        this.cardExpiry = this.iframeSelector.getByRole('textbox', { name: 'Expiration date MM / YY' });
        this.cardCvc = this.iframeSelector.getByRole('textbox', { name: 'Security code' });
        this.zipCodeInput = this.iframeSelector.getByRole('textbox', { name: 'ZIP code' });
        this.completePaymentButton = page.locator('button: has-text("Complete Payment"), button: has-text("Pay Now")');

        // Confirmation
        this.confirmationTitle = page.locator('.confirmation-msg__title, h4:has-text("You\'re almost done")');
        this.confirmationDescription = page.locator('.confirmation-msg__desc, p:has-text("medical questionnaire")');

        // Errors/Validation
        this.errorMessages = this.iframeSelector.locator('p.p-FieldError[role="alert"]');
    }

    async navigateToBooking() {
        await this.clickElement(this.bookScanButton);
        await this.page.waitForURL('**/select-plan');
        await this.waitForPageLoad();
    }

    async fillDateOfBirth(dateofBirth: string) {
        await this.fillField(this.dateOfBirthInput, dateofBirth);
    }

    async selectSexAtBirth(sex: string): Promise<void> {
        //click the custom multiselect dropdown to open it
        await this.clickElement(this.sexAtBirthDropdown);

        //check if the option is already selected
        const selectionOption = this.page.locator(`.multiselect__element[aria-selected="true"]`);
        const selectedText = await selectionOption.textContent();

        // If already selected, close the dropdown by clicking outside or pressing escape
        if (selectedText === sex) {
            await this.page.keyboard.press('Escape'); // Close dropdown
            return;
        }

        // Otherwise, select the desired option
        const option = this.page.locator(`.multiselect__element[aria-selected="false"]`).filter({ hasText: sex });
        await option.click();
    }

    async selectMRIScan() {
        await this.clickElement(this.mriScanOption);
        await this.wait(500);
    }

    async clickContinue() {
        await this.clickElement(this.continueButton);
        await this.waitForPageLoad();
    }

    async selectLocation(index: number = 0): Promise<void> {
        // Click on an available (non-disabled) date cell
        await this.locationcards.nth(index).click();
        await this.wait(1000); // Wait for time slots to load after selecting date
    }

    async selectDate(index: number = 0): Promise<void> {
        // Click on an available (non-disabled) date cell
        await this.availableDateCells.nth(index).click();
        await this.wait(1000); // Wait for time slots to load after selecting date
    }

    async isDateSelected(): Promise<boolean> {
        return await this.isElementVisible(this.selectedDateCell);
    }

    async selectTimeSlot(index: number = 0): Promise<void> {
        await this.timeSlots.nth(index).click();

        // Wait for the corresponding radio button to be checked (radio inputs are hidden, so check for 'attached' state)
        await this.selectedTimeSlot.waitFor({ state: 'attached', timeout: 5000 });
        await this.wait(500); // Additional wait to ensure time slot selection is processed
    }

    async isTimeSlotSelected(): Promise<boolean> {
        try {
            // Radio input is hidden, so we check if it exists (attached) rather than visible
            await this.selectedTimeSlot.waitFor({ state: 'attached', timeout: 5000 });
            return true;
        } catch {
            return false;
        }
    }

    async fillPaymentDetails(cardInfo: { cardNumber: string; expiry: string; cvc: string; zipCode: string }) {
        await this.cardNumber.fill(cardInfo.cardNumber);
        await this.cardExpiry.fill(cardInfo.expiry);
        await this.cardCvc.fill(cardInfo.cvc);
        await this.zipCodeInput.fill(cardInfo.zipCode);
    }

    async clickCompletePayment() {
        await this.clickElement(this.completePaymentButton);
        await this.page.waitForLoadState('networkidle', { timeout: 30000 });
    }

    async completePayment(cardInfo: { cardNumber: string; expiry: string; cvc: string; zipCode: string }): Promise<void> {
        await this.fillPaymentDetails(cardInfo);
        await this.clickContinue();
    }
    
    async isConfirmationDisplayed(): Promise<boolean> {
        return await this.isElementVisible(this.confirmationTitle);
    }

    async getConfirmationTitle(): Promise<string> {
        return await this.getElementText(this.confirmationTitle);
    }

    async getConfirmationDescription(): Promise<string> {
        return await this.getElementText(this.confirmationDescription);
    }

    async areBookingElementsVisible(): Promise<boolean> {
        const isDOBVisible = await this.isElementVisible(this.dateOfBirthInput);
        const isSexDropdownVisible = await this.isElementVisible(this.sexAtBirthDropdown);
        return isDOBVisible || isSexDropdownVisible;
    }

    async areErrorsDisplayed(): Promise<boolean> {
        return await this.isElementVisible(this.errorMessages);
    }
}