interface CallbackType { (name: string): void }
const callbacksStart: CallbackType[] = []
const callbacksEnd: CallbackType[] = []
const callbacksError: CallbackType[] = []

export default {
  emitRequestStart(name: string) {
    this.emitRequest(name, callbacksStart)
  },
  emitRequestEnd(name: string) {
    this.emitRequest(name, callbacksEnd)
  },
  emitRequestError(name: string) {
    this.emitRequest(name, callbacksError)
  },
  emitRequest(name: string, callbacks: CallbackType[] | null) {
    if (callbacks) {
      callbacks.forEach(c => c(name))
    }
  },
  onRequestStart(cb: CallbackType) {
    callbacksStart.push(cb)
  },
  onRequestEnd(cb: CallbackType) {
    callbacksEnd.push(cb)
  },
  onRequestError(cb: CallbackType) {
    callbacksError.push(cb)
  },
  removeStartListener(cb: CallbackType) {
    this.removeListenerOf(cb, callbacksStart)
  },
  removeEndListener(cb: CallbackType) {
    this.removeListenerOf(cb, callbacksEnd)
  },
  removeErrorListener(cb: CallbackType) {
    this.removeListenerOf(cb, callbacksError)
  },
  removeListenerOf(cb: CallbackType, callbacks: CallbackType[]) {
    const index = callbacks.indexOf(cb)
    if (index > -1) {
      callbacks.splice(index, 1)
    }
  },
  removeListener(cb: CallbackType) {
    this.removeStartListener(cb)
    this.removeEndListener(cb)
    this.removeErrorListener(cb)
  },
  clearStartListeners() {
    this.clearListenersOf(callbacksStart)
  },
  clearEndListeners() {
    this.clearListenersOf(callbacksEnd)
  },
  clearErrorListeners() {
    this.clearListenersOf(callbacksError)
  },
  clearListenersOf(callbacks: CallbackType[]) {
    callbacks.splice(0, callbacks.length)
  },
  clearListeners() {
    this.clearStartListeners()
    this.clearEndListeners()
    this.clearErrorListeners()
  },
  startListenerCount(cb: CallbackType | null = null) {
    return this.listenerCount(cb, callbacksStart)
  },
  endListenerCount(cb: CallbackType | null = null) {
    return this.listenerCount(cb, callbacksEnd)
  },
  errorListenerCount(cb: CallbackType | null = null) {
    return this.listenerCount(cb, callbacksError)
  },
  listenerCount(cb: CallbackType | null = null, callbacks: CallbackType[]) {
    if (!cb) {
      return callbacks.length
    }

    return callbacks.indexOf(cb) === -1 ? 0 : 1
  },
}
