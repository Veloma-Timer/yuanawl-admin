"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args) {
    const [channel, listener] = args;
    electron.ipcRenderer.on(channel, (event, ...args2) => listener(event, ...args2));
  },
  off(...args) {
    const [channel, ...omit] = args;
    electron.ipcRenderer.off(channel, ...omit);
  },
  send(...args) {
    const [channel, ...omit] = args;
    electron.ipcRenderer.send(channel, ...omit);
  },
  invoke(...args) {
    const [channel, ...omit] = args;
    electron.ipcRenderer.invoke(channel, ...omit);
  }
  // You can expose other APTs you need here.
  // ...
});
electron.contextBridge.exposeInMainWorld("osApi", {
  sendNotification: (params) => electron.ipcRenderer.invoke("notification", params),
  watchNotification: (callback) => electron.ipcRenderer.on("return-notification", (_, value) => callback(value)),
  openUrl: (url) => electron.ipcRenderer.invoke("open-url", url),
  watchMacAddress: (callback) => electron.ipcRenderer.on("mac-address", (_, value) => callback(value)),
  ready: () => electron.ipcRenderer.invoke("ready"),
  loading: () => appendLoading(),
  done: () => removeLoading()
});
function domReady(condition = ["complete", "interactive"]) {
  return new Promise((resolve) => {
    if (condition.includes(document.readyState)) {
      resolve(true);
    } else {
      document.addEventListener("readystatechange", () => {
        if (condition.includes(document.readyState)) {
          resolve(true);
        }
      });
    }
  });
}
const safeDOM = {
  append(parent, child) {
    if (!Array.from(parent.children).find((e) => e === child)) {
      return parent.appendChild(child);
    }
  },
  remove(parent, child) {
    if (Array.from(parent.children).find((e) => e === child)) {
      return parent.removeChild(child);
    }
  }
};
function useLoading() {
  const className = `loaders-css__square-spin`;
  const styleContent = `
@keyframes square-spin {
  25% { transform: perspective(100px) rotateX(180deg) rotateY(0); }
  50% { transform: perspective(100px) rotateX(180deg) rotateY(180deg); }
  75% { transform: perspective(100px) rotateX(0) rotateY(180deg); }
  100% { transform: perspective(100px) rotateX(0) rotateY(0); }
}
.${className} > div {
  animation-fill-mode: both;
  width: 50px;
  height: 50px;
  background: #fff;
  border-radius: 4px;
  animation: square-spin 3s 0s cubic-bezier(0.09, 0.57, 0.49, 0.9) infinite;
}
.app-loading-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #282c34;
  z-index: 9;
}
    `;
  const oStyle = document.createElement("style");
  const oDiv = document.createElement("div");
  oStyle.id = "app-loading-style";
  oStyle.innerHTML = styleContent;
  oDiv.className = "app-loading-wrap";
  oDiv.innerHTML = `<div class="${className}"><div><img src="../../src/assets/images/logo-small.png" style="width:100%; height: 100%;" alt="元阿网络"></div></div>`;
  return {
    appendLoading() {
      safeDOM.append(document.head, oStyle);
      safeDOM.append(document.body, oDiv);
    },
    removeLoading() {
      safeDOM.remove(document.head, oStyle);
      safeDOM.remove(document.body, oDiv);
    }
  };
}
const { appendLoading, removeLoading } = useLoading();
domReady().then(appendLoading);
window.onmessage = (ev) => {
  ev.data.payload === "removeLoading" && removeLoading();
};
setTimeout(removeLoading, 4999);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uLy4uL2VsZWN0cm9uL3ByZWxvYWQvaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtjb250ZXh0QnJpZGdlLCBpcGNSZW5kZXJlcn0gZnJvbSAnZWxlY3Ryb24nO1xuXG4vLyAtLS0tLS0tLS0gRXhwb3NlIHNvbWUgQVBJIHRvIHRoZSBSZW5kZXJlciBwcm9jZXNzIC0tLS0tLS0tLVxuY29udGV4dEJyaWRnZS5leHBvc2VJbk1haW5Xb3JsZCgnaXBjUmVuZGVyZXInLCB7XG4gIG9uKC4uLmFyZ3M6IFBhcmFtZXRlcnM8dHlwZW9mIGlwY1JlbmRlcmVyLm9uPikge1xuICAgIGNvbnN0IFtjaGFubmVsLCBsaXN0ZW5lcl0gPSBhcmdzXG4gICAgaXBjUmVuZGVyZXIub24oY2hhbm5lbCwgKGV2ZW50LCAuLi5hcmdzKSA9PiBsaXN0ZW5lcihldmVudCwgLi4uYXJncykpXG4gIH0sXG4gIG9mZiguLi5hcmdzOiBQYXJhbWV0ZXJzPHR5cGVvZiBpcGNSZW5kZXJlci5vZmY+KSB7XG4gICAgY29uc3QgW2NoYW5uZWwsIC4uLm9taXRdID0gYXJnc1xuICAgIGlwY1JlbmRlcmVyLm9mZihjaGFubmVsLCAuLi5vbWl0KVxuICB9LFxuICBzZW5kKC4uLmFyZ3M6IFBhcmFtZXRlcnM8dHlwZW9mIGlwY1JlbmRlcmVyLnNlbmQ+KSB7XG4gICAgY29uc3QgW2NoYW5uZWwsIC4uLm9taXRdID0gYXJnc1xuICAgIGlwY1JlbmRlcmVyLnNlbmQoY2hhbm5lbCwgLi4ub21pdClcbiAgfSxcbiAgaW52b2tlKC4uLmFyZ3M6IFBhcmFtZXRlcnM8dHlwZW9mIGlwY1JlbmRlcmVyLmludm9rZT4pIHtcbiAgICBjb25zdCBbY2hhbm5lbCwgLi4ub21pdF0gPSBhcmdzXG4gICAgaXBjUmVuZGVyZXIuaW52b2tlKGNoYW5uZWwsIC4uLm9taXQpXG4gIH0sXG5cbiAgLy8gWW91IGNhbiBleHBvc2Ugb3RoZXIgQVBUcyB5b3UgbmVlZCBoZXJlLlxuICAvLyAuLi5cbn0pXG5cblxuY29udGV4dEJyaWRnZS5leHBvc2VJbk1haW5Xb3JsZCgnb3NBcGknLCB7XG4gIHNlbmROb3RpZmljYXRpb246IChwYXJhbXM6IE5vdGlmaWNhdGlvblBhcmFtcykgPT4gaXBjUmVuZGVyZXIuaW52b2tlKCdub3RpZmljYXRpb24nLCBwYXJhbXMpLFxuICB3YXRjaE5vdGlmaWNhdGlvbjogKGNhbGxiYWNrOiBGdW5jdGlvbikgPT4gaXBjUmVuZGVyZXIub24oJ3JldHVybi1ub3RpZmljYXRpb24nLCAoXywgdmFsdWU6IE5vdGlmaWNhdGlvblBhcmFtcykgPT4gY2FsbGJhY2sodmFsdWUpKSxcbiAgb3BlblVybDogKHVybDogc3RyaW5nKSA9PiBpcGNSZW5kZXJlci5pbnZva2UoJ29wZW4tdXJsJywgdXJsKSxcbiAgd2F0Y2hNYWNBZGRyZXNzOiAoY2FsbGJhY2s6IEZ1bmN0aW9uKSA9PiBpcGNSZW5kZXJlci5vbignbWFjLWFkZHJlc3MnLCAoXywgdmFsdWU6IHN0cmluZykgPT4gY2FsbGJhY2sodmFsdWUpKSxcbiAgcmVhZHk6ICgpID0+IGlwY1JlbmRlcmVyLmludm9rZSgncmVhZHknKSxcbiAgbG9hZGluZzogKCkgPT4gYXBwZW5kTG9hZGluZygpLFxuICBkb25lOiAoKSA9PiByZW1vdmVMb2FkaW5nKClcbn0pO1xuXG4vLyAtLS0tLS0tLS0gUHJlbG9hZCBzY3JpcHRzIGxvYWRpbmcgLS0tLS0tLS0tXG5mdW5jdGlvbiBkb21SZWFkeShjb25kaXRpb246IERvY3VtZW50UmVhZHlTdGF0ZVtdID0gWydjb21wbGV0ZScsICdpbnRlcmFjdGl2ZSddKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgIGlmIChjb25kaXRpb24uaW5jbHVkZXMoZG9jdW1lbnQucmVhZHlTdGF0ZSkpIHtcbiAgICAgIHJlc29sdmUodHJ1ZSlcbiAgICB9IGVsc2Uge1xuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigncmVhZHlzdGF0ZWNoYW5nZScsICgpID0+IHtcbiAgICAgICAgaWYgKGNvbmRpdGlvbi5pbmNsdWRlcyhkb2N1bWVudC5yZWFkeVN0YXRlKSkge1xuICAgICAgICAgIHJlc29sdmUodHJ1ZSlcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG4gIH0pXG59XG5cbmNvbnN0IHNhZmVET00gPSB7XG4gIGFwcGVuZChwYXJlbnQ6IEhUTUxFbGVtZW50LCBjaGlsZDogSFRNTEVsZW1lbnQpIHtcbiAgICBpZiAoIUFycmF5LmZyb20ocGFyZW50LmNoaWxkcmVuKS5maW5kKGUgPT4gZSA9PT0gY2hpbGQpKSB7XG4gICAgICByZXR1cm4gcGFyZW50LmFwcGVuZENoaWxkKGNoaWxkKVxuICAgIH1cbiAgfSxcbiAgcmVtb3ZlKHBhcmVudDogSFRNTEVsZW1lbnQsIGNoaWxkOiBIVE1MRWxlbWVudCkge1xuICAgIGlmIChBcnJheS5mcm9tKHBhcmVudC5jaGlsZHJlbikuZmluZChlID0+IGUgPT09IGNoaWxkKSkge1xuICAgICAgcmV0dXJuIHBhcmVudC5yZW1vdmVDaGlsZChjaGlsZClcbiAgICB9XG4gIH0sXG59XG5cbi8qKlxuICogaHR0cHM6Ly90b2JpYXNhaGxpbi5jb20vc3BpbmtpdFxuICogaHR0cHM6Ly9jb25ub3JhdGhlcnRvbi5jb20vbG9hZGVyc1xuICogaHR0cHM6Ly9wcm9qZWN0cy5sdWtlaGFhcy5tZS9jc3MtbG9hZGVyc1xuICogaHR0cHM6Ly9tYXRlamt1c3RlYy5naXRodWIuaW8vU3BpblRoYXRTaGl0XG4gKi9cbmZ1bmN0aW9uIHVzZUxvYWRpbmcoKSB7XG4gIGNvbnN0IGNsYXNzTmFtZSA9IGBsb2FkZXJzLWNzc19fc3F1YXJlLXNwaW5gXG4gIGNvbnN0IHN0eWxlQ29udGVudCA9IGBcbkBrZXlmcmFtZXMgc3F1YXJlLXNwaW4ge1xuICAyNSUgeyB0cmFuc2Zvcm06IHBlcnNwZWN0aXZlKDEwMHB4KSByb3RhdGVYKDE4MGRlZykgcm90YXRlWSgwKTsgfVxuICA1MCUgeyB0cmFuc2Zvcm06IHBlcnNwZWN0aXZlKDEwMHB4KSByb3RhdGVYKDE4MGRlZykgcm90YXRlWSgxODBkZWcpOyB9XG4gIDc1JSB7IHRyYW5zZm9ybTogcGVyc3BlY3RpdmUoMTAwcHgpIHJvdGF0ZVgoMCkgcm90YXRlWSgxODBkZWcpOyB9XG4gIDEwMCUgeyB0cmFuc2Zvcm06IHBlcnNwZWN0aXZlKDEwMHB4KSByb3RhdGVYKDApIHJvdGF0ZVkoMCk7IH1cbn1cbi4ke2NsYXNzTmFtZX0gPiBkaXYge1xuICBhbmltYXRpb24tZmlsbC1tb2RlOiBib3RoO1xuICB3aWR0aDogNTBweDtcbiAgaGVpZ2h0OiA1MHB4O1xuICBiYWNrZ3JvdW5kOiAjZmZmO1xuICBib3JkZXItcmFkaXVzOiA0cHg7XG4gIGFuaW1hdGlvbjogc3F1YXJlLXNwaW4gM3MgMHMgY3ViaWMtYmV6aWVyKDAuMDksIDAuNTcsIDAuNDksIDAuOSkgaW5maW5pdGU7XG59XG4uYXBwLWxvYWRpbmctd3JhcCB7XG4gIHBvc2l0aW9uOiBmaXhlZDtcbiAgdG9wOiAwO1xuICBsZWZ0OiAwO1xuICB3aWR0aDogMTAwdnc7XG4gIGhlaWdodDogMTAwdmg7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBiYWNrZ3JvdW5kOiAjMjgyYzM0O1xuICB6LWluZGV4OiA5O1xufVxuICAgIGBcbiAgY29uc3Qgb1N0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKVxuICBjb25zdCBvRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcblxuICBvU3R5bGUuaWQgPSAnYXBwLWxvYWRpbmctc3R5bGUnXG4gIG9TdHlsZS5pbm5lckhUTUwgPSBzdHlsZUNvbnRlbnRcbiAgb0Rpdi5jbGFzc05hbWUgPSAnYXBwLWxvYWRpbmctd3JhcCdcbiAgb0Rpdi5pbm5lckhUTUwgPSBgPGRpdiBjbGFzcz1cIiR7Y2xhc3NOYW1lfVwiPjxkaXY+PGltZyBzcmM9XCIuLi8uLi9zcmMvYXNzZXRzL2ltYWdlcy9sb2dvLXNtYWxsLnBuZ1wiIHN0eWxlPVwid2lkdGg6MTAwJTsgaGVpZ2h0OiAxMDAlO1wiIGFsdD1cIuWFg+mYv+e9kee7nFwiPjwvZGl2PjwvZGl2PmBcblxuICByZXR1cm4ge1xuICAgIGFwcGVuZExvYWRpbmcoKSB7XG4gICAgICBzYWZlRE9NLmFwcGVuZChkb2N1bWVudC5oZWFkLCBvU3R5bGUpXG4gICAgICBzYWZlRE9NLmFwcGVuZChkb2N1bWVudC5ib2R5LCBvRGl2KVxuICAgIH0sXG4gICAgcmVtb3ZlTG9hZGluZygpIHtcbiAgICAgIHNhZmVET00ucmVtb3ZlKGRvY3VtZW50LmhlYWQsIG9TdHlsZSlcbiAgICAgIHNhZmVET00ucmVtb3ZlKGRvY3VtZW50LmJvZHksIG9EaXYpXG4gICAgfSxcbiAgfVxufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmNvbnN0IHthcHBlbmRMb2FkaW5nLCByZW1vdmVMb2FkaW5nfSA9IHVzZUxvYWRpbmcoKVxuZG9tUmVhZHkoKS50aGVuKGFwcGVuZExvYWRpbmcpXG5cbndpbmRvdy5vbm1lc3NhZ2UgPSAoZXYpID0+IHtcbiAgZXYuZGF0YS5wYXlsb2FkID09PSAncmVtb3ZlTG9hZGluZycgJiYgcmVtb3ZlTG9hZGluZygpXG59XG5cbnNldFRpbWVvdXQocmVtb3ZlTG9hZGluZywgNDk5OSlcbiJdLCJuYW1lcyI6WyJjb250ZXh0QnJpZGdlIiwiaXBjUmVuZGVyZXIiLCJhcmdzIl0sIm1hcHBpbmdzIjoiOztBQUdBQSxTQUFBQSxjQUFjLGtCQUFrQixlQUFlO0FBQUEsRUFDN0MsTUFBTSxNQUF5QztBQUN2QyxVQUFBLENBQUMsU0FBUyxRQUFRLElBQUk7QUFDaEJDLGFBQUFBLFlBQUEsR0FBRyxTQUFTLENBQUMsVUFBVUMsVUFBUyxTQUFTLE9BQU8sR0FBR0EsS0FBSSxDQUFDO0FBQUEsRUFDdEU7QUFBQSxFQUNBLE9BQU8sTUFBMEM7QUFDL0Ms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
