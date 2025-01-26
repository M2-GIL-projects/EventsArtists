# Utiliser une image de Node.js pour le build
FROM node:18 AS builder

# Créer un répertoire de travail
WORKDIR /app

# Copier les fichiers de l'application
COPY package.json package-lock.json ./
RUN npm install

COPY . .

# Construire l'application pour la production
RUN npm run build

# Étape 2 : Utiliser une image Nginx pour servir le frontend
FROM nginx:alpine

# Copier les fichiers générés par Vite dans le répertoire HTML de Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copier une configuration personnalisée de Nginx si nécessaire
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exposer le port 80
EXPOSE 80

# Lancer Nginx
CMD ["nginx", "-g", "daemon off;"]
