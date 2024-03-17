/**
 * 获取字典数据
 */

import {getDictDataList} from "@/api/modules/dict";
import useDictStore from "@/stores/modules/dict";
import {Dict} from "@/typings/dict";
import {ref, toRefs} from "vue";

export function useDict(...args: string[]) {
  const res = ref<{ [key: string]: Dict.IDataItem[] }>({});
  return (() => {
    args.forEach((type, index) => {
      res.value[type] = [];
      const dicts = useDictStore().getDict(type);
      if (dicts) {
        res.value[type] = dicts;
      } else {
        getDictDataList({ type, status: "1" }).then(resp => {
          res.value[type] =
            type === "common_yes_no" ? resp.data.map(v => ({ ...v, value: v.value === "Y" ? true : false })) : resp.data;
          useDictStore().setDict(type, res.value[type]);
        });
      }
    });
    return toRefs(res.value);
  })();
}
