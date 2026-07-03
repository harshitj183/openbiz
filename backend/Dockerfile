FROM node:20-alpine

WORKDIR /usr/src/backend

COPY backend/package*.json ./
RUN npm install

COPY backend/tsconfig.json ./
COPY backend/src ./src
COPY backend/prisma ./prisma
COPY backend/.env.example ./
COPY backend/.gitignore ./
COPY backend/package-lock.json ./
COPY backend/jest.config.js ./

RUN npm run build

EXPOSE 3001

CMD ["node", "-r", "module-alias/register", "dist/index.js"]
