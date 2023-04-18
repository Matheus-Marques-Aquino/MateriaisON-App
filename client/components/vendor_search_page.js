
import React, { Component } from 'react';
import { createContainer } from 'react-meteor-data';
import history from './subcomponents/widgets/history';
import { Vendors } from '../../imports/collections/vendors';
import { Products } from '../../imports/collections/products';
import BottomMenu from './subcomponents/bottom_menu';
import BackButton from './subcomponents/back_button';
import Filters from './subcomponents/filters';
import ProductBox from './subcomponents/product_box';
import Waiting from './subcomponents/widgets/waiting';
import Fuse from 'fuse.js';
import DistanceHelper from './subcomponents/widgets/distance_helper';
import { Cart } from '../../imports/collections/cart';
import VendorHeader from './subcomponents/vendor_header';

class VendorSearchPage extends Component{
    constructor(props) {
        super(props);
        this.start = false;
        this.ready = false;
        this.allProducts = [];
        this.filterProducts = [];
        this.queryProducts = [];
        this.notFound = 'none';
        this.load = 0;
        this.state = {
            waiting: false,
            searchQuery: '',
            filter: ['price'],            
            order: ['price', 'popularity'],
            vendor: undefined,
            queryProducts: [],
            products: [],
            filters:{
                distance: false,
                distanceMax: 10,
                price: false,
                priceMax: 0,
                priceMin: 0,
                shipping: false
            },
            productOrder: '_popularity',
            cartId: -1,
            loading: true
        }
    }    
    componentDidMount(){
        if (document.querySelector('.searchBar')) {
            document.querySelector('.searchBar').focus();
        }        
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
        ]        
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
    inputHandler(event){
        if (!this.state.waiting){
            let value = event.target.value;
            this.setState({
                searchQuery: value
            });
        }
    }
    doSearch(string){
        this.setState({waiting: true});
        var idArray = [];
        if (this.ready){
            var options = {
                includeScore: true,
                minMatchCharLength: 3,
                findAllMatches: true,
                threshold: 0.25,
                keys: [ 'name' ]
            };
            var searchString = new Fuse(this.allProducts, options);
        }else{
            setTimeout(()=>{ this.doSearch(string); }, 200);
            return;
        }
        idArray = [];            
        var searchResult = searchString.search(string);
        if (searchResult.length > 0){
            this.notFound = 'none'
            searchResult.map(item=>{
                idArray.push(item.item._id);
            });
        }else{
            this.notFound = 'block'
            this.queryProducts = [];
            this.setState({
                products: [],
                waiting: false
            });
            return;
        }
        Meteor.subscribe('productFields', 'SearchPageResults', idArray, ()=>{
            let products = Products.find({'_id': { $in: idArray }}).fetch();
            if (this.state.filters.price){
                let filterProducts = [];
                products.map(product=>{                    
                    if (product.price >= this.state.filters.priceMin && product.price <= this.state.filters.priceMax){
                        filterProducts.push(product)
                    }                    
                })
                this.queryProducts = filterProducts;
                this.setState({ waiting: false });
            }else{
                this.queryProducts = products; 
                this.setState({ waiting: false });
            }  
            this.applyOrder(this.queryProducts, this.state.productOrder, false)
            return;
        });        
    }
    applyFilter(filter, changeFilter){
        if (filter.price){
            let products = this.state.queryProducts;
            let filterProducts = [];
            products.map(product=>{                    
                if (product.price >= filter.priceMin && product.price <= filter.priceMax){
                    filterProducts.push(product)
                }                    
            })
            this.filterProducts = filterProducts;
            if (changeFilter){ this.setState({ filters: filter });}
            this.applyOrder(filterProducts, this.state.productOrder, false)
        }        
    }    
    applyOrder(products, order, changeOrder){        
        switch(order){
            case '_lowPrice':                
                products.sort((a,b)=>{
                    if (parseFloat(a.price) > parseFloat(b.price)){
                        return 1;
                    }
                    if (parseFloat(a.price) < parseFloat(b.price)){
                        return -1;
                    }
                    return 0
                });
                if (changeOrder){
                    this.setState({
                        productOrder: '_lowPrice',
                        products: products
                    });
                }else{
                    this.setState({
                        products: products
                    });
                }                
                break;
            case '_highPrice':
                products.sort((a,b)=>{
                    if (parseFloat(a.price) < parseFloat(b.price)){
                        return 1;
                    }
                    if (parseFloat(a.price) > parseFloat(b.price)){
                        return -1;
                    }
                    return 0
                });
                if (changeOrder){
                    this.setState({
                        productOrder: '_highPrice',
                        products: products
                    });
                }else{
                    this.setState({
                        products: products
                    });
                }  
                break;
            case '_popularity':                
                products.sort((a,b)=>{
                    if (!a.popularity){ a.popularity = 0; }
                    if (!b.popularity){ b.popularity = 0; }
                    if (a.popularity < b.popularity){
                        return 1;
                    }
                    if (a.popularity > b.popularity){
                        return -1;
                    }
                    return 0
                });
                if (changeOrder){
                    this.setState({
                        productOrder: '_popularity',
                        products: products
                    });
                }else{
                    this.setState({                        
                        products: products
                    });
                }                 
                break;
            default:
                products.sort((a,b)=>{
                    if (!a.popularity){ a.popularity = 0; }
                    if (!b.popularity){ b.popularity = 0; }
                    if (a.popularity < b.popularity){
                        return 1;
                    }
                    if (a.popularity > b.popularity){
                        return -1;
                    }
                    return 0
                });
                if (changeOrder){
                    this.setState({
                        productOrder: '_popularity',
                        products: products
                    });
                }else{
                    this.setState({
                        products: products
                    });
                }  
                break;
        }
    }
    
