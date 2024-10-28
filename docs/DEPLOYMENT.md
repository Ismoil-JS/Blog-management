# Deployment Documentation for Express App

## Overview

This document provides the necessary steps to deploy the Express application using Docker. The application runs on Node.js and uses PostgreSQL as the database.

## Prerequisites

- Docker and Docker Compose installed on your machine.
- Basic knowledge of how to use Docker commands.

## Project Structure

Ensure your project has the following structure:

/Blog-management
├── Dockerfile
├── docker-compose.yml
├── package.json
└── src

## Running the Application

Build and Start Containers
To build the application and start the containers, use the following command from the project root:

- bash
- Copy code
- docker-compose up --build

This command will:

Build the Docker images based on the Dockerfile.
Start the application container and the PostgreSQL database container.
Access the Application
Once the containers are running, you can access the application at:

## Access the Application

Once the containers are running, you can access the application at:

- http://localhost:3100

## Project Scripts

Here are the available scripts in the package.json file:

"scripts": {
"dev": "tsc & npx concurrently \"npm run watch:run\"",
"watch:run": "npx nodemon dist/app.js",
"build": "tsc",
"start": "node dist/app.js",
"test": "jest"
}
dev: Compiles TypeScript and runs the application in development mode.
watch:run: Watches for changes and restarts the application automatically.
build: Compiles TypeScript into JavaScript.
start: Runs the compiled JavaScript application.
test: Runs tests using Jest.

### Notes

- Replace .env material as it is given on .env.example file before you run application.
