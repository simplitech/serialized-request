import { Dictionary } from './Dictionary'

interface CallbackType { (name: string): void }
const callbacksStartByName: Dictionary<CallbackType[]> = {}
const callbacksEndByName: Dictionary<CallbackType[]> = {}
const callbacksStart: CallbackType[] = []
const callbacksEnd: CallbackType[] = []

export default {
  emitRequestStart(name: string) {
    const callbacks = callbacksStartByName[name]
    if (callbacks) {
      callbacks.forEach(c => c(name))
    }
    callbacksStart.forEach(c => c(name))
  },
  emitRequestEnd(name: string) {
    const callbacks = callbacksEndByName[name]
    if (callbacks) {
      callbacks.forEach(c => c(name))
    }
    callbacksEnd.forEach(c => c(name))
  },
  onRequestStart(name: string | null, cb: CallbackType) {
    if (!name) {
      callbacksStart.push(cb)
    } else {
      if (!callbacksStartByName[name]) {
        callbacksStartByName[name] = []
      }
      callbacksStartByName[name].push(cb)
    }
  },
  onRequestEnd(name: string | null, cb: CallbackType) {
    if (!name) {
      callbacksEnd.push(cb)
    } else {
      if (!callbacksEndByName[name]) {
        callbacksEndByName[name] = []
      }
      callbacksEndByName[name].push(cb)
    }
  },
  clearStartListener(name: string | null, cb?: CallbackType) {
    if (!name) {
      if (!cb) {
        callbacksStart.splice(0, callbacksStart.length)
        return
      }
      const index = callbacksStart.indexOf(cb)
      if (index > -1) {
        callbacksStart.splice(index, 1)
      }
    } else {
      if (!cb) {
        delete callbacksStartByName[name]
      } else {
        const list = callbacksStartByName[name]
        const index = list.indexOf(cb)
        if (index > -1) {
          list.splice(index, 1)
        }
      }
    }
  },
  clearEndListener(name: string | null, cb?: CallbackType) {
    if (!name) {
      if (!cb) {
        callbacksEnd.splice(0, callbacksEnd.length)
        return
      }
      const index = callbacksEnd.indexOf(cb)
      if (index > -1) {
        callbacksEnd.splice(index, 1)
      }
    } else {
      if (!cb) {
        delete callbacksEndByName[name]
      } else {
        const list = callbacksEndByName[name]
        const index = list.indexOf(cb)
        if (index > -1) {
          list.splice(index, 1)
        }
      }
    }
  },
  clearListener(name: string | null, cb?: CallbackType) {
    this.clearStartListener(name, cb)
    this.clearEndListener(name, cb)
  },
  startListenerCount(name: string | null, cb?: CallbackType) {
    if (!name) {
      if (!cb) {
        return callbacksStart.length
      }

      return callbacksStart.indexOf(cb) === -1 ? 0 : 1
    } else {
      const list = callbacksStartByName[name]
      if (!list) {
        return 0
      }

      if (!cb) {
        return list.length
      }

      return list.indexOf(cb) === -1 ? 0 : 1
    }
  },
  endListenerCount(name: string | null, cb?: CallbackType) {
    if (!name) {
      if (!cb) {
        return callbacksEnd.length
      }

      return callbacksEnd.indexOf(cb) === -1 ? 0 : 1
    } else {
      const list = callbacksEndByName[name]
      if (!list) {
        return 0
      }

      if (!cb) {
        return list.length
      }

      return list.indexOf(cb) === -1 ? 0 : 1
    }
  },
}
