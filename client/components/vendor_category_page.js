import React, { Component } from 'react';
import { createContainer } from 'react-meteor-data';
import history from './subcomponents/widgets/history';
import BottomMenu from './subcomponents/bottom_menu';
import BackButton from './subcomponents/back_button';
import { Vendors } from '../../imports/collections/vendors';
import { Products } from '../../imports/collections/products';
import { Cart } from '../../imports/collections/cart';
import ProductBox from './subcomponents/product_box';
import Filters from './subcomponents/filters';
import Waiting from './subcomponents/widgets/waiting';
import VendorHeader from './subcomponents/vendor_header';
import DistanceHelper from './subcomponents/widgets/distance_helper';

class VendorCategoryPage extends Component{
    constructor(props){
        super(props);
        this.start = false;
        this.queryProducts = [];
        this.load = 0;
        this.state = {
            vendor: undefined,
            products: [],
            filter: ['price'],            
            order: ['price', 'popularity'],
            cartId: -1,
            loading: true
        };
    }
    isOpen(open){
        if (open){
            return(<div style={{fontWeight:'bold', fontSize:'13px', color:'#38C135'}}>ABERTO</div>);
        }else{
            return(<div style={{fontWeight:'bold', fontSize:'13px', color:'#ff4d4d'}}>FECHADO</div>);
        }
    }
    deliveryMethods(vendor){
        let deliveryArray = [
            'Motoboy', 'Correios', 'Correios', 'Transportadora', 'Retirar na loja'
        ];
        if (!vendor.terms){
            return(<div></div>);
        }
        return(
        <div style={{textAlign:'right', fontSize:'11px', lineHeight:'15px'}}>
            {vendor.terms.delivery.map((delivery, index)=>{
            let key='delivery_'+index;
            if (delivery){
                if (index == 0){
                    return(
                    <div key={key}>
                        <div>{deliveryArray[index]}</div>
                    </div>)
                }
                if (index == 2){
                    if (vendor.terms.delivery[1]){
                        return(<div key={key}></div>)
                    }
                    return(<div key={key}>{deliveryArray[index]}</div>)
                }
                return(<div key={key}>{deliveryArray[index]}</div>)
            }
        })}</div>)
    }

    applyFilter(filter, changeFilter){
        let products = this.queryProducts;
        if (filter.price){
            let filterProducts = [];
            products.map(product=>{ 
                let push = true                   
                if (filter.price){
                    if (parseFloat(product.price) < filter.priceMin || parseFloat(product.price) > filter.priceMax){
                        push = false;
                    }
                }
                if (push){filterProducts.push(product)}
            });
            this.setState({
                products: filterProducts
            });
        }
    }
    applyOrder(order, changeOrder){        
        let products = this.state.products;
        switch(order){
            case '_highPrice':
                    products.sort((a,b)=>{
                        if (parseFloat(a.price) < parseFloat(b.price)){
                            return 1;
                        }
                        if (parseFloat(a.price) > parseFloat(b.price)){
                            return -1;
                        }
                        return 0
                    })                    
                    this.setState({
                        products: products
                    });                                       
                    break;
                case '_lowPrice':
                    products.sort((a,b)=>{
                        if (parseFloat(a.price) > parseFloat(b.price)){
                            return 1;
                        }
                        if (parseFloat(a.price) < parseFloat(b.price)){
                            return -1;
                        }
                        return 0
                    })                    
                    this.setState({
                        products: products
                    });                                       
                    break;
                case '_popularity':
                    products.sort((a,b)=>{
                        if (a.popularity < b.popularity){
                            return 1;
                        }
                        if (a.popularity > b.popularity){
                            return -1;
                        }
                        return 0
                    })                    
                    this.setState({
                        products: products
                    });                    
                    break;
        }
    }

