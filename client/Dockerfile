# 配備環境
FROM nginx:stable-alpine

ARG _DIR_NAME

COPY ./$_DIR_NAME .

RUN apk add --no-cache ca-certificates

COPY $_DIR_NAME/nginx/default.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]