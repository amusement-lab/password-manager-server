import CryptoJS from 'crypto-js'

function encrypt(payload: string, secret: string) {
  return CryptoJS.AES.encrypt(payload, secret).toString()
}

function decrypt(ciphertext: string, secret: string) {
  return CryptoJS.AES.decrypt(ciphertext, secret).toString(CryptoJS.enc.Utf8)
}

export { encrypt, decrypt }
