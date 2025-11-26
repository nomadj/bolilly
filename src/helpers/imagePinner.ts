// helpers/imagePinner.ts
import axios from "axios";
import FormData from "form-data";
import dotenv from "dotenv";

dotenv.config();

const PINATA_API_KEY = process.env.PINATA_API_KEY!;
const PINATA_SECRET_API_KEY = process.env.PINATA_SECRET_API_KEY!;

/**
 * Pins an image (browser File or Blob) to Pinata and returns its IPFS URI
 * @param file - File or Blob object (from FormData)
 * @param fileName - Optional name for the file
 * @returns IPFS URI string
 */
export async function pinImageToPinata(file: File | Blob, fileName = "upload.png"): Promise<string> {
  try {
    const url = "https://api.pinata.cloud/pinning/pinFileToIPFS";

    // Convert File/Blob to Buffer (needed in Node.js environment)
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const data = new FormData();
    data.append("file", buffer, { filename: fileName });

    const res = await axios.post(url, data, {
      maxBodyLength: Infinity,
      headers: {
        ...data.getHeaders(),
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_API_KEY,
      },
    });

    if (res.data && res.data.IpfsHash) {
      return `ipfs://${res.data.IpfsHash}`;
    } else {
      throw new Error("Pinata did not return an IPFS hash.");
    }
  } catch (error) {
    console.error("Error pinning image to Pinata:", error);
    throw error;
  }
}
