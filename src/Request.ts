import { AxiosRequestConfig } from 'axios'
import { classToPlain, ClassTransformOptions } from 'class-transformer'
import { Response } from './Response'
import { ResponseType } from './ResponseType'

export class Request {
  constructor(axiosConfig: AxiosRequestConfig) {
    this.axiosConfig = axiosConfig
  }

  readonly axiosConfig: AxiosRequestConfig

  requestName?: string
  requestDelay?: number

  static get(url: string, axiosConfig?: AxiosRequestConfig) {
    const localConfig: AxiosRequestConfig = { method: 'GET', url }
    return new Request(Object.assign(localConfig, axiosConfig))
  }

  static delete(url: string, axiosConfig?: AxiosRequestConfig) {
    const localConfig: AxiosRequestConfig = { method: 'DELETE', url }
    return new Request(Object.assign(localConfig, axiosConfig))
  }

  static head(url: string, axiosConfig?: AxiosRequestConfig) {
    const localConfig: AxiosRequestConfig = { method: 'HEAD', url }
    return new Request(Object.assign(localConfig, axiosConfig))
  }

  static post(
    url: string,
    data?: any,
    axiosConfig?: AxiosRequestConfig,
    classTransformOptions?: ClassTransformOptions
  ) {
    const localConfig: AxiosRequestConfig = {
      method: 'POST',
      url,
      data: classToPlain(data, classTransformOptions)
    }
    return new Request(Object.assign(localConfig, axiosConfig))
  }

  static put(
    url: string,
    data?: any,
    axiosConfig?: AxiosRequestConfig,
    classTransformOptions?: ClassTransformOptions
  ) {
    const localConfig: AxiosRequestConfig = {
      method: 'PUT',
      url,
      data: classToPlain(data, classTransformOptions)
    }
    return new Request(Object.assign(localConfig, axiosConfig))
  }

  static patch(
    url: string,
    data?: any,
    axiosConfig?: AxiosRequestConfig,
    classTransformOptions?: ClassTransformOptions
  ) {
    const localConfig: AxiosRequestConfig = {
      method: 'PATCH',
      url,
      data: classToPlain(data, classTransformOptions)
    }
    return new Request(Object.assign(localConfig, axiosConfig))
  }

  get endpoint() {
    const url = this.axiosConfig.url || ''
    return url.replace(/^(?:https?:)?\/\/.*(?=\.)[^\/]*/g, '').replace(/(?=\?).*/g, '')
  }

  name(requestName: string) {
    this.requestName = requestName
    return this
  }

  delay(requestDelay: number) {
    this.requestDelay = Math.max(requestDelay, 0)
    return this
  }

  as<T = any>(responseType?: ResponseType<T>) {
    return new Response<T>(this, responseType)
  }

  asArrayOf<T = any>(responseType?: ResponseType<T>) {
    return new Response<T[]>(this, responseType as ResponseType<any>)
  }

  asAny() {
    return new Response<any>(this)
  }

  asVoid() {
    return new Response<void>(this)
  }

  asString() {
    return new Response<string>(this)
  }

  asNumber() {
    return new Response<number>(this)
  }

  asBoolean() {
    return new Response<boolean>(this)
  }
}
