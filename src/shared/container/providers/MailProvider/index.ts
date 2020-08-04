import { container } from "tsyringe";
import IMailProvider from "./models/IMailProvider";
import EtherealMailProvider from "./implementations/EtherealMailProvider";
import HandlebarsMailTemplateProvider from "../MailTemplateProvider/implementations/HandlebarsMailTemplateProvider";
import IMailTemplateProvider from "../MailTemplateProvider/models/IMailTemplateProvider";

container.registerSingleton<IMailTemplateProvider>(
  "MailTemplateProvider",
  HandlebarsMailTemplateProvider
);

container.registerInstance<IMailProvider>(
  "MailProvider",
  container.resolve(EtherealMailProvider)
);
