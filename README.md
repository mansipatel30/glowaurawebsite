# Vanguard Hero

Build a fullscreen hero landing page for a creative agency called "VANGUARD" using React, Tailwind CSS, and Vite. The page should be a single viewport-height section with a looping background video and all content overlaid on top.

**Background video:**
Use this exact CloudFront URL as a fullscreen `<video>` element with `autoPlay`, `muted`, `loop`, and `playsInline` attributes, set to `object-cover` to fill the entire viewport:
```
https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260606_154941_df1a96e1-a06f-450c-bd02-d863414cc1a0.mp4
```

**Fonts (loaded in index.html):**
1. "FSP DEMO - PODIUM Sharp 4.11" from `https://db.onlinewebfonts.com/c/8b75d9dcff6a48c35a46656192adf019?family=FSP+DEMO+-+PODIUM+Sharp+4.11` -- used for the brand name and main heading. Create a `.font-podium` utility class for it and register it in tailwind.config.js as `fontFamily.podium`.
2. "Inter" from Google Fonts (weights 400, 500, 600, 700) -- used for body text, nav links, stats, and CTAs. Register it in tailwind.config.js as `fontFamily.inter`.

**Icons:** Use `lucide-react` for all icons: `ArrowUpRight`, `Award`, `Crown`, and `X`.

**Navbar:**
- Horizontal bar at the top with responsive padding (`px-6 sm:px-10 lg:px-16`, `py-5 lg:py-7`).
- Left: brand name "VANGUARD" in `font-podium`, white, bold, uppercase, `text-2xl sm:text-3xl`, `tracking-wider`.
- Center (hidden below `md`): four nav links -- "Projects", "Studio", "Offerings", "Inquire" -- in `font-inter`, `text-sm`, `text-white/80`, `tracking-widest`, uppercase, with `hover:text-white` transition.
- Right (hidden below `md`): a "GET IN TOUCH" link with an `ArrowUpRight` icon, styled as a bordered button (`border border-white/30 hover:border-white/60`, `px-6 py-3`, `text-xs`, `tracking-widest`, uppercase, `hover:bg-white/10`).
- Right (visible below `md`): a hamburger button made of three white `div` bars (`w-6 h-0.5`, `w-6 h-0.5`, `w-4 h-0.5` with `space-y-1.5`).

**Mobile Menu Overlay (below `md` only):**
- Fixed fullscreen overlay (`fixed inset-0 z-50`) with `bg-black/95 backdrop-blur-sm`.
- Toggles visibility via React `useState` -- when open: `opacity-100 visible`, when closed: `opacity-0 invisible`, with `transition-all duration-500`.
- Header row matches the navbar: brand name on left, `X` close icon on right.
- Centered vertically: each of the 4 nav links rendered in `font-podium`, `text-4xl sm:text-5xl`, white, uppercase, with staggered entrance animations using inline `style` -- each item gets `transitionDelay: i * 80 + 100ms`, `opacity` and `translateY(20px)` transitions based on the open state.
- Below the links: a "GET IN TOUCH" bordered button with the same staggered animation pattern.
- All links call `setMenuOpen(false)` on click.

**Hero Content (vertically centered, left-aligned):**
All hero elements use staggered `animate-fade-up` animations (defined in CSS as `@keyframes fade-up` translating from `translateY(30px), opacity:0` to `translateY(0), opacity:1` over `0.8s ease-out`). Each successive element has an additional `0.2s` delay. Elements start with `opacity: 0` and use `animation-fill-mode: forwards`.

1. **Tagline:** A `Crown` icon (lucide, `w-4 h-4`, `text-white/70`) followed by "World-Class Digital Collective" in `text-white/70`, `text-xs sm:text-sm`, `font-inter`, `tracking-[0.3em]`, uppercase. Uses `animate-fade-up` (no delay). Has `mb-6 lg:mb-8`.

2. **Main Heading:** Three lines in `font-podium`, white, uppercase, `leading-[0.92]`, `tracking-tight`, each using `text-[clamp(2.8rem,8vw,7rem)]`:
   - "Design."
   - "Disrupt."
   - "Conquer."
   Uses `animate-fade-up-delay-1` (0.2s delay).

