#!/bin/bash

# Create a temporary directory for packaging
mkdir -p package

# Install dependencies into the package directory
pip install -r requirements.txt -t package/

# Copy the handler code
cp index.py package/

# Create the deployment package
cd package && zip -r ../deployment.zip . && cd ..

# Clean up
rm -rf package

echo "Deployment package created as deployment.zip" 