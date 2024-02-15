export interface IAPI {
  ok: boolean
  result?: { [key: string]: any }
  error?: { [key: string]: any }
}
