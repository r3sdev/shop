import { Response } from 'express';
import QRCode from 'qrcode';


export function generateQRCode(data: string, res: Response) {
    QRCode.toDataURL(data, function (_, url) {
      res.send(url)
    });
  }
  