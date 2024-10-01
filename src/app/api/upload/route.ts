import { NextResponse } from 'next/server';
import { ShareServiceClient, StorageSharedKeyCredential, generateFileSASQueryParameters, SASProtocol, FileSASPermissions } from "@azure/storage-file-share";
import { v4 as uuidv4 } from 'uuid';

const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME!;
const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY!;
const shareName = process.env.AZURE_FILE_SHARE_NAME!;

const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);
const serviceClient = new ShareServiceClient(
  `https://${accountName}.file.core.windows.net`,
  sharedKeyCredential
);

async function ensureShareAndDirectoryExist() {
  const shareClient = serviceClient.getShareClient(shareName);
  await shareClient.createIfNotExists();
  
  const directoryClient = shareClient.getDirectoryClient("uploads");
  await directoryClient.createIfNotExists();
}

function generateSASToken(fileName: string) {
  const startsOn = new Date();
  const expiresOn = new Date(startsOn);
  expiresOn.setDate(expiresOn.getDate() + 1); // Token valid for 1 day

  const sasOptions = {
    filePath: `uploads/${fileName}`,
    shareName: shareName,
    permissions: FileSASPermissions.parse("r"), // Read permission
    startsOn: startsOn,
    expiresOn: expiresOn,
    protocol: SASProtocol.Https,
  };

  const sasToken = generateFileSASQueryParameters(sasOptions, sharedKeyCredential).toString();
  return sasToken;
}

export async function POST(request: Request) {
  try {
    await ensureShareAndDirectoryExist();

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    const shareClient = serviceClient.getShareClient(shareName);
    const directoryClient = shareClient.getDirectoryClient("uploads");
    
    const fileExtension = file.name.split(".").pop();
    const createdFileName = `${uuidv4()}.${fileExtension}`;
    
    const fileClient = directoryClient.getFileClient(createdFileName);

    const arrayBuffer = await file.arrayBuffer();

    await fileClient.uploadData(arrayBuffer, {
      rangeSize: 4 * 1024 * 1024, // 4MB range size
    });

    const sasToken = generateSASToken(createdFileName);
    const downloadURL = `${fileClient.url}?${sasToken}`;

    // Log the created file name and download link
    console.log('Created File Name:', createdFileName);
    console.log('Download URL:', downloadURL);

    return NextResponse.json({ 
      success: true, 
      downloadURL, 
      fileName: file.name,
      createdFileName: createdFileName  // Include the created file name in the response
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ success: false, error: "File upload failed", details: error }, { status: 500 });
  }
}