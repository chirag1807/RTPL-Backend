const AWS = require("aws-sdk");
const fs = require("fs");

AWS.config.update({
  accessKeyId: "your-access-key-id",
  secretAccessKey: "your-secret-access-key",
  region: "your-region", // e.g., 'us-east-1'
});

// Create an S3 instance
const s3 = new AWS.S3();

async function uploadFileToS3(bucketName, fileKey, fileData) {
    try {
      // Decode base64 data
      const fileContent = Buffer.from(fileData, 'base64');
  
      // Upload the file to S3
      const params = {
        Bucket: bucketName,
        Key: fileKey,
        Body: fileContent,
      };
  
      const result = await s3.upload(params).promise();
  
      console.log('File uploaded successfully:', result.Location);
      return result.Location;
    } catch (error) {
      console.error('Error uploading file to S3:', error);
      throw error;
    }
  }

  module.exports = uploadFileToS3;