3. **Subtext:** "We build fierce brand identities" (line break) "that don't just turn heads --" then bold white "they lead." in `text-white/70`, `text-sm sm:text-base`, `font-inter`, `leading-relaxed`, `max-w-md`. Uses `animate-fade-up-delay-2` (0.4s delay). `mt-6 lg:mt-8`.

4. **CTA Row:** Uses `animate-fade-up-delay-3` (0.6s delay), `mt-8 lg:mt-10`, `flex flex-wrap items-center gap-4 sm:gap-6`.
   - Black button "SEE OUR WORK" with `ArrowUpRight` icon. `bg-black hover:bg-neutral-900`, `px-5 sm:px-7 py-3 sm:py-4`, `text-[11px] sm:text-xs`, `tracking-widest`, uppercase. Arrow has `group-hover:translate-x-0.5 group-hover:-translate-y-0.5` transition.
   - Beside it (hidden on mobile, `hidden sm:flex`): an `Award` icon (`w-8 h-8`, `text-white/50`) with two lines of text: "Top-Rated" / "Brand Studio" in `text-white/60`, `text-xs`, `tracking-wider`, uppercase.

5. **Stats Row:** Uses `animate-fade-up-delay-4` (0.8s delay), `mt-8 sm:mt-10 lg:mt-14`, `flex flex-wrap gap-6 sm:gap-12 lg:gap-16`. Three stats:
   - "250+" / "Brands Transformed"
   - "95%" / "Client Retention"
   - "10+" / "Years in the Game"
   Values in `font-inter`, white, `text-2xl sm:text-4xl lg:text-5xl`, bold, `tracking-tight`. Labels in `text-white/50`, `text-[9px] sm:text-xs`, `tracking-widest`, uppercase, `mt-1`.

**CSS Animations (defined in index.css under `@layer utilities`):**
```css
@keyframes fade-up {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes scale-in {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}
```
With classes: `.animate-fade-up` (0s delay), `.animate-fade-up-delay-1` through `.animate-fade-up-delay-4` (0.2s increments, starting `opacity: 0`), `.animate-fade-in`, `.animate-fade-in-delay`.

**Responsive behavior:**
- Full layout is mobile-first with breakpoints at `sm` (640px), `md` (768px), and `lg` (1024px).
- Nav links and "GET IN TOUCH" button show at `md`+; hamburger shows below `md`.
- Award badge hides on mobile (`hidden sm:flex`).
- All text sizes, paddings, gaps, and margins scale up through `sm:` and `lg:` prefixes.
- Stats and CTA row use `flex-wrap` to prevent overflow on small screens.

Make everything fully mobile responsive. Use a single `App.tsx` component with `useState` for the menu toggle. No routing needed.

FULL WEBSITE DEVELOPMENT PROMPT — GLOWAURA BEAUTY

Create a complete, modern, responsive beauty and cosmetics e-commerce website called “GlowAura Beauty”, inspired by the overall functionality of large beauty shopping platforms such as Nykaa, but with a completely original brand identity, layout, styling, content, product data, and UI.

The website should look like a real-world professional Indian beauty e-commerce business, not a basic college/demo website.

1. BRAND

Brand Name: GlowAura Beauty

Tagline: “Your Beauty. Your Glow.”

Business Type: Online beauty and cosmetics store.

Target Customers: Indian customers looking for skincare, makeup, haircare, fragrance, bath & body products, and beauty accessories.

Currency: Indian Rupee (₹)

Language: English

Design style:

Premium

Clean

Feminine

Modern

Elegant

Mobile-friendly

Easy to navigate

Professional e-commerce UI

Use a soft luxury beauty aesthetic with a clean background, attractive product cards, subtle animations, rounded cards, modern typography, and high-quality beauty product imagery.

Do NOT copy Nykaa's logo, exact design, text, images, colors, or proprietary branding.

2. WEBSITE STRUCTURE

Create these pages:

Customer Website

Home

Shop All

Makeup

