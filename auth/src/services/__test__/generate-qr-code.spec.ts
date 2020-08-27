import { generateQRCode } from '../generate-qr-code';
import QRCode from 'qrcode';

it('should generate a QR code', () => {
  const res: any = jest.fn();

  generateQRCode("test", res)

  expect(QRCode.toDataURL).toHaveBeenCalledWith("test", expect.any(Function))
})