# Angular Shopping App

A modern e-commerce application built with Angular (frontend) and Node.js/Express (backend) with PostgreSQL database.

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## Project Overview

This is a full-stack e-commerce application featuring:
- User authentication (login, signup, JWT-based auth)
- Product browsing and search
- Shopping cart functionality
- Wishlist management
- Order processing
- Admin dashboard capabilities
- Responsive UI with Tailwind CSS

## Tech Stack

### Frontend
- **Angular 18** - Progressive web app framework
- **Tailwind CSS** - Utility-first CSS framework
- **Angular Router** - Client-side routing
- **RxJS** - Reactive programming

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Prisma ORM** - Database toolkit and ORM
- **PostgreSQL** - Relational database
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing

## Folder Structure

```
angular-shopping-app/
├── backend/                          # Backend application
│   ├── src/                          # Source code
│   │   ├── config/                   # Configuration files
│   │   │   └── env.ts                # Environment configuration
│   │   ├── controllers/              # Request controllers
│   │   │   ├── auth.controller.ts    # Authentication controller
│   │   │   ├── cart.controller.ts    # Cart controller
│   │   │   ├── category.controller.ts # Category controller
│   │   │   ├── order.controller.ts   # Order controller
│   │   │   ├── product.controller.ts # Product controller
│   │   │   └── wishlist.controller.ts # Wishlist controller
│   │   ├── middleware/               # Express middleware
│   │   │   ├── auth.middleware.ts    # Authentication middleware
│   │   │   ├── error.middleware.ts   # Error handling middleware
│   │   │   └── validation.middleware.ts # Request validation middleware
│   │   ├── routes/                   # API route definitions
│   │   │   ├── auth.routes.ts        # Authentication routes
│   │   │   ├── cart.routes.ts        # Cart routes
│   │   │   ├── category.routes.ts   # Category routes
│   │   │   ├── order.routes.ts       # Order routes
│   │   │   ├── product.routes.ts     # Product routes
│   │   │   └── wishlist.routes.ts    # Wishlist routes
│   │   ├── services/                 # Business logic services
│   │   │   ├── auth.service.ts       # Authentication service
│   │   │   ├── cart.service.ts       # Cart service
│   │   │   ├── category.service.ts   # Category service
│   │   │   ├── order.service.ts      # Order service
│   │   │   ├── product.service.ts    # Product service
│   │   │   └── wishlist.service.ts   # Wishlist service
│   │   ├── utils/                    # Utility functions
│   │   │   ├── jwt.util.ts           # JWT utilities
│   │   │   └── password.util.ts      # Password utilities
│   │   ├── validators/               # Request validation schemas
│   │   │   ├── auth.validator.ts     # Auth validation
│   │   │   └── product.validator.ts  # Product validation
│   │   ├── prisma/                   # Prisma client
│   │   │   └── client.ts             # Prisma client instance
│   │   ├── app.ts                    # Express app setup
│   │   └── server.ts                 # Server entry point
│   ├── prisma/                       # Database schema and migrations
│   │   ├── schema.prisma             # Prisma schema
│   │   └── migrations/               # Database migrations
│   ├── generated/                    # Generated Prisma client
│   ├── .env                        # Environment variables (gitignored)
│   ├── .env.example                # Environment variables template
│   ├── package.json                # Backend dependencies
│   ├── tsconfig.json               # TypeScript configuration
│   └── eslint.config.mjs           # ESLint configuration
│
├── frontend/                         # Frontend application
│   ├── src/                          # Source code
│   │   ├── app/                      # Angular application
│   │   │   ├── components/           # Reusable UI components
│   │   │   │   ├── about/            # About section component
│   │   │   │   ├── brands/           # Brands display component
│   │   │   │   ├── cart/             # Cart component
│   │   │   │   ├── cart-sidebar/     # Cart sidebar component
│   │   │   │   ├── customer-reviews/ # Customer reviews component
│   │   │   │   ├── delivery-info/    # Delivery info component
│   │   │   │   ├── faq/              # FAQ component
│   │   │   │   ├── featured-categories/ # Featured categories component
│   │   │   │   ├── flash-sale/       # Flash sale component
│   │   │   │   ├── footer/           # Footer component
│   │   │   │   ├── hero/             # Hero banner component
│   │   │   │   ├── modal/            # Modal components
│   │   │   │   ├── navbar/           # Navigation bar component
│   │   │   ├── newsletter/           # Newsletter subscription component
│   │   │   ├── statistics/           # Statistics display component
│   │   │   ├── toast/                # Toast notification component
│   │   │   ├── trending-products/    # Trending products component
│   │   │   └── why-choose-us/        # Why choose us component
│   │   │   ├── guards/               # Route guards
│   │   │   │   └── auth.guard.ts     # Authentication guard
│   │   │   ├── interceptors/         # HTTP interceptors
│   │   │   │   └── jwt.interceptor.ts # JWT interceptor
│   │   │   ├── pages/                # Page components
│   │   │   │   ├── cart-page/        # Cart page
│   │   │   │   ├── checkout/         # Checkout page
│   │   │   │   ├── home/             # Home page
│   │   │   │   ├── login/            # Login page
│   │   │   │   ├── not-found/        # 404 page
│   │   │   │   ├── product-detail/   # Product detail page
│   │   │   │   ├── products/         # Products listing page
│   │   │   │   ├── profile/          # User profile page
│   │   │   │   └── signup/           # Signup page
│   │   │   ├── services/             # API services
│   │   │   │   ├── auth.service.ts   # Authentication service
│   │   │   │   ├── cart.service.ts   # Cart service
│   │   │   │   ├── category.service.ts # Category service
│   │   │   │   ├── order.service.ts  # Order service
│   │   │   │   ├── product.service.ts # Product service
│   │   │   │   ├── toast.service.ts  # Toast service
│   │   │   │   └── wishlist.service.ts # Wishlist service
│   │   │   ├── config/               # Application configuration
│   │   │   │   └── contact.config.ts # Contact configuration
│   │   │   ├── app.component.ts      # Root component
│   │   │   └── app.routes.ts         # Application routes
│   │   ├── assets/                   # Static assets
│   │   │   └── images/               # Image assets
│   │   ├── environments/             # Environment configurations
│   │   │   ├── environment.ts        # Development environment
│   │   │   └── environment.prod.ts   # Production environment
│   │   ├── index.html                # Main HTML file
│   │   ├── main.ts                   # Application entry point
│   │   ├── styles.css                # Global styles
│   │   └── proxy.conf.json           # Proxy configuration
│   ├── angular.json                  # Angular configuration
│   ├── package.json                  # Frontend dependencies
│   ├── tsconfig.json                 # TypeScript configuration
│   ├── tsconfig.app.json             # TypeScript app configuration
│   ├── tailwind.config.js            # Tailwind CSS configuration
│   ├── postcss.config.mjs            # PostCSS configuration
│   └── eslint.config.mjs             # ESLint configuration
│
├── .gitignore                        # Git ignore rules
├── LICENSE                           # MIT License
└── README.md                         # This file
```

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **PostgreSQL** (v14 or higher)
- **Angular CLI** (v18 or higher)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/angular-shopping-app.git
cd angular-shopping-app
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Update .env with your database credentials
# DATABASE_URL="postgresql://user:password@localhost:5432/shopping_db"