Skincare

Haircare

Fragrance

Bath & Body

Beauty Tools

Gift Sets

New Arrivals

Best Sellers

Offers

Product Details

Search Results

Wishlist

Cart

Checkout

Payment

Order Success

My Orders

Track Order

My Profile

Login

Register

Forgot Password

About Us

Contact Us

FAQ

Privacy Policy

Terms & Conditions

Return & Refund Policy

Admin Website

Create a separate secure admin dashboard.

Admin pages:

Admin Login

Dashboard

Products

Add Product

Edit Product

Categories

Brands

Orders

Customers

Inventory

Coupons

Reviews

Payments

Banners

Offers

Reports

Admin Profile

Logout

3. HEADER

Create a professional responsive header.

Top announcement bar:

“✨ Free Shipping on Orders Above ₹999 | Easy Returns | Secure Payments ✨”

Main header:

GlowAura Beauty logo

Search bar:

“Search for skincare, makeup, haircare…”

Icons:

Search

Wishlist

Account

Cart

Navigation:

HOME | MAKEUP | SKINCARE | HAIRCARE | FRAGRANCE | BATH & BODY | BEAUTY TOOLS | GIFT SETS | OFFERS

On mobile:

Hamburger menu

Search

Wishlist

Cart

4. HOMEPAGE

Create a premium homepage.

Hero Section

Large beauty banner.

Heading:

“Discover Your Natural Glow”

Subheading:

“Premium beauty essentials for your everyday beauty routine.”

Buttons:

SHOP NOW

EXPLORE OFFERS

Include a beautiful skincare/makeup lifestyle image.

5. CATEGORY SECTION

Create attractive category cards.

Categories:

💄 Makeup
🧴 Skincare
💇 Haircare
🌸 Fragrance
🛁 Bath & Body
💅 Beauty Tools
🎁 Gift Sets

Each category should have:

Image

Category name

“Shop Now” button

6. BEST SELLERS

Create a horizontal/product grid section:

🔥 Best Sellers

Product cards should include:

Product image

Brand

Product name

Rating

Review count

Original price

Discounted price

Discount percentage

Wishlist heart

Add to Cart

Buy Now

Example:

Vitamin C Glow Serum

⭐ 4.6 (245)

₹599

₹799

25% OFF

[♡] [ADD TO CART]

7. PRODUCT CATALOG

Create at least 30 realistic sample products.

SKINCARE

Vitamin C Glow Serum — ₹599

Hyaluronic Acid Serum — ₹699

Gentle Face Cleanser — ₹399

SPF 50 Sunscreen — ₹549

Rose Face Mist — ₹299

Niacinamide Serum — ₹649

Aloe Vera Gel — ₹249

Hydrating Face Moisturizer — ₹499

MAKEUP

Matte Liquid Lipstick — ₹449

Nude Eyeshadow Palette — ₹799

Waterproof Mascara — ₹399

Liquid Eyeliner — ₹299

Cream Blush — ₹499

Full Coverage Foundation — ₹699

Lip Gloss — ₹349

Makeup Setting Spray — ₹549

HAIRCARE

Hydrating Shampoo — ₹499

Hair Repair Conditioner — ₹449

Hair Growth Oil — ₹399

Anti-Frizz Hair Serum — ₹499

Hair Mask — ₹549

BATH & BODY

Body Scrub — ₹349

Body Lotion — ₹399

Body Wash — ₹349

Hand & Body Cream — ₹299

FRAGRANCE

Eau de Parfum — ₹999

Floral Perfume — ₹799

Fresh Citrus Perfume — ₹899

BEAUTY TOOLS

Makeup Brush Set — ₹599

Beauty Blender Set — ₹299

Facial Roller — ₹399

GIFT SETS

Everyday Beauty Gift Set — ₹999

Luxury Self-Care Gift Box — ₹1,499

Use fictional brand names such as:

GlowAura

PureBloom

LumiSkin

VelvetGlow

AuraCare

Do not use copyrighted product images or trademarks.

8. PRODUCT CARD

Every product card must display:

Product image

Brand

