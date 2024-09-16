FROM nginx
MAINTAINER sylphy
VOLUME /tmp
ENV LANG en_US.UTF-8

# 将本地 nginx 配置文件复制到容器中
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# 创建必要的目录
RUN mkdir -p /var/www/html

# 添加构建的静态网站文件
ADD ./src/.vuepress/dist/ /var/www/html/

# 暴露端口
EXPOSE 8089
