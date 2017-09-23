export class Txo {
  value : number;
  txid : string;
  vout : number;
  address? : string;
  spent : boolean;
  spentTxID : string;
}
