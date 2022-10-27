const pkgcloud = require('pkgcloud');
const fs = require('fs');
const tempDir = './tmp';
const container = 'DewContainer';
let client = null;
const logger = require(global.appRoot + '/app/log');

//Upload fpr package clound envi creation
const createClient = () => {
    if (client) return;
    try {
        pkgcloud.providers.filesystem = {};
        pkgcloud.providers.filesystem.storage = require('filesystem-storage-pkgcloud');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir);
        }
        var containerDir = tempDir + '/' + container;
        if (!fs.existsSync(containerDir)) {
            fs.mkdirSync(containerDir);
        }
        client = pkgcloud.storage.createClient({
            provider: 'filesystem',
            root: tempDir
        });
    } catch (error) {
        logger.error(error);
    }
};

//Upload fpr Camera captured filea
const uploadCameraImage = (multerFile) => {
    try {
        createClient();
        var milliseconds = new Date().getTime();
        var imagename = milliseconds + ".jpg";

        var imageBuffer = Buffer.from(multerFile.file, 'base64');

        var writeStream = client.upload({
            container: container, //'a-container',
            remote: imagename //'remote-file-name.txt'

        });
        fs.writeFile(writeStream.path, imageBuffer, (err) => {
            return Promise.resolve(imagename)
        });
    } catch (err) {
        return Promise.reject(err);
    }
};

//Upload a file
const uploadFile = async (multerFile) => {
    return new Promise(function (resolve, reject) {
        try {
            createClient();
            //var readStream = fs.createReadStream('a-file.txt');
            var readStream = fs.createReadStream(multerFile.path);
            var writeStream = client.upload({
                container: container, //'a-container',
                remote: multerFile.filename //'remote-file-name.txt'
            });
            writeStream.on('error', (err) => {
                reject(err);
            });
            writeStream.on('success', (file) => {
                readStream.destroy();
                resolve(file);
            });
            readStream.on('close', (err) => {
                fs.unlink(multerFile.path, (err) => {
                });
            });
            readStream.pipe(writeStream);
        }
        catch (err) {
            return Promise.reject(err);
        }
    });
};

//Download a file
var downloadFile = (req, res, remoteFileName) => {
    try {
        createClient();
        client.download({
            container: container,
            remote: remoteFileName
        }).pipe(res);
    }
    catch (err) {
        return Promise.reject(err);
    }
};

module.exports = { uploadFile, downloadFile, uploadCameraImage };
