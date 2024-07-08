import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(
  req: NextRequest,
  { params }: { params: { language: string } },
) {
  const { language } = params;
  const templatePath = path.resolve(
    process.cwd(),
    "../base_templates",
    language,
  );

  console.log(`Request received for language: ${language}`);
  console.log(`Checking path: ${templatePath}`);

  if (fs.existsSync(templatePath)) {
    const files = fs.readdirSync(templatePath).reduce(
      (acc, file) => {
        acc[file] = fs.readFileSync(path.join(templatePath, file), "utf8");
        return acc;
      },
      {} as { [key: string]: string },
    );

    console.log(`Files found: ${Object.keys(files).join(", ")}`);
    return NextResponse.json(files);
  } else {
    console.error(`Invalid language: ${language}`);
    return NextResponse.json({ error: "Invalid language" }, { status: 400 });
  }
}
