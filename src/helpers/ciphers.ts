import CryptoJS from 'crypto-js'

function enc(payload: string, secret: string) {
  return CryptoJS.AES.encrypt(payload, secret).toString()
}

function dec(ciphertext: string, secret: string) {
  return CryptoJS.AES.decrypt(ciphertext, secret).toString(CryptoJS.enc.Utf8)
}

export { enc, dec }
