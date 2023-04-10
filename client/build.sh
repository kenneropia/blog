#!/bin/bash

# Set the path to the front-end project folder
FRONTEND_PATH="./client"

# Set the path to the backend project folder
BACKEND_PATH="./server"

# Build the front-end project using npm
npm run build

cd ..

# Create a new static folder in the backend project folder
mkdir static

# Copy the built front-end files to the new static folder
cp -R $FRONTEND_PATH/dist/* $BACKEND_PATH/static
