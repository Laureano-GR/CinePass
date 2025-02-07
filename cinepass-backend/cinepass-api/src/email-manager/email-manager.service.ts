import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailManagerService {
  private transporter;

  constructor() {
      this.transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465, // También puedes usar 587 con `secure: false`
        secure: true, // true para 465, false para 587
      auth: {
        user: "cinepass2024@gmail.com",
        pass: "dfii lrtn cyih zdfw"
      }
    });
  }

  async enviarCorreo(destinatario: string, asunto: string, contenidoHtml: string, qrCodeBase64?: string) {
    const mailOptions: any = {
      from: "cinepass2024@gmail.com",
      to: destinatario,
      subject: asunto,
      html: contenidoHtml,
    };

    // Si hay un QR, lo adjuntamos
    if (qrCodeBase64) {
      mailOptions.attachments = [
        {
          filename: 'qrcode.png',
          content: qrCodeBase64.split(';base64,').pop(),
          encoding: 'base64'
        }
      ];
    }

    await this.transporter.sendMail(mailOptions);
  }
}

