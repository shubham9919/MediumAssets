"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const util = require('util');
const client_s3_1 = require("@aws-sdk/client-s3");
async function uploadToS3() {
    try {
        // await multiPartUploadToS3()
        // await blockingIoUpload()
        // nonBlockingIoUpload()
        // console.log('uploadToS3 function ends here.')
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}
/**
 * @description This fn uploads the file to s3 in blocking mode
 *
 */
async function blockingIoUpload() {
    try {
        const startTime = performance.now();
        const readable_chunks = fs_1.default.createReadStream('../large');
        const fileContent = fs_1.default.readFileSync('../large');
        const s3 = new aws_sdk_1.default.S3();
        const params = {
            Bucket: 'medium-demo-shubham',
            Key: 'video.mp4',
            Body: fileContent,
        };
        const upload = s3.upload(params);
        const myPromise = util.promisify(s3.upload.bind(s3));
        await myPromise(params);
        const endTime = performance.now(); // End time of the upload process
        const totalDuration = endTime - startTime; // Total duration of upload process in milliseconds
        console.log(`blockingIoUpload Upload complete in ${totalDuration}ms`);
        console.log('This operation was blocking.. s3 upload done now.');
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}
/**
 * @description This fn uploads the file to s3 in non blocking mode
 *
 */
function nonBlockingIoUpload() {
    try {
        const startTime = performance.now();
        const readable_chunks = fs_1.default.createReadStream('../large');
        const s3 = new aws_sdk_1.default.S3();
        const params = {
            Bucket: 'medium-demo-shubham',
            Key: 'video.mp4',
            Body: readable_chunks,
        };
        const upload = s3.upload(params);
        upload.on('httpUploadProgress', function (progress) {
            // console.log(`Uploaded ${progress.loaded} bytes`);
        });
        upload.send((err, data) => {
            if (err)
                console.error('Error uploading file:', err);
            else {
                console.log('File uploaded successfully:', data.Location);
                const endTime = performance.now(); // End time of the upload process
                const totalDuration = endTime - startTime; // Total duration of upload process in milliseconds
                console.log(`blockingIoUpload Upload complete in ${totalDuration}ms`);
            }
        });
        console.log('This operation is non blocking.. s3 upload is going on.');
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}
/**
 * @description This fn uploads the file to s3 in multipart upload mode
 *
 */
async function multiPartUploadToS3() {
    const GB = 1024 * 1024 * 1024;
    const CHUNK_SIZE = 5 * GB; // 5 GB per part (maximum part size allowed by S3)
    const s3Client = new client_s3_1.S3Client({ region: 'us-west-1' });
    const bucketName = "medium-demo-shubham";
    const key = "large";
    const filePath = "../large";
    const fileStats = fs_1.default.statSync(filePath);
    const fileSize = fileStats.size;
    let uploadId;
    try {
        const startTime = performance.now();
        const multipartUpload = await s3Client.send(new client_s3_1.CreateMultipartUploadCommand({
            Bucket: bucketName,
            Key: key,
        }));
        uploadId = multipartUpload.UploadId;
        const numParts = Math.ceil(fileSize / CHUNK_SIZE);
        const uploadPromises = [];
        // Upload each part
        let filePosition = 0;
        for (let i = 0; i < numParts; i++) {
            const partSize = Math.min(CHUNK_SIZE, fileSize - filePosition);
            const partParams = {
                Bucket: bucketName,
                Key: key,
                UploadId: uploadId,
                PartNumber: i + 1,
                Body: fs_1.default.createReadStream(filePath, {
                    start: filePosition,
                    end: filePosition + partSize - 1,
                }),
                ContentLength: partSize,
            };
            uploadPromises.push(s3Client
                .send(new client_s3_1.UploadPartCommand(partParams))
                .then((data) => {
                return {
                    PartNumber: i + 1,
                    ETag: data.ETag,
                };
            }));
            filePosition += partSize;
        }
        // Wait for all parts to finish uploading
        const uploadResults = await Promise.all(uploadPromises);
        // Complete the multipart upload
        await s3Client.send(new client_s3_1.CompleteMultipartUploadCommand({
            Bucket: bucketName,
            Key: key,
            UploadId: uploadId,
            MultipartUpload: {
                Parts: uploadResults,
            },
        }));
        const endTime = performance.now(); // End time of the upload process
        const totalDuration = endTime - startTime; // Total duration of upload process in milliseconds
        console.log(`Multipart Upload complete in ${totalDuration}ms`);
    }
    catch (err) {
        console.error(err);
        if (uploadId) {
            await s3Client.send(new client_s3_1.AbortMultipartUploadCommand({
                Bucket: bucketName,
                Key: key,
                UploadId: uploadId,
            }));
            console.log("Multipart upload aborted.");
        }
    }
}
(async () => {
    await uploadToS3();
})();