Product name

Short description

Star rating

Number of reviews

Original price

Sale price

Discount

Stock status

Wishlist button

Add to Cart button

Example:

GlowAura

Vitamin C Glow Serum

⭐ 4.6 | 245 Reviews

₹599

₹799

25% OFF

✓ In Stock

[♡] [ADD TO CART]

9. PRODUCT DETAILS PAGE

When the customer clicks a product, show:

Large product image gallery.

Product information:

Brand

Product name

⭐ Rating

Number of reviews

Original price

Sale price

Discount

Tax information

Availability

Quantity selector

Delivery PIN code checker

Buttons:

ADD TO CART

BUY NOW

ADD TO WISHLIST

Sections:

Product Description

Key Benefits

Ingredients

How to Use

Suitable For

Product Information

Shipping Information

Return Information

Customer Reviews

Related Products

Frequently Bought Together

10. SEARCH

Create a working search system.

Search should support:

Product name

Brand

Category

Keywords

Example:

User searches:

“serum”

Show all serum products.

Show:

“24 products found”

Provide:

Sort

Filters

Search suggestions

Recent searches

11. FILTERS

Create sidebar filters.

Category

☐ Makeup
☐ Skincare
☐ Haircare
☐ Fragrance
☐ Bath & Body

Price

☐ Under ₹300
☐ ₹300–₹500
☐ ₹500–₹1,000
☐ Above ₹1,000

Rating

☐ 4★ & above
☐ 3★ & above

Discount

☐ 10%+
☐ 20%+
☐ 30%+
☐ 50%+

Availability

☐ In Stock

Sorting:

Popularity

Price Low to High

Price High to Low

Newest

Highest Rated

Biggest Discount

12. CART

Create a fully functional shopping cart.

Display:

Product image

Product name

Price

Quantity +/-

Remove

Wishlist

Subtotal

Discount

Coupon

Delivery charge

Tax

Total

Example:

Subtotal: ₹1,398

Discount: -₹200

Delivery: ₹40

Tax: ₹0

Total: ₹1,238

Button:

PROCEED TO CHECKOUT

13. COUPON SYSTEM

Create coupon functionality.

Example coupons:

GLOW10 → 10% OFF

BEAUTY20 → 20% OFF

WELCOME15 → 15% OFF

FIRSTORDER → ₹100 OFF

Show:

“Coupon applied successfully!”

Also validate invalid/expired coupons.

14. CHECKOUT

Create a professional multi-step checkout.

Step 1 — Address

Full Name

Mobile Number

Email

House/Flat Number

Street

Area

City

State

PIN Code

Save Address

Step 2 — Delivery

Standard Delivery

Express Delivery

Step 3 — Order Summary

Products

Subtotal

Discount

Delivery

Total

Step 4 — Payment

15. PAYMENT SYSTEM

Integrate Razorpay for Indian online payments.

Payment options:

UPI

Credit Card

Debit Card

Net Banking

Wallets

Cash on Delivery

Use Razorpay's official checkout integration.

IMPORTANT:

Use TEST/SANDBOX credentials during development.

Never expose secret API keys in frontend code.

Store sensitive payment credentials securely in environment variables.

Verify payment status on the backend.

Generate a unique order ID.

Store Razorpay payment ID.

Handle successful payment.

Handle failed payment.

Handle cancelled payment.

Prevent duplicate orders.

Update order status after verified payment.

Payment flow:

Cart

→ Checkout

→ Create Order

→ Razorpay Checkout

→ Payment

→ Backend Verification

→ Update Order

→ Order Confirmation

16. CASH ON DELIVERY

Allow COD.

COD rules:

Available only for eligible PIN codes.

Optional maximum order value.

Show COD fee if applicable.

Example:

COD Fee: ₹40

17. ORDER SUCCESS PAGE

After successful payment show:

🎉 Order Placed Successfully!

“Thank you for shopping with GlowAura Beauty.”

Order ID:

GA20260808001

Payment:

Paid

Total:

₹1,238

Buttons:

VIEW ORDER

TRACK ORDER

CONTINUE SHOPPING

