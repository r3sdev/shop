import { Response } from 'express';
import QRCode from 'qrcode';

export async function generateQRCode(data: string, res: Response) {
  return QRCode.toDataURL(data)
  .then(url => {
    res.send(url)
  })
  .catch(err => {
    console.error(err)
  })
 
}
