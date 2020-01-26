import { Dictionary } from './Dictionary'

const callbacksStartByName: Dictionary<Function[]> = {}
const callbacksEndByName: Dictionary<Function[]> = {}

export default {
  emitRequestStart(name: string) {
    const callbacks = callbacksStartByName[name]
    if (callbacks) {
      callbacks.forEach(c => c())
    }
  },
  emitRequestEnd(name: string) {
    const callbacks = callbacksEndByName[name]
    if (callbacks) {
      callbacks.forEach(c => c())
    }
  },
  onRequestStart(name: string, cb: Function) {
    if (!callbacksStartByName[name]) {
      callbacksStartByName[name] = []
    }
    callbacksStartByName[name].push(cb)
  },
  onRequestEnd(name: string, cb: Function) {
    if (!callbacksEndByName[name]) {
      callbacksEndByName[name] = []
    }
    callbacksEndByName[name].push(cb)
  },
  clearStartListener(name: string, cb?: Function) {
    if (!cb) {
      delete callbacksStartByName[name]
    } else {
      const list = callbacksStartByName[name]
      const index = list.indexOf(cb)
      if (index > -1) {
        list.splice(index, 1)
      }
    }
  },
  clearEndListener(name: string, cb?: Function) {
    if (!cb) {
      delete callbacksEndByName[name]
    } else {
      const list = callbacksEndByName[name]
      const index = list.indexOf(cb)
      if (index > -1) {
        list.splice(index, 1)
      }
    }
  },
  clearListener(name: string, cb?: Function) {
    this.clearStartListener(name, cb)
    this.clearEndListener(name, cb)
  },
  startListenerCount(name: string, cb?: Function) {
    const list = callbacksStartByName[name]
    if (!list) {
      return 0
    }

    if (!cb) {
      return list.length
    }

    return list.indexOf(cb) === -1 ? 0 : 1
  },
  endListenerCount(name: string, cb?: Function) {
    const list = callbacksEndByName[name]
    if (!list) {
      return 0
    }

    if (!cb) {
      return list.length
    }

    return list.indexOf(cb) === -1 ? 0 : 1
  },
}
