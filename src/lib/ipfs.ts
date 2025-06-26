import { Web3Storage } from "web3.storage";

export const storeSubmission = async (data: {
  description: string;
  files: File[];
}) => {
  const client = new Web3Storage({ token: process.env.WEB3_STORAGE_TOKEN! });
  const cid = await client.put(data.files);
  return `ipfs://${cid}/metadata.json`;
};
