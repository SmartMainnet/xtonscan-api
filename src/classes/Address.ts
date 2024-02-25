import TonWeb, { AddressType } from 'tonweb'

export class Address {
  static parse(address: string) {
    const Address: AddressType = new (TonWeb as any).utils.Address(address)

    return {
      raw_form: Address.toString(false, true, true),
      bounceable: Address.toString(true, true, true),
      non_bounceable: Address.toString(true, true, false),
    }
  }

  static getRaw(address: string) {
    const Address: AddressType = new (TonWeb as any).utils.Address(address)
    return Address.toString(false, true, true)
  }

  static getBounceable(address: string) {
    const Address: AddressType = new (TonWeb as any).utils.Address(address)
    return Address.toString(true, true, true)
  }

  static getNonBounceable(address: string) {
    const Address: AddressType = new (TonWeb as any).utils.Address(address)
    return Address.toString(true, true, false)
  }
}
