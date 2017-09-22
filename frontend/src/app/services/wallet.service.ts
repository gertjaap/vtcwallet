import {Injectable} from '@angular/core';
import * as bip39 from 'bip39';
import * as crypto from 'crypto-browserify';
import * as bitcoin from 'bitcoinjs-lib/src';
import {SettingsService} from './settings.service';

@Injectable()
export class WalletService {
  private lastGeneratedMnemonic : string = '';
  constructor(private settingsService : SettingsService) {

  }

  generateNewHDKeyPair() : string {
    var randomBytes = crypto.randomBytes(16);
    this.lastGeneratedMnemonic = bip39.entropyToMnemonic(randomBytes.toString('hex'));

    //bip39.mnemonicToSeed(mnemonic);
    return this.lastGeneratedMnemonic;
  }

  checkAgainstLastGeneratedMnemonic(checkPhrase : string) : boolean {
    return (checkPhrase === this.lastGeneratedMnemonic);
  }




}
