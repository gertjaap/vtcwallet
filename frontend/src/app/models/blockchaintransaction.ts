import { TransactionInput } from './transactioninput';
import { TransactionOutput } from './transactionoutput';

export class BlockchainTransaction {
  vins : TransactionInput[];
  vouts : TransactionOutput[];
  dateTime : Date;
  total: number;
}
