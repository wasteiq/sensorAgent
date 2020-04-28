# sensorAgent
Reads GPS data, using gpsd, and streams Arduino values from serial line - then transfers all to WasteIQ.

## Hardware

* Raspberry PI or other MicroPC
* USB based GPS
* Arduino with accoustic sensor, and the sketch in this project
* A wifi router (mobile broadband)


## ENV

`WIQ_ACCESS_POINT_ID=5dbc1858d907e062b12593e3` - Access point to target in WIQ
`VENDOR_STATUS_API_URL=https://track.bossmyapi.xyz/vendorstatusgraphql` - URL of WIQ's streaming service, which must have the audience key installed. 

## Making keys

```
ssh-keygen -t rsa -b 4096 -m PEM -f jwtRS256.key

Rename and overwrite the file in the `keys` folder with this private key, jwtRS256.key.

# No passphrase!
openssl rsa -in jwtRS256.key -pubout -outform PEM -out jwtRS256.key.pub
```
Then give the public key to WasteIQ for install in the services.

## Deployment Framework

Test balena.io? A tool for deploying to edge machines, Raspberry Pi and Jetson.
