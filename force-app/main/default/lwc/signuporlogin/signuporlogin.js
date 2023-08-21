import { LightningElement,track} from 'lwc';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import {NavigationMixin} from 'lightning/navigation';
import loginDetails from '@salesforce/apex/ProductList.loginDetails';
import noHeader from '@salesforce/resourceUrl/NoHeader';
import {loadStyle} from "lightning/platformResourceLoader";
export default class Signuporlogin extends NavigationMixin(LightningElement){
    @track email;
    @track password;
    @track loginError = false;
    ShowSignup=true;
    ShowLogin=false;

    connectedCallback() {
        loadStyle(this, noHeader)
            .then(result => {});
    }
    handleSignUp()
    {
        this.ShowSignup=true;
        this.ShowLogin=false;
    }
    handleLogin()
    {
        this.ShowSignup=false;
        this.ShowLogin=true;
    }
    handleSignupSuccess(event)
    {
        const leadId=event.detail.id;
        const fields=event.detail.fields;
        const email=fields.Email.value;
        const password=fields.Password__c.value;
        loginDetails({email,password})
        .then(result=>{
            if(result)
            {
                console.log('Success Signup');
            }
            else
            {
                this.loginError=true;
            }
        })
        .catch(error=>{
            console.error(error);
        });
        console.log('Lead ID:', leadId);
        const toastEvent=new ShowToastEvent({
            title:"Success",
            message:"Signup Successful",
            variant:'success'
        });
        this.dispatchEvent(toastEvent);
    }
    handleEmailChange(event) {
        this.email = event.target.value;
    }

    handlePasswordChange(event) {
        this.password = event.target.value;
    }

    handleLoginSuccess(event) {
        if (!this.email || !this.password) {
            this.loginError = true;
            const toastEvent = new ShowToastEvent({
                title: "Error",
                message: "Please enter both email and password",
                variant: 'error'
            });
            this.dispatchEvent(toastEvent);
            return;
        }

        loginDetails({ email: this.email, password: this.password })
            .then(result => {
                if (result) {
                    console.log('Success Login ' + JSON.stringify(result));
                    const toastEvent = new ShowToastEvent({
                        title: "Success",
                        message: "Login Successful",
                        variant: 'success'
                    });
                    this.dispatchEvent(toastEvent);
                    this.navigateToProductPage(result);
                } 
            })
            .catch(error => {
                console.error(error);
                this.loginError = true;
                const toastEvent = new ShowToastEvent({
                    title: 'Error',
                    message: 'Invalid Email or Password',
                    variant: 'error',
                });
                this.dispatchEvent(toastEvent);
            });
    }

    navigateToProductPage(leadId) {
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: `/lightning/n/Products?c__leadId=${leadId}`
            }
        });
    }

}