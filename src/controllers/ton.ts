import { Request, Response } from 'express'
import { Address } from 'ton-core'

import { TransactionsModel } from '../database/models/index.js'
import { tonapi, toncenter } from '../core/index.js'
import { API } from '../classes/index.js'
import { IAPI } from '../types/index.js'

export const getFriendlyAddress = async (
  req: Request,
  res: Response
): Promise<Response<IAPI>> => {
  try {
    const { address } = req.body

    return res.json(API.result(Address.normalize(address)))
  } catch (e: any) {
    return res.json(API.error({ message: 'error' }))
  }
}

export const getRawAddress = async (
  req: Request,
  res: Response
): Promise<Response<IAPI>> => {
  try {
    const { address } = req.body

    const response = await toncenter.get(`/unpackAddress?address=${address}`)
    const rawAddress: string = response.data.result

    if (rawAddress) {
      return res.json(API.result(rawAddress))
    }

    return res.json(API.error({ message: 'error' }))
  } catch (e: any) {
    const error: string = e?.response?.data?.error

    if (error && error.toLowerCase().includes('rate limit')) {
      return res.json(
        API.error({
          message: 'rate limit',
        })
      )
    }

    return res.json(API.error({ message: 'error' }))
  }
}

export const getTonPrice = async (
  req: Request,
  res: Response
): Promise<Response<IAPI>> => {
  try {
    const response = await tonapi.get('/rates?tokens=ton&currencies=usd')
    const tonPrice: number = response?.data?.rates?.TON?.prices?.USD

    if (tonPrice) {
      return res.json(API.result(tonPrice))
    }

    return res.json(API.error({ message: 'error' }))
  } catch (e: any) {
    const error: string = e?.response?.data?.error

    if (error && error.toLowerCase().includes('rate limit')) {
      return res.json(
        API.error({
          message: 'rate limit',
        })
      )
    }

    return res.json(API.error({ message: 'error' }))
  }
}

export const getAddressType = async (
  req: Request,
  res: Response
): Promise<Response<IAPI>> => {
  try {
    const { address } = req.body

    const response = await tonapi.get(`/accounts/${address}`)
    const addressData = response.data

    const normalizedAddress: string = Address.normalize(address)
    const isWallet: boolean = addressData.is_wallet

    if (isWallet) {
      return res.json(
        API.result({
          address: normalizedAddress,
          type: 'wallet',
        })
      )
    }

    if (addressData.interfaces.some((item: string) => item === 'jetton_master')) {
      return res.json(
        API.result({
          address: normalizedAddress,
          type: 'jetton',
        })
      )
    }

    if (addressData.interfaces.some((item: string) => item === 'nft_item')) {
      return res.json(
        API.result({
          address: normalizedAddress,
          type: 'nft',
        })
      )
    }

    return res.json(API.error({ message: 'error' }))
  } catch (e: any) {
    const error: string = e?.response?.data?.error

    if (error && error.toLowerCase().includes("can't decode address")) {
      return res.json(
        API.error({
          message: "can't decode address",
        })
      )
    }

    if (error && error.toLowerCase().includes('rate limit')) {
      return res.json(
        API.error({
          message: 'rate limit',
        })
      )
    }

    return res.json(API.error({ message: 'error' }))
  }
}

