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

    const total = (incomeSum.sum ? parseFloat(incomeSum.sum) : 0) - (outcomeSum.sum ? parseFloat(outcomeSum.sum) : 0)

    const balance = {
      income: incomeSum.sum ? parseFloat(incomeSum.sum) : 0,
      outcome: outcomeSum.sum ? parseFloat(outcomeSum.sum) : 0 ,
      total
    }

    return balance;
  }
}

export default TransactionsRepository;
