#!/bin/bash
cd /home/ec2-user/MUJI_MOCK;
git reset --hard;
git pull;
cd /home/ec2-user/MUJI_MOCK/server;
npm install;
pm2 restart ecosystem.config.js --env production;