18. MY ORDERS

Customer can see:

Order ID

Date

Products

Amount

Payment status

Order status

Delivery date

Buttons:

View Details

Track Order

Cancel Order

Download Invoice

19. ORDER TRACKING

Create tracking timeline:

✓ Order Placed

✓ Payment Confirmed

✓ Order Packed

✓ Shipped

✓ Out for Delivery

✓ Delivered

Show estimated delivery date.

20. USER ACCOUNT

Create:

Profile

My Orders

Wishlist

Saved Addresses

Payment History

Change Password

Logout

21. WISHLIST

Customer can:

Add products

Remove products

Move to cart

View price

See availability

Show:

“Your Wishlist is waiting for you ❤️”

22. PRODUCT REVIEWS

Allow verified customers to submit:

⭐ Rating

Review title

Review text

Optional image

Display:

Average rating

Rating distribution

Customer reviews

Only customers who purchased the product should be able to submit a verified purchase review.

23. ADMIN DASHBOARD

Create a professional dashboard.

Dashboard cards:

Total Sales

Total Orders

Total Customers

Total Products

Low Stock Products

Pending Orders

Successful Payments

Refunds

Add charts:

Sales by month

Orders by category

Revenue

Top-selling products

24. ADMIN PRODUCT MANAGEMENT

Admin can:

Add product

Edit product

Delete product

Update price

Update discount

Update stock

Upload product image

Assign category

Assign brand

Add description

Add ingredients

Add benefits

Add usage instructions

Mark product as:

New Arrival

Best Seller

Featured

On Sale

25. INVENTORY

Track:

Product

SKU

Stock quantity

Low-stock threshold

Sold quantity

Available quantity

Show warning:

⚠️ Low Stock

26. ADMIN ORDER MANAGEMENT

Admin can view:

Order ID

Customer

Products

Amount

Payment method

Payment status

Order status

Date

Address

Admin can update:

Pending

Confirmed

Packed

Shipped

Out for Delivery

Delivered

Cancelled

Refunded

27. ADMIN COUPONS

Admin can create:

Coupon code

Discount percentage

Maximum discount

Minimum order amount

Expiry date

Usage limit

Active/inactive status

28. SECURITY

Implement:

Secure authentication

Password hashing

Session/JWT protection

Input validation

Server-side validation

SQL injection protection

XSS protection

CSRF protection where applicable

Secure payment verification

Admin route protection

Environment variables

No exposed API secrets

Proper authorization

Rate limiting for sensitive endpoints

29. DATABASE

Create database tables for:

users

admins

products

categories

brands

product_images

cart

cart_items

wishlist

orders

order_items

addresses

payments

coupons

coupon_usage

reviews

inventory

banners

offers

notifications

order_tracking

30. DATABASE RELATIONSHIPS

Users can have multiple:

Orders

Addresses

Wishlist items

Reviews

Cart items

Orders contain multiple:

Order Items

Products belong to:

Category

Brand

Products can have:

Multiple Images

Multiple Reviews

Orders can have:

One Payment

Multiple Tracking Events

31. RESPONSIVE DESIGN

The website must work perfectly on:

Desktop

Laptop

Tablet

Mobile

Use:

Responsive navbar

Mobile menu

Responsive product grid

Touch-friendly buttons

Responsive checkout

Responsive admin dashboard

32. UI/UX

Make the interface:

Premium

Clean

Fast

Modern

Easy to navigate

Use:

Smooth hover animations

Product image zoom

Loading states

Skeleton loaders

Toast notifications

Modal dialogs

Breadcrumbs

Sticky header

Responsive cards

Empty-state designs

Examples:

“Product added to cart ✓”

“Added to wishlist ❤️”

“Coupon applied successfully 🎉”

33. FOOTER

Footer sections:

GlowAura Beauty

“Your Beauty. Your Glow.”

Shop

Makeup

Skincare

Haircare

Fragrance

Bath & Body

Beauty Tools

Gift Sets

Customer Care

Contact Us

FAQ

Shipping

Returns

Track Order

Company

About Us

Privacy Policy

