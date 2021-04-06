#!/bin/bash
cd /home/ec2-user/MUJI_MOCK;
git reset --hard;
git pull;
npm ci;
pm2 restart 0;