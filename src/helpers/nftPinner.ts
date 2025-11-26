// helpers/nftPinner.ts
import { pinImageToPinata } from "./imagePinner";
import { pinMetadataToPinata } from "./pinataPinner";

/**
 * NFT metadata type
 */
export interface NFTMetadata {
  name: string;
  description: string;
  image?: string; // will be filled in by nftPinner
  [key: string]: string | number | boolean | undefined; // allow extra optional fields
}

/**
 * Pins an image and metadata to Pinata, then returns the metadata URI
 * @param file - File or Blob object (e.g. from formData)
 * @param metadata - NFT metadata object excluding the image field
 * @returns Metadata IPFS URI
 */
export async function nftPinner(
  file: File | Blob,
  metadata: NFTMetadata
): Promise<string> {
  try {
    // 1️⃣ Pin the image
    const imageName = file instanceof File ? file.name : "upload.png";
    const imageUri = await pinImageToPinata(file, imageName);
    console.log("Image pinned at:", imageUri);

    // 2️⃣ Add image URI to metadata
    const fullMetadata: NFTMetadata = { ...metadata, image: imageUri };

    // 3️⃣ Pin the metadata
    const metadataUri = await pinMetadataToPinata(fullMetadata);
    console.log("Metadata pinned at:", metadataUri);

    return metadataUri;
  } catch (error) {
    console.error("Error in nftPinner:", error);
    throw error;
  }
}
