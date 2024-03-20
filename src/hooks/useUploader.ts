import { uploadBase64ImgOss, uploadStreamImgOss } from "@/api/modules/upload";
// import { fs, dialog } from "@tauri-apps/api";

function uint8ArrayToBase64(array: Uint8Array) {
  let binary = "";
  for (let i = 0; i < array.length; i++) {
    binary += String.fromCharCode(array[i]);
  }
  return btoa(binary);
}

const useUploader = () => {
  const uploadBase64 = async () => {
    // const filepath = await dialog.open({
    //   multiple: false,
    //   title: "选择文件"
    // });

    // const fileContent = await fs.readBinaryFile(filepath as string);

    // const base64 = `data:image/jpeg;base64,${uint8ArrayToBase64(fileContent)}`;

    // return await uploadBase64ImgOss(base64);
  };

  const uploadStream = async (type: 'img' | 'sheet' | 'all' = 'all') => {
    const { path, data } = await window.osApi.openFile({ type });

    if (!data) {
      return { data: { 'fileName': '' }, blobUrl: '' }
    }

    const blob = new Blob([data], { type: "application/octet-stream" });

    const blobUrl = URL.createObjectURL(blob);

    return { data: (await uploadStreamImgOss(blob)).data, blobUrl: blobUrl, path };
  };

  return { uploadBase64, uploadStream };
};

export default useUploader;