export const getWalletInfo = async (
  req: Request,
  res: Response
): Promise<Response<IAPI>> => {
  try {
    const { address } = req.body

    const response = await tonapi.get(`/accounts/${address}`)
    const addressData = response.data

    const tonPriceRes = await tonapi.get('/rates?tokens=ton&currencies=usd')
    const tonPrice: number = tonPriceRes?.data?.rates?.TON?.prices?.USD

    const jettonsRes = await tonapi.get(
      `/accounts/${address}/jettons?currencies=usd`
    )
    const jettons = jettonsRes.data.balances

    const nftsRes = await tonapi.get(`/accounts/${address}/nfts`)
    const nfts = nftsRes.data.nft_items

    const walletAddress: string = Address.normalize(address)
    const balanceTON: number = addressData.balance / 1000000000 || 0
    const balanceUSD: number = balanceTON * tonPrice
    const jettonCount: number = jettons.length
    const nftCount: number = nfts.length

    return res.json(
      API.result({
        address: walletAddress,
        raw_address: addressData.address,
        status: addressData.status,
        name: addressData.name,
        balance: {
          TON: balanceTON,
          USD: balanceUSD,
        },
        jetton_count: jettonCount,
        nft_count: nftCount,
        is_wallet: addressData.is_wallet,
      })
    )
  } catch (e: any) {
    const error: string = e?.response?.data?.error

    if (error && error.toLowerCase().includes('rate limit')) {
      return res.json(
        API.error({
          message: 'rate limit',
        })
      )
    }

    return res.json(API.error({ message: 'error' }))
  }
}

export const getTransactionInfo = async (
  req: Request,
  res: Response
): Promise<Response<IAPI>> => {
  try {
    const { address } = req.body

    const response = await tonapi.get(`/events/${address}`)
    const transaction = response.data

    return res.json(API.result(transaction))
  } catch (e: any) {
    const error: string = e?.response?.data?.error

    if (error && error.toLowerCase().includes('rate limit')) {
      return res.json(
        API.error({
          message: 'rate limit',
        })
      )
    }

    return res.json(API.error({ message: 'error' }))
  }
}

export const getJettonInfo = async (
  req: Request,
  res: Response
): Promise<Response<IAPI>> => {
  try {
    const { address } = req.body

    const response = await tonapi.get(`/jettons/${address}`)
    const jettonInfo = response.data

    const rawJettonAddress: string = jettonInfo.metadata.address
    const jettonAddress: string = Address.normalize(rawJettonAddress)

    return res.json(
      API.result({
        address: jettonAddress,
        raw_address: rawJettonAddress,
        mintable: jettonInfo.mintable,
        total_supply: jettonInfo.total_supply,
        holders_count: jettonInfo.holders_count,
        name: jettonInfo.metadata.name,
        symbol: jettonInfo.metadata.symbol,
        decimals: jettonInfo.metadata.decimals,
        description: jettonInfo.metadata.description,
        verification: jettonInfo.verification,
      })
    )
  } catch (e: any) {
    const error: string = e?.response?.data?.error

    if (error && error.toLowerCase().includes('rate limit')) {
      return res.json(
        API.error({
          message: 'rate limit',
        })
      )
    }

    return res.json(API.error({ message: 'error' }))
  }
}

export const getNftInfo = async (
  req: Request,
  res: Response
): Promise<Response<IAPI>> => {
  try {
    const { address } = req.body

    const response = await tonapi.get(`/nfts/${address}`)
    const nftInfo = response.data

    const ownerAddress: string = Address.normalize(nftInfo.owner.address)
    const collectionAddress: string = Address.normalize(nftInfo.collection.address)
    const nftAddress: string = Address.normalize(address)

    return res.json(
      API.result({
        nft_address: nftAddress,
        collection_address: collectionAddress,
        owner_address: ownerAddress,
        owner_name: nftInfo.owner.name,
        nft_image: nftInfo.previews[2].url,
        nft_name: nftInfo.metadata.name,
        nft_description: nftInfo.metadata.description,
        nft_attributes: nftInfo.metadata.attributes,
        approved_by: nftInfo.approved_by,
      })
    )
  } catch (e: any) {
    const error: string = e?.response?.data?.error

    if (error && error.toLowerCase().includes('rate limit')) {
      return res.json(
        API.error({
          message: 'rate limit',
        })
      )
    }

    return res.json(API.error({ message: 'error' }))
  }
}

