FROM node:16 AS builder
WORKDIR /build/
COPY . /build/
RUN yarn install
RUN yarn build

FROM nginx:1.21
COPY --from=builder /build/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /build/dist/ /usr/share/nginx/html/
CMD ["/usr/sbin/nginx", "-c", "/etc/nginx/nginx.conf"]
