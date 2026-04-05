# FunctionHealth
Ezra Automation


## Overview
This project contains automated tests for the Ezra booking flow using Playwright with Typescript

## Setup Instructions

### Prerequisites
- Node.js v16 or higher
- npm

###Installation

1. Clone the repo
2. Install dependencies 
```bash
npm install
```

3. Install playwright browsers
```bash
npm playwright install
```

4. configure environment variables
- copy `.env.example` to `.env`
- Note: `.env` is not committed to git for security, so `.env.example` is provided as a template

## Running Tests

Run all tests:
```bash
npx playwright test
```

Run specific test:
```bash
npx playwright test booking.happyPath.spec.ts
npx playwright test payment.validation.spec.ts
npx playwright test authentication.security.spec.ts
```


## Test Case Selection
Top 3 most critical test cases from Part 1:

### Happy Path (TC01)
File: tests/booking.happyPath.spec.ts

Why I chose this:
- This is the primary revenue generating flow
- Tests all system components working together(auth, booking, payment, confirmation)
- catches integration issues that unit tests would miss
- Most valuable test to run on every deployment

### Payment Processing (TC02)
File: tests/payment.validation.spec.ts

Why I chose this:
- payment is the conversion point where users become paying customers
- tests stripe
- payment failure
- validate that payment data flows securely 

### Authentication Security (TC03)
File tests/authentication.security.spec.ts

Why I chose this:
- Security is critical for healthcare applications (HIPPA compliance)
- prevents unauthorized access to booking system
- Authentication bypass could expose patient data and result in regulatory fines

## Architecture Decisions
### Page Object Model
I used the Page Object Model to separate test logic from page interactions. This makes tests easier to maintain when UI changes occur. All page objects extend a Basepage class that provides common functionality.
### TypeScript
TypeScript provides type safety and better IDE support which reduces bugs and makes the codebase easier to maintain as it grows.
### Custom Fixtures
I created custom Playwright fixtures to handle common setup 11ke page initialization and authenticated sessions. This keeps tests clean and focused on business logic.
## Test Data Management
All test data. (Stripe cards, user credentials, test scenarios) is centralized in utils/testdata.ts for easy maintenance and reusability.

## Trade-offs and Assumptions
### Assumptions
- Staging environment is stable and Stripe test mode is enabled
- Test user credentials remain valid
- Available appointment slots exist for booking
- UI locators may need adjustment based on actual implementation

### Trade-offs
1. Real Integration vs Mocking
*used real Stripe integration instead of mocks
- This catches actual integration issues but makes tests slower and dependent on third-party availability
- For production use, I'd recommend a mix of both approaches
2. Reliability vs Speed
- Tests wait for network idle to ensure page loads completely
- This makes tests more reliable but slower
- For faster feedback, critical tests could use lighter wait strategies

## Scalability Considerations
### Current Implementation Supports
1. Adding new tests easily
- Clear page object structure makes it simple to add new page classes
- Reusable fixtures reduce boilerplate in new tests
2. Parallel execution
- Tests are independent and can run in parallel
- Playwright handles this automatically with multiple workers
3. Multiple environments
- URLs and credentials can be moved to environment variables
- Different configs for dev, staging, and production

### Recommendations for Scaling
When the test suite grows to 50+ tests:
1. Test organization
- Group tests by feature or user journey
- Use tags (smoke, regression) to run different test suites
- Separate critical path tests from edge case tests
2. Data management
- Implement test data factories for dynamic data generation
- Add database cleanup between test runs
- Create dedicated test accounts for different scenarios

## Future Enchancements

1. Add API Testing
2. Visual regression Testing
3. Performance monitoring
4. Database verification
5. Email Verification
6. Accessibility Test
7. Cross-browser testing





