import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class NodemailerService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendInviteEmail(email: string, token: string) {
    const inviteLink = `${process.env.APP_URL}/invite/accept?token=${token}&email=${email}`;

    try {
      return await this.transporter.sendMail({
        from: `"Nuegas" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Invitation to join class',
        html: `
          <h3>You have been invited to join a class</h3>
          <p>Click the link below to accept the invitation:</p>
          <a href="${inviteLink}">${inviteLink}</a>
          <p>This link will expire in 24 hours.</p>
        `,
      });
    } catch (error) {
      console.error('Email send error:', error);
      return error;
    }
  }
}
