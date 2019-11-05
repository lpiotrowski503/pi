# Docker doc.

```bash
sudo su root
```

---

```bash
docker version
```

---

```bash
docker info
```

---

## Run images

```bash
# -d = background
# 8080:80 local-port:server-port
docker container run -it -p 80:80 <IMAGE_NAME>
docker container run -d -p 8080:80 --name mynginx nginx
docker container run -d -p 8081:80 --name myapache httpd
docker container run -d -p 3306:3306 --name mysql --env MYSQL_ROOT+PASSWORD=123456 mysql
```

---

## Show running containers

```bash
docker container ls
docker container ps
docker ps
```

---

## Show all containers

```bash
docker container ls -a
```

---

## Remove containers with id

```bash
docker container rm <ID>
```

---

## Show all images

```bash
docker images
```

---

## Remove images with id

```bash
docker image rm <ID>
docker image rm <ID> -f
```

---

## Download image

```bash
docker pull <IMAGE_NAME>
```

---

## Stop running container

```bash
docker container stop <IMAGE_NAME>
```

---

## Opening terminal of server

```bash
docker container exec -it mynginx bash
exit
```

---

## Remove all containers

```bash
docker rm $(docker ps -aq) -f
```

---

## Remove all images

```bash
docker rmi $(docker images -q) -f
```

---

## Change path server

```bash
docker container run -d -p 8080:80 -v $(pwd):/usr/share/nginx/html --name nginx-website nginx
```

---

## Create image from file

```bash
docker build -t <NAME_IMAGE> .
```

---

## Logging to docker account

```bash
docker login
```

---

## Start docker image

```bash
docker run -p 3000:3000 node-twitter-stream:latest
```

---

## Quick Start

```bash
# Run in Docker
docker-compose up
# use -d flag to run in background

# Tear down
docker-compose down

# To be able to edit files, add volume to compose file
volumes: ['./:/usr/src/app']

# To re-build
docker-compose build
```

---

## Dockerfile

```docker
# import node v10
FROM node:10

# path to app
WORKDIR /usr/src/app

# copy package.json & package-lock.json
COPY package*.json ./

# run command
RUN npm install

# copy all to container
COPY . .

# set port
EXPOSE 3000

# set start app command
CMD ["npm", "start"]
```

---

## docker-compose.yml

```yml
version: '3'
services:
  app:
    # conainer name
    container_name: docker-node-mongo

    # always restart
    restart: always

    # build all from DockerFile
    build: .

    # port in docker container : port in ja app
    ports:
      - '80:3000'

    # connect app container with mongo container
    links:
      - mongo
  mongo:
    container_name: mongo

    # pull mongo image from dockerhub
    image: mongo
    ports:
      - '27017:27017'
```

---

## run docker compose

```bash
docker-compose up

# run in background
docker-compose up -d
```

---

## shutdown running in background

```bash
docker-compose down
```

---

## heroku docker commands

```bash
# connect to decker container
heroku container:login

# instaling images
heroku container:push web

# startup conainers
heroku ps:scale web=1

# shutdown containers
heroku ps:scale web=0

# view logs
heroku logs --tail
```

---
