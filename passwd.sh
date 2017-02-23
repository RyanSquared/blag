echo -n "Password: "
stty -echo echonl
read passwd
stty echo
echo -n "sha512: "
echo -n "$passwd" | sha512sum | awk '{ print $1  }'

