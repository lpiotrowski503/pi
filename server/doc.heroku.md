# Heroku deploy docker container

    heroku create faceclone

    heroku login

    sudo heroku container:login

    sudo heroku container:push web --app faceclone

    sudo heroku container:release web --app faceclone



    heroku config:set NODE_ENV=production --app faceclone
