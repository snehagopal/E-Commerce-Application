import { LightningElement,wire,track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
import getProductsByProductCode from '@salesforce/apex/ProductList.getProductsByProductCode';
import addedToCartProducts from '@salesforce/apex/ProductList.addedToCartProducts';
import addedToWishlistProducts from '@salesforce/apex/ProductList.addedToWishlistProducts';
import wishlistProducts from '@salesforce/apex/ProductList.wishlistProducts';
import cartProducts from '@salesforce/apex/ProductList.cartProducts';
import { refreshApex } from '@salesforce/apex';
import cancelCartProducts from '@salesforce/apex/ProductList.CancelCartProducts';
import cancelWishlistProducts from '@salesforce/apex/ProductList.cancelWishlistProducts';
import noHeader from '@salesforce/resourceUrl/NoHeader';
import {loadStyle} from "lightning/platformResourceLoader";
export default class Products extends NavigationMixin(LightningElement) {
    clothings;
    watches;
    shoes;
    womensclothings;
    jewelleries;
    beauties;
    toys;
    accessories;
    @track wishlists;
    @track carts;
    @track clothingList;
    showPreviousButton=false;
    showNextButton=true;
    showClothing = true;
    showWatches = false;
    showShoes = false;
    showWomensClothing = true;
    showJewellery = false;
    showBeauty = false;
    showToys = true;
    showAccessories = false;
    wishlist = [];
    @track selectedQuantity;
    @track totalAmount = 0;
    @track cartProducts=[];
    @track wishlistProducts=[];
    currentPage = 1;
    productsPerPage = 5;
    totalPages=3;
    showEmptyHeart=true;
    showFilledHeart=false;
    wiredMensClothingResult;
    wiredMensWatchesResult;
    wiredMensShoesResult;
    wiredWomensClothingResult;
    wiredWomensJewelleryResult;
    wiredWomensBeautyResult;
    wiredKidsToysResult;
    wiredKidsAccessoriesResult;
    wiredCartProductsResult;
    wiredwishlistProductsResult;
    @track leadId;
    connectedCallback() {
        loadStyle(this, noHeader);
    }
    @wire(getProductsByProductCode,{ productCode: '%BC-%',pageNumber: '$currentPage', pageSize: '$productsPerPage'})
      wiredMensClothingAvailable(result) {
        this.wiredMensClothingResult = result;
        const { data, error } = result;
        if (data) {
            this.clothings = data;
        } else if (error) {
            console.error(error);
        }
    }
    @wire(getProductsByProductCode,{ productCode: '%MW-%',pageNumber: '$currentPage', pageSize: '$productsPerPage'})
      wiredMensWatchesAvailable(result) {
        this.wiredMensWatchesResult = result;
        const { data, error } = result;
        if (data) {
            this.watches = data;
        } else if (error) {
            console.error(error);
        }
    }
    @wire(getProductsByProductCode,{ productCode: '%MS-%',pageNumber: '$currentPage', pageSize: '$productsPerPage'})
      wiredMensShoesAvailable(result) {
        this.wiredMensShoesResult = result;
        const { data, error } = result;
        if (data) {
            this.shoes = data;
        } else if (error) {
            console.error(error);
        }
    }
    @wire(getProductsByProductCode,{ productCode: '%WC-%' ,pageNumber: '$currentPage', pageSize: '$productsPerPage'})
      wiredWomensClothingAvailable(result) {
        this.wiredWomensClothingResult = result;
        const { data, error } = result;
        if (data) {
            this.womensclothings = data;
        } else if (error) {
            console.error(error);
        }
    }
    @wire(getProductsByProductCode,{ productCode: '%WJ-%',pageNumber: '$currentPage', pageSize: '$productsPerPage'})
      wiredWomensJewelleryAvailable(result) {
        this.wiredWomensJewelleryResult = result;
        const { data, error } = result;
        if (data) {
            this.jewelleries = data;
        } else if (error) {
            console.error(error);
        }
    }
    @wire(getProductsByProductCode,{ productCode: '%WB-%',pageNumber: '$currentPage', pageSize: '$productsPerPage'})
      wiredWomensBeautyAvailable(result) {
        this.wiredWomensBeautyResult = result;
        const { data, error } = result;
        if (data) {
            this.beauties = data;
        } else if (error) {
            console.error(error);
        }
    }
    @wire(getProductsByProductCode,{ productCode: '%KT-%',pageNumber: '$currentPage', pageSize: '$productsPerPage'})
      wiredKidsToysAvailable(result) {
        this.wiredKidsToysResult = result;
        const { data, error } = result;
        if (data) {
            this.toys = data;
        } else if (error) {
            console.error(error);
        }
    }
    @wire(getProductsByProductCode,{ productCode: '%KA-%',pageNumber: '$currentPage', pageSize: '$productsPerPage'})
      wiredKidsAccessoriesAvailable(result) {
        this.wiredKidsAccessoriesResult = result;
        const { data, error } = result;
        if (data) {
            this.accessories = data;
        } else if (error) {
            console.error(error);
        }
    }
    @wire(cartProducts)
    wiredCartProducts(result) {
      this.wiredCartProductsResult = result;
      const { data, error } = result;
        if (data) {
            this.carts = data;
        } else if (error) {
            console.error(error);
        }
    }  
    @wire(wishlistProducts)
    wiredwishlistProducts(result) {
      this.wiredwishlistProductsResult = result;
      const { data, error } = result;
        if (data) {
            this.wishlists = data;
        } else if (error) {
            console.error(error);
        }
    }  
    handleMensClothing()
    {
        this.showClothing=true;
        this.showWatches=false;
        this.showShoes=false;

    }
    handleMensWatches()
    {
        this.showClothing=false;
        this.showWatches=true;
        this.showShoes=false;
    }
    handleMensShoes()
    {
        this.showClothing=false;
        this.showWatches=false;
        this.showShoes=true;
    }
    handleWomensClothing()
    {
        this.showWomensClothing=true;
        this.showJewellery=false;
        this.showBeauty=false;
    }
    handleWomensJewellery()
    {
        this.showWomensClothing=false;
        this.showJewellery=true;
        this.showBeauty=false;
    }
    handleWomensBeauty()
    {
        this.showWomensClothing=false;
        this.showJewellery=false;
        this.showBeauty=true;
    }
    handleKidsToys()
    {
        this.showKidsClothing=false;
        this.showToys=true;
        this.showAccessories=false;
    }
    handleKidsAccessories()
    {
        this.showKidsClothing=false;
        this.showToys=false;
        this.showAccessories=true;
    }
    handleAction(event)
    {
        this.addToCart(event);
    }
    handleWishlistAction(event)
    {
        this.wishList(event);
    }
    handleQuantityChange(event) {
        this.selectedQuantity = event.target.value;
        event.target.value = ' ';
    }
    handleNextPage() {
        if(this.currentPage<this.totalPages)
        {
        this.currentPage++;
        }
        this.showPreviousButton = true;
        this.showNextButton = this.currentPage < this.totalPages; 
    }
    
    handlePreviousPage() {
        
        if (this.currentPage > 1) {
            this.currentPage--;            
        }
        this.showPreviousButton = this.currentPage > 1;
        this.showNextButton = true;
    }
    get clothings() {
        const startIndex = (this.currentPage - 1) * this.productsPerPage;
        const endIndex = startIndex + this.productsPerPage;
        return this.clothings.slice(startIndex, endIndex);
    }
    get watches() {
        const startIndex = (this.currentPage - 1) * this.productsPerPage;
        const endIndex = startIndex + this.productsPerPage;
        return this.watches.slice(startIndex, endIndex);
    }
    get shoes() {
        const startIndex = (this.currentPage - 1) * this.productsPerPage;
        const endIndex = startIndex + this.productsPerPage;
        return this.shoes.slice(startIndex, endIndex);
    }
    get womensclothings() {
        const startIndex = (this.currentPage - 1) * this.productsPerPage;
        const endIndex = startIndex + this.productsPerPage;
        return this.womensclothings.slice(startIndex, endIndex);
    }
    get jewelleries() {
        const startIndex = (this.currentPage - 1) * this.productsPerPage;
        const endIndex = startIndex + this.productsPerPage;
        return this.jewelleries.slice(startIndex, endIndex);
    }
    get beauties() {
        const startIndex = (this.currentPage - 1) * this.productsPerPage;
        const endIndex = startIndex + this.productsPerPage;
        return this.beauties.slice(startIndex, endIndex);
    }
    get toys() {
        const startIndex = (this.currentPage - 1) * this.productsPerPage;
        const endIndex = startIndex + this.productsPerPage;
        return this.toys.slice(startIndex, endIndex);
    }
    get accessories() {
        const startIndex = (this.currentPage - 1) * this.productsPerPage;
        const endIndex = startIndex + this.productsPerPage;
        return this.accessories.slice(startIndex, endIndex);
    }
    addToCart(event) {
        const urlParams = new URLSearchParams(window.location.search);
        const leadId = urlParams.get('c__leadId');
        console.log(leadId);
        if (!leadId) {
            this.showToast('Error', 'Please log in to your account', 'error');
            this.navigateToSignupLoginPage();
            return;
        }
        const productId=event.target.dataset.productId;
        const productName=event.target.dataset.productName;
        const productStatus=event.target.dataset.productStatus;
        const totalStock = parseFloat(event.target.dataset.totalStock); 
        if (productStatus === 'Out of Stock') {
            this.showToast('Error', 'This product is currently out of stock', 'error');
            return;
          }
          if (this.selectedQuantity > totalStock) {
            this.showToast('Error', 'Only '+totalStock+' Products available', 'error');
            return;
        }
        addedToCartProducts({ leadId: leadId, productId: productId, productName: productName ,quantity: this.selectedQuantity})
            .then(() => {
                console.log('Success: Added');
                console.log('leadId:' + leadId);
                console.log('productId:' + productName+productStatus);
                console.log('productId:' + productId);
                this.showToast('Success', productName +' added to cart', 'success');
                refreshApex(this.wiredMensClothingResult);
                refreshApex(this.wiredMensWatchesResult);
                refreshApex(this.wiredMensShoesResult);
                refreshApex(this.wiredWomensClothingResult);
                refreshApex(this.wiredWomensJewelleryResult);
                refreshApex(this.wiredKidsToysResult);
                refreshApex(this.wiredKidsAccessoriesResult);
                return refreshApex(this.wiredCartProductsResult);
            })
            .catch(error => {
                console.error(error);
            });


}
    
    wishList(event) {
        const urlParams = new URLSearchParams(window.location.search);
        const leadId = urlParams.get('c__leadId');
        console.log(leadId);
        if (!leadId) {
            this.showToast('Error', 'Please log in to your account', 'error');
            this.navigateToSignupLoginPage();
            return;
            
        }
        const productId=event.target.dataset.productId;
        const productName=event.target.dataset.productName;
        const quantity=this.selectedQuantity;
        const productStatus=event.target.dataset.productStatus;
        if(productStatus==='True')
        {
            this.showToast('Error', 'This Product is already in wishlist', 'error');
            return;
        }
        addedToWishlistProducts({ leadId: leadId, productId: productId, productName: productName ,quantity: quantity})
            .then((result) => {
                console.log('Wishlist Success: Added');
                console.log('leadId:' + leadId);
                console.log('productName:' + productName);
                console.log('productId:' + productId);
                console.log('result:' + result);
                this.showToast('Success', productName +' added to wishlist', 'success');
                this.addToCart(event);
                return refreshApex(this.wiredwishlistProductsResult);
                

            })
            .catch(error => {
                console.error(error);
            });
    }
    handleCartCancel(event)
    {
        const cartId=event.target.dataset.cartId;
        cancelCartProducts({cartId:cartId})
        .then(()=>{
            console.log('Success:Removed');
            this.showToast('Success','Product removed from your cart','success');
            refreshApex(this.wiredMensClothingResult);
            refreshApex(this.wiredMensWatchesResult);
            refreshApex(this.wiredMensShoesResult);
            refreshApex(this.wiredWomensClothingResult);
            refreshApex(this.wiredWomensJewelleryResult);
            refreshApex(this.wiredKidsToysResult);
            refreshApex(this.wiredKidsAccessoriesResult);
            return refreshApex(this.wiredCartProductsResult);
        })
        .catch(error=>{
            console.error(error);
        });
    }
    handleWishlistCancel(event)
    {
        const cartId=event.target.dataset.cartId;
        cancelWishlistProducts({cartId:cartId})
        .then(()=>{
            console.log('Success:Removed');
            this.showToast('Success','Product removed from your wishlist','success');
            return refreshApex(this.wiredwishlistProductsResult);
        })
        .catch(error=>{
            console.error(error);
        });
    }
    handlePayment(event)
    {
        const urlParams = new URLSearchParams(window.location.search);
        const leadId = urlParams.get('c__leadId');
        this.showToast('Success', 'Payment Successful', 'success');
        this.navigateToPaymentPage();
        return refreshApex(this.wiredCartProductsResult);  

        /*checkOutProducts({leadId:leadId})
        .then(()=>{
            this.showToast('Success', 'Payment Successful', 'success');
            return refreshApex(this.wiredCartProductsResult);   
        })
        
        .catch(error=>{
            console.error(error);
        })
        .finally(() => {
            this.navigateToPaymentPage();
        });*/
        
    }
    navigateToPaymentPage() {
        const urlParams = new URLSearchParams(window.location.search);
        const leadId = urlParams.get('c__leadId');
        console.log(leadId);
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: `/lightning/n/Payment?c__leadId=${leadId}`
            }
        });
    }
    navigateToSignupLoginPage(){
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: `/lightning/n/Signup_Login`
            }
        });
    } 
    showToast(title, message, variant)
    {
        const toastEvent = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant
        });
        this.dispatchEvent(toastEvent);
    }
    
}