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

## SHA-512 password

You need to use a Hashed password in Blag, use this command to generate the hash.
```
echo -n 'password' | sha512sum | awk '{ print $1 }'
```

Put the outputted text in the password field like this.
```
password = "1667443199c48200fa038936025f492160250babd8b0c6ba94495ea751ae76a35af7b193d5c41fcb37f487f69046c005d751e7039c0f02f1197a25c4c987c0b2"
```
