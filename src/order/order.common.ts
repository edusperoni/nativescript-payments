type Purchase = com.android.billingclient.api.Purchase;

export abstract class BaseOrder {
  public nativeValue: Purchase | SKPaymentTransaction;
  public abstract readonly debug: string | null;

  public state: OrderState;
  public itemId: string;
  public orderId: string;
  public orderDate: Date;
  public receiptToken: string;
  public userData: string;
  public restored: boolean;
  /** Android only */
  public isSubscription: boolean;
  public dataSignature: string;
  public acknowledged: boolean;

  constructor(nativeValue: Purchase | SKPaymentTransaction, restored: boolean = false) {
    this.nativeValue = nativeValue;
    this.restored = restored;
  }
}

export enum OrderState {
  INVALID = 'INVALID',
  PROVISIONAL = 'PROVISIONAL',
  VALID = 'VALID',
}
