export namespace YuanawlAdmin {
  export interface IType {
    id: number;
    name: string;
    icon: string;
    isLeaf: boolean;
  }

  export interface IProduct {
    id: number;
    name: string;
    icon: string;
    isLeaf: boolean;
    price: string;
    number: string;
  }

  export interface IPath {
    id: number;
    name: string;
    value: string | number;
    desc: string;
    path: string;
  }
}
