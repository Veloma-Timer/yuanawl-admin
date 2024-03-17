import { Dict } from "@/typings/dict";
import { isEmpty } from "@/utils/is";
import { defineStore } from "pinia";

const useDictStore = defineStore("dict", {
  state: (): { dict: { key: string; value: Dict.IDataItem[] }[] } => ({
    dict: []
  }),
  actions: {
    // 获取字典
    getDict(_key: string) {
      if (isEmpty(_key)) {
        return null;
      }
      try {
        for (let i = 0; i < this.dict.length; i++) {
          if (this.dict[i].key == _key) {
            return this.dict[i].value;
          }
        }
      } catch (e) {
        return null;
      }
    },
    // 设置字典
    setDict(_key: string, value: Dict.IDataItem[]) {
      if (!isEmpty(_key)) {
        // 判断是否存在
        const dict = this.getDict(_key);
        if (isEmpty(dict)) {
          this.dict.push({
            key: _key,
            value: value
          });
        } else {
          for (const dict of this.dict) {
            if (dict.key == _key) {
              dict.value = value;
              return;
            }
          }
        }
      }
    }
  }
});

export default useDictStore;
