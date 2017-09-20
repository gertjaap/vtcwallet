import {Injectable} from '@angular/core';
import * as bip39 from 'bip39';
import * as crypto from 'crypto-browserify';
import * as bitcoin from 'bitcoinjs-lib/src';
import {SettingsService} from './settings.service';

@Injectable()
export class WalletService {
  constructor(private settingsService : SettingsService) {

  }

  generateNewHDKeyPair() : string {
    var randomBytes = crypto.randomBytes(16);
    var mnemonic = bip39.entropyToMnemonic(randomBytes.toString('hex'));

    //bip39.mnemonicToSeed(mnemonic);
    return mnemonic;
  }





}
