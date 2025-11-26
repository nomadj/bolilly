import { NextResponse } from "next/server";
import { pinImageToPinata } from "@/helpers/imagePinner";
import { pinMetadataToPinata } from "@/helpers/pinataPinner";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  const metadata = JSON.parse(formData.get("metadata") as string);

  const imageUri = await pinImageToPinata(file, file.name);
  const metadataUri = await pinMetadataToPinata({ ...metadata, image: imageUri });

  return NextResponse.json({ metadataUri });
}
