import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";


export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const rootPath = process.env.WEBX_AWS_S3_BUCKET_PATH

  const s3 = new S3Client({
    region: 'us-east-1',
    credentials: {
      accessKeyId: process.env.WEBX_AWS_KEY,
      secretAccessKey: process.env.WEBX_AWS_SECRET_KEY,
    },
  });

  const bucketName = 'webx';
  const fileName = `sites/${Date.now()}_${body.fileName}`;

  try {
    const putObjectCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      Body: Buffer.from(body.fileContent, "base64"),
      ContentType: body.contentType,
    });

    const result = await s3.send(putObjectCommand);

    return {
      message: "File uploaded successfully",
      link: `${rootPath}/${fileName}`,
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: `S3 Upload Error: ${error.message}`,
    });
  }
});
