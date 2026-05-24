# syntax=docker/dockerfile:1.7

# Build stage runs on the host architecture (no QEMU emulation)
# since the output is static assets that are identical across arches.
FROM --platform=$BUILDPLATFORM node:24-alpine AS build
WORKDIR /app
RUN apk add --no-cache git \
 && git config --global url."https://github.com/".insteadOf "ssh://git@github.com/" \
 && git config --global url."https://github.com/".insteadOf "git@github.com:"
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:1-alpine-slim
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist/ /usr/share/nginx/html/
CMD ["/usr/sbin/nginx", "-c", "/etc/nginx/nginx.conf"]
