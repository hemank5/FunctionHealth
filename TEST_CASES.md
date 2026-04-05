
# Test Cases for Ezra Booking Flow
## Question 1- Part 1: 15 Test Cases Ranked by Priority

### Test Case 1: Complete Happy Path - End-to-End Booking with Valid Payment
**Steps:**
1. Sign in to member account
2. Click "Book a scan" button
3. Select MRI Scan from available options
4. Click Continue
5. Choose a location (selecting first available)
6. Select an available date from the calendar
7. Pick a time slot
8. Click Continue to go to payment
9. Fill in payment info
10. Click Continue to submit payment
11. Check that confirmation message "You're almost done" appears
12. Verify the medical questionnaire reminder shows up

**Expected Result:** Booking goes through successfully and user sees confirmation with next steps

### Test Case 2: Payment Failure - Declined Card
**Steps:**
1. Go through booking flow until you reach payment (select service, location, date/time)
2. Enter a declined test card
3. Submit payment
**Expected Result:** Payment gets declined, clear error message shows, user stays on payment page and can try again with a different card

### Test Case 3: Unauthenticated Access Prevention
1. Try accessing booking URLs directly without being logged in
2. Try submitting booking data through API without valid session

**Expected Result:** User gets redirected to login; API calls return 401/403 errors

### Test Case 4: Time Slot Race Condition
**Steps:**
1. Start booking and view available time slots
2. Have another user book the same slot (can simulate via API or separate browser)
3. Try completing the booking for that same slot

**Expected Result:** System catches this and tells user the slot is no longer available, shows updated options

### Test Case 5: Required Field Validation
**Steps:**
1. Go through booking flow
2. Try submitting forms with empty required fields
3. Test on all fields: name, email, phone, date/time selections, payment info

**Expected Result:** System shows clear error messages for missing fields and won't let you continue until they're filled

### Test Case 6: Invalid Payment Card Formats
**Steps:**
1. Get to the payment step
2. Try different invalid inputs:
- Incomplete card number (e.g., just "4242")
- Expired date
- Wrong CVV length (2 digits or 5 digits)
- Special characters in card fields

**Expected Result:** Validation catches these errors in real-time and shows helpful messages

### Test Case 7: Email Validation
**Steps:**
1. Try entering bad email formats during booking:
- No @symbol
- Missing domain
- Weird special characters
- Spaces in email

**Expected Result:** System validates email format and gives hints on what's wrong

### Test Case 8: Session Timeout Handling
**Steps:**
1. Start a booking
2. Leave it idle until session expires (or force expire it)
3. Try to continue with the booking

**Expected Result:** User gets asked to log back in; ideally booking data is saved or user is redirected gracefully

### Test Case 9: Browser Back Button Behavior
**Steps:**
1. Go through a few steps of booking (like step 1 → 2 → 3)
2. Hit browser back button
3. Change some selections and go forward again

**Expected Result:** App handles this properly - no lost data, no weird errors, no duplicate bookings

### Test Case 10: International Card Support
**Steps:**
1. Reach payment step
2. Try using international test cards from different countries
3. Check if currency conversion happens

**Expected Result:**
Either international cards work or there's a clear message saying they're not supported yet

### Test Case 11: Insufficient Funds
**Steps:**
1. Get to payment page
2. Use test card for insufficient funds: 4000 0000 0000 9995
3. Submit

**Expected Result:** Clear error about insufficient funds; user can try a different payment method

### Test Case 12: Network Interruption During Payment
**Steps:**
1. Go to payment step
2. Throttle network to offline while submitting payment
3. Check payment status after connection comes back

**Expected Result:** Payment either completes or gets rolled back properly; no double charges; user knows what happened

### Test Case 13: Cross-Browser Testing
**Steps:**
1. Run the complete booking flow on:
- Chrome 
- Firefox 
- Safari

**Expected Result:** Everything works the same across browsers

### Test Case 14: Accessibility with Screen Readers
**Steps:**
1. Use a screen reader (JAWS or NVDA) to navigate through booking
2. Check that all form fields have labels
3. Make sure error messages get announced
4. Verify keyboard-only navigation works

**Expected Result:** Accessible to users with screen readers; can complete entire booking with just keyboard

### Test Case 15: Booking Confirmation Email
**Steps:**
1. Complete a successful booking
2. Check email inbox
3. Verify email has all the details: date, time, location, payment receipt
4. Click on links in email (like reschedule or cancel) to make sure they work

**Expected Result:** Confirmation email arrives within 5 minutes with correct info and working links