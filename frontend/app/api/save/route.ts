import { NextRequest, NextResponse } from "next/server";
import AWS from "aws-sdk";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION,
});

export async function POST(req: NextRequest) {
  const { code, filename } = await req.json();
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: filename,
    Body: code,
  };

  try {
    await s3.upload(params).promise();
    return NextResponse.json({ message: "Code saved!" });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 },
    );
  }
}
