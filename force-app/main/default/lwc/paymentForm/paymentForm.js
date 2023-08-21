import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import noHeader from '@salesforce/resourceUrl/NoHeader';
import {loadStyle} from "lightning/platformResourceLoader";
import createOrder from '@salesforce/apex/ProductList.createOrder';
export default class PaymentForm extends LightningElement {
    @track address = '';
    @track cardNumber = '';
    @track expirationDate = '';
    @track cvv = '';
    showPaymentForm=true;
    orderPlacedMessage='';
    order = {};
    connectedCallback() {
        loadStyle(this, noHeader)
            .then(result => {});
    }
    handleAddressChange(event)
    {
        this.address=event.target.value;
    }
    handleCardNumberChange(event) {
        this.cardNumber = event.target.value;
    }

    handleExpirationDateChange(event) {
        this.expirationDate = event.target.value;
    }

    handleCvvChange(event) {
        this.cvv = event.target.value;
    }
    handleConfirmOrder() {
        
        console.log('Card Number:', this.cardNumber);
        console.log('Expiration Date:', this.expirationDate);
        console.log('CVV:', this.cvv);
        const urlParams = new URLSearchParams(window.location.search);
        this.leadId = urlParams.get('c__leadId');
        console.log(this.leadId);
        createOrder({leadId:this.leadId})
       .then((result) => {
        this.showToast('Success', 'Order Placed', 'success');
        console.log(result);
        this.order=result;
        this.showPaymentForm = false;
        this.orderPlacedMessage = 'Your order will be delivered on 15-06-2023.Thanks for Shopping!!!';
        this.clearForm();
      })
      .catch((error) => {
        console.error('Error creating order:', error);
      });
        
    }

    showToast(title, message, variant) {
        const toastEvent = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant
        });
        this.dispatchEvent(toastEvent);
    }

    clearForm() {
        this.cardNumber = '';
        this.expirationDate = '';
        this.cvv = '';
    }
   
        
}