Terms & Conditions

Follow Us

Instagram

Facebook

YouTube

Pinterest

Newsletter

“Subscribe for beauty tips and exclusive offers.”

Email input

SUBSCRIBE button

34. SEO

Implement:

SEO-friendly URLs

Meta titles

Meta descriptions

Product structured data

Open Graph tags

Sitemap

Robots.txt

Proper heading hierarchy

Image alt text

Fast loading

Mobile optimization

35. PERFORMANCE

Optimize:

Images

CSS

JavaScript

Database queries

API requests

Use lazy loading for product images.

36. SAMPLE BUSINESS CONTENT

About Us:

“GlowAura Beauty is an online beauty destination created to make quality beauty products accessible, simple, and enjoyable to shop. From everyday skincare essentials to makeup, haircare, fragrances, and self-care products, we bring carefully selected beauty essentials together in one place.”

Customer promise:

✓ Authentic products

✓ Secure payments

✓ Easy returns

✓ Fast delivery

✓ Customer support

37. TECHNICAL REQUIREMENT

Build the website using a professional full-stack architecture.

Preferred stack:

Frontend:
HTML5
CSS3
JavaScript
Bootstrap 5 or React

Backend:
Node.js
Express.js

Database:
MongoDB or MySQL

Authentication:
JWT / secure session authentication

Payment:
Razorpay

Image storage:
Cloudinary or secure cloud storage

Use REST APIs for:

Authentication

Products

Categories

Cart

Wishlist

Orders

Payments

Reviews

Coupons

Admin

38. CODE QUALITY

Write:

Clean code

Modular components

Reusable functions

Proper folder structure

Meaningful variable names

Error handling

Validation

Comments where necessary

Secure API handling

Do not create fake buttons that do nothing.

All major features should actually work.

39. IMPORTANT REQUIREMENT

The final website should feel like a real commercial beauty e-commerce application.

Do not make it look like a simple student project.

Include realistic:

Product data

Product images/placeholders

Prices

Discounts

Reviews

Categories

Offers

Cart

Checkout

Payment flow

Orders

Admin dashboard

Use fictional products and brand names unless real products are specifically provided.

40. FINAL OUTPUT

Generate the complete project with:

Frontend

Backend

Database

Authentication

Product management

Search

Filters

Cart

Wishlist

Checkout

Razorpay payment integration

COD

Orders

Order tracking

Reviews

Coupons

Admin dashboard

Inventory

Responsive design

SEO

Security

Error handling

Also provide:

Complete folder structure

Database schema

Environment variable example

Installation instructions

Database setup instructions

Razorpay test-mode setup

Admin login setup

How to run frontend

How to run backend

How to deploy the application

Create the project in a way that another developer can clone it, configure environment variables, install dependencies, initialize the database, and run the website successfully.

Generate & Customize
Al builds your animated website instanty.
Make changes: colors, content, pages. 
SaaS Landing Page
Create a modem SaaS landing page with smooth scroll animations, 
floating navigation bar, hero section with gradient background, 
feature cards with hover effects, pricing table with toggle, 
testimonial carousel, and animated CTA buttons. Use a clean
minimalist design with subtle micro-interactions
Portfolio Website
Build a creative portfolio website with page transitions, 
project gallery with fiter animations, about section with
parallax scrolling, skils section with animated progress bars,contact form wilth validation feedback, and a dark mode toggle Make it feel premium and professional.
Agency Website
Design a bold agency website with animated text reveals, case study cards with image hover zoom, team section with social links, service offerings with icon animations, 
client logo carousel, and a sticky contact button.
Use strong typography and confident brand colors.

Start SimpleGenerate the basic version first, then iterate. Don't try to describe everything in one prompt.Reference Real WebsitesTell Lovable: 'Make it look like [competitor website]' — it understands references!Test on Mobile First80% of visitors will see your site on phone. Always preview mobile before publishing.Charge PremiumThese websites look like they cost $50,000+. Charge accordingly.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://glowaurawebsite.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/125a3ac1-999b-401f-9e63-185ea4aca1c9).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
