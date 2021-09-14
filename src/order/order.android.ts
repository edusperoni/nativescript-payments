import { BaseOrder, OrderState } from './order.common';

type Purchase = com.android.billingclient.api.Purchase;

export { OrderState } from './order.common';

export class Order extends BaseOrder {
  public nativeValue: Purchase;

  constructor(nativeValue: Purchase, restored: boolean = false) {
    super(nativeValue, restored);

    const jsonObject: any = JSON.parse(nativeValue.getOriginalJson());
    // TODO: treat multiple SKUs
    this.itemId = nativeValue.getSkus().get(0) as string;
    this.receiptToken = nativeValue.getPurchaseToken();
    this.dataSignature = nativeValue.getSignature();
    this.orderId = nativeValue.getOrderId();
    this.userData = jsonObject.developerPayload;
    this.isSubscription = jsonObject.autoRenewing;
    this.orderDate = new Date(nativeValue.getPurchaseTime());
    this.acknowledged = nativeValue.isAcknowledged();
    if (typeof jsonObject.purchaseState !== 'undefined') {
      // console.log('jsonObject.purchaseState:', jsonObject.purchaseState);
      switch (jsonObject.purchaseState) {
        case 0:
          this.state = OrderState.VALID;
          break;
        case 1:
        case 2:
        default:
          if (this.isSubscription) {
            // for now try this:
            this.state = OrderState.VALID;
          } else {
            this.state = OrderState.INVALID;
          }
          break;
      }
    } else {
      // force it to be processed and consumed so it doesn't get stuck
      this.state = OrderState.VALID;
    }
  }

  get debug(): string {
    return this.nativeValue.getOriginalJson();
  }
}
