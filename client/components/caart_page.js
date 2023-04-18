import React, { Component } from 'react';
import { createContainer } from 'react-meteor-data';
import { Cart } from '../../imports/collections/cart';
import { Products } from '../../imports/collections/products';
import { Vendors } from '../../imports/collections/vendors';
import { Profile } from '../../imports/collections/profile'
import { Orders } from '../../imports/collections/orders'
import { Cache } from './subcomponents/widgets/cache';
import BackButton from './subcomponents/back_button';
import BottomMenu from './subcomponents/bottom_menu';
import ProductBox from './subcomponents/product_box';
import DeliverySelection from './subcomponents/delivery_select';
import FormatNumber from './subcomponents/widgets/format_number';
import QuantityBox from './subcomponents/widgets/quantity_box';
import MessageBox from './subcomponents/widgets/message_box';
import history from './subcomponents/widgets/history';
import ErrorBox from './subcomponents/widgets/error_box';
import PaymentBox from './subcomponents/payment_box';
import InstallmentBox from './subcomponents/widgets/installment_box';
import Waiting from './subcomponents/widgets/waiting';
import ConfirmPayment from './subcomponents/widgets/confirm_payment';

class CartPage extends Component{
    constructor(props){
        super(props)
        this.load = false;
        this.incompleteProduct = [];
        this.productIds = [];
        this.time = 0; 
        this.order = {};
        this.state={
            profile: undefined,
            packages: [],
            delivery: {
                name:'',
                price: 0,
                index: -1,
                box:{
                    w: 0,
                    d: 0,
                    h: 0,
                    wg: 0,
                    error: false
                }
            },
            installment:{
                parcel: 1,
                price: 0,
                total:0
            },
            subtotal: 0,
            card: {},
            selectData: {},
            selectIndex: -1,
            cpfCnpj:'',
            waiting: false,
            removeBox: false,
            removeItem: undefined,
            paymentWarning: false,
            deliveryWarning: false,
            finishWarning: false,
            emptyWarning: false,
            installmentSelect: false,
            quantityBox: false,
            cpfCnpjWarning: false,
            loading: false,
            paymentConfirm: false,
            error: {}
        }
    }
    handleDeliveryValue(delivery) {
        this.setState({ delivery: delivery });    
    }
    installmentHandler(installment){
        this.setState({ installment: installment })
    }
    selectItem(index){
        if (!this.state.waiting && !this.state.removeBox && this.state.packages.length > 0 &&
            !this.state.deliveryWarning &&!this.state.finishWarning && !this.state.emptyWarning && 
            !this.state.paymentWarning){
                this.setState({
                    selectData: this.state.packages[index],
                    selectIndex: index,
                    quantityBox: true,
                    removeBox:false
                });
            }        
    }
    confirmRemove(){        
        if (this.state.removeItem){
            Meteor.call('cart.remove', this.state.removeItem, (error)=>{
                this.load = false;
                if (!error){
                    this.setState({ 
                        delivery: {
                            name:'',
                            price: 0,
                            index: -1,
                            box:{
                                w: 0,
                                d: 0,
                                h: 0,
                                wg: 0,
                                error: false
                            }
                        },
                        waiting: false,
                        removeBox:false,
                        selectData: {},
                        selectIndex: -1,
                        quantityBox: false,
                        removeItem: undefined,
                        error: {}
                    })
                }else{
                    this.setState({
                        waiting: false,
                        removeBox:false,
                        selectData: {},
                        selectIndex: -1,
                        quantityBox: false,
                        removeItem: undefined,
                        error: error
                    });
                }
            });
        }                        
    }    
    closeBox(){
        if (this.state.paymentConfirm){
            this.setState({
                waiting:false,
                paymentConfirm:false
            })
        }
        if (this.state.waiting == false){
            this.setState({
                quantityBox: false,
                selectIndex: -1,
                selectData: {},
                removeBox: false,
                deliveryWarning: false,
                emptyWarning: false,
                finishWarning: false,
                paymentWarning: false,
                installmentSelect: false,
                cpfCnpjWarning: false,
                paymentConfirm:false
            });
        }else{
            this.setState({                
                removeBox: false,
                selectIndex: -1,
                selectData: {},
                cpfCnpjWarning: false,
                paymentConfirm: false
            });
        }        
    }
    quantityHandler(index, qtd){
        let _package = this.state.packages[index] 
        if (_package.quantity + qtd <= 0){
            this.setState({
                removeBox: true,
                selectData: {},
                selectIndex: -1,
                quantityBox: false,
                removeItem: _package,
                error: {}
            });
            return;
        } 
        if (this.state.waiting == false){
            this.setState({                
                waiting: true,
                selectData: {},
                selectIndex: -1,
                quantityBox: false,
                removeBox: false,
                error: {}
            });                      
            Meteor.call('cart.increaseQuantity', _package, qtd, (error) => {
                this.load = false;
                if (!error){
                    this.setState({
                        delivery: {
                            name:'',
                            price: 0,
                            index: -1,
                            box:{
                                w: 0,
                                d: 0,
                                h: 0,
                                wg: 0,
                                error: false
                            }
                        },
                        removeBox: false,
                        selectData: {},
                        selectIndex: -1,
                        quantityBox: false,
                        waiting: false,
                        error: {}
                    });
                }else{
                    console.log(error)
                    this.setState({
                        removeBox: false,
                        selectData: {},
                        selectIndex: -1,
                        quantityBox: false,
                        waiting: false,
                        error: error
                    });

                }
            })
        }
    }
    finishOrder(){
        if (this.state.paymentConfirm){return;}
        if (!this.state.waiting && !this.state.removeBox && this.state.packages.length > 0 && 
            this.state.delivery.name != '' && this.state.delivery.index >= 0 && 
            !this.state.deliveryWarning && this.state.profile && this.state.card.lastDigits &&
            !this.state.finishWarning && !this.state.emptyWarning && !this.state.paymentWarning&&
            !this.state.quantityBox && !this.state.cpfCnpjWarning && !this.state.loading
            ){

            this.setState({ waiting: true});
            let vendorId =  this.state.packages[0].product.id_vendor;
            let packages = this.state.packages;
            let delivery = this.state.delivery;
            let profile = this.state.profile;
            let subtotal = this.state.subtotal;
            let total = this.state.installment.total;
            let installments = this.state.installment.parcel;  
            let card = this.state.card;
            let cpfCnpj = this.state.cpfCnpj;
            let deliveryPrice = this.state.delivery.price;
            if (!(/^\d{2}.\d{3}.\d{3}\/\d{4}\-\d{2}$/.test(cpfCnpj))){
                if (!(/^\d{3}.\d{3}.\d{3}\-\d{2}$/.test(cpfCnpj))){
                    this.setState({
                        cpfCnpjWarning: true,
                        waiting: false
                    })
                    return;
                }
            }             
            Meteor.call('freshProducts', this.productIds, this.time, {}, (error, result)=>{
                if (!error){
                    if (result) {
                        this.reload()
                    }else{
                        this.order = {
                            user_id: Meteor.userId(),
                            mainAddress: profile.mainAddress,
                            vendorId: vendorId,
                            packages: packages,
                            delivery: delivery,
                            total: total,
                            subtotal: subtotal,
                            installments: installments,
                            card: card,
                            cpfCnpj: cpfCnpj,
                            deliveryPrice: deliveryPrice 
                        }
                        this.setState({
                            paymentConfirm: true
                        });
                    }
                }else{
                    console.log(error)
                    this.load = false;
                    this.setState({
                        waiting: false,
                        finishWarning: true
                    });
                }
            })
        }else{            
            if (!this.state.waiting && this.state.packages.length == 0){
                this.setState({ emptyWarning: true });
                return;
            }
            if (!this.state.card.lastDigits && !this.state.paymentWarning){
                this.setState({ paymentWarning: true });
                return;
            }
            if ((this.state.delivery.name == '' || this.state.delivery.index < 0) && !this.state.deliveryWarning){
                this.setState({ deliveryWarning: true });
                return;                
            }
        }
    }
    confirmOrder(cvv){
        this.setState({loading: true, paymentConfirm:false});
        let order = this.order;
        order.card.cvv = cvv;
        Meteor.call('finishOrder', order.user_id, order.mainAddress, 
        order.vendorId, order.packages, order.delivery, order.total, 
        order.subtotal, order.installments, order.card, order.cpfCnpj, 
        order.deliveryPrice, (error, result)=>{
            if (!error){
                if (result != false){
                    history.push('/pedido/'+result) 
                    this.setState({
                        loading: false,
                        waiting: false
                    });
                }else{
                    this.setState({
                        loading: false,
                        waiting: false
                    });
                }
            }else{
                this.setState({
                    loading: false,
                    waiting: false
                });
            }
        });
    }
    checkCart(){
        Meteor.call('checkCart')
    }
    reload(){
        Meteor.call('freshProducts', this.productIds, this.time, {}, (error, result)=>{
            if (!error){
                if (result) {
                    this.load = false;
                    this.selectIndex = -1;
                    this.totalWeight = 0;
                    this.totalVolume = 0;
                    this.productIds = [];
                    this.time = 0;
                    this.setState({
                        profile: undefined,
                        packages: [],
                        delivery: {
                            name:'',
                            price: 0,
                            index: -1
                        },
                        card: {},
                        waiting: false,
                        removeBox: false,
                        removeItem: undefined,
                        paymentWarning: false,
                        deliveryWarning: false,
                        finishWarning: false,
                        emptyWarning: false,
                        error: {}
                    });
                }
            }else{
                console.log(error)
                this.load = false;
                this.setState({
                    waiting: false,
                    finishWarning: true
                });
            }
        })        
        setTimeout(()=>{this.reload()}, 10*60*1000)
    } 
    render(){ 
        if (!this.load){
            setTimeout(()=>{this.reload()}, 10*60*1000)
            this.empty = 'none';
            this.load = true;
            Meteor.subscribe('cartFields', 'CartPage', Meteor.userId(), ()=>{
                let cart = Cart.find({'user_id': Meteor.userId()}).fetch();                
                if (cart[0].cart.length > 0){             
                    this.empty = 'none';       
                    let vendorId = cart[0].cart[0].vendor_id;                
                    this.time = new Date;
                    let cartQuantity = [];
                    this.productIds = [];
                    cart[0].cart.map(product=>{
                        this.productIds.push(product.product_id);
                        cartQuantity[product.product_id] = product.quantity;
                    });                                
                    Meteor.subscribe('productFields', 'CartPage', this.productIds, ()=>{
                        let products = Products.find({'_id': { $in: this.productIds }}).fetch()                        
                        let _packages = [];
                        let _subtotal = 0;
                        products.map(product=>{
                            product.price = parseFloat(product.price); 
                            
                            let item = {
                                product: product,
                                quantity: cartQuantity[product._id]
                            }                                                   
                            _subtotal += product.price * cartQuantity[product._id] 

                            if (item.quantity <= 0){
                                Meteor.call('cart.remove', item)
                            }else{
                                _packages.push(item);
                            }
                                                    
                        });
                        _subtotal = (Math.round(_subtotal*100)/100);
                        this.setState({
                            subtotal: _subtotal,
                            installment:{
                                parcel: 1,
                                price: _subtotal,
                                total: _subtotal
                            },
                            packages: _packages
                        })
                    })
                    if (!this.state.vendor){
                        Meteor.subscribe('vendorFields', 'CartPage', vendorId, ()=>{
                            let vendor = Vendors.find({'id': vendorId}).fetch()
                            this.setState({                                
                                vendor: vendor[0]
                            })
                        })
                    }
                    Meteor.subscribe('profileFields', 'DeliveryPage', Meteor.userId(), ()=>{
                        let profile = Profile.find({}).fetch();
                        this.setState({
                            profile:{
                                name: profile[0].profile.name,
                                email: profile[0].emails[0].address,
                                mainAddress: profile[0].profile.mainAddress,
                                address: profile[0].profile.address[profile[0].profile.mainAddress]
                            }
                        });                    
                    });                    
                }else{
                    this.empty = 'block'
                    this.setState({
                        packages: [],
                        vendor: {}
                    });
                }                
            });
        }    

        if (!this.state.packages || !this.state.vendor || !this.state.profile){return(<div></div>)} 
        return(<div  className='mainContainer' style={{position: 'relative'}}>
            <BackButton title='Carrinho'/>            
            <div className='mainContainer' style={{marginTop:'15px'}}>
                <PaymentBox installment={this.state.installment} openSelect={()=>{this.setState({installmentSelect: true})}} payment={(card, index)=>{card.index = index; this.setState({ card: card });}} cpfHandler={(cpfCnpj)=>{this.setState({ cpfCnpj: cpfCnpj })}}/>
                <div style={{margin:'40px auto', textAlign:'center', display: this.empty}}>Seu carrinho esta vazio.</div>
                <ProductBox type='cart' data={this.state.packages} quantity={(index)=>{this.selectItem(index)}} select={(index)=>{this.selectItem(index)}} selectIndex={this.state.selectIndex}/>
                <DeliverySelection packages={this.state.packages} selection={(delivery)=>{this.handleDeliveryValue(delivery)}} vendor={this.state.vendor} profile={this.state.profile} ref={instance => { this.child = instance; }}/>
                <div style={{marginLeft:'10px', marginBottom:'10px', marginTop:'20px', fontSize:'14px', fontWeight:'bold', color:'#555'}}>Resumo do pedido</div>
                <div style={{backgroundColor:'white', borderTop:'1px solid #ccc', borderBottom:'1px solid #ccc'}}>    
                    <div style={{height:'25px', margin:'5px 20px', marginTop:'10px', display:'flex'}}>
                        <div style={{height:'25px', lineHeight:'25px', fontSize:'15px', width:'70px'}}>Subtotal:</div>
                        <div style={{height:'25px', marginLeft:'10px', lineHeight:'25px', fontSize:'15px'}}>R$ <FormatNumber number={this.state.subtotal}/></div>
                    </div> 
                    <div style={{height:'25px', margin:'5px 20px', display:'flex'}}>
                        <div style={{height:'25px', lineHeight:'25px', fontSize:'15px', width:'70px'}}>Frete:</div>
                        <div style={{height:'25px', marginLeft:'10px', lineHeight:'25px', fontSize:'15px'}}>R$ <FormatNumber number={this.state.delivery.price}/></div>
                    </div>               
                    <div style={{height:'25px', margin:'5px 20px', display:'flex'}}>
                        <div style={{height:'25px', lineHeight:'25px', fontSize:'15px', width:'70px'}}>Total:</div>
                        <div style={{height:'25px', marginLeft:'10px', lineHeight:'25px', fontSize:'15px'}}>R$ <FormatNumber number={this.state.installment.total}/></div>
                    </div>
                </div>
                <div style={{width: '190px', height:'35px', margin:'0 auto', marginTop:'20px', textAlign:'center', lineHeight:'35px', borderRadius:'25px', border:'2px solid #ff7000', fontWeight:'bold', color:'white', backgroundColor:'#ff7000'}} onClick={()=>{this.finishOrder()}}>Finalizar Compra</div>
            </div>
            <QuantityBox open={this.state.quantityBox} select={this.state.selectData} confirm={(qtd)=>{this.quantityHandler(this.state.selectIndex, qtd)}} cancel={()=>{this.closeBox()}}/>
            <MessageBox open={this.state.removeBox} confirm={()=>{this.confirmRemove()}} cancel={()=>{this.closeBox()}} message='Tem certeza que deseja remover este produto do carrinho?' options={['Remover', 'Cancelar']}/>            
            <InstallmentBox open={this.state.installmentSelect} close={()=>{this.closeBox()}} subtotal={this.state.subtotal} delivery={this.state.delivery} installment={(installment)=>{this.installmentHandler(installment)}}/>
            <ErrorBox open={this.state.emptyWarning} close={()=>{this.closeBox()}} message='Seu carrinho esta vazio.'/>
            <ErrorBox open={this.state.paymentWarning} close={()=>{this.closeBox()}} message='Selecione uma forma de pagamento.'/>
            <ErrorBox open={this.state.finishWarning} close={()=>{this.closeBox()}} message='Ocorreu um erro ao finalizar o pedido, atualize a página e tente novamente.'/>
            <ErrorBox open={this.state.deliveryWarning} close={()=>{this.closeBox()}} message='Selecione uma categoria de entrega.'/>
            <ErrorBox open={this.state.cpfCnpjWarning} close={()=>{this.closeBox()}} message='Não foi possível validar o CPF/CNPJ fornecido.'/>
            <ConfirmPayment open={this.state.paymentConfirm} close={()=>{this.closeBox()}} confirm={(cvv)=>{this.confirmOrder(cvv)}}/>
            <Waiting open={this.state.loading}/>
            <BottomMenu />
        </div>)
    }
}

export default CartPage;