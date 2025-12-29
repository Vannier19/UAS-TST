# Dockerfile buat Service B (Node.js)
FROM node:18-alpine

WORKDIR /app

COPY package.json .
COPY server.js .
COPY dummy_loans.json .

RUN npm install --omit=dev

EXPOSE 9000

CMD ["npm", "start"]