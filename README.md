# Project Setup

Welcome to the project! Follow the instructions below to get started quickly.

## Prerequisites

- Make sure you're using **Node.js > 18**.

## Installation

1. Clone the repository or download the project files.
2. Install dependencies:
   ```bash
   npm install
   ```

## Configuration

1. In the root directory of the project, create a `.env` file.
2. Define the following environment variables in your `.env` file:

   ```env
   WEBX_AWS_KEY=<your-aws-access-key-id>
   WEBX_AWS_SECRET_KEY=<your-aws-secret-access-key>
   WEBX_AWS_S3_BUCKET_PATH=<your-s3-bucket-path>
   ```

## Example Code

The project uses the AWS S3 client for storage. Here's an example configuration:

```javascript
const s3 = new S3Client({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});
```

## That's It!

You're all set up! Run the project, and have fun 🚀
