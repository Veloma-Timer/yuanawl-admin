import { Paging } from "@/typings";
import { computed, reactive } from "vue";

export const useSelectScroll = (params: any, method: Function) => {
  const options = reactive<{
    data: any[];
    params: Paging & any;
  }>({
    data: [],
    params: {
      pageNum: 1,
      pageSize: 10,
      total: 0,
      ...params
    }
  });

  const isMore = computed(() => !(options.data.length > 0 && options.params.total === options.data.length));

  const load = async () => {
    if (!isMore.value) return;

    const {
      data: { list, total }
    } = await method(options.params);

    options.data = options.data.concat(list);
    options.params.pageNum++;
    options.params.total = total!;
  };

  return {
    options,
    load
  };
};
