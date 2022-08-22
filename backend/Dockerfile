# Multi-stage builds (permets de garder des images petites)
# Container basé sous NodeJS v18-alpine 🔒
FROM node:18-alpine AS builder

# Place le container dans le répertoire de travail 👨‍🔧
WORKDIR /app

# Copie les fichiers .json et Prisma 🔧
COPY package*.json ./
COPY prisma ./prisma/

# Install les deps spécifiés les .json 📦
RUN npm install

# Copie les fichiers du projets 🔀
COPY . .

# Build le projet dans le container 🏗
RUN npm run build

# Production step builds 🏭
FROM node:18-alpine

# Copy les fichiers de l'étape builder dans un nouveau container 🛠
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Expose le port du container 🔌
EXPOSE 3000

# Pour migrer les tables Prisma 👇🏽
# Ne pas oublier de changer postgres par localhost dans ${DATABASE_URL}
# CMD [ "npm", "run", "start:prod" ]

# Deploie la migration et lance le service en prod 👇🏽 
CMD [  "npm", "run", "start:migrate:prod" ]