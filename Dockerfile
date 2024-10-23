FROM node:latest as build
WORKDIR /app
COPY package.json ./
RUN npm ci
RUN npm install -g @angular/cli
COPY . .
RUN npm run build --configuration=production


FROM httpd:2.4
COPY --from=build /app/dist/app-bodega/browser /usr/local/apache2/htdocs/
COPY apache.conf /usr/local/apache2/conf/sites-available/000-default.conf
RUN ln -s /usr/local/apache2/conf/sites-available/000-default.conf /usr/local/apache2/conf/sites-enabled/000-default.conf

