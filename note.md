# NOTE

## pi mac

    B8:27:EB:D6:D4:11

## pi ip

    192.168.43.77

## ssh

    <!-- connect -->
    ssh pi@192.168.43.77

    <!-- disconnect -->
    ctrl + D

## scp

    <!-- files transfer -->
    scp -r ../johnny-five/ pi@192.168.43.77:Desktop/johnny-five
    scp -r ./dist pi@192.168.43.77:Desktop/johnny-five

## docker

    <!-- create and run container -->
    docker container run --privileged -d --restart always -d -p 3000:3000 --name johnny johnny-five

    <!-- open terminal in container -->
    docker container exec -it johnny bash

    <!-- stop container -->
    docker container stop johnny

    <!-- start container -->
    docker start johnny

    <!-- remove all containers -->
    docker rm $(docker ps -aq) -f

    <!-- remove all images -->
    docker rmi $(docker images -q) -f

## Pi

    raspi-soft-pwm
    raspi-gpio
    i2c-bus
    i2c-bus/build
    pigpio
    pigpio/build
    serialport/build
    serialport
    @serialport/bindings
    @serialport/bindings/build
    I2C


    "raspi-io": "10.0.2"
    "pi-io": "^1.0.0"


    libpigpio.so: cannot open shared object file: No such file or directory


    ssh pi@169.254.124.222
    ssh pi@192.168.137.41
    ssh pi@169.254.124.222
