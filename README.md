# blag
A blog

## Running

```sh
pip3 install -r requirements.txt
python3 -m blag
```

## Self-signed certificate verification

Please note that this is not the best way to enable TLS on a local copy of the
software but this is the easiest way to do so without CA verification.

```sh
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365
```
