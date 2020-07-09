import AppError from '../errors/AppError';
import {getRepository,getCustomRepository} from 'typeorm';

import TransactionRepository from '../repositories/TransactionsRepository';;
import Category from '../models/Category';
import Transaction from '../models/Transaction';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({title, value, type, category}:Request): Promise<Transaction> {
    const categoryRepository = getRepository(Category);
    let categoryObject = await categoryRepository.findOne({
      where: {title:category}
    });

    if(!categoryObject){
      //Se não existe uma categoria, vai ser criado uma.
      try{
        categoryObject = categoryRepository.create({
          title:category
        })
        await categoryRepository.save(categoryObject);
      }catch(err){
        throw new AppError("Ocorreu um erro ao criar uma nova categoria", 400)
      }
    }
    const transactionRepository = getCustomRepository(TransactionRepository);
    let balance = await transactionRepository.getBalance();

    if(type === 'outcome'){
      if((balance.total - value) < 0 ){
        //Ta tirando mais do que possuí
        throw new AppError(`Saldo insuficiente para realizar está transação. Seu saldo é de ${balance.total}.`);
      }
    }

    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category: categoryObject
    })

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
