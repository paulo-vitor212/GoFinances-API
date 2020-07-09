import { EntityRepository, Repository,getRepository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const incomeSum = await
    this.createQueryBuilder("tr")
    .select("SUM(tr.value)", "sum")
    .where("tr.type = :type", { type: 'income' })
    .getRawOne();

    const outcomeSum = await
    this.createQueryBuilder("tr")
    .select("SUM(tr.value)", "sum")
    .where("tr.type = :type", { type: 'outcome' })
    .getRawOne();

    const balance = {
      income: incomeSum.sum,
      outcome: outcomeSum.sum,
      total: incomeSum.sum - outcomeSum.sum
    }

    return balance;
  }
}

export default TransactionsRepository;
