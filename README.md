# My Node.js Project

This is a simple Node.js project setup with ESLint for code linting and Nodemon for automatic restarting during development.

## Installation

```bash
npm install

## Assignment 5: Additional API Functionalities

In this assignment, we have added some new functionalities to the REST API:

### New Endpoints:

1. GET random-fact
   - Description: This endpoint returns a random fact from a predefined list.

2. POST 
   - Description: Adds new data to the server. This endpoint now:
     - Auto-generates an `id` for the message.
     - Adds a `timestamp` when the message is created.
   
3. PUT
   - Description: Updates the current data. The `id` remains the same, and a new `timestamp` is generated upon update.

4. DELETE
   - Description: Deletes the current data (dummy functionality).

### Additional Functionalities:
- Each new data entry receives a unique, auto-incremented `id`.
- Every time a message is added or updated, a `timestamp` is generated.

These functionalities were added for testing purposes and to demonstrate basic data handling and response generation within a Node.js server.