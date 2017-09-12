#!/bin/bash
cd frontend
ng build
rm -rf ../mobile/www
cp -R dist ../mobile/www
cd ../mobile
cordova run ios
