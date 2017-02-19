#!/bin/bash

cd ..

git fetch --all
git reset --hard origin/master

cnpm i 

npm run start
