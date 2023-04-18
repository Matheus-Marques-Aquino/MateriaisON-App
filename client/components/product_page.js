import React, { Component } from 'react';
import { createContainer } from 'react-meteor-data';
import history from './subcomponents/widgets/history';
//import { Cache } from './subcomponents/widgets/cache';
import ProductImages from './subcomponents/product_images'
import BottomMenu from './subcomponents/bottom_menu';
import FormatNumber from './subcomponents/widgets/format_number';
import BackButton from './subcomponents/back_button';
import TextBreak from './subcomponents/widgets/text_break';
import { Meteor } from 'meteor/meteor';
import { Products } from '../../imports/collections/products';
import { Vendors } from '../../imports/collections/vendors';
import { Cart } from '../../imports/collections/cart';
import Loading from './subcomponents/widgets/loading';
import ErrorBox from './subcomponents/widgets/error_box';
import FadeOutBox from './subcomponents/widgets/fadeout_box';
//import { ProductCache } from '../../imports/collections/cache/product_cache';
//import { VendorCache } from '../../imports/collections/cache/vendor_cache';
import DetailsTable from './subcomponents/details_table';
import AddToCartBox from './subcomponents/widgets/add_to_cart_box';
import Waiting from './subcomponents/widgets/waiting';
import DistanceHelper from './subcomponents/widgets/distance_helper';

class ProductPage extends Component{

