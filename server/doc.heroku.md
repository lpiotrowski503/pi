# Heroku deploy docker container

    heroku create pi-programs

    heroku login

    sudo heroku container:login

    sudo heroku container:push web --app pi-programs

    sudo heroku container:release web --app pi-programs
