# Use the base node image
FROM node:18

# Set the working directory
WORKDIR /app

# Install build tools (for building native modules like bcrypt)
RUN apt-get update && apt-get install -y build-essential python3

# Copy the package.json and package-lock.json files to install dependencies
COPY package*.json ./

# Install the production dependencies
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Rebuild bcrypt to match the platform architecture (force rebuild)
RUN npm rebuild bcrypt --build-from-source

# Build the application
RUN npm run build

# Expose port 3000 (or whatever port you're using)
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start:prod"]
