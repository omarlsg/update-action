# Update an action with given properties

[![js-standard-style](https://cdn.rawgit.com/standard/standard/master/badge.svg)](http://standardjs.com)

## Run

    node src/main -f [snapshot/labels/info] input.csv -td [update / check]
    
    ex:
    node src/main snapshot -f file.csv -td check
    node src/main labels -f file.csv -td update
    node src/main info -f file.csv -o output.csv

    - snapshot command updates all the information of the source/target of the main action and the transfer
    - labels command updates specific labels in the actions

    * update: writes in db for each row in the file
    * check: read and logs the labels/snapshot of each row in the file

## Input csv format for labels

    actionId,hash
    ff58bf85-537a-4fc3-beca-9151bdfaa108,15f1797cc457b4551472631c232e35c20fcb183e0d1a55d424a3c607d2ae50e21

    actionId,tx_ref
    ff58bf85-537a-4fc3-beca-9151bdfaa108,H6boaAPxAEiwyk4p5

    actionId,reverseInitiated
    ff58bf85-537a-4fc3-beca-9151bdfaa108,true

## Input csv format for snapshot
    transferId,actionId,[target/source]
    ocBYM3IeT6huWq7Ac,914e0e4d-a0ae-4449-acbd-830d96544a37,"{""signer"": {""handle"": ""wZW9LYsaKGuJjR4YXH3Uu28zzYxzMnkR1r"", ...}"

## Environment variables

    MYSQL_USER=
    MYSQL_PASSWORD=
    MYSQL_HOST=
    MYSQL_DATABASE=
    GCLOUD_PROJECT=
    GOOGLE_APPLICATION_CREDENTIALS=