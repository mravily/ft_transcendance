# Image sur laquel est basé le container
# FROM node:18-alpine AS development

# # Defini le repertoire de travail dans le container
# WORKDIR /app

# # Copy tous fichiers package.json dans le container
# COPY package*.json ./
# COPY prisma ./prisma/

# # Install les dépendances dans le container 
# RUN npm install

# # Copy tous les fichiers de l'app dans le container
# COPY . .

# RUN npm run build

# # Expose le port du container
# EXPOSE 3000

# # Lance le server de dévellopement dans le container
# CMD [  "npm", "run", "start:migrate:dev" ]



# # Specify Node Version and Image
# # Name Image development (can be anything)
# FROM node:18-alpine AS development

# # Specify Working directory inside container
# WORKDIR /usr/app

# # Copy package-lock.json & package.json from host to inside container working directory
# COPY package*.json ./

# # Install deps inside container
# RUN npm install

# COPY . .

# RUN npm run build

# EXPOSE 3000

# ################
# ## PRODUCTION ##
# ################
# # Build another image named production
# FROM node:18-alpine AS production

# ARG NODE_ENV=production
# ENV NODE_ENV=${NODE_ENV}

# # Set work dir
# WORKDIR /app

# COPY --from=development /app/ .

# EXPOSE 3000

# # run app
# CMD [ "node", "dist/main"]

# FROM node:18-alpine AS builder

# # Create app directory
# WORKDIR /app

# # A wildcard is used to ensure both package.json AND package-lock.json are copied
# COPY package*.json ./
# COPY prisma ./prisma/

# # Install app dependencies
# RUN npm install

# COPY . .

# RUN npm run build

# FROM node:18-alpine

# COPY --from=builder /app/node_modules ./node_modules
# COPY --from=builder /app/package*.json ./
# COPY --from=builder /app/dist ./dist

# EXPOSE 3000
# CMD [ "npm", "run", "start:prod" ]