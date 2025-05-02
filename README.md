

## Description
A housing reviewing app--The backend(REST API)

## For Docker Image
```bash
# build docker image
$ docker build -t my-image-name:tag .

# To run docker image in background
$ docker run -d -p 8080:80 --name my-container my-image-name:tag

# To run the image and add environmental variables
$ docker run -d -p 8080:80 --name my-container -e VAR1=value1 -e VAR2=value2 my-image-name:tag
# check .env.example file to see the structure of the variables
```

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```




## Stay in touch

- Twitter - [@Toluwanimi](https://twitter.com/p_lurd)

