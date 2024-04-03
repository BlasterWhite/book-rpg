# Build
FROM bigpapoo/r5a05-node as build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Nginx
FROM bigpapoo/r5a05-nginx

COPY --from=build /app/dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
