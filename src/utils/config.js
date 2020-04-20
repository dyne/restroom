require('dotenv').config()

export const PORT = parseInt(process.env.PORT || '3000', 10)
export const HOST = process.env.HOST || '0.0.0.0'
export const SMART_CONTRACTS = process.env.SMART_CONTRACTS