# Run database migrations
npx prisma migrate dev

# Start the development server
npm run dev
```

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The application will be available at:
- Frontend: `http://localhost:4200`
- Backend API: `http://localhost:3000`

## Environment Variables

### Backend (.env)

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/shopping_db"

# Server
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# Bcrypt
BCRYPT_ROUNDS=12
```

### Frontend (environment.ts)

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
};
```

## Available Scripts

### Backend

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run test` | Run tests |
| `npm run lint` | Run linter |

### Frontend

| Script | Description |
|--------|-------------|
| `npm start` | Start development server |
| `npm run build` | Build for production |
| `npm run lint` | Run linter |
| `npm test` | Run tests |

## API Documentation

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/logout` | Logout user |
| GET | `/api/auth/me` | Get current user |

### Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products |
| GET | `/api/products/:id` | Get a single product |
| POST | `/api/products` | Create a product (Admin) |
| PUT | `/api/products/:id` | Update a product (Admin) |
| DELETE | `/api/products/:id` | Delete a product (Admin) |

### Categories

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | Get all categories |
| POST | `/api/categories` | Create a category (Admin) |

### Cart

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cart` | Get cart items |
| POST | `/api/cart` | Add item to cart |
| PUT | `/api/cart/:id` | Update cart item |
| DELETE | `/api/cart/:id` | Remove item from cart |

### Orders

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/orders` | Get all orders |
| GET | `/api/orders/:id` | Get a single order |
| POST | `/api/orders` | Create a new order |

### Wishlist

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/wishlist` | Get wishlist items |
| POST | `/api/wishlist` | Add item to wishlist |
| DELETE | `/api/wishlist/:id` | Remove item from wishlist |

## Contributing

We welcome contributions to this project! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature-name`)
3. Make your changes
4. Run tests and ensure they pass
5. Commit your changes (`git commit -m 'Add some feature'`)
6. Push to the branch (`git push origin feature/your-feature-name`)
7. Open a Pull Request

### Coding Standards

- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Angular](https://angular.io/) - Frontend framework
- [Express.js](https://expressjs.com/) - Backend framework
- [Prisma](https://www.prisma.io/) - Database ORM
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [PostgreSQL](https://www.postgresql.org/) - Database