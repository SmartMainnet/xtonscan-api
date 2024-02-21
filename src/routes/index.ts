import { Router } from 'express'

import { ton } from '../controllers/index.js'

const router = Router()

router.get('/ton/getFriendlyAddress', ton.getFriendlyAddress)
router.get('/ton/getRawAddress', ton.getRawAddress)
router.get('/ton/getTonPrice', ton.getTonPrice)
router.get('/ton/getAddressType', ton.getAddressType)
router.get('/ton/getWalletInfo', ton.getWalletInfo)
router.get('/ton/getTransactionInfo', ton.getTransactionInfo)
router.get('/ton/getJettonInfo', ton.getJettonInfo)
router.get('/ton/getNftInfo', ton.getNftInfo)
router.get('/ton/getNftInfoByOwner', ton.getNftInfoByOwner)
router.get('/ton/getTransactions', ton.getTransactions)
router.get('/ton/getJettons', ton.getJettons)
router.get('/ton/getNfts', ton.getNfts)

export { router }
