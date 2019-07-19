# code injection
sed -i -e $'s/var randomBytes = require(\'randombytes\')*/var randomBytes = require(\'crypto\').randomBytes/g' ./node_modules/bip39/index.js
