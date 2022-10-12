# Multi-stage builds (permets de garder des images petites)
# Container basé sous NodeJS v18-alpine 🔒
FROM node:lts-alpine3.15 AS builder

# Place le container dans le répertoire de travail 👨‍🔧
WORKDIR /app

# Copie les fichiers .json et Prisma 🔧
COPY *.json ./
COPY prisma ./prisma/

# Install les deps spécifiés les .json 📦
RUN npm install -g npm
RUN npm install

# Copie les fichiers du projets 🔀
COPY . .

# Build le projet dans le container 🏗
RUN npm run build

# Step production builds 🏭
FROM node:lts-alpine3.15

# Copy les fichiers de l'étape builder dans un nouveau container 🛠
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Expose le port du container 🔌
EXPOSE 3000

# Permet la génération du client Prisma
RUN npx prisma generate

# Pour migrer les tables Prisma 👇🏽
# # Ne pas oublier de changer postgres par localhost dans les .env
# CMD [ "npm", "run", "start:dev" ]

# Deploie la migration et lance le service en dev 👇🏽 
CMD [ "npm", "run", "start:migrate:dev" ]

# Deploie la migration et lance le service en prod 👇🏽 
# CMD [ "npm", "run", "start:migrate:prod" ]