import axios from 'axios'
import { BASE_URL_MINERIA } from '../config/config'

export const MineriaApi = axios.create({
  baseURL: BASE_URL_MINERIA,
  headers: {
    'Content-Type': 'application/json'
  }
})
