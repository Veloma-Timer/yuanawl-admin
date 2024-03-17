import Sortable from "sortablejs";
import { ColumnProps } from "@/components/ProTable/interface";

//列拖拽
function columnDrop(dropCol: ColumnProps<any>[]) {
  //获取dom节点
  const wrapperTr = document.querySelector(".el-table__header-wrapper tr")!;

  if (!wrapperTr) return dropCol;

  Sortable.create(wrapperTr as HTMLElement, {
    animation: 180,
    delay: 0,
    onEnd: (evt: any) => {
      const oldItem = dropCol[evt.oldIndex];
      dropCol.splice(evt.oldIndex, 1);
      dropCol.splice(evt.newIndex, 0, oldItem);
    }
  });

  return dropCol;
}

export default columnDrop;
