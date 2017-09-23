import {Injectable, NgZone} from '@angular/core';
import * as bip39 from 'bip39';
import * as crypto from 'crypto-browserify';
import * as convertHex from 'convert-hex';
import * as bitcoin from 'bitcoinjs-lib/src';
import {SettingsService} from './settings.service';
import { Wallet } from '../models/wallet';
import { WalletKeyPair, WalletKeyPairType } from '../models/walletkeypair';

@Injectable()
export class WalletService {
  private lastGeneratedMnemonic : string = '';
  private wallet : Wallet;
  public vertcoinNetwork : any = {
    messagePrefix: 'Vertcoin Signed Message:\n',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4
    },
    pubKeyHash: 0x47,
    scriptHash: 0x05,
    wif: 0x80
  };

  constructor(private ngZone : NgZone, private settingsService : SettingsService) {
    this.settingsService.get('wallet', (value) => {
      if(value) {
        try {
          this.wallet = JSON.parse(value);
          console.log("Wallet loaded");
        } catch (e) {
          console.log("Error parsing stored wallet. Ignoring", e);
        }
      } else {
        console.log("No wallet found");
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

    wallet.checkPhraseSalt = crypto.randomBytes(32).toString('hex');
    crypto.pbkdf2(password, wallet.checkPhraseSalt, 100000, 32, 'sha256', (err, encKey) => {
      var checkPhraseIv = crypto.randomBytes(16);
      wallet.checkPhraseIv = checkPhraseIv.toString('hex');
      var cipher = crypto.createCipheriv('aes256', encKey, checkPhraseIv);
      cipher.update('VERTCOIN_WALLET','ascii');
      wallet.checkPhraseCipherText = cipher.final('hex');
      var walletKeyPair = new WalletKeyPair();
      walletKeyPair.type = WalletKeyPairType.HD;

      walletKeyPair.salt = crypto.randomBytes(32).toString('hex');
      crypto.pbkdf2(password, walletKeyPair.salt, 100000, 32, 'sha256', (err, encKey) => {
        var iv = crypto.randomBytes(16);
        walletKeyPair.iv = iv.toString('hex');
        var cipher = crypto.createCipheriv('aes256', encKey, iv);

        var seed = bip39.mnemonicToSeed(this.lastGeneratedMnemonic);
        this.lastGeneratedMnemonic = '';
        var root = bitcoin.HDNode.fromSeedBuffer(seed);

        cipher.update(root.toBase58(),'ascii');
        walletKeyPair.cipherText = cipher.final('hex');
        walletKeyPair.publicKey = root.neutered().toBase58();
        wallet.keys = [walletKeyPair];
        this.settingsService.set('wallet', JSON.stringify(wallet), () => {
          this.wallet = wallet;
          this.ngZone.run(() => { callback(); });
        });
      });
    });
  }

  tryUnlockWallet(password : string, callback : (success : boolean) => void) : void {
    crypto.pbkdf2.create(password, this.wallet.checkPhraseSalt, 100000, 8, 'sha256', (err, encKey) => {
      if(err) {
        callback(false);
        return;
      }
      var decipher = crypto.createDecipheriv('aes256', encKey, convertHex.hexToBytes(this.wallet.checkPhraseIv));
      decipher.update(this.wallet.checkPhraseCipherText);
      if(decipher.final('ascii') === 'VERTCOIN_WALLET') {
        callback(true);
        return;
      }
      callback(false);
      return;
    });
  }

  getHighestReceiveAddressIndex() : number {
    if(this.wallet.keys[0].addressDescriptions === undefined)
      this.wallet.keys[0].addressDescriptions = [];
    return (this.wallet.keys[0].addressDescriptions.length - 1);
  }

  getNewReceiveAddressIndex(description : string, callback : (index : number) => void) {
    if(this.wallet.keys[0].addressDescriptions === undefined)
      this.wallet.keys[0].addressDescriptions = [];

    var index = this.wallet.keys[0].addressDescriptions.length;
    this.wallet.keys[0].addressDescriptions.push(description);
    this.settingsService.set('wallet', JSON.stringify(this.wallet), () => {
      this.ngZone.run(() => { callback(index); });
    });
  }

  getAddressFromIndex(index : number) : string {
    var node = bitcoin.HDNode.fromBase58(this.wallet.keys[0].publicKey,this.vertcoinNetwork);
    var derived = node.derive(index);
    return derived.getAddress(this.vertcoinNetwork);
  }

  getPublicKeys() : string[] {
    if(!this.wallet) return [];
    var returnValue : string[] = [];

    for(var key of this.wallet.keys) {
      returnValue.push(key.publicKey);
    }

    return returnValue;
  }

}
