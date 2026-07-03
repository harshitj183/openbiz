FROM node:20-alpine

WORKDIR /usr/src/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/tsconfig.json ./
COPY frontend/next.config.js ./
COPY frontend/postcss.config.js ./
COPY frontend/tailwind.config.ts ./
COPY frontend/next-env.d.ts ./
COPY frontend/app ./app
COPY frontend/components ./components
COPY frontend/hooks ./hooks
COPY frontend/lib ./lib
COPY frontend/types ./types
COPY frontend/__tests__ ./__tests__
COPY frontend/public ./public
COPY schema ./schema
COPY frontend/.gitignore ./
COPY frontend/README.md ./

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
