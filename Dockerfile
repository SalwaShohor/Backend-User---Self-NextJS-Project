# FROM node:20

# WORKDIR /app

# # Install deps
# COPY package*.json ./
# # RUN npx prisma generate
# RUN npm install

# # Copy rest of app
# COPY . .

# EXPOSE 4001

# # Default command (can be overridden in docker-compose)
# CMD ["npm", "start"]

FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# ✅ Generate Prisma Client inside the image
RUN npx prisma generate

EXPOSE 4001
CMD ["npm", "start"]