    constructor(props){
        super(props)
        this.load = 0;
        this.start = false;
        this.ready = false
        this.product={}
        this.waiting = false;
        this.colors = ['#ff7000', 'gray'];
        this.cart = [];
        this.alreadyHave = 0;
        this.fixed = false;
        this.state={
            loading: true,
            product: undefined,
            vendor: undefined,
            quantity: 0,
            waiting: false,
            vendorCart: -1,
            error: false,
            email: '',
            notification: false, 
            page: 0
        }
    }
    inputHandler(event){
        let name = event.target.name;
        let value = event.target.value
        this.setState({
            [name]: value
        })
    }
    quantityHandler(event){
        let value = event.target.value;
        if (value != ''){
            value = Math.floor(value);
        }        
        if (value + this.alreadyHave > this.product.stock_quantity){
            if (this.product.stock_quantity - this.alreadyHave > 0){
                value = this.product.stock_quantity - this.alreadyHave;
            }else{
                value = 0
            }            
        }
        if (value < 0){
            value = 0;
        }
        this.setState({
            quantity: value
        })
    }
    changeQuantity(qtd){
        let quantity = this.state.quantity + qtd;        
        if (quantity + this.alreadyHave > this.product.stock_quantity){
            if (this.product.stock_quantity - this.alreadyHave > 0){
                quantity = this.product.stock_quantity - this.alreadyHave;
            }else{
                quantity = 0;
            }            
        }
        if (quantity < 0){ quantity = 0; }
        this.setState({
            quantity: quantity
        })
    }
    addToCart(user_id, quantity, product_id, id_vendor, finish){
        if (!this.ready){   
            setTimeout(()=>{ this.addToCart(user_id, quantity, product_id, id_vendor); }, 200);
            return;
        }
        if (quantity == 0){ return; }
        if (!this.state.waiting){
            this.setState({ waiting: true })
            let state = this;            
            if (this.state.vendorCart == 0 || this.state.vendorCart == id_vendor){
                Meteor.call('cart.insert', user_id, quantity, product_id, id_vendor, (error)=>{                
                    if (!error){   
                        this.alreadyHave += quantity;                     
                        if (finish){ 
                            history.push('/carrinho'); 
                        }else{
                            let resetQuantity = 1;
                            if (this.alreadyHave >= this.state.product.stock_quantity){
                                resetQuantity = 0;
                            }
                            this.itemInsert.openBox(quantity);                            
                            this.setState({ waiting: false, quantity: resetQuantity });
                        }                                                
                    }else{ 
                        console.log(error); 
                    }                
                });
            }else{
                state.setState({ 
                    error:true,
                    waiting: false
                });
            }                                           
        }
    }
    closeError(){
        this.setState({ 
            error: false,
            waiting: false
        });
    }    
    productContent(state){        
        if (state == 0){
            return(
            <div className='description'>
                <div style={{padding:'20px 15px', wordBreak:'normal', fontSize:'15px', color:'#333', border:'1px solid #ff7000'}}>
                    <TextBreak text={this.product.description}/>
                </div>                
            </div>)
        }
        if (state == 1){
            return(
            <div className = 'detalhes'>
                <DetailsTable details={this.product.details} stock={this.product.stock_quantity} title='Detalhes'/>
            </div>)
        }
    }
    displayStock(){
        if (this.product.stock_quantity > 0){
            return(
            <div>
                <div style={{width:'fit-content', margin:'10px auto', display:'flex', padding:'0 15px'}}>
                    <div style={{display:'flex', margin:'auto', marginRight:'5px'}}>
                        <div style={{height:'34px', width:'34px', marginLeft:'auto', border:'1px solid #ff7000', backgroundColor:'white', lineHeight:'33px', textAlign:'center'}} onClick={()=>{this.changeQuantity(-1)}}>-</div>
                            <div style={{width:'50px', height:'34px', border:'1px solid #ff7000', borderRight:'0px', borderLeft:'0px'}}>
                                <input type='number' style={{width:'50px', height:'32px', textAlign:'center', border:'0px', backgroundColor:'transparent', lineHeight:'30px'}} value={this.state.quantity} onChange={this.quantityHandler.bind(this)}/>
                            </div>                        
                        <div style={{height:'34px', width:'34px', marginRight:'auto', border:'1px solid #ff7000', backgroundColor:'white', lineHeight:'33px', textAlign:'center'}} onClick={()=>{this.changeQuantity(1)}}>+</div>                
                    </div>
                    <div style={{margin:'0 auto', width:'150px', marginLeft:'5px', height:'40px', lineHeight:'40px', backgroundColor:'#3395f5', border:'2px solid #3395f5', borderRadius:'25px', textAlign:'center', fontSize:'17px', color:'white'}} onClick={()=>{this.addToCart(Meteor.userId(), this.state.quantity, this.product._id, this.product.id_vendor, false)}}>Adicionar</div>                
                </div>
                <div style={{margin:'0 auto', marginTop:'20px', width:'250px', height:'40px', lineHeight:'40px', backgroundColor:'#FF7000', border:'2px solid #FF7000', borderRadius:'25px', textAlign:'center', fontSize:'17px', color:'white'}} onClick={()=>{this.addToCart(Meteor.userId(), this.state.quantity, this.product._id, this.product.id_vendor, true)}}>Finalizar Compra</div> 
            </div>)
        }
        return(
        <div style={{padding:'5px 0', paddingBottom:'10px'}}>
            <div style={{minHeight:'20px'}}>
                <div style={{margin:'auto 20px', marginTop:'5px', wordBreak:'normal', color:'red', fontSize:'15px'}}>O produto esta fora de estoque!</div>                
            </div>
            <div style={{minHeight:'20px'}}>
                <div style={{margin:'auto 20px', marginTop:'5px', wordBreak:'normal', fontSize:'15px'}}>Notifique-me quantido estiver diposnível:</div>                
            </div>
            <div style={{marginTop:'10px', display:'flex'}}>
                <div style={{padding:'0 10px', border:'1px solid #ff7000', borderRadius:'3px', backgroundColor:'white', marginLeft:'20px', marginRight:'10px', width:'100%'}}>
                    <input style={{height:'28px', width:'100%', lineHeight:'30px', fontSize:'14px', backgroundColor:'transparent', border:'0px', textAlign:'center'}} onChange={this.inputHandler.bind(this)} value={this.state.email} placeholder='ENDEREÇO DE E-MAIL' name='email'/>
                </div>
                <div style={{width:'100px', height:'30px', padding:'1px 5px', borderRadius:'5px', lineHeight:'30px', marginLeft:'auto', marginRight:'20px', textAlign:'center', lineHeight:'30px', backgroundColor:'#ff7000', color:'white', fontSize:'14px'}} onClick={()=>{this.setNotifications()}}>ENVIAR</div>                
            </div> 
            {this.activateNotification()}           
        </div>)
    }
    activateNotification(){
        if (this.state.notification){
            return(<div style={{padding:'5px 20px', fontSize:'15px', color:'#32CD32'}}>Você será notificado quando este produto estiver diponível!</div>);
        }else{
            return(<div></div>);
        }        
    }
    setNotifications(){
        if (this.state.email.includes('@') && this.state.email('.')){
            this.setState({notification: true})
        }
    }
    fixCartQuantity(){
        this.setState({loading: true})
        Meteor.call('cart.fix', [this.product], (error, result)=>{
            if (error){
                console.log(error)
            }
            this.setState({loading: false})
        })
    }
    render(){  
        if (!Meteor.userId()){
            Meteor.logout((error)=>{
                if (!error){history.push('/entrar')
            }else{
                console.log(error)
            }});
            return (<div></div>);
        } 
        const vendorId = this.props.vendorId;
        const productId = this.props.productId;

        if (!this.start){
            this.start = true;
            this.Distance = new DistanceHelper(this);
            Meteor.call('products.popularity', productId);
            Meteor.subscribe('productFields', 'ProductPage', productId, ()=>{
                this.load += 1;
                let product = Products.findOne({'id': productId});
                if (this.load >= 3){
                    this.setState({ product: product, loading: false })
                }else{
                    this.setState({ product: product })
                }
                Meteor.subscribe('cartFields', 'ProductPage', Meteor.userId, ()=>{
                    this.load += 1;
                    let cart = Cart.findOne({'user_id': Meteor.userId()});
                    if (!cart){
                        cart = {cart: []}
                    }
                    this.cart = cart.cart;
                    let startQuantity = 1;
                    this.cart.map(_product=>{
                        if (_product.product_id == product._id){
                            this.alreadyHave = _product.quantity;
                            if (this.alreadyHave >= product.stock_quantity){
                                startQuantity = 0;
                            }
                        }
                    });
                    if (cart.cart.length > 0){
                        let vendorCart = (cart.cart[0].vendor_id);
                        if (this.load >= 3){
                            this.setState({ vendorCart: vendorCart, quantity: startQuantity, loading: false });
                        }else{
                            this.setState({ vendorCart: vendorCart, quantity: startQuantity });
                        }                    
                    }else{
                        if (this.load >= 3){
                            this.setState({ vendorCart: 0, quantity: startQuantity, loading: false })
                        }else{
                            this.setState({ vendorCart: 0, quantity: startQuantity })
                        }                    
                    }  
                    this.ready = true;
                });            
            });
            Meteor.subscribe('vendorFields', 'ProductPage', vendorId, ()=>{
                this.load += 1;
                let vendor = Vendors.find({'id': vendorId}).fetch();                
                let distance = this.Distance.distanceBetweenMe(vendor[0].address.coords.selected);
                if (this.load >= 3){
                    this.setState({ vendor: vendor[0], loading: false })
                }else{
                    this.setState({ vendor: vendor[0] })
                } 
            });                  
        }
        var vendorName = '';
        if (this.state.loading){ 
            return (
            <div className='mainContainer'> 
                <BackButton title={vendorName}/>
                <Waiting open={this.state.loading} size='60px'/>
                <BottomMenu/>
            </div>); 
        }        
        if (this.state.vendor){ vendorName = this.state.vendor.display_name; }
        
        const mainCategories = [
            'Banheiro','Climatização e ventilação',
            'Cozinha e área de serviço','Decoração',
            'Esporte e lazer','Ferragens',
            'Ferramentas','Iluminação',
            'Jardim e varanda','Materiais elétricos',
            'Materiais hidráulicos','Material de construção',
            'Pisos e revestimentos','Segurança e comunicação',
            'Tapetes','Tintas e acessórios','Tudo para sua casa'
        ];
        const delivery = ['PAC', 'Sedex', 'Transportadora', 'Motoboy'];
        this.product = this.state.product;        
        var img_url = [];
        var category = '';
        var categoryLink = '';
        var color = [];
        var vendorColor = '#ff7000';
        var quantity_text = ''
        var marginTop = '0px';

        if (this.product.img_url.length == 0){
            img_url.push('https://via.placeholder.com/150');            
        }else{
            this.product.img_url.map(image => {
                img_url.push(image.src);                
            });
        }        
        if (this.state.vendor.color){
            vendorColor = this.state.vendor.color;
        }
        
        this.product.category.map(_category=>{
            if (mainCategories.includes(_category.name)){ 
                category = _category.name;
                let categoryIndex = mainCategories.indexOf(_category.name)
                if (categoryIndex > -1){ categoryLink = '/categoria/'+vendorId+'/'+ categoryIndex; }                
            }
        });
        
        if (this.state.page == 0){ color = ['#ff7000', '#777']; }else{ color = ['#777', '#ff7000']; }   
        if (this.product.stock_quantity <= 0){ marginTop = '25px'; }     
        if (this.product.stock_quantity == 1){
            quantity_text = this.product.stock_quantity+' unidade em estoque.';
        }
        if (this.product.stock_quantity > 1){
            quantity_text = this.product.stock_quantity+' unidades em estoque.';
        } 
        return(<div className='mainContainer'> 
            <BackButton title={vendorName}/>
            <div style={{height:'30px', lineHeight:'30px', paddingLeft:'15px', borderBottom:'1px solid #ccc', marginBottom:'20px'}} onClick={()=>{if (categoryLink != ''){history.push(categoryLink)}}}>» {category}</div> 
            <ProductImages images={this.product.img_url}/>            
            <div style={{ marginTop:'30px', padding:'0 55px', lineHeight:'15x', fontSize:'17px', color:'#333'}}>{this.product.name}</div>            
            <div style={{padding:'5px 55px', paddingBottom:'0px', height:'30px', display:'flex'}}>
                <div style={{paddingRight:'10px', fontSize:'17px', marginTop:'auto'}}>R$ <FormatNumber number={this.product.price}/></div>
                <div style={{fontSize:'13px', marginTop:'auto'}}>unidade</div>                
            </div>            
            <div style={{margin:'5px 0', marginLeft:'55px', marginBottom:'15px', fontSize:'12px'}}>{quantity_text}</div>
            <div style={{margin:'15px 20px', marginTop:marginTop}}>
                <div style={{height:'33px', display:'flex', border:'1px solid #ff7000', borderBottom:'0px'}}>
                    <div style={{width:'50%', height:'27px', margin:'auto', borderRight:'1px solid #ff7000'}}>
                        <div style={{margin:'auto', marginRight:'30px', width:'90px', height:'27px', lineHeight:'27px', textAlign:'center', fontSize:'18px', color:color[0], fontWeight:'bold'}}onClick={()=>{if (this.state.page == 1){this.setState({ page: 0 })}}}>Descrição</div>
                    </div>
                    <div style={{width:'50%', height:'27px', margin:'auto'}}>
                        <div style={{margin:'auto', marginLeft:'30px', width:'90px', height:'27px', lineHeight:'27px', textAlign:'center', fontSize:'18px', color:color[1], fontWeight:'bold'}}onClick={()=>{if (this.state.page == 0){this.setState({ page: 1 })}}}>Detalhes</div>
                    </div>
                </div>            
                {this.productContent(this.state.page)}
            </div>
            {this.displayStock()}  
            <div style={{margin:'20px', padding:'10px 15px', fontSize:'13px', border:'1px solid #ff7000', display:'flex'}} onClick={()=>{history.push('/fornecedor/'+this.state.vendor.id)}}>
                <div>Vendedor: <span style={{fontWeight:'bold', color:vendorColor}}>{vendorName}</span></div>
                <div style={{marginLeft:'auto'}}>({this.state.distance} km)</div>
            </div>          
            <AddToCartBox images={this.product.img_url} ref={ instance=>{ this.itemInsert = instance; }} />            
            <ErrorBox message='Finalize a compra com o vendor dos produtos de seu carrinho para poder efetuar uma nova compra com outro vendedor.' close={()=>{this.closeError()}} open={this.state.error}/>
            <Loading waiting={false}/>
            <BottomMenu /> 
        </div>)
    }
}
export default createContainer(() => {
    
    const location = history.location.pathname.split("/");
    const vendorId = location[location.length - 2];
    const productId = location[location.length - 1];        
 
    return {
        productId: productId,
        vendorId: vendorId
    }
    
}, ProductPage );