# Tooldocker Client Testing Guide

## Project URL

Use the local project URL while testing:

`http://127.0.0.1:3001`

If the project is not open yet, start the dev server first and then open the URL above.

---

## Test Accounts

### Admin Login

- Login page: `http://127.0.0.1:3001/tooldocker-admin/login`
- Email: `tooldockerdev@gmail.com`
- Password: `use the current Supabase Auth password set for this admin account`

### Vendor Login

- Login page: `http://127.0.0.1:3001/vendor/login`
- Email: `stonetechinc@gmail.com`
- Password: `use the current Supabase Auth password set for this vendor account`

## Important Note About Passwords

The repository does not store the actual account passwords in code or markdown files.

If the client needs direct access, provide the current passwords from Supabase Auth or reset them before handoff.

---

## Admin Testing Flow

### 1. Login as Admin

1. Open `http://127.0.0.1:3001/tooldocker-admin/login`
2. Enter the admin email and password
3. After login, the admin dashboard should open

### 2. Check Vendor Approval

1. Open the `Vendors` section in admin
2. Confirm the vendor row is visible
3. Assign a plan if needed
4. Approve product access for the vendor

### 3. What Admin Should Verify

- Vendor appears in the vendor queue
- Plan can be assigned successfully
- Product access can be approved
- After approval, the vendor can add products directly

---

## Vendor Testing Flow

### 1. Login as Vendor

1. Open `http://127.0.0.1:3001/vendor/login`
2. Enter the vendor email and password
3. Vendor dashboard should open

### 2. Open Product Section

1. Go to `My Products`
2. Click `Add Product`
3. Fill product information
4. Upload a product image or add an image URL
5. Save the product

### 3. What Vendor Should Verify

- Vendor can open the Add Product page
- Product image upload works
- Product is saved successfully
- Edit button opens the edit page
- Saved product appears in the vendor product list

---

## Frontend Website Check

After the vendor adds a product and the vendor account is approved:

1. Open the homepage: `http://127.0.0.1:3001`
2. Check featured/public product sections
3. Open the product detail page from the product card

### What To Verify

- The vendor product is visible on the public website
- Product image loads correctly
- Product detail page opens correctly
- Store/vendor name is shown on the product card and product page

---

## Full End-to-End Client Test

1. Login as admin
2. Approve the vendor account
3. Assign the vendor plan
4. Login as vendor
5. Add a new product
6. Edit that product
7. Open the public homepage
8. Confirm the product appears on the website
9. Open the product details page

---

## Expected Result

If everything is working correctly:

- Admin can manage vendor approval and plans
- Vendor can add and edit products after approval
- Vendor products go live without separate admin product moderation
- Public website shows the vendor products

