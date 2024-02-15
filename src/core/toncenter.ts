import 'dotenv/config'
import axios from 'axios'

const { TONCENTER_URL, TONCENTER_KEY } = process.env

export const toncenter = axios.create({
  baseURL: TONCENTER_URL,
  headers: { Authorization: `Bearer ${TONCENTER_KEY}` },
})
