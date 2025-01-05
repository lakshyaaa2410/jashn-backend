# Jashn - Event Booking App Backend

Welcome to **Jashn**, the backend of an event booking app that lets users discover and book exciting events in their cities. Built with **Node.js**, **Express**, and **MongoDB**, this repository focuses solely on the server-side code of the application.

---

## 🚀 Features

-   **User Authentication**: Secure login and registration with JWT-based authentication.
-   **Event Management**: APIs for creating, updating, and fetching events.
-   **Event Booking**: Seamless booking functionality for users.
-   **Scalable Architecture**: Modular code structure for future scalability.
-   **MongoDB Integration**: Robust database handling for storing user and event data.

---

## 🛠️ Technologies Used

-   **Node.js**: JavaScript runtime environment.
-   **Express.js**: Web application framework.
-   **MongoDB**: NoSQL database for data storage.
-   **Mongoose**: MongoDB object modeling for Node.js.
-   **JSON Web Tokens (JWT)**: Authentication and authorization.

---

## 📂 Project Structure

```
Jashn/
├── controllers/     # Business logic and API handling
├── models/          # MongoDB models
├── routes/          # API routes
├── utils/           # Helper functions
├── server.js        # Entry point
└── package.json     # Dependencies and scripts
```

---

## 🔧 Setup and Installation

### Prerequisites

-   Node.js (v16+ recommended)
-   MongoDB (local or cloud instance)

### Steps

1. Clone the repository:

    ```bash
    git clone https://github.com/lakshyaaa2410/jashn-backend.git
    cd jashn-backend
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Configure environment variables:
   Create a `.env` file in the root directory with the following:

    ```env
    PORT=3000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    ```

4. Start the server:

    ```bash
    npm start
    ```

    The server will run on `http://localhost:3000`.

---

## 📚 API Endpoints

### Authentication

-   `POST /api/auth/signup` - Register a new user.
-   `POST /api/auth/login` - Log in an existing user.

### Events

-   `GET /api/events` - Fetch all events.
-   `POST /api/events` - Create a new event.
-   `GET /api/events/:id` - Fetch event details by ID.

### Bookings

-   `POST /api/bookings` - Book an event.
-   `GET /api/bookings` - Fetch user bookings.

---

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any feature additions or bug fixes.

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).

---

## 📬 Contact

For queries, feel free to reach out:

-   **Email**: lakshyachoudhary1@gmail.com
-   **GitHub**: [lakshyaaa2410](https://github.com/lakshyaaa2410)

---

Thank you for checking out Jashn! 🎉
