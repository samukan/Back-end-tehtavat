# My Node.js Project

This is a simple Node.js project setup with ESLint for code linting and Nodemon for automatic restarting during development.

## Installation

```bash
npm install

## Assignment 5: Additional API Functionalities

In this assignment, we have added some new functionalities to the REST API:

### New Endpoints:

1. **GET `/random-fact`**
   - **Description:** This endpoint returns a random fact from a predefined list.
   - **Example Response:**
     ```json
     {
       "fact": "Bananas are berries, but strawberries aren’t."
     }
     ```

2. **POST `/data`**
   - **Description:** Adds new data to the server. This endpoint now:
     - Auto-generates an `id` for the message.
     - Adds a `timestamp` when the message is created.
   - **Example Request:**
     ```json
     {
       "message": "This is a test message."
     }
     ```
   - **Example Response:**
     ```json
     {
       "message": "Data saved successfully!",
       "data": {
         "id": 3,
         "message": "This is a test message.",
         "timestamp": "2024-10-24T10:15:00.000Z"
       }
     }
     ```

3. **PUT `/data`**
   - **Description:** Updates the current data. The `id` remains the same, and a new `timestamp` is generated upon update.
   - **Example Request:**
     ```json
     {
       "message": "This is an updated message."
     }
     ```
   - **Example Response:**
     ```json
     {
       "message": "Data updated successfully.",
       "data": {
         "id": 3,
         "message": "This is an updated message.",
         "timestamp": "2024-10-24T11:00:00.000Z"
       }
     }
     ```

4. **DELETE `/data`**
   - **Description:** Deletes the current data (dummy functionality).
   - **Example Response:**
     ```json
     {
       "message": "Data deleted successfully."
     }
     ```

### Additional Functionalities:
- Each new data entry receives a unique, auto-incremented `id`.
- Every time a message is added or updated, a `timestamp` is generated.

These functionalities were added for testing purposes and to demonstrate basic data handling and response generation within a Node.js server.