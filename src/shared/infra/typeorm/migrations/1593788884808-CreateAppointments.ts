import { MigrationInterface, QueryRunner, Table } from "typeorm";

export default class CreateAppointments1593788884808
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "appointments",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          { name: "provider", type: "varchar" },
          { name: "date", type: "timestamp with time zone" },
          { name: "created_at", type: "timestamp", default: "now()" },
          { name: "updated_at", type: "timestamp", default: "now()" },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("appointments");
  }
}

/**
 * Linha do tempo
 *
 * 1ª semana: Agendamentos
 * 2ª semana: Usuários
 * (Novo dev) 3ª semana: edição na tabela de agendamentos
 * 4ª semana: Compras
 *
 * Controlam a versão e as alterações no Banco de Dados
 *
 */
