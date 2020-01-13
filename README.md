# sensorAgent
Read GPS data, using gpsd, and streams readings on serial line - then transfers all to WasteIQ.


## ENV

`WIQ_ACCESS_POINT_ID=5dbc1858d907e062b12593e3` - Access point to target in WIQ
`VENDOR_STATUS_API_URL=https://track.bossmyapi.xyz/vendorstatusgraphql` - URL of WIQ's streaming service, which must have the audience key installed. 

## Making keys

```
ssh-keygen -t rsa -b 4096 -m PEM -f jwtRS256.key
# No passphrase!
openssl rsa -in jwtRS256.key -pubout -outform PEM -out jwtRS256.key.pub
```

## Deployment Framework

Test balena.io? A tool for deploying to edge machines, Raspberry Pi and Jetson.