export const getNftInfoByOwner = async (
  req: Request,
  res: Response
): Promise<Response<IAPI>> => {
  try {
    const { address, page = 0 } = req.body

    const response = await tonapi.get(`/accounts/${address}/nfts`)
    const nftInfo = response.data.nft_items[page]

    const nftCount: number = response.data.nft_items?.length
    const ownerAddress: string = Address.normalize(nftInfo.owner.address)
    const collectionAddress: string = Address.normalize(nftInfo.collection.address)
    const nftAddress: string = Address.normalize(address)

    return res.json(
      API.result({
        nft_address: nftAddress,
        collection_address: collectionAddress,
        owner_address: ownerAddress,
        owner_name: nftInfo.owner.name,
        last_page: nftCount,
        nft_image: nftInfo.previews[2].url,
        nft_name: nftInfo.metadata.name,
        nft_description: nftInfo.metadata.description,
        nft_attributes: nftInfo.metadata.attributes,
        approved_by: nftInfo.approved_by,
      })
    )
  } catch (e: any) {
    const error: string = e?.response?.data?.error

    if (error && error.toLowerCase().includes('rate limit')) {
      return res.json(
        API.error({
          message: 'rate limit',
        })
      )
    }

    return res.json(API.error({ message: 'error' }))
  }
}

export const getTransactions = async (
  req: Request,
  res: Response
): Promise<Response<IAPI>> => {
  try {
    const { address, message_id, limit = 10, page = 0 } = req.body

    let transactionsFromDb = await TransactionsModel.findOne({ message_id })
    const length = transactionsFromDb?.events.length || 0
    const start = page * limit
    const end = page * limit + limit

    if (!transactionsFromDb) {
      const response = await tonapi.get(
        `/accounts/${address}/events?limit=100&initiator=false`
      )

      const transactions = response.data
      transactionsFromDb = await TransactionsModel.create({
        message_id,
        events: transactions.events,
        next_from: transactions.next_from,
        is_end: transactions.events.length < limit,
      })
    } else if (start >= length) {
      const response = await tonapi.get(
        `/accounts/${address}/events?limit=100&initiator=false&before_lt=${transactionsFromDb.next_from}`
      )

      const transactions = response.data
      await TransactionsModel.findOneAndUpdate(
        { message_id },
        {
          $push: { events: { $each: transactions.events } },
          $set: {
            next_from: transactions.next_from,
            is_end: transactions.events.length < limit,
          },
        }
      )
      const updatedTransactions = await TransactionsModel.findOne({ message_id })

      if (updatedTransactions) {
        transactionsFromDb = updatedTransactions
      }
    }

    return res.json(
      API.result({
        owner_address: address,
        limit,
        page,
        is_last_page:
          page === Math.ceil(transactionsFromDb.events.length / limit) - 1 &&
          transactionsFromDb.is_end,
        events_count: transactionsFromDb.events.length,
        events: transactionsFromDb.events.slice(start, end),
      })
    )
  } catch (e: any) {
    const error: string = e?.response?.data?.error

    if (error) {
      if (error.includes('rate limit')) {
        return res.json(
          API.error({
            message: 'rate limit',
          })
        )
      }
    }

    return res.json(API.error({ message: 'error' }))
  }
}

export const getJettons = async (
  req: Request,
  res: Response
): Promise<Response<IAPI>> => {
  try {
    const { address } = req.body

    const response = await tonapi.get(`/accounts/${address}/jettons?currencies=usd`)
    const jettons = response.data.balances

    return res.json(API.result(jettons))
  } catch (e: any) {
    const error: string = e?.response?.data?.error

    if (error && error.toLowerCase().includes('rate limit')) {
      return res.json(
        API.error({
          message: 'rate limit',
        })
      )
    }

    return res.json(API.error({ message: 'error' }))
  }
}

export const getNfts = async (
  req: Request,
  res: Response
): Promise<Response<IAPI>> => {
  try {
    const { address } = req.body

    const response = await tonapi.get(`/accounts/${address}/nfts`)
    const nfts = response.data.nft_items

    return res.json(API.result(nfts))
  } catch (e: any) {
    const error: string = e?.response?.data?.error

    if (error && error.toLowerCase().includes('rate limit')) {
      return res.json(
        API.error({
          message: 'rate limit',
        })
      )
    }

    return res.json(API.error({ message: 'error' }))
  }
}
