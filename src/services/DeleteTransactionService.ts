import AppError from '../errors/AppError';
import {getCustomRepository} from 'typeorm';

import TransactionRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  private id: string;

  constructor(transaction_id:string){
    this.id = transaction_id;
  }

  public async execute(): Promise<void> {
    const transaction = getCustomRepository(TransactionRepository);
    try{
      const transactionFounded = await transaction.findOne(this.id);

      if(!transactionFounded){
        throw new AppError('Não possível deletar a sua transação, tente novamente mais tarde.',400);
      }

      await transaction.delete(this.id);

    }catch{
      throw new AppError('Não possível deletar a sua transação, tente novamente mais tarde.',400);
    }
  }
}

export default DeleteTransactionService;
