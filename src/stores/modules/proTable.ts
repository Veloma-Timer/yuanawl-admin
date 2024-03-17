import { defineStore } from "pinia";
import { ProTableState, ProTableColoum } from "@/stores/interface";

export const userProTableStore = defineStore({
  id: "new-pro-table",
  state: (): ProTableState => ({
    list: []
  }),
  getters: {},
  actions: {
    setProTableState(routeName: string, state: ProTableColoum[]) {
      try {
        let currentIndex = this.list.findIndex((item: any) => item.key === routeName);
        if (currentIndex >= 0) {
          this.list[currentIndex].key = routeName;
          this.list[currentIndex].value = state;
        } else {
          this.list.push({
            key: routeName,
            value: state
          });
        }
      } catch (error) {
        console.log("setProTableStateError", error);
      }
    }
  },
  persist: {
    key: "new-pro-table", //设置存储的key
    storage: localStorage //表示存储在localStorage
  }
});
