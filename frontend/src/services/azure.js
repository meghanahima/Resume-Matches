import { BlobServiceClient, AnonymousCredential } from "@azure/storage-blob";
import { Buffer } from "buffer";
window.Buffer = window.Buffer || Buffer;

// export async function getAccountNameByAction(action) {

//   storageData.forEach((obj, index) => {
//     if (obj.actions.includes(action)) {
//       return obj.accountName;
//     }

//   })

//   return null;

// }

export async function getAccountNameByAction(action) {
  for (const obj of storageData) {
    if (obj.actions.includes(action)) {
      return obj.accountName;
    }
  }
  return null;
}

export async function getContainerNameByAction(action) {
  for (const obj of storageData) {
    if (obj.actions.includes(action)) {
      return obj.container;
    }
  }
  return null;
}

export async function getSasTokenByAction(action) {
  for (const obj of storageData) {
    if (obj.actions.includes(action)) {
      return obj.sasToken;
    }
  }
  return null;
}

export async function uploadFileToAzure(
  fileName,
  file
  //   { action = "profile" }
) {
  return new Promise(async (resolve, reject) => {
    if (!file) {
      console.error("No file selected");
      resolve({
        error: "No file selected",
      });
    }

    // const accountName = await getAccountNameByAction(action);
    const accountName = import.meta.env.VITE_AZURE_ACCOUNT_NAME;
    console.log("accountName:", accountName);
    const containerName = import.meta.env.VITE_AZURE_CONTAINER_NAME;
    // const containerName = await getContainerNameByAction(action);
    console.log("containerName:", containerName);

    // const sasToken = await getSasTokenByAction(action);
    const sasToken = import.meta.env.VITE_AZURE_SAS_TOKEN;
    // "sp=racw&st=2024-02-10T17:14:44Z&se=2024-12-31T01:14:44Z&sv=2022-11-02&sr=c&sig=Ot0%2FJiMkYqSPELB9huKV5P1llxS3ULeLbslW129%2BI%2F0%3D"; // valid till 31st dec 2024
    console.log("sasToken:", sasToken);

    const blobServiceClient = new BlobServiceClient(
      `https://${accountName}.blob.core.windows.net?${sasToken}`,
      new AnonymousCredential()
    );

    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobName = fileName;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    try {
      let temp = await blockBlobClient.uploadData(file);
      // console.log("Image uploaded successfully!", temp);
      // console.log(
      //   `https://${accountName}.blob.core.windows.net/${containerName}/${fileName}`
      // );

      resolve({
        // success: "Image uploaded successfully!",
        url: `https://${accountName}.blob.core.windows.net/${containerName}/${fileName}`,
        data: temp,
        success: true,
      });
    } catch (error) {
      console.error("Error uploading image:", error.message);
      resolve({
        error: "Error uploading image:",
        data: error,
        success: false,
      });
    }
  });
}

// export async function uploadFileToAzure(
//   fileName,
//   file
//   //   { action = "profile" }
// ) {
//   return new Promise(async (resolve, reject) => {
//     console.log("gelloin azue");
//     if (!file) {
//       console.error("No file selected");
//       resolve({
//         error: "No file selected",
//       });
//     }

//     const accountName = import.meta.env.VITE_AZURE_ACCOUNT_NAME;
//     const containerName = import.meta.env.VITE_AZURE_CONTAINER_NAME;
//     // const sasToken = import.meta.env.VITE_AZURE_SAS_TOKEN;

//     const blobServiceClient = new BlobServiceClient(
//       import.meta.env.VITE_BLOB_SAS_URL
//     );
//     const containerClient = blobServiceClient.getContainerClient(containerName);
//     const blockBlobClient = containerClient.getBlockBlobClient(fileName);

//     try {
//       const temp = await blockBlobClient.uploadData(file);

//       resolve({
//         url: `https://${accountName}.blob.core.windows.net/${containerName}/${fileName}`,
//         data: temp,
//         success: true,
//       });
//     } catch (error) {
//       console.error("Error uploading image:", error.message);
//       resolve({
//         error: "Error uploading image:",
//         data: error,
//         success: false,
//       });
//     }
//   });
// }
