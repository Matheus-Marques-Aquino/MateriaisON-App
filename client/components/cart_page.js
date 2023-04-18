import React, { Component } from 'react';
import { Cart } from '../../imports/collections/cart';
import { Products } from '../../imports/collections/products';
import { Vendors } from '../../imports/collections/vendors';
import { Profile } from '../../imports/collections/profile'
import BackButton from './subcomponents/back_button';
import BottomMenu from './subcomponents/bottom_menu';
import Waiting from './subcomponents/widgets/waiting';
import PaymentBox from './subcomponents/payment_box';
import InstallmentBox from './subcomponents/widgets/installment_box';
import ProductBox from './subcomponents/product_box';
import QuantityBox from './subcomponents/widgets/quantity_box';
import MessageBox from './subcomponents/widgets/message_box';
import DeliverySelection from './subcomponents/delivery_select';
import FormatNumber from './subcomponents/widgets/format_number';
import history from './subcomponents/widgets/history';
import ErrorBox from './subcomponents/widgets/error_box';
import ConfirmPayment from './subcomponents/widgets/confirm_payment';

class CartPage extends Component{
    constructor(props){
        super(props);
        this.start = false;
        this.reload = false;
        this.complete = 0;
        this.time = new Date;
        this.productIds = [];
        this.productStock = [];
        this.order = {};
        this.state={
            waiting: false,            
            loading: false,
            installment: { parcel: 1, price: 0, total: 0 },
            paymentData: { cpfCnpj: '', card: { cvv: '' }, confirm: false },
            deliveryData: { name: '', price: 0, index: -1, box: { w: 0, d: 0, h:0, wg: 0, error: false } },
            winBox: { 
                installment: false,
                quantity: false,
                warning: false
            },
            select: { index: -1, data: {}, remove: false },
            subtotal: 0,
            packages: []
        }
    }
    closeBox(){
        let paymentData = this.state.paymentData;
        let winBox = {
            warning: false,
            installment: false,            
            quantity: false,
        };        
        paymentData.confirm = false;
        if (this.reload){
            this.start = false;
        }
        this.setState({
            winBox: winBox,
            paymentData: paymentData,
            select: { index: -1, data: {}, remove: false }       
        });
    }
    selectItem(index){
        let winBox = this.state.winBox;
        for (let box in winBox){ 
            if (winBox[box]){ return; }
        }
        let select = { index: index, data: this.state.packages[index], remove: false}
        winBox.quantity = true;
        this.setState({ select: select, winBox: winBox });
    }
    quantityHandler(qtd){
        let index = this.state.select.index;
        let pack = this.state.packages[index];
        let winBox = this.state.winBox;        
        if (pack.quantity + qtd <= 0){
            winBox.quantity = false;
            this.setState({
                select: { index: index, data: {}, remove: pack },
                winBox: winBox,
                error: {}
            });
            return;
        }
        if (!this.state.waiting){
            winBox.quantity = false;
            this.setState({                
                waiting: true,
                select: { index: -1, data: {}, remove: false },
                winBox: winBox,
                error: {}
            });
            Meteor.call('cart.increaseQuantity', pack, qtd, (error) => {
                this.start = false;
                if (!error){
                    this.setState({
                        waiting: false,
                        deliveryData: { name:'', price: 0, index: -1, box:{ w: 0, d: 0, h: 0, wg: 0, error: false } },
                        select: { index: -1, data: {}, remove: false},
                        error: {}
                    }); 
                }else{
                    this.setState({
                        waiting: false,
                        select: { index: -1, data: {}, remove: false},
                        error: error
                    }); 
                }
            });
        }        
    }
    confirmRemove(){
        if (this.state.select.remove){
            Meteor.call('cart.remove', this.state.select.remove, (error)=>{
                this.start = false;
                if (!error){
                    this.setState({
                        waiting: false,
                        deliveryData: { name:'', price: 0, index: -1, box:{ w: 0, d: 0, h: 0, wg: 0, error: false } },
                        select: { index: -1, data: {}, remove: false},
                        error: {}
                    });
                }else{
                    this.setState({
                        waiting: false,
                        deliveryData: { name:'', price: 0, index: -1, box:{ w: 0, d: 0, h: 0, wg: 0, error: false } },
                        select: { index: -1, data: {}, remove: false},
                        error: error
                    });                    
                }
            });
        }
    }
    confirmOrder(){
        let winBox = this.state.winBox;
        let select = this.state.select;
        let waiting = this.state.waiting;
        let packages = this.state.packages;
        let delivery = this.state.deliveryData;
        let profile = this.state.profile;
        let cpfCnpj = this.state.paymentData.cpfCnpj;        
        let loading = this.state.loading;
        let card = this.state.paymentData.card;

        for (let box in winBox){
            if (winBox[box]){ return; }
        }
        if ( select.index != -1 || select.remove || waiting || loading){ return; }        
        if (!(/^\d{2}.\d{3}.\d{3}\/\d{4}\-\d{2}$/.test(cpfCnpj))){
            if (!(/^\d{3}.\d{3}.\d{3}\-\d{2}$/.test(cpfCnpj))){
                winBox.warning = 'Não foi possível validar o CPF/CNPJ fornecido acima.';
                this.setState({ winBox: winBox });
                return;
            }
        }
        if ( packages.length > 0 && delivery.index >= 0 && profile && card.lastDigits){
            let vendorId = packages[0].product.id_vendor;
            let installment = this.state.installment;
            let subtotal = this.state.subtotal;
            let mainAddress = profile.mainAddress;
            let paymentData = this.state.paymentData;            
            this.order = { 
                mainAddress: mainAddress, vendorId: vendorId, packages: packages, card: card,
                delivery: delivery, installment: installment, subtotal: subtotal, cpfCnpj: cpfCnpj                
            } 
            paymentData.confirm = true;           
            this.setState({ paymentData: paymentData });
        }else{
            if (packages.length == 0){
                winBox.warning = 'Seu carrinho esta vazio.';
                this.setState({
                    winBox: winBox
                });
                return;
            }
            if (delivery.index < 0){
                winBox.warning = 'Selecione uma forma de envio.';
                this.setState({
                    winBox: winBox
                });
                return;
            }
            winBox.warning = 'Ocorreu um erro ao finalizar a compra, atualize a página e tente novamente.';
            this.setState({
                winBox: winBox
            });
            return;
        }
    }
    finishOrder(cvv){        
        let order = this.order;
        this.setState({ waiting: true, loading: true });
        order.card.cvv = cvv;
        Meteor.call('finishOrder', Meteor.userId(), order.mainAddress, order.vendorId, order.packages, order.delivery,
        order.installment.total, order.subtotal, order.installment.parcel, order.cpfCnpj, order.delivery.price, order.card, 
        (error, result)=>{
            let winBox = this.state.winBox;
            if (!error){                    
                history.push('/pedido/'+result);
            }else{
                console.log(error)
                winBox.warning = error.reason;
                this.reload = true;
                this.setState({ winbox: winBox, waiting: false, loading: false});
            }                
        });
    }
    orderBlock(){
        let winBox = this.state.winBox;
        winBox.warning = 'Não estamos aceitando pedidos no momento, aguarde o lançamento oficial para efetuar a compra.';
        this.setState({ winBox: winBox});
    }
    render(){        
        if (!this.start){
            this.start = true;
            this.realod = false;
            this.complete = 0;
            //setTimeout(()=>{this.reload()}, 10*60*1000); //10 minutos para atulizar página.
            Meteor.subscribe('cartFields', 'CartPage', Meteor.userId(), ()=>{
                let cart = Cart.findOne({'user_id': Meteor.userId()});
                if (!cart){
                    cart = { cart:[] };
                }                
                cart = cart.cart;
                if (!cart){ cart = []; }
                if (cart.length > 0){
                    let vendorId = cart[0].vendor_id;
                    let cartQuantity = [];                    
                    Meteor.call('checkCart', Meteor.userId(), (error, result)=>{
                        let winBox = this.state.winBox;
                        if (!error){
                            if (!result.success){                                
                                winBox.warning = result.messages[0];
                                this.reload = true;                                
                            }
                        }else{
                            console.log(error);
                        }                        
                        cart.map(product=>{
                            this.productIds.push(product.product_id);
                            cartQuantity[product.product_id] = product.quantity;
                        });  
                        Meteor.subscribe('productFields', 'CartPage', this.productIds, ()=>{
                            let packs = [];
                            let subtotal = 0;                        
                            let products = Products.find({'_id': { $in: this.productIds }}).fetch();
                            products.map(product=>{                            
                                product.price = parseFloat(product.price);
                                let item = { product: product, quantity: cartQuantity[product._id] };
                                if (item.quantity > 0){                                
                                    subtotal += product.price * cartQuantity[product._id];
                                    this.productStock.push(product.stock_quantity);
                                    packs.push(item);
                                }else{
                                    Meteor.call('cart.remove', item);                                    
                                }
                            });                        
                            subtotal = (Math.round(subtotal*100)/100);
                            this.complete += 1;                        
                            this.setState({ 
                                winBox: winBox,                                   
                                installment:{ parcel: 1, price: subtotal, total: subtotal },
                                subtotal: subtotal,
                                packages: packs
                            });
                        });                        
                    });
                    Meteor.subscribe('vendorFields', 'CartPage', vendorId, ()=>{
                        let vendor = Vendors.findOne({'id': vendorId})
                        this.complete += 1;
                        this.setState({ vendor: vendor });
                    });
                }else{
                    let packs = [];
                    let subtotal = 0;
                    this.productStock = [];                    
                    this.complete += 2;
                    this.setState({                                    
                        installment:{ parcel: 1, price: subtotal, total: subtotal },
                        subtotal: subtotal,
                        packages: packs
                    });
                }
            });
            Meteor.subscribe('profileFields', 'DeliveryPage', Meteor.userId(), ()=>{
                let profile = Profile.findOne({'_id': Meteor.userId()});
                let _profile = profile.profile;
                this.complete += 1;
                this.setState({ 
                    profile:{ 
                        name: _profile.name, 
                        email: profile.emails[0].address, 
                        mainAddress: _profile.mainAddress, 
                        address: _profile.address[_profile.mainAddress] 
                    } 
                });
            });
        }        
        if ( this.complete < 3 ){
            return(
            <div className='mainContainer'>
                <BackButton title='Carrinho'/>
                <Waiting open={true} size='60px'/>
                <BottomMenu />
            </div>)
        }
        if ( this.state.packages.length == 0 ){
            return(
            <div className='mainContainer'>
                <BackButton/>                
                    <div style={{height:'55px', display:'flex', backgroundColor:'#ff7000'}}>
                        <div style={{margin:'auto', color:'white', fontSize:'19px', fontWeight:'bold', }}>
                            Carrinho
                        </div>    
                    </div>
                    <PaymentBox installment={this.state.installment} 
                        openSelect={()=>{ 
                            let winBox = this.state.winBox; 
                            winBox.installment = true; this.setState({ winBox: winBox }); 
                        }}
                        payment={(card, index)=>{ 
                            let data = this.state.paymentData; 
                            data.card = card; 
                            data.card.index = index; 
                            this.setState({ paymentData: data }); 
                        }} 
                        cpfHandler={(cpfCnpj)=>{ 
                            let data = this.state.paymentData; 
                            data.cpfCnpj = cpfCnpj; 
                            this.setState({ paymentData: data }); 
                        }}
                    />
                    <div style={{margin:'40px auto', textAlign:'center', fontSize:'15px', fontWeight:'bold'}}>
                        Seu carrinho esta vazio.
                    </div>
                
                <InstallmentBox 
                    open={ this.state.winBox.installment } 
                    close={ ()=>{ this.closeBox(); } } 
                    subtotal={ this.state.subtotal } 
                    delivery={ this.state.deliveryData } 
                    installment={(installment)=>{ this.setState({installment: installment}); }}/>
                <BottomMenu />
            </div>)
        }
        var subtotal = parseFloat(this.state.subtotal).toFixed(2).split('.');
        var frete = parseFloat(this.state.deliveryData.price).toFixed(2).split('.');
        var total = parseFloat(this.state.installment.total).toFixed(2).split('.');
        return(
        <div className='mainContainer'>
            <BackButton/>            
            <div style={{height:'55px', display:'flex', backgroundColor:'#ff7000', marginBottom:'25px'}}>
                <div style={{margin:'auto', color:'white', fontSize:'19px', fontWeight:'bold'}}>Carrinho</div>    
            </div>
            <div style={{padding:'0 10px'}}>
                <PaymentBox installment={this.state.installment} 
                    openSelect={()=>{ 
                        let winBox = this.state.winBox; 
                        winBox.installment = true; 
                        this.setState({ winBox: winBox }); }}
                    payment={(card, index)=>{ 
                        let data = this.state.paymentData; 
                        data.card = card;
                        data.card.index = index; 
                        this.setState({ paymentData: data }); 
                    }} 
                    cpfHandler={(cpfCnpj)=>{ 
                        let data = this.state.paymentData; 
                        data.cpfCnpj = cpfCnpj; 
                        this.setState({ paymentData: data }); 
                    }}
                />
                <ProductBox type='cart' data={this.state.packages} 
                    select={(index)=>{ this.selectItem(index) }} 
                    selectIndex={ this.state.select.index }
                    removeItem={(index)=>{
                        let pack = this.state.packages[index];
                        this.setState({
                            select: { index: index, data: {}, remove: pack },
                            error: {}
                        });
                    }}
                />
                <DeliverySelection packages={this.state.packages} 
                    selection={ (delivery)=>{ this.setState({ deliveryData: delivery }); } } 
                    vendor={this.state.vendor} 
                    profile={this.state.profile}
                />
                <div style={{padding:'10px', marginTop:'10px', backgroundColor:'#F7F7F7'}}>                    
                    <div style={{marginBottom:'10px', fontSize:'15px', fontWeight:'bold', color:'#ff7000', display:'flex'}}>
                        <div style={{width:'10px', height:'10px', margin:'auto 0', backgroundImage:'url(/imgs/icons/icon-rightArrow.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></div>
                        <div style={{marginLeft:'5px'}}>Resumo do pedido</div>                        
                    </div>
                    <div style={{color:'#444', lineHeight:'20px', fontSize:'13px'}}>
                        <div style={{height:'20px', margin:'5px 20px', marginTop:'10px', display:'flex'}}>
                            <div style={{height:'20px', width:'70px'}}>
                                Subtotal:
                            </div>
                            <div style={{height:'20px', marginLeft:'10px'}}>
                                R$ <span>{subtotal[0]},<span style={{fontSize:'10px', position:'relative', top:'-1px'}}>{subtotal[1]}</span></span>
                            </div>
                        </div>
                        <div style={{height:'20px', margin:'5px 20px', display:'flex'}}>
                            <div style={{height:'20px', width:'70px'}}>
                                Frete:
                            </div>
                            <div style={{height:'20px', marginLeft:'10px'}}>
                                R$ <span>{frete[0]},<span style={{fontSize:'10px', position:'relative', top:'-1px'}}>{frete[1]}</span></span>
                            </div>
                        </div>
                        <div style={{height:'18px', margin:'5px 20px', display:'flex'}}>
                            <div style={{width:'70px', fontWeight:'bold'}}>
                                Total:
                            </div>
                            <div style={{marginLeft:'10px', fontWeight:'bold'}}>
                                R$ <span>{total[0]},<span style={{fontSize:'10px', position:'relative', top:'-1px'}}>{total[1]}</span></span>
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{width: '190px', height:'35px', margin:'0 auto', marginTop:'20px', textAlign:'center', lineHeight:'35px', borderRadius:'25px', border:'2px solid #ff7000', color:'white', backgroundColor:'#ff7000'}} 
                onClick={ ()=>{ this.orderBlock(); /*this.confirmOrder();*/ }}>
                    Finalizar Compra
                </div>                
            </div>
            <InstallmentBox 
                open={ this.state.winBox.installment } 
                close={ ()=>{ this.closeBox(); } } 
                subtotal={ this.state.subtotal } 
                delivery={ this.state.deliveryData } 
                installment={ (installment)=>{ this.setState({installment: installment}); } }
            />            
            <QuantityBox 
                open={ this.state.winBox.quantity } 
                select={ this.state.select.data } 
                stock={ this.productStock[this.state.select.index] } 
                confirm={ (qtd)=>{ this.quantityHandler(qtd); } } 
                cancel={ ()=>{ this.closeBox(); } }                
            />
            <MessageBox 
                open={ this.state.select.remove } 
                confirm={ ()=>{ this.confirmRemove(); } } 
                cancel={ ()=>{ this.closeBox(); } } 
                message='Tem certeza que deseja remover este produto do carrinho?' 
                options={ ['Remover', 'Cancelar'] }
            />
            <ConfirmPayment 
                open={this.state.paymentData.confirm} 
                close={()=>{ this.closeBox(); }} 
                confirm={(cvv)=>{ this.finishOrder(cvv); }}
            />
            <ErrorBox 
                open={ this.state.winBox.warning }
                close={ ()=>{ this.closeBox(); } }
                message={ this.state.winBox.warning }
            />
            <Waiting open={ this.state.loading } size='60px'/>
            <BottomMenu />
        </div>);
    }
    
}
export default CartPage;