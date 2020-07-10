import Transaction from '../models/Transaction';
import csvParse from 'csv-parse';
import fs from 'fs';
import Category from '../models/Category';
import {In, getRepository} from 'typeorm';


interface csvTransaction {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class ImportTransactionsService {
  async execute(filePath: string): Promise<Transaction[]> {
    const contactsReadStream = fs.createReadStream(filePath);

    const transactions: csvTransaction[] = [];
    const categories: string[] = [];

    const parsers = csvParse({
     delimiter: ',',
     from_line: 2,
    });
    const parseCSV = contactsReadStream.pipe(parsers);

    parseCSV.on('data',async line => {
      const [title, type, value, category] = line.map( (cell:string) => cell.trim());

      if(!title || !type || !value){
        return;
      }

      categories.push(category);
      transactions.push({ title , type , value , category });

    })

    await new Promise(resolve => parseCSV.on('end', resolve))

    const categoryRepository = getRepository(Category);
    const existentCategories = await categoryRepository.find({
      where:{
        title: In(categories)
      }
    });

    const existentCategoriesTitles = existentCategories.map( (category: Category) => category.title)

    const addCategoryTitles = categories
    .filter(category => !existentCategoriesTitles.includes(category)) // filtrando para retornar todas as categorias que não existem no BD
    .filter((value, index, self) => self.indexOf(value) === index); // para não retornar duplicatas

    const newCategories = categoryRepository.create(
      addCategoryTitles.map(title => ({
        title,
      }))
    );

    await categoryRepository.save(newCategories);

    const finalCategories = [...newCategories, ...existentCategories];

    const transactionRepository = getRepository(Transaction);

    const createdTransactions = transactionRepository.create(
      transactions.map(transaction => ({
        title: transaction.title,
        type: transaction.type,
        value: transaction.value,
        category: finalCategories.find(
          category => category.title === transaction.category
        )
      }))
    )

    await transactionRepository.save(createdTransactions);

    await fs.promises.unlink(filePath);

    return createdTransactions;
  }
}

export default ImportTransactionsService;
