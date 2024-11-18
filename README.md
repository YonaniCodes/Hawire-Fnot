# Hawire Fnot Tour Project

**Version**: 1.0.0
**Author**: Yonas Awoke

## Project Description

The **Hawire Finot Project** is a Node.js application built with Express, MongoDB, and additional libraries to provide robust, secure, and scalable web services.The Api's are built for both Server Side and Client Side Rendering

## Getting Started

Follow these steps to set up the project and run it on your local machine.

### Prerequisites

Before starting, ensure you have the following installed:

1. **Node.js**: v10.0.0 or higher[Download and Install Node.js](https://nodejs.org/)
2. **npm**: Comes bundled with Node.js.
   Verify installation:

   ```bash
   node -v
   npm -v
   ```

3. Ensure MongoDB is installed and running.
   [Install MongoDB](https://www.mongodb.com/try/download/community)

   4.Clone the Repository

```bash
git clone https://github.com/yourusername/ha-project.git
cd ha-project
```

5.Install Dependencies

Run the following command to install all required dependencies:

```bash
npm install
```

6.Configuring Environment Variables

To properly set up your environment, follow these steps:

1. **Create a `.env` file**In the root directory of your project, create a file named `.env`.
2. **Add the following environment variables**
   Open the `.env` file and add the following configuration:

   ODE_ENV=development
   PORT=3000
   DB_URI=mongodb+srv://`<username>`:`<password>`@cluster.mongodb.net/yourdatabase
   JWT_SECRET=yourjwtsecret
   JWT_EXPIRES_IN=90d
   EMAIL_HOST=smtp.example.com
   EMAIL_PORT=587
   EMAIL_USER=[your-email@example.com]()
   EMAIL_PASS=your-email-password

   3.

   - Replace `<username>` and `<password>` with your MongoDB Atlas credentials.
   - Set `yourjwtsecret` to a secure secret key for signing JWT tokens.
   - Enter your email SMTP server details if you're using email functionality.

   3. **Save the `.env` file**
      Once you’ve updated the `.env` file, save it.

   These variables will be used by the application for various configurations like database connection, email handling, and JWT token management.

   ***

   Once the `.env` file is configured, you can start the application as usual.

7.Start the Server

Run the development server using:

```
npm start
```
