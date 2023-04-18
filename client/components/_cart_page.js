import React, { Component } from 'react';
import { createContainer } from 'react-meteor-data';
import { Cart } from '../../imports/collections/cart';
import { Products } from '../../imports/collections/products';
import { Vendors } from '../../imports/collections/vendors';
import { Cache } from './subcomponents/widgets/cache';
import BackButton from './subcomponents/back_button';
import BottomMenu from './subcomponents/bottom_menu';
import ProductBox from './subcomponents/product_box';
import DeliverySelection from './subcomponents/delivery_select';
import FormatNumber from './subcomponents/widgets/format_number';
import QuantityBox from './subcomponents/widgets/quantity_box';
import MessageBox from './subcomponents/widgets/message_box';
    
class CartPage extends Component{
    constructor(props){
        super(props)
        this.load = false;
        this.state={
            package: [],
            deliveryValue: 0,
            waiting: false,
            selectData: {},
            selectIndex: -1,
            quantityBox: false,
            removeBox: false,
            error: {}
        }
    }

    handleDeliveryValue(index, price) {
        this.setState({ deliveryValue: price });        
    }
    selectItem(item, index){
        if (this.state.waiting == false && this.state.quantityBox == false && this.state.removeBox == false){
            this.setState({
                selectData: this.state.packages[index],
                selectIndex: index,
                quantityBox: true,
                removeBox:false
            });
        }
    }
    removeItem(item, index){        
        if (this.state.waiting == false && this.state.quantityBox == false && this.state.removeBox == false){
            this.setState({
                selectData: this.state.packages[index],
                selectIndex: index,
                quantityBox: false,
                removeBox: true
            });
        }                
    }
    confirmRemove(){        
        if (this.state.waiting == false){
            if (this.state.quantityBox == false && this.state.removeBox == true){
                this.setState({
                    waiting: true,
                    selectData: {},
                    selectIndex: -1,
                    quantityBox: false,
                    removeBox: false,
                    error: {}
                });
                Meteor.call('cart.remove', this.state.selectData, (error)=>{
                    this.load = false;
                    if (!error){
                        this.setState({                            
                            waiting: false,
                            error: {}
                        })
                    }else{
                        this.setState({
                            waiting: false,
                            error: error
                        });
                    }
                });
            }
        }
    }
    changeQuantity(qtd){
        if (this.state.waiting == false){
            if (qtd >= 0 && this.state.quantityBox == true && qtd != this.state.selectData.quantity && this.state.removeBox == false){
                if (qtd == 0){
                    this.setState({
                        waiting: true,
                        selectData: {},
                        selectIndex: -1,
                        quantityBox: false,
                        removeBox: false,
                        error: {}
                    });
                    Meteor.call('cart.remove', this.state.selectData, (error)=>{
                        this.load = false;
                        if (!error){
                            this.setState({                                
                                waiting: false,
                                error: {}
                            })
                        }else{
                            this.setState({                                
                                waiting: false,
                                error: error
                            });
                        }
                    });      
                }else{
                    this.setState({
                        waiting: true,
                        error: {}
                    });
                    Meteor.call('cart.changeQuantity', this.state.selectData, qtd, (error)=>{
                        this.load = false;
                        if (!error){
                            this.setState({
                                selectData: {},
                                selectIndex: -1,
                                quantityBox: false,
                                removeBox: false,
                                waiting: false,
                                error: {}
                            })
                        }else{
                            this.setState({
                                selectData: {},
                                selectIndex: -1,
                                quantityBox: false,
                                removeBox: false,
                                waiting: false,
                                error: error
                            });
                        }
                    }); 
                }
            }else{
                this.setState({
                    selectData: {},
                    selectIndex: -1,
                    quantityBox: false,
                    removeBox: false
                }); 
            }
        }        
    }
    closeBox(){
        if (this.state.waiting == false){
            this.setState({
                selectData: {},
                selectIndex: -1,
                quantityBox: false,
                removeBox: false
            });
        }        
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
        if (!this.load){
            this.load = true;
            Meteor.subscribe('cartFields', 'CartPage', Meteor.userId(), ()=>{
                let cart = Cart.find({'user_id': Meteor.userId()}).fetch();
                let vendorId = cart[0].cart[0].vendor_id;                
                let productIds = [];
                let cartQuantity = [];
                cart[0].cart.map(product=>{
                    productIds.push(product.product_id);
                    cartQuantity[product.product_id] = product.quantity;
                });                
                Meteor.subscribe('productFields', 'CartPage', productIds, ()=>{
                    let products = Products.find({'_id': { $in: productIds }}).fetch()
                    let _packages = [];
                    products.map(product=>{
                        let item = {
                            product: product,
                            quantity: cartQuantity[product._id]
                        }
                        _packages.push(item);
                    });
                    this.setState({
                        packages: _packages
                    })
                })
                if (!this.state.vendor){
                    Meteor.subscribe('vendorFields', 'CartPage', vendorId, ()=>{
                        let vendor = Vendors.find({'id': vendorId}).fetch()
                        this.setState({
                            vendor: vendor[0]
                        });
                    });
                }
            })
        }


        if (!this.state.packages || !this.state.vendor){return(<div></div>)}
                  
        const packages = this.state.packages;
        const vendor = this.state.vendor;        
        
        var subTotalPrice = 0;
        var totalPrice = 0;
        var deliveryPrice = this.state.deliveryValue;
        
        packages.map(product=>{            
            subTotalPrice += product.quantity * product.product.price;
        })

        subTotalPrice= Math.floor(subTotalPrice*100)/100;

        totalPrice = subTotalPrice + deliveryPrice;
        
        return(<div style={{position: 'relative'}}>
            <BackButton/>            
            <div >
                <div style={{height:'40px', marginBottom:'10px', display:'flex'}}>
                    <div style={{margin:'auto'}}>Carrinho</div>
                </div>
                <ProductBox type='cart' data={packages} remove={(item, index)=>{this.removeItem(item, index)}} select={(item, index)=>{this.selectItem(item, index)}} selectIndex={this.state.selectIndex}/>
                <div style={{height:'25px', margin:'5px 25px', marginTop:'15px', display:'flex'}}>
                    <div style={{height:'25px', lineHeight:'25px'}}>Subtotal:</div>
                    <div style={{height:'25px', marginLeft:'10px', lineHeight:'25px'}}>R$ <FormatNumber number={subTotalPrice}/></div>
                </div>
                <DeliverySelection selection={(index,price)=>{this.handleDeliveryValue(index, price)}} vendor={vendor} />
                <div style={{height:'40px', margin:'5px 25px', display:'flex'}}>
                    <div style={{height:'40px', lineHeight:'40px'}}>Total:</div>
                    <div style={{height:'40px', marginLeft:'10px', lineHeight:'40px'}}>R$ <FormatNumber number={totalPrice}/></div>
                </div>
                <div style={{width: '160px', height:'35px', margin:'0 auto', marginTop:'20px', textAlign:'center', lineHeight:'35px', border:'1px solid black'}}>Finalizar Compra</div>
            </div>
            <MessageBox open={this.state.removeBox} confirm={()=>{this.confirmRemove()}} cancel={()=>{this.closeBox()}} message='Tem certeza que deseja remove este produto do carrinho?' options={['Remover', 'Cancelar']}/>
            <QuantityBox open={this.state.quantityBox} select={this.state.selectData} confirm={(qtd)=>{this.changeQuantity(qtd)}} cancel={()=>{this.closeBox()}}/>
            <BottomMenu />
        </div>)
    }
}

export default CartPage;