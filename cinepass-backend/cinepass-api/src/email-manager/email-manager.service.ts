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
      },
      tls: { 
        rejectUnauthorized: false, //FIXME esto es inseguro, pero necesario para evitar errores de certificado, esto no deberia pasar de ningun modo a produccion
      },
    });
  }

  async enviarCorreo(recipient: string, asunto: string, htmlContent: string, attachments: any[] = []) {
    const mailOptions: any = {
      from: "CinePass <cinepass2024@gmail.com>",
      to: recipient,
      subject: asunto,
      html: htmlContent,
      attachments: attachments
    };

    await this.transporter.sendMail(mailOptions);
  }
}