    render(){
        const vendorId = this.props.vendorId;
        const categoryId = this.props.categoryId;

        const categories = [
            'Banheiro','Climatização e ventilação',
            'Cozinha e área de serviço','Decoração',
            'Esporte e lazer','Ferragens',
            'Ferramentas','Iluminação',
            'Jardim e varanda','Materiais elétricos',
            'Materiais hidráulicos','Material de construção',
            'Pisos e revestimentos','Segurança e comunicação',
            'Tapetes','Tintas e acessórios','Tudo para sua casa'
        ]

        if(!this.start){
            this.load = 0
            this.start = true;
            this.Distance = new DistanceHelper(this);

            Meteor.subscribe('cartFields', 'ProductPage', Meteor.userId(), ()=>{
                let cart = Cart.findOne({'user_id': Meteor.userId()});
                if (!cart){
                    cart = { cart: [] }                
                }                
                if (!cart.cart){
                    this.load += 1;
                }else{
                    if (cart.cart.length == 0){
                        this.load += 1;
                    }else{                        
                        let cartId = cart.cart[0].vendor_id;
                        this.load += 1;
                        if (this.load == 3){
                            this.setState({ loading: false, cartId: carId })
                        }else{
                            this.setState({ cartId: cartId })
                        }                        
                    }
                }
            })

            Meteor.subscribe('vendorFields', 'CategoryPage', vendorId, ()=>{
                let vendor = Vendors.findOne({'id': vendorId});
                let distance = this.Distance.distanceBetweenMe(vendor.address.coords.selected);
                if (!vendor.terms){
                    vendor.terms = {};
                }
                if (!vendor.terms.delivery){
                    vendor.terms.delivery = [true, false, false, false, false];
                }
                this.load += 1;
                if (this.load == 3){
                    this.setState({ vendor: vendor, loading: false });
                }else{
                    this.setState({ vendor: vendor });
                }
                Meteor.subscribe('productFields', 'CategoryPage', {vendorId: vendorId, categoryName: categories[categoryId]}, ()=>{
                    let products = Products.find({'category': {$elemMatch:{name: categories[categoryId]}}, 'id_vendor': vendorId}).fetch();
                    this.queryProducts = products;
                    this.load += 1;
                    if (this.load == 3){
                        this.setState({ products: products, loading: false });
                    }else{
                        this.setState({ products: products });
                    }                    
                });
            });
        }
        if (this.state.loading){ 
            return(
            <div className='mainContainer'>
                <BackButton/>
                <BottomMenu/>
                <Waiting open={this.state.loading} size='60px'/>
            </div>); 
        }

        var vendor = this.state.vendor;
        var products = this.state.products;
        var image = '';
        var color = '#ff7000'
        var vendorName = [];
        vendorName[vendor.id] = vendor.display_name;
        if (vendor.img_url){ image = 'url('+vendor.img_url+')'; }
        if (vendor.color){ color = vendor.color; }        
        return (
        <div className='mainContainer'>
            <BackButton title={vendor.display_name}/>
            <VendorHeader vendor={vendor} distance={this.state.distance}/>           
            <div style={{marginTop:'15px', marginBottom:'5px'}}>
                <Filters filter={this.state.filter} order={this.state.order}  filterReturn={(filter)=>{this.applyFilter(filter, true)}} orderReturn={(order)=>{this.applyOrder(order, true)}}/>
            </div>
            <div style={{marginTop:'30px', marginBottom:'20px', display:'flex'}}>
                <div style={{minWidth:'20px', height:'20px', padding:'0 10px', margin:'auto 0', backgroundImage:'url(/imgs/goArrow.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></div>
                <div style={{minWidth:'fit-content', margin:'auto 0', fontSize:'14px', fontWeight:'bold', color:'#ff7000'}} >{categories[categoryId].toLocaleUpperCase()}</div> 
            </div>
            <div style={{paddingBottom:'10px', backgroundColor:'white'}}>
                <ProductBox type='productLine' type2='vendor' data={products} vendors={vendorName} cart={this.state.cartId}/>
            </div>            
            <BottomMenu />
        </div>);

    }

}
export default createContainer(() => {
    
    const location = history.location.pathname.split("/");
    const vendorId = location[location.length - 2];
    const categoryId = location[location.length - 1];        
 
    return {
        categoryId: categoryId,
        vendorId: vendorId
    }
    
}, VendorCategoryPage );