# code injection
sed -i -e $'s/var randomBytes = require(\'randomBytes\')*/var randomBytes = require(\'crypto\').randomBytes/g' ./node_modules/bip39/index.js

# hack
./node_modules/.bin/rn-nodeify --hack --install
