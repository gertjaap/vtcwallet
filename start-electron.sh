#!/bin/bash
cd frontend
npm run build:dev
rm -rf ../electron/walletui
cp -R dist ../electron/dist
mv ../electron/dist ../electron/walletui
cd ../electron
npm start
