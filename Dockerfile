FROM centos
RUN curl --silent --location https://rpm.nodesource.com/setup_8.x | bash -
RUN yum install -y git make gcc nodejs && yum clean all
WORKDIR /app/
COPY . /app/
RUN yum install -y make gcc-c++ libpng12 && yum -y clean all && npm install
EXPOSE 7075
CMD ["/usr/bin/node", "server.js"]
