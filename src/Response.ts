import { AxiosResponse } from 'axios'
import { ClassTransformOptions, plainToClass, plainToClassFromExist } from 'class-transformer'
import { Request } from './Request'
import { ResponseType } from './ResponseType'
import { ResponseEvent } from './ResponseEvent'
import { ClassType } from './ClassType'
import RequestListener from './RequestListener'
import { RequestConfig } from './Config'

/**
 * The Response is an auxiliary class of [[Request]].
 *
 * Although you may use this class to make HTTP requests, it is recommended to use [[Request]] instead.
 *
 * By using [[Request]], the code will be semantically better.
 *
 * It uses [Axios](https://github.com/axios/axios) to request; therefore, you may configure an Axios instance.
 *
 */
export class Response<T = any> {
  /**
   * Assigns a new response instance with a provided request instance.
   *
   * @param request A request instance
   * @param responseType The response type. You may use either an instance object or a class definition.
   * If it is an instance, then the response will populate it.
   */
  constructor(request: Request, responseType?: ResponseType<T>) {
    this.request = request
    this.responseType = responseType
  }

  /**
   * The request instance of this response
   * @hidden
   */
  readonly request: Request

  /**
   * The response type
   * @hidden
   */
  readonly responseType?: ResponseType<T>

  /**
   * Get the Axios configuration of the provided [[Request]].
   * More details in [Axios Docs](https://github.com/axios/axios#request-config)
   * @hidden
   */
  get axiosConfig() {
    return this.request.axiosConfig
  }

  /**
   * Get the name of the provided [[Request]].
   * @hidden
   */
  get requestName() {
    return this.request.requestName
  }

  /**
   * Get the delay of the provided [[Request]].
   * @hidden
   */
  get requestDelay() {
    return this.request.requestDelay
  }

  /**
   * Get the endpoint of the provided [[Request]].
   * @hidden
   */
  get endpoint() {
    return this.request.endpoint
  }

  /**
   * Gives a name of this request which is used in [[Await]] component.
   */
  name(requestName: string) {
    this.request.requestName = requestName
    return this
  }

  /**
   * Provides a delay of any request from this instance.
   */
  delay(requestDelay: number) {
    this.request.requestDelay = Math.max(requestDelay, 0)
    return this
  }

  /**
   * Makes a HTTP request and returns the data content from response.
   */
  async fetchData(classTransformOptions?: ClassTransformOptions) {
    return (await this.fetchResponse(classTransformOptions)).data
  }

  /**
   * Makes a HTTP request and returns the response content.
   */
  async fetchResponse(classTransformOptions?: ClassTransformOptions): Promise<AxiosResponse<T>> {
    const { axiosConfig, responseType, requestName, requestDelay, endpoint } = this
    const event = responseType as ResponseEvent<T>

    if (event && typeof event.onBeforeResponse === 'function') {
      event.onBeforeResponse(this)
    }

    RequestListener.emitRequestStart(requestName || endpoint)

    let response: AxiosResponse<T> | null = null
    try {
      if (requestDelay) {
        await this.sleep(requestDelay)
      }

      response = await RequestConfig.axios.request<T>(axiosConfig)

    } catch (e) {
      RequestListener.emitRequestError(requestName || endpoint)
      throw e
    }

    RequestListener.emitRequestEnd(requestName || endpoint)

    if (event && typeof event.onBeforeSerialization === 'function') {
      event.onBeforeSerialization(response, this)
    }

    if (response.data === undefined) {
      response.data = JSON.parse(response.request.response || '{}')
    }

    if (responseType === undefined) {
      return response
    }

    if (typeof responseType === 'object') {
      // Class object instance from constructor (new CustomClass())
      // The instance will be automatically populated
      response.data = plainToClassFromExist(responseType as T, response.data, classTransformOptions)
    } else if (typeof responseType === 'function') {
      // Class constructor (CustomClass, Number, String, Boolean, etc.)
      response.data = plainToClass(
        responseType as ClassType<T>,
        response.data,
        classTransformOptions
      )
    } else throw Error('Error: Entity should be either a Class or ClassObject')

    if (event && typeof event.onAfterSerialization === 'function') {
      event.onAfterSerialization(response, this)
    }

    return response
  }

  /**
   * @deprecated use fetchData instead
   */
  getData(classTransformOptions?: ClassTransformOptions) {
    return this.fetchData(classTransformOptions)
  }

  /**
   * @deprecated use fetchResponse instead
   */
  getResponse(classTransformOptions?: ClassTransformOptions) {
    return this.fetchResponse(classTransformOptions)
  }

  sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}
