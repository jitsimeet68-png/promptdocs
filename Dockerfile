# Stage 1: build MkDocs site
FROM python:3.12-slim AS builder
WORKDIR /app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY mkdocs.yml ./
COPY docs/ ./docs
COPY js/ ./js
COPY assets/ ./assets

RUN mkdocs build --clean

# Stage 2: serve with Nginx
FROM nginx:stable-alpine
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/site /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
