#!/bin/bash

wait=0
MONGO=mongo

if [[ -z $(docker ps | grep $MONGO) ]]; then
  docker run --name=$MONGO --rm -tid \
    -p27017:27017 mongo;
  # give db time to init
  wait=1
else
  echo "$MONGO already started, skip"
fi

# echo "wait needed: $wait"
if [[ $wait == 1 ]]; then
  echo "waiting for services"
  sleep 10;
fi