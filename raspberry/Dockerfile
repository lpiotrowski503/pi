FROM balenalib/raspberrypi3-node:11

# ENV container docker

# RUN apt-get update && apt-get install -y --no-install-recommends \
#     systemd \
#     && rm -rf /var/lib/apt/lists/*

# RUN systemctl mask \
#     dev-hugepages.mount \
#     sys-fs-fuse-connections.mount \
#     sys-kernel-config.mount \

#     display-manager.service \
#     getty@.service \
#     systemd-logind.service \
#     systemd-remount-fs.service \

#     getty.target \
#     graphical.target

WORKDIR /usr/src/app

COPY . .

RUN npm install

# RUN sudo npm install pi-io

# RUN npm install 

# RUN cd node_modules/pi-io && ls -la && cd .. && cd ..

# ENV UDEV=1

# EXPOSE 3000

# RUN sudo su

# RUN sudo npm start

CMD ["npm", "start"]