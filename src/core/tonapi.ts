import axios from 'axios'

const { TONAPI_URL, TONAPI_KEY } = process.env

export const tonapi = axios.create({
  baseURL: TONAPI_URL,
  headers: { Authorization: `Bearer ${TONAPI_KEY}` },
})
