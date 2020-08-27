import { generateQRCode } from '../generate-qr-code';


it('should generate a QR code', async () => {
  const res: any = {
    send: jest.fn()
  }

  await generateQRCode("test", res)

  expect(res.send).toHaveBeenCalledWith("test")
})