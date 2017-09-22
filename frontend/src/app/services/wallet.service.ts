import {Injectable, NgZone} from '@angular/core';
import * as bip39 from 'bip39';
import * as crypto from 'crypto-browserify';
import * as bitcoin from 'bitcoinjs-lib/src';
import {SettingsService} from './settings.service';
import {EncryptionService} from './encryption.service';
import { Wallet } from '../models/wallet';
import { WalletKeyPair, WalletKeyPairType } from '../models/walletkeypair';

@Injectable()
export class WalletService {
  private lastGeneratedMnemonic : string = '';
  private wallet : Wallet;

  constructor(private encryptionService : EncryptionService, private ngZone : NgZone, private settingsService : SettingsService) {
    this.settingsService.get('wallet', (value) => {
      if(value) {
        try {
          this.wallet = JSON.parse(value);
        } catch (e) {
          console.log("Error parsing stored wallet. Ignoring", e);
        }
      }
    });
  }

  generateNewHDKeyPair() : string {
    var randomBytes = crypto.randomBytes(16);
    this.lastGeneratedMnemonic = bip39.entropyToMnemonic(randomBytes.toString('hex'));

    //
    return this.lastGeneratedMnemonic;
  }

  checkAgainstLastGeneratedMnemonic(checkPhrase : string) : boolean {
    return (checkPhrase === this.lastGeneratedMnemonic);
  }

  encryptNewWallet(password : string, callback : () => void) : void {
    var wallet = new Wallet();

    var walletKeyPair = new WalletKeyPair();
    walletKeyPair.type = WalletKeyPairType.HD;

    var seed = bip39.mnemonicToSeed(this.lastGeneratedMnemonic);
    this.lastGeneratedMnemonic = '';
    var root = bitcoin.HDNode.fromSeedBuffer(seed);

    walletKeyPair.publicKey = root.neutered().toBase58();

    wallet.keys = [walletKeyPair];

    // todo: encrypt private key and store in wallet.

    console.log("New wallet", wallet);

    this.settingsService.set('wallet', JSON.stringify(this.wallet), () => {
      this.wallet = wallet;
      this.ngZone.run(() => { callback(); });
    });
  }



}
