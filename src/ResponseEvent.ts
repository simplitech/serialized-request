import { AxiosResponse } from 'axios'
import { Response } from './Response'

export interface ResponseEvent<T = any> {
  onBeforeResponse?: (responseConfig: Response) => void
  onBeforeSerialization?: (response: AxiosResponse<T>, responseConfig: Response) => void
  onAfterSerialization?: (response: AxiosResponse<T>, responseConfig: Response) => void
}
