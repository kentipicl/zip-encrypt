const crypto = require('crypto');
const fs = require('fs');
const path = require('path')
const zlib = require('zlib');
const { pipeline } = require('stream');

const algorithm = 'aes-256-cbc';
const gz = zlib.createGzip();

// input file
const srcFile = 'file.txt'
const srcPath = path.join(__dirname, srcFile)
const gzPath = srcPath + '.gz'
const encPath = srcPath + '.enc'
const decGzPath = srcPath + '.dec.gz'
const decPath = srcPath + '.dec.txt'

const password = 'sym-key'
const salt = 'abcd'
const key = crypto.scryptSync(password, salt, 32)
const iv = Buffer.alloc(16, 0)

const gunzip = (file) => {
    writeStream = fs.createWriteStream(file.decPath)

    readStream = fs.createReadStream(file.decGzPath)
    readStream.pipe(zlib.createGunzip()).pipe(writeStream);

    console.log('Unzip succeeded');
}

const decrypt = (file) => {
    decipher = crypto.createDecipheriv(algorithm, key, iv)
    writeStream = fs.createWriteStream(file.decGzPath)

    readStream = fs.createReadStream(file.encPath)
    readStream.on('data', (chunk) => {
        writeStream.write(decipher.update(chunk))
    }).on('end', () => {
        writeStream.write(decipher.final())
        writeStream.end()

        console.log('Decrypt succeeded');

        gunzip({
            decGzPath: file.decGzPath,
            decPath: file.decPath
        })
    })
}

const encrypt = (file) => {
    cipher = crypto.createCipheriv(algorithm, key, iv)
    let writeStream = fs.createWriteStream(file.encPath)

    let readStream = fs.createReadStream(file.srcPath)
    readStream.on('data', (chunk) => {
        writeStream.write(cipher.update(chunk))
    }).on('end', () => {
        writeStream.write(cipher.final())
        writeStream.end()

        console.log('Encrypt succeeded');

        decrypt(file)
    })
}

const gzip = (file) => {
    pipeline(
        fs.createReadStream(file.srcPath),
        zlib.createGzip(),
        fs.createWriteStream(file.gzPath),
        (err) => {
            if (err) {
                console.error('Gzip failed', err);
            } else {
                console.log('Gzip succeeded');

                encrypt({
                    srcPath: gzPath,
                    encPath: encPath,
                    decGzPath: decGzPath,
                    decPath: decPath
                })
            }
        }
    );
}

gzip({
    srcPath: srcPath,
    gzPath: gzPath
})
