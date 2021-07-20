# sym-key
Test with aes-256-cbc symmetric key encryption with gzip compression

## Run
```
yarn dev
```
## Result
### Size of file:
* Source file (file.txt) = 258 bytes
* No gzip, just encrypted file = 272 bytes
* After gzip, encrypted file (file.txt.enc) = 80 bytes
* File size reduced: 30%