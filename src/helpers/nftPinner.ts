// helpers/nftPinner.ts
import { pinImageToPinata } from "./imagePinner";
import { pinMetadataToPinata } from "./pinataPinner";

/**
 * Pins an image and metadata to Pinata, then returns the metadata URI
 * @param file - File or Blob object (e.g. from formData)
 * @param metadata - Metadata object excluding the image field
 * @returns Metadata IPFS URI
 */
export async function nftPinner(
  file: File | Blob,
  metadata: Record<string, any>
): Promise<string> {
  try {
    // 1️⃣ Pin the image
    const imageUri = await pinImageToPinata(file, (file as File).name || "upload.png");
    console.log("Image pinned at:", imageUri);

    // 2️⃣ Add image URI to metadata
    metadata.image = imageUri;

    // 3️⃣ Pin the metadata
    const metadataUri = await pinMetadataToPinata(metadata);
    console.log("Metadata pinned at:", metadataUri);

    return metadataUri;
  } catch (error) {
    console.error("Error in nftPinner:", error);
    throw error;
  }
}
