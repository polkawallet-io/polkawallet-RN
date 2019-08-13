# code injection
sed -i -e $'s/var randomBytes = require(\'randombytes\')*/var randomBytes = require(\'crypto\').randomBytes/g' ./node_modules/bip39/index.js

# add extra memory to node env
sed -i -e $'s/NODE_ARGS=""/NODE_ARGS="--max_old_space_size=4096"/g' ./node_modules/react-native/scripts/react-native-xcode.sh
