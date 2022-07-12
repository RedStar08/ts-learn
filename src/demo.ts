const EventBus = {
  // 调度中心-保存订阅的缓存列表
  _events: {},
  on(event: string, callback: Function) {
    if (!event || !callback) return false
    const _this = this
    // 存在 event 类型的缓存列表，就直接 push 否则先创建一个缓存列表在 push
    ;(_this._events[event] || (_this._events[event] = [])).push(callback)
    return _this
  },
  emit(event: string, ...args: any[]) {
    if (!event) return false
    const _this = this
    const callbacks = [..._this._events[event]]
    if (!callbacks || callbacks.length === 0) return false
    callbacks.forEach((fn) => {
      fn.apply(_this, args)
    })
    return _this
  },
  off(event: string, callback: Function) {
    if (!event) return false
    const _this = this
    const callbacks = _this._events[event]
    if (!callbacks || callbacks.length === 0) return false
    if (!callback) {
      callbacks.length = 0
    } else {
      callbacks.forEach((fn: Function, index: number) => {
        if (fn === callback) {
          callbacks.splice(index, 1)
        }
      })
    }
    return _this
  },
  once(event: string, callback: Function) {
    if (!event || !callback) return false
    const _this = this
    const once = (...args: any[]) => {
      callback.apply(_this, args)
      _this.off(event, once)
    }
    _this.on(event, once)
    return _this
  },
}

// Test
const users1 = (data: any) => {
  console.log("用户1，订阅的数据是：", data)
}
const users2 = (data: any) => {
  setTimeout(() => {
    console.log("用户2，订阅的数据是：", data)
  }, 1000)
}
const users3 = (data: any) => {
  console.log("用户3，订阅的数据是：", data)
}
const users4 = (data: any) => {
  setTimeout(() => {
    console.log("用户4，订阅的数据是：", data)
  }, 1000)
}
const users5 = (data: any) => {
  setTimeout(() => {
    console.log("用户5，订阅的数据是：", data)
  }, 1000)
}

EventBus.on("article", users1)
EventBus.on("article", users2)
EventBus.on("article", users3)
EventBus.on("article", users4)
EventBus.off("article", users4)
EventBus.once("article", users5)

EventBus.emit("article", { title: "《Javascript 入门到放弃》", price: "￥48" })
EventBus.emit("article", { title: "《Javascript 百炼成仙》", price: "￥68" })
