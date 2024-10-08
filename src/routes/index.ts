import { Router } from 'express'

import { ton, users } from '../controllers/index.js'

const router = Router()

router.post('/users/createUser', users.createUser)
router.get('/users/getUsers', users.getUsers)
router.get('/users/getUserById', users.getUserById)
router.get('/users/getUserByUserId', users.getUserByUserId)

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
