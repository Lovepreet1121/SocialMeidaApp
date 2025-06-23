# Social Media App

This is a full-stack social media application built using the MERN (MongoDB, Express.js, React.js, Node.js) stack. It allows users to register, log in, create a profile, make posts, and interact with posts.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Live Demo](#live-demo)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Known Issues / Limitations](#known-issues--limitations)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [License](#license)

## Features

* **User Authentication:** Secure user registration and login functionalities.
* **User Profiles:** Users can create and update their profiles, including username, profile picture (URL), and bio.
* **Post Creation:** Authenticated users can create new text posts.
* **Global Feed:** Display a feed of all posts from users.
* **Post Reactions:** Users can "Like" posts (basic reaction system).
* **Database Integration:** Data persistence using MongoDB.

## Technologies Used

### Frontend
* **React.js:** For building the user interface.
* **Vite:** As a fast development build tool.
* **React Router DOM:** For client-side routing.
* **CSS:** For styling.

### Backend
* **Node.js:** JavaScript runtime environment.
* **Express.js:** Web framework for Node.js.
* **MongoDB:** NoSQL database for data storage.
* **Mongoose:** ODM (Object Data Modeling) library for MongoDB.
* **bcryptjs:** For password hashing.
* **jsonwebtoken (JWT):** For secure authentication.
* **express-validator:** For request data validation.
* **CORS:** For handling Cross-Origin Resource Sharing.
* **Nodemon:** For automatic server restarts during development.

## Project Structure

The project is organized into two main directories: