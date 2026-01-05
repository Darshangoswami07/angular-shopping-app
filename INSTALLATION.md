# Luxe E-Commerce Storefront - Installation Guide

Welcome! Follow these step-by-step instructions to install and run this Angular e-commerce storefront on your local machine.

## Prerequisites

Before you begin, make sure you have the following installed:

1. **Node.js** (version 18 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: Open terminal/command prompt and run:
     ```bash
     node --version
     ```
   - Should display something like `v18.x.x` or higher

2. **npm** (comes with Node.js)
   - Verify installation:
     ```bash
     npm --version
     ```

## Installation Steps

### Step 1: Extract the Project
1. Extract the downloaded ZIP file to your desired location
2. Open the extracted folder - you should see files like `package.json`, `angular.json`, etc.

### Step 2: Open Terminal/Command Prompt
1. **Windows**: Right-click inside the project folder and select "Open in Terminal" or "Git Bash Here"
2. **Mac/Linux**: Right-click the folder and select "Open Terminal Here" or use `cd` to navigate to the folder

### Step 3: Install Dependencies
Run the following command to install all required packages:

```bash
npm install
```

This will take a few minutes. You'll see a progress bar and lots of text - this is normal!

**Note**: If you see any warnings (yellow text), that's okay. Only errors (red text) are problematic.

### Step 4: Start the Development Server
Once installation is complete, start the app with:

```bash
npm start
```

or

```bash
ng serve
```

You should see output like:
```
** Angular Live Development Server is listening on localhost:4200 **
```

### Step 5: View the Application
1. Open your web browser (Chrome, Firefox, Edge, Safari)
2. Navigate to: **http://localhost:4200**
3. The e-commerce storefront should load! 🎉

## What to Expect

You'll see:
- ✅ A sticky glassmorphism navbar with cart icon and badge
- ✅ A massive hero section with "Shop Now" button
- ✅ Featured categories grid with hover animations
- ✅ 8 trending product cards with "Add to Cart" functionality
- ✅ Why Choose Us section with icons
- ✅ Newsletter signup section
- ✅ Detailed footer with links and social media icons
- ✅ Smooth scroll-reveal animations
- ✅ Fully responsive design (try resizing your browser!)

## Testing the Interactivity

1. **Cart Functionality**: Click any "Add to Cart" button on products
   - The cart badge in the navbar should increase!
   
2. **Animations**: Scroll down the page
   - Sections should fade in smoothly as they come into view

3. **Mobile View**: Resize your browser window to test responsiveness
   - Or press F12 and click the mobile icon

## Troubleshooting

### Issue: Port 4200 is already in use
**Solution**: Either:
- Close other Angular apps running on your machine
- Or specify a different port:
  ```bash
  ng serve --port 4300
  ```
  Then visit: http://localhost:4300

### Issue: "ng is not recognized" error
**Solution**: Install Angular CLI globally:
```bash
npm install -g @angular/cli
```

### Issue: Lucide icons not showing
**Solution**: 
1. Stop the server (Ctrl+C)
2. Run: `npm install`
3. Start again: `npm start`

### Issue: Styles not loading properly
**Solution**:
1. Make sure Tailwind CSS is properly configured
2. Try clearing the browser cache (Ctrl+Shift+Delete)
3. Hard refresh the page (Ctrl+Shift+R)

## Building for Production

When you're ready to deploy your app:

```bash
npm run build
```

This creates an optimized version in the `dist/` folder.

## Project Structure

```
angular-ecommerce-storefront/
├── src/
│   ├── app/
│   │   ├── components/         # All UI components
│   │   │   ├── navbar/
│   │   │   ├── hero/
│   │   │   ├── featured-categories/
│   │   │   ├── trending-products/
│   │   │   ├── why-choose-us/
│   │   │   ├── newsletter/
│   │   │   └── footer/
│   │   ├── services/           # Cart service
│   │   └── app.component.ts    # Main app component
│   ├── styles.css              # Global styles with Tailwind
│   └── index.html              # Main HTML file
├── package.json                # Dependencies
├── angular.json               # Angular configuration
├── tailwind.config.js         # Tailwind configuration
└── tsconfig.json              # TypeScript configuration
```

## Features Implemented

✅ **Glassmorphism Navbar**: Sticky navigation with blur effect
✅ **Dynamic Cart Badge**: Real-time cart count updates
✅ **8 Product Cards**: With images, prices, ratings, and add-to-cart buttons
✅ **Smooth Animations**: Scroll-reveal effects throughout
✅ **Lucide Icons**: Professional icon system
✅ **Tailwind CSS**: Modern, responsive styling
✅ **Standalone Components**: Modern Angular architecture
✅ **Mobile Responsive**: Works perfectly on all screen sizes

## Need Help?

- **Angular Documentation**: https://angular.dev
- **Tailwind CSS Docs**: https://tailwindcss.com/docs
- **Lucide Icons**: https://lucide.dev

Enjoy your new e-commerce storefront! 🛍️
