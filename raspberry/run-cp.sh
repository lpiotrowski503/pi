#!/bin/bash

# "cp": "scp -r ./app pi@192.168.43.77:Desktop/johnny-five",
# "cp-all": "scp -r ../johnny-five pi@192.168.43.77:Desktop/",
# "cp-all-2": "rsync -av --progress --exclude node_modules ../johnny-five ../buffor",
# "cp-all-3": "find . -type f -not -iname './node_modules/*' -exec cp '{}' '/buffor/{}' ';'",

# wifi ip
scp -r ./app pi@192.168.43.77:Desktop/raspberry
scp -r ./Dockerfile pi@192.168.43.77:Desktop/raspberry
scp -r ./package.json pi@192.168.43.77:Desktop/raspberry
scp -r ./run-cp-all.sh pi@192.168.43.77:Desktop/raspberry
scp -r ./run-cp.sh pi@192.168.43.77:Desktop/raspberry
scp -r ./tsconfig.json pi@192.168.43.77:Desktop/raspberry

# lan ip
# scp -r ./app pi@192.168.137.41:Desktop/raspberry
# scp -r ./Dockerfile pi@192.168.137.41:Desktop/raspberry
# scp -r ./package.json pi@192.168.137.41:Desktop/raspberry
# scp -r ./run-cp-all.sh pi@192.168.137.41:Desktop/raspberry
# scp -r ./run-cp.sh pi@192.168.137.41:Desktop/raspberry
# scp -r ./tsconfig.json pi@192.168.137.41:Desktop/raspberry