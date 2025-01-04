

# Spend - Expense Tracker

This is **Spend**, the modern-day expense tracker designed both with precision and the latest technology. The app is seamless in tracking expenses; visualizing things in between; and better managing finances.

## 🛠️ Tech Stack

Spend leverages the following tools and libraries:

- [**TypeScript**](https://www.typescriptlang.org/): Type-safe programming
- [**Next.js 15**](https://nextjs.org/): Robust React framework for building modern web applications
- [**TailwindCSS**](https://tailwindcss.com/): Utility-first CSS framework
- [**Prisma**](https://www.prisma.io/): ORM for database management
- [**NeonDB**](https://neon.tech/): Postgres database as a service
- [**ClerkAuth**](https://clerk.dev/): Authentication made simple
- [**Recharts**](https://recharts.org/): Beautiful and customizable charts
- [**React Hook Form**](https://react-hook-form.com/): Simplified form handling
- [**Zod**](https://zod.dev/): Schema validation
- [**TanStack Table**](https://tanstack.com/table): Flexible table library
- [**TanStack Query**](https://tanstack.com/query): Asynchronous state management
- [**Lucide React**](https://lucide.dev/): Icon toolkit
- [**ShadCN-UI**](https://shadcn.dev/): Components for building user interfaces
- [**Date-fns**](https://date-fns.org/): Utility library for handling dates
- [**Export-to-CSV**](https://www.npmjs.com/package/export-to-csv): Export data as CSV
- [**React CountUp**](https://www.npmjs.com/package/react-countup): Animated number counter
- [**Emoji Mart**](https://emoji-mart.js.org/): Emoji picker library
- [**pnpm**](https://pnpm.io/): Fast, disk space-efficient package manager


---

## 🌟 Features

- 🚀 **Effortless Expense Tracking**: Add, edit, and delete expenses with ease.
- 📊 **Interactive Charts**: Visualize spending patterns using beautiful charts.
- 🗃️ **Customizable Tables**: Organize and filter your expense data.
- 📅 **Date Management**: Intuitive date handling for accurate records.
- 🛡️ **Secure Authentication**: Manage users with robust authentication.
- 📤 **Export Data**: Save your data as CSV for offline use.
- 🌈 **Dynamic Emojis**: Add a personal touch with emojis.

---

## 🚀 Getting Started

Follow these steps to set up the project locally:

### Prerequisites
- Node.js >= 16
- pnpm installed globally: `npm install -g pnpm`
- A NeonDB database instance
- ClerkAuth account for authentication

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/IFTE-13/spend.git
   cd spend
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   ```
   
3. **Set up environment variables:**

   Create a `.env` file in the root of your project and add your API key for the services:

   ```plaintext
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=publishable_key
    CLERK_SECRET_KEY=secret_key
    NEXT_PUBLIC_CLERK_SIGN_IN_URL=sign-in
    DATABASE_URL=your_api_key_here
   ```
   
4. **Run the development server:**

## 🤝 Contributing

Contributions are welcome! If you have any suggestions or improvements, feel free to create an issue or submit a pull request.

1. **Fork the repository**
2. **Create a new branch:**

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
4. **Commit your changes:**

   ```bash
   git commit -m '<type>[optional scope]: <description>'
   ```

5. **Push to the branch:**

   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a pull request**

   ```bash
   pnpm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser to see the app in action.

## 📝 License

> [!Caution]
> This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
