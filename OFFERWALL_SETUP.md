# Offerwall Setup Guide

## Problem
The offerwalls are not appearing because there are no offerwall settings configured in the database.

## Solution

### Option 1: Use the Admin Panel (Recommended)

1. **Log in as an admin** to your application
2. Go to **Admin Dashboard** → **Earning** tab
3. Click on **"Offerwall Settings"** (the new card I just added)
4. You'll see a configuration page for each offerwall network:
   - **CPAGrip**
   - **AdBlueMedia (AdGate Media)**
   - **FaucetPay**

5. For each offerwall you want to enable:
   - Toggle the **"Enabled"** switch to ON
   - Fill in the required credentials:
     - **CPAGrip**: User ID (required), API Key (optional)
     - **AdBlueMedia**: Wall ID (required), API Key (required)
   - Click **"Save Settings"**

6. Visit `/earn/offerwalls` to see the enabled offerwalls

### Option 2: Direct Database Insert

If you prefer to add settings directly to the database:

1. Edit the `adshrt_offerwalls.sql` file I created
2. Replace the placeholder values with your actual credentials
3. Run the SQL script in your PostgreSQL database:
   ```bash
   psql -d your_database_name -U your_username -f adshrt_offerwalls.sql
   ```

## How Offerwalls Work

### Architecture
1. **Frontend**: [src/app/earn/offerwalls/page.tsx](src/app/earn/offerwalls/page.tsx)
   - Fetches enabled offerwalls from `/api/offerwalls`
   - Displays tabs for each enabled network
   - Shows offers from each network

2. **API Endpoints**:
   - `GET /api/offerwalls` - Returns enabled offerwall settings
   - `GET /api/offerwalls/{network}/offers` - Fetches offers from specific network
   - `POST /api/postback/{network}` - Receives postback notifications when users complete offers

3. **Admin Management**:
   - `GET /api/admin/offerwall-settings` - Get all settings
   - `PATCH /api/admin/offerwall-settings/{network}` - Update settings for a network

### Postback Configuration

After enabling an offerwall, you need to configure the postback URL in your offerwall provider's dashboard:

**Postback URL Format:**
```
https://yourdomain.com/api/postback/{network}?user_id={{USER_ID}}&amount={{AMOUNT}}
```

**Examples:**
- CPAGrip: `https://yourdomain.com/api/postback/cpagrip?user_id={subid}&amount={amount}`
- AdBlueMedia: `https://yourdomain.com/api/postback/adbluemedia?user_id={subid}&amount={payout}`

When a user completes an offer, the offerwall provider will send a postback to your server, and the user's balance will be automatically credited.

## Getting Offerwall Credentials

### CPAGrip
1. Sign up at [https://www.cpagrip.com/](https://www.cpagrip.com/)
2. Go to your dashboard
3. Find your **User ID** (required for offers API)
4. Generate an **API Key** if needed
5. Configure postback URL in their settings

### AdBlueMedia (AdGate Media)
1. Sign up at [https://www.adbluemedia.com/](https://www.adbluemedia.com/)
2. Create an offerwall in your publisher dashboard
3. Get your **Wall ID**
4. Get your **API Key** for offers feed
5. Configure postback URL

### FaucetPay
1. Sign up at [https://faucetpay.io/](https://faucetpay.io/)
2. Get your API credentials
3. Configure in the admin panel

## Testing

1. After configuration, visit `/earn/offerwalls`
2. You should see tabs for each enabled offerwall
3. Click on a tab to see available offers
4. Each offer will have a "Complete" button

## Troubleshooting

### Offerwalls still not showing
- Check that at least one offerwall is **enabled** in settings
- Verify the credentials are correct
- Check browser console for any errors
- Check server logs for API errors

### Offers not loading
- Verify your API credentials are correct
- Check that the offerwall provider's API is accessible
- Look at the network tab in browser dev tools for failed requests

### Postbacks not working
- Ensure postback URL is configured correctly in provider dashboard
- Check that the postback endpoint `/api/postback/{network}` is accessible
- Verify the user_id parameter is being passed correctly
- Check server logs for incoming postback requests

## Files Changed/Created

1. **Created**: [src/app/admin/offerwalls/page.tsx](src/app/admin/offerwalls/page.tsx) - Admin UI for managing offerwall settings
2. **Modified**: [src/app/admin/page.tsx](src/app/admin/page.tsx) - Added link to offerwall settings
3. **Created**: [adshrt_offerwalls.sql](adshrt_offerwalls.sql) - SQL script to manually add settings
4. **Created**: This README file

## Next Steps

1. Navigate to `/admin/offerwalls` in your browser
2. Enable at least one offerwall (CPAGrip or AdBlueMedia)
3. Add your credentials
4. Save the settings
5. Visit `/earn/offerwalls` to see the offerwalls appear
6. Configure postback URLs in your offerwall provider dashboards
