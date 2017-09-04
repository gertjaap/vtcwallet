#!/bin/bash
cd frontend
ng build
rm -rf ../electron/walletui
cp -R dist ../electron/walletui
cd ../electron
npm start
