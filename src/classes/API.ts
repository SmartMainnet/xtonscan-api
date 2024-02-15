export class API {
  response: any = {}

  static error(data: {}) {
    return new API().error(data)
  }

  static result(data: {}) {
    return new API().result(data)
  }

  error(data: {}) {
    this.response.ok = false
    if (data || data === false) {
      this.response.error = data
    }
    return this.response
  }

  result(data: {}) {
    this.response.ok = true
    if (data || data === false) {
      this.response.result = data
    }
    return this.response
  }
}
