# # FROM node:20

# # WORKDIR /app

# # # Install deps
# # COPY package*.json ./
# # # RUN npx prisma generate
# # RUN npm install

# # # Copy rest of app
# # COPY . .

# # EXPOSE 4001

# # # Default command (can be overridden in docker-compose)
# # CMD ["npm", "start"]

# # FROM node:20

# # WORKDIR /app

# # COPY package*.json ./
# # RUN npm install

# # COPY . .

# # RUN npx prisma generate

# # EXPOSE 8080

# # CMD ["npm", "start"]

# # Use official Node.js image
# FROM node:20

# # Set working directory
# WORKDIR /app

# # Copy package files
# COPY package*.json ./

# # Install dependencies (including dev if needed)
# RUN npm install

# # Copy Prisma schema first (so Docker cache is used efficiently)
# COPY prisma ./prisma

# # Generate Prisma client during build
# RUN npx prisma generate

# # Copy the rest of the code
# COPY . .

# # Expose app port
# EXPOSE 8101

# # Start the app
# CMD ["npm", "start"]


FROM node:20-alpine AS runner

WORKDIR /app

# Install deps first
COPY package*.json ./
RUN npm install --only=production

# Copy Prisma schema and generate client
COPY prisma ./prisma
RUN npx prisma generate

# Copy the rest of the application
COPY . .

EXPOSE 8101

CMD ["npm", "start"]
