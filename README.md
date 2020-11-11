# Update an action with given properties

[![js-standard-style](https://cdn.rawgit.com/standard/standard/master/badge.svg)](http://standardjs.com)

## Run

    ./src/main.js -f input.csv -td [update / check]
    
    ex:
    node src/main -f file.csv -td check

    * update: writes the hash for each actionId in the file
    * check: read and logs the hash of each actionId in the file

## Input csv format

    actionId,hash
    ff58bf85-537a-4fc3-beca-9151bdfaa108,15f1797cc457b4551472631c232e35c20fcb183e0d1a55d424a3c607d2ae50e21

## Environment variables

    MYSQL_USER=
    MYSQL_PASSWORD=
    MYSQL_HOST=
    MYSQL_DATABASE=
