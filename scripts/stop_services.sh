#!/bin/bash

MONGO=mongo

if [[ $(docker ps | grep $MONGO) ]]; then
  docker rm -f $MONGO
else
  echo "$MONGO already stopped, skip"
fi
