# PlantNet

PlantNet is a web application for managing and purchasing plants. This project includes both client-side and server-side code.

## Table of Contents

-   [Installation](#installation)
-   [Usage](#usage)
-   [Features](#features)
-   [Technologies](#technologies)
-   [Contributing](#contributing)

## Installation

### Prerequisites

-   Node.js
-   MongoDB

### Client-side

1. Navigate to the client directory:

    ```sh
    cd client
    ```

2. Install dependencies:

    ```sh
    npm install
    ```

3. Create a `.env` file in the [client](http://_vscodecontentref_/1) directory and add your environment variables:

    ```env
    VITE_API_URL=http://localhost:9000
    VITE_IMGBB_API_KEY=your_imgbb_api_key
    ```

4. Start the client:
    ```sh
    npm run dev
    ```

### Server-side

1. Navigate to the server directory:

    ```sh
    cd server
    ```

2. Install dependencies:

    ```sh
    npm install
    ```

3. Create a `.env` file in the [server](http://_vscodecontentref_/2) directory and add your environment variables:

    ```env
    MONGODB_URI=your_mongodb_uri
    ACCESS_TOKEN_SECRET=your_access_token_secret
    ```

4. Start the server:
    ```sh
    npm start
    ```

## Usage

1. Open your browser and navigate to `http://localhost:3000` to access the client-side application.
2. Use the application to manage and purchase plants.

## Features

-   User authentication and authorization
-   Plant management (add, update, delete)
-   Purchase plants
-   View plant details
-   Admin and seller roles

## Technologies

-   React
-   Node.js
-   Express
-   MongoDB
-   Axios
-   React Query
-   Tailwind CSS

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.
