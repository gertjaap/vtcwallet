import { WalletKeyPair } from './walletkeypair';

export class Wallet {
  checkPhraseCipherText : string;
  checkPhraseIv : string;
  checkPhraseSalt : string;
  keys : WalletKeyPair[];
}
