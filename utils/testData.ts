/* 
Test Data for Ezra Booking flow Tests
Includes Stripe test cards and user credentials for testing purposes.
*/


export const STRIPE_TEST_CARDS = {
    //Successful Payment
    VALID: {
        cardNumber: '4242424242424242',
        expiry: '12/28',
        cvc: '123',
        zipCode: '10001',
        description: 'Visa - Successful Payment',
    },
    //Declined Payment
    DECLINED: {
        cardNumber: '4000000000000002',
        expiry: '12/28',
        cvc: '123',
        zipCode: '10001',
        description: 'Visa - Card Declined',
    }
};
//Test user credentials
export const TEST_USERS = {
    VALID_USER: {
        email: process.env.TEST_USER_EMAIL || '',
        password: process.env.TEST_USER_PASSWORD || ''
    }
};
//Test booking data templates
export const BOOKING_DATA = {
    VALID_BOOKING: {
        dateOfBirth: '1990-01-01',
        sex: 'Male',
        serviceIndex: 0, // Assuming the first service in the list
        data: '2026-04-15',
        timeSlotIndex: 0, // Assuming the first time slot in the list
        cardInfo: STRIPE_TEST_CARDS.VALID
    }
};

export const URLS = {
    BASE: process.env.BASE_URL || '',
    SELECT_PLAN: `${process.env.BASE_URL || ''}/select-plan`,
    SCHEDULE_SCAN: `${process.env.BASE_URL || ''}/schedule-scan`,
    RESERVE_APPOINTMENT: `${process.env.BASE_URL || ''}/reserve-appointment`
};