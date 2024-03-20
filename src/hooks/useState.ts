const states: Ref<any>[] = [];
const stateSetters: Array<any> = [];

let stateIndex: number = 0;

/**
 * 主要用于创建一个响应式的数据
 * @param initalState 初始state
 * @param stateIndex state对应的下标
 * @returns 判断已有数组中是否存在，如果不存在，则返回这个数据，如果存在了则就返回原有数据中对应的数据
 */
function createState<T>(initalState: T, stateIndex: number): Ref<T> {
  const state = ref<T>(initalState);

  return states[stateIndex] !== undefined ? states[stateIndex] : state;
}

/**
 * 完成函数的返回
 * @param stateIndex 传入state对应的下标
 * @returns 根据类型进行判断，如果是方法，则执行后的结构赋值给响应式的数据，如果不是函数类型，那么我们就将传递过来的新的值的进行赋值
 */
function createStateSetters<T>(stateIndex: number) {
  return function (newState: T | ((prevState: T) => T)) {
    if (typeof newState === "function") {
      const prevState = states[stateIndex].value;
      states[stateIndex].value = (newState as (prevState: T) => T)(prevState);
    } else {
      states[stateIndex].value = newState;
    }
  };
}

/**
 * useState Hooks
 * @param initalState 暴露出去的方法，在外界使用时，仅需传入初始值
 * @returns 返回一个响应式的数据，以及返回一个可以对数据进行操作的操作函数
 */
function useState<T>(initalState: T): [Ref<T>, (newState: T | ((prevState: T) => T)) => void] {
  states[stateIndex] = createState(initalState, stateIndex);
  if (!stateSetters[stateIndex]) {
    stateSetters.push(createStateSetters(stateIndex));
  }
  const _state = states[stateIndex];
  const _setState = stateSetters[stateIndex];
  stateIndex++;
  return [_state, _setState];
}

export default useState;
