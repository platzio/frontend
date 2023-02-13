FROM nginx:1-alpine-slim
COPY nginx.conf /etc/nginx/nginx.conf
COPY dist/ /usr/share/nginx/html/
CMD ["/usr/sbin/nginx", "-c", "/etc/nginx/nginx.conf"]