    render(){
        const vendorId = this.props.vendorId;
        if (!this.start){
            this.load = 0;           
            this.start = true;
            this.Distance = new DistanceHelper(this);
            Meteor.subscribe('productFields', 'VendorSearchPage', vendorId, ()=>{                
                this.ready = true
                this.allProducts = Products.find({'id_vendor': vendorId}).fetch();
                this.load += 1;
                if (this.load == 3){
                    this.setState({ loading: false })
                }
            });
            Meteor.subscribe('cartFields', 'ProductPage', Meteor.userId(), ()=>{
                let cart = Cart.findOne({'user_id': Meteor.userId()});
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
            Meteor.subscribe('vendorFields', 'VendorSearchPage', vendorId, ()=>{                
                let vendor = Vendors.findOne({'id': vendorId});  
                if (this.state.vendor == undefined){ 
                    let distance = this.Distance.distanceBetweenMe(vendor.address.coords.selected);
                    if (!vendor.terms){
                        vendor.terms = {};
                    }
                    if (!vendor.terms.delivery){
                        vendor.terms.delivery = [true, false, false, false, false];
                    }
                    this.load += 1;
                    if (this.load == 3){
                        this.setState({ vendor: vendor, loading:false }); 
                    }else{
                        this.setState({ vendor: vendor}); 
                    }
                    
                }                                                      
            });
        }
        if (this.state.loading){ 
            return(
            <div className='mainContainer'>
                <BackButton/>
                <Waiting open={true} size='60px'/>
                <BottomMenu/>
            </div>)
        }         
        var vendor =  this.state.vendor;  
        var products = this.state.products;
        var image = vendor.img_url;
        var color = '#ff7000';
        var vendorData = [];
        vendorData[vendor.id] = {name: vendor.display_name, color: vendor.color}; 
        if (vendor.color){ color = vendor.color; }
        if (!vendor.img_url){ image = ''; }else{ image = 'url('+vendor.img_url+')'; } 
        return(<div className='mainContainer'>
            <BackButton title={vendor.display_name}/>
            <VendorHeader vendor={vendor} distance={this.state.distance}/>
            <div style={{display:'flex', marginTop:'15px', marginBottom:'15px', padding:'0 15px', position:'relative'}}>
                <input style={{width:'100%', height:'30px', marginTop:'10px', margin:'auto 0', paddingLeft:'45px', borderRadius:'5px', border:'1px solid #ff7000', backgroundImage: 'url(/imgs/search.jpg)', backgroundRepeat:'no-repeat', backgroundPosition:'2px 0px', backgroundSize:'contain', fontSize:'15px'}} type='text' placeholder='O que você esta procurando?' value={this.state.searchQuery} onChange={this.inputHandler.bind(this)} onKeyDown={(e)=>{if (e.key==='Enter'){this.doSearch(this.state.searchQuery)}}}/>
                <div style={{width:'40px', position:'absolute', top:'3px', height:'30px'}} onClick={()=>{this.doSearch(this.state.searchQuery)}}></div>
            </div>
            <div style={{marginBottom:'20px', paddingBottom:'5px', backgroundColor:'white'}}>
                <Filters filter={this.state.filter} order={this.state.order} filterReturn={(filter)=>{this.applyFilter(filter, true)}} orderReturn={(order)=>{this.applyOrder(this.filterProducts, order, true)}}/>
            </div>
            <div className='productSearchContainer' style={{height:'max-content', overflow:'hidden', maxHeight:'max-content'}}>
                <ProductBox type='productLine' type2='vendor' data={products} vendors={vendorData} cart={this.state.cartId}/>              
            </div>  
            <div style={{minHeight:'35px', padding:'5px 10px', backgroundColor:'white', borderBottom:'1px solid #ccc', borderTop:'1px solid #ccc', textAlign:'center', fontSize:'15px', display:this.notFound}}>Não foi encontrado nenhum produto com esse nome.</div>
            <Waiting open={this.state.waiting} size='60px'/>
            <BottomMenu />
        </div>);
    }
}
export default createContainer(() => {    
    const location = history.location.pathname.split("/");
    const vendorId = location[location.length - 1];

    return {
        vendorId: vendorId 
    }

}, VendorSearchPage );