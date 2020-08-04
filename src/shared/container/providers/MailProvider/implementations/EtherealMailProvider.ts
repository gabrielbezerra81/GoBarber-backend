import nodemailer from "nodemailer";
import IMailProvider from "../models/IMailProvider";
import Mail from "nodemailer/lib/mailer";
import ISendMailDTO from "../dtos/ISendMailDTO";
import IMailTemplateProvider from "../../MailTemplateProvider/models/IMailTemplateProvider";
import { inject, injectable } from "tsyringe";
import mailConfig from "@config/mail";

@injectable()
export default class EtherealMailProvider implements IMailProvider {
  private client: Mail;

  constructor(
    @inject("MailTemplateProvider")
    private mailTemplateProvider: IMailTemplateProvider
  ) {
    const setupMailer = async () => {
      // const account = await nodemailer.createTestAccount();

      const transporter = nodemailer.createTransport({
        service: "gmail",
        // host: account.smtp.host,
        // port: account.smtp.port,
        // secure: account.smtp.secure,
        auth: {
          user: mailConfig.email,
          pass: mailConfig.password,
        },
      });
      this.client = transporter;
    };
    setupMailer();
  }

  public async sendMail({
    to,
    subject,
    templateData,
    from,
  }: ISendMailDTO): Promise<void> {
    const html = await this.mailTemplateProvider.parse(templateData);

    const info = await this.client.sendMail({
      from: {
        name: from?.name || "Equipe GoBarber",
        address: from?.email || "equipegobarber@gmail.com",
      },
      to: { name: to.name, address: to.email },
      subject,
      html,
    });

    console.log(info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  }
}
