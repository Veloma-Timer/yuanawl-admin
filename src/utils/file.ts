import {useDateFormat} from "@vueuse/core";

export const saveFile = async (res: any, filename: string) => {



  let data = res;

  const isBuffer = res.type === 'Buffer'

  if (res.data) {
    data = res.data;
  }

  let blob;

  if (isBuffer) {
    const uInt8Array = new Uint8Array(data); //先将返回的二进制数组转化为js的二进制数组
    blob = new Blob([uInt8Array], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }); //然后创建blob对象，文件类型设置为excel的类型
  } else {
    blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }); //然后创建blob对象，文件类型设置为excel的类型
  }

  const blobUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = filename + '.xlsx';
  link.style.display = 'none';
  link.href = blobUrl;
  // 触发点击
  document.body.appendChild(link);
  link.click();
  // 移除
  document.body.removeChild(link);
};

