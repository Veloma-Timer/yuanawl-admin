import { defineStore } from "pinia";
import { UserState } from "@/stores/interface";
import piniaPersistConfig from "@/config/piniaPersist";

export const useUserStore = defineStore({
  id: "user",
  state: (): UserState => ({
    token: "",
    userInfo: {} as UserState["userInfo"]
  }),
  getters: {},
  actions: {
    // Set Token
    setToken(token: string) {
      this.token = `Bearer ${token}`;
    },
    cleanToken() {
      this.token = "";
      this.userInfo = {} as UserState["userInfo"];
    },
    // Set setUserInfo
    setUserInfo(userInfo: UserState["userInfo"]) {
      this.userInfo = userInfo;
    }
  },
  persist: piniaPersistConfig("user")
});
