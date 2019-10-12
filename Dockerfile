FROM node:lts-alpine

COPY app /app

ENTRYPOINT [ "/usr/bin/env", "node", "/app/server.js" ]