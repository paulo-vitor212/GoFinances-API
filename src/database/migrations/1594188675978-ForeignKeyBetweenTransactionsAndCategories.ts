import {MigrationInterface, QueryRunner,TableForeignKey} from "typeorm";

export class ForeignKeyBetweenTransactionsAndCategories1594188675978 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createForeignKey('transactions',new TableForeignKey({
        name: 'TransactionCategoriesForeignKey',
        columnNames: ['category_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'categories',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
    }))
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropForeignKey('transactions','TransactionCategoriesForeignKey');
  }

}
