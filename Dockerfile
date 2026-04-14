# Multi-stage build

FROM node:20-alpine AS frontend-builder

COPY ./frontend ./app

WORKDIR /app

RUN npm install

RUN npm run build


FROM node:20-alpine AS backend-builder

COPY ./backend ./app

WORKDIR /app

RUN npm install

COPY --from=frontend-builder /app/dist /app/public

CMD ["node", "server.js"]

