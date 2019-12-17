FROM node:8

COPY . /app
WORKDIR /app
RUN npm install -g gulp-cli \
    && npm install -g gulp -D \
    && npm install -g serve \
    && npm install . \
 && npm run postinstall

EXPOSE 5000

ENTRYPOINT ["serve"]
CMD []
