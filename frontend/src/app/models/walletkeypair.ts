export enum WalletKeyPairType {
    Single = 1,
    HD = 2
}

export class WalletKeyPair {
    type : WalletKeyPairType;
    publicKey : string;
    cipherText : string;
    iv : string;
    salt : string;
    addressDescriptions : string[];
}
