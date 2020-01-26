/* istanbul ignore file */
import { Exclude, Expose, Type } from 'class-transformer'

export function ResponseSerialize(func: Function) {
  return Type(() => func)
}

export function ResponseExpose(name?: string) {
  return Expose({ name, toClassOnly: true })
}

export function RequestExpose(name?: string) {
  return Expose({ name, toPlainOnly: true })
}

export function HttpExpose(name?: string) {
  return Expose({ name })
}

export function RequestExclude() {
  return Exclude({ toPlainOnly: true })
}

export function ResponseExclude() {
  return Exclude({ toClassOnly: true })
}

export function HttpExclude() {
  return Exclude()
}
