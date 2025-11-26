import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_API_KEY = process.env.PINATA_SECRET_API_KEY;

/**
 * Pins metadata JSON to Pinata and returns the IPFS URI
 * @param metadata - Metadata object (name, description, image, etc.)
 * @returns IPFS URI string
 */
export async function pinMetadataToPinata(metadata: Record<string, any>): Promise<string> {
    try {
        const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;

        const res = await axios.post(url, metadata, {
            headers: {
                pinata_api_key: PINATA_API_KEY!,
                pinata_secret_api_key: PINATA_SECRET_API_KEY!,
                "Content-Type": "application/json",
            },
        });

        if (res.data && res.data.IpfsHash) {
            return `ipfs://${res.data.IpfsHash}`;
        } else {
            throw new Error("Pinata did not return an IPFS hash.");
        }
    } catch (error) {
        console.error("Error pinning metadata to Pinata:", error);
        throw error;
    }
}
