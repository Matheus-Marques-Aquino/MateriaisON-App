import React, { Component } from 'react';
import { createContainer } from 'react-meteor-data';
import history from './subcomponents/widgets/history';
import { Meteor } from 'meteor/meteor'
import { Vendors } from '../../imports/collections/vendors';
import { Products } from '../../imports/collections/products';
import Categories from './subcomponents/categories';
import Filters from './subcomponents/filters';
import BottomMenu from './subcomponents/bottom_menu';
import BackButton from './subcomponents/back_button';
import ProductBox from './subcomponents/product_box';
import Fuse from 'fuse.js';
import Waiting from './subcomponents/widgets/waiting';
import DistanceHelper from './subcomponents/widgets/distance_helper';
import { Profile } from '../../imports/collections/profile';
import VendorBox from './subcomponents/vendor_box';
import { Cart } from '../../imports/collections/cart';

class SearchPage extends Component{
    constructor(props) {
        super(props);
        this.load = 0;
        this.productReady = false;
        this.vendorReady = false;
        this.start = false;
        this.allProducts = [];
        this.allVendors = [];
        this.cacheUpToDate = false;
        this.vendorById = [];
        this.queryProducts = [];
        this.queryVendors = [];        
        this.filterProducts = [];
        this.vendorData = [];
        this.filterVendors = [];
        this.errors = [];
        this.color = ['#777','#ff7000']
        this.state = {
            ready: false,
            waiting: false,            
            products: [],
            vendors: [],            
            searchQuery: '',
            filter: ['shipping', 'open', 'price', 'distance'],            
            order: ['price', 'popularity', 'distance'],
            search: 'Products',
            productFilters:{
                distance: false,
                distanceMax: 10,
                open: false,
                price: false,
                priceMax: 0,
                priceMin: 0,
                shipping: false
            },
            vendorFilters:{
                distance: false,
                distanceMax: 10,
                open: false,
                price: false,
                priceMax: 0,
                priceMin: 0,
                shipping: false
            },
            productOrder: '_popularity',
            vendorOrder: '_popularity',
            cartId: -1
        }
    }

    componentDidMount(){
        if (document.querySelector('.searchBar')) {
            document.querySelector('.searchBar').focus();
        }
    }
    changeSearch(event){
        if (!this.state.waiting){
            this.errors = []
            switch(event){
                case 0:
                    this.color=['#ff7000', '#777']
                    this.setState({
                        ['searchType']: 1,
                        ['filter']: ['shipping', 'open', 'distance'], 
                        ['order']: ['popularity', 'distance'],
                        ['search']: 'Vendors'
                    });
                    document.querySelector('.productSearchContainer').style.maxHeight = '0px';
                    document.querySelector('.vendorSearchContainer').style.maxHeight = 'max-content';
                    break;

                case 1:
                    this.color=['#777', '#ff7000']
                    this.setState({
                        ['searchType']: 0,
                        ['filter']: ['shipping', 'open', 'price', 'distance'], 
                        ['order']: ['price', 'popularity', 'distance'],
                        ['search']: 'Products'
                    });
                    document.querySelector('.vendorSearchContainer').style.maxHeight = '0px';
                    document.querySelector('.productSearchContainer').style.maxHeight = 'max-content';
                    break;
            }
        }
    }
    doSearch(string){        
        this.setState({waiting: true});
        if (!this.state.ready){
            setTimeout(()=>{this.doSearch(string)}, 1000);
            return;
        }
        var idArray = [];
        this.errors = [];
        if (this.state.search == 'Products'){
            if (this.productReady && this.vendorReady){
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
            var searchResult = searchString.search(string);
            if (searchResult.length > 0){
                searchResult.map(item=>{                    
                    idArray.push(item.item._id);
                });
            }else{
                this.errors.push('Nenhum produto encontrado');
                this.queryProducts = [];
                this.setState({
                    products: [],
                    waiting: false
                });
                return;
            }
            Meteor.subscribe('productFields', 'SearchPageResults', idArray, ()=>{
                let products = Products.find({'_id': { $in: idArray }}).fetch();
                products.map(product=>{
                    product.distance = this.vendorById[product.id_vendor].distance;
                    product.open = this.vendorById[product.id_vendor].open;
                    if (!product.popularity){product.popularity = 0}
                })
                this.queryProducts = products;
                this.setState({                                        
                    waiting: false
                });
                this.applyFilter(this.state.productFilters, false);
                return;
            });
        }
        if (this.state.search == 'Vendors'){
            if (this.vendorReady){
                var options = {
                    includeScore: true,
                    minMatchCharLength: 3,
                    findAllMatches: true,
                    threshold: 0.25,
                    keys: [ 'display_name' ]
                }
                var searchString = new Fuse(this.allVendors, options);
            }else{
                setTimeout(()=>{ this.doSearch(string); }, 200);
                return;
            }                       
            var searchResult = searchString.search(string);            
            if (searchResult.length > 0){
                searchResult.map(item=>{
                    idArray.push(item.item.id);
                });
            }else{                
                this.errors.push('Nenhum vendedor encontrado');
                this.queryVendors = [];
                this.setState({
                    vendors: [],
                    waiting: false
                });
                return;
            }
            Meteor.subscribe('vendorFields', 'SearchPageResults', idArray, ()=>{
                let vendors = Vendors.find({'id': { $in: idArray }}).fetch();                
                vendors.map(vendor=>{
                    vendor.distance = this.vendorById[vendor.id].distance;
                    if (!vendor.popularity){ vendor.popularity = 0; }
                })
                this.queryVendors = vendors;
                this.setState({
                    waiting: false
                });
                this.applyFilter(this.state.vendorFilters, false)
            })
        }
    }
    inputHandler(event){
        if (!this.state.waiting){
            let value = event.target.value;
            this.setState({
                searchQuery: value
            });
        }
    }
    applyFilter(filter, changeFilter){
        if (this.state.search == 'Products'){
            let products = this.queryProducts;
            if (filter.price || filter.open || filter.shipping || filter.distance ){
                let filterProducts = [];
                products.map(product=>{ 
                    let push = true                   
                    if (filter.price){
                        if (parseFloat(product.price) < filter.priceMin || parseFloat(product.price) > filter.priceMax){
                            push = false;
                        }
                    }
                    if (filter.distance){
                        if (product.distance > filter.distanceMax &&  filter.distanceMax != 30){
                            push = false;
                        }
                    }
                    if (filter.open){
                        if (!product.open){
                            push = false;
                        }
                    }
                    if (filter.shipping){}
                    
                    if (push){filterProducts.push(product)}
                });        
                this.filterProducts = filterProducts;        
                if (changeFilter){
                    this.setState({ 
                        productFilters: filter });
                }
                
            }else{
                this.filterProducts = products;
                if (changeFilter){
                    this.setState({ productFilters: filter });
                }
            }
            this.applyOrder(this.state.productOrder, false)
        }
        if (this.state.search == 'Vendors'){
            let vendors = this.queryVendors;
            let filterVendors = []; 
            if (filter.price || filter.open || filter.shipping || filter.distance ){                
                vendors.map(vendor=>{
                    let push = true
                    if (filter.distance){
                        if (vendor.distance > filter.distanceMax &&  filter.distanceMax != 30){
                            push = false;
                        }
                    }
                    if (filter.open){
                        if (!vendor.open){
                            push = false;
                        }
                    }
                    if (filter.shipping){}                    
                    if (push){filterVendors.push(vendor)}
                });
                this.filterVendors = filterVendors;                
                if (changeFilter){
                    this.setState({ vendorFilters: filter });
                }
            }else{
                this.filterVendors = vendors;
                if (changeFilter){
                    this.setState({ vendorFilters: filter });
                }
            }
            this.applyOrder(this.state.vendorOrder, false)
        }                
    }
    applyOrder(order, changeOrder){
        if (this.state.search == 'Products'){
            let products = this.filterProducts;
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
                    if (changeOrder){
                        this.setState({
                            products: products,
                            productOrder: order
                        });
                    }else{
                        this.setState({
                            products: products
                        });
                    }                    
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
                    if (changeOrder){
                        this.setState({
                            products: products,
                            productOrder: order
                        });
                    }else{
                        this.setState({
                            products: products
                        });
                    }                    
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
                    if (changeOrder){
                        this.setState({
                            products: products,
                            productOrder: order
                        });
                    }else{
                        this.setState({
                            products: products
                        });
                    }
                    break;
                case '_distance':
                    products.sort((a,b)=>{
                        if (a.distance > b.distance){
                            return 1;
                        }
                        if (a.distance < b.distance){
                            return -1;
                        }
                        return 0
                    })
                    if (changeOrder){
                        this.setState({
                            products: products,
                            productOrder: order
                        });
                    }else{
                        this.setState({
                            products: products
                        });
                    }
                    break;
            }
        }
        if (this.state.search == 'Vendors'){
            let vendors = this.filterVendors;
            switch(order){
                case '_popularity':
                    vendors.sort((a,b)=>{
                        if (a.popularity < b.popularity){
                            return 1;
                        }
                        if (a.popularity > b.popularity){
                            return -1;
                        }
                        return 0
                    })
                    if (changeOrder){
                        this.setState({
                            vendors: vendors,
                            vendorOrder: order
                        });
                    }else{
                        this.setState({
                            vendors: vendors
                        });
                    }
                    break;
                case '_distance':
                    vendors.sort((a,b)=>{
                        if (a.distance > b.distance){
                            return 1;
                        }
                        if (a.distance < b.distance){
                            return -1;
                        }
                        return 0
                    })
                    if (changeOrder){
                        this.setState({
                            vendors: vendors,
                            vendorOrder: order
                        });
                    }else{
                        this.setState({
                            vendors: vendors
                        });
                    }
                    break;
            }
        }        
    } 
    displayError(){
        if (this.errors.length > 0){
        return(<div>{
            this.errors.map((error, index)=>{
                let key = 'error_'+index;
                return(<div style={{color:'red', padding:'10px 30px', borderTop:'1px solid #ccc', borderBottom:'1px solid #ccc'}} key={key}>{error}</div>)
            })
        }</div>)}
    }
    render(){
        //var longestRange = 30;
        if (!this.start){   
            this.load = 0;      
            this.start = true;
            var Distance = new DistanceHelper();
            Meteor.subscribe('productFields', 'SearchPage', -1, ()=>{                
                this.productReady = true
                this.allProducts = Products.find({}).fetch();
            });

            Meteor.subscribe('cartFields', 'ProductPage', Meteor.userId(), ()=>{
                let cart = Cart.findOne({'user_id': Meteor.userId()});
                if (!cart.cart){
                    this.setState({ ready: true});
                }else{
                    if (cart.cart.length == 0){
                        this.load += 1;
                        this.setState({ ready: true});
                        
                    }else{                        
                        let cartId = cart.cart[0].vendor_id;
                        this.setState({ ready: true, cartId: cartId })
                    }
                }
            })
            Meteor.subscribe('profileFields', 'ProfileCoords', Meteor.userId(), ()=>{
                let profile = Profile.find({'_id': Meteor.userId()}).fetch();
                profile = profile[0].profile
                let mainAddress = profile.mainAddress;
                let position = profile.address[mainAddress].coords.selected;
                
                Meteor.subscribe('vendorFields', 'SearchPage', -1, ()=>{
                    this.vendorReady = true
                    this.allVendors = Vendors.find({}).fetch();
                    this.allVendors.map(vendor=>{
                        this.vendorById[vendor.id] = vendor;
                        this.vendorData[vendor.id] = {name: vendor.display_name, color: vendor.color};
                        if (vendor.address.coords.selected){
                            this.vendorById[vendor.id].distance = Distance.distanceBetween(position, vendor.address.coords.selected);
                        }
                    });                                                   
                });
            });
        }
        /*if (!this.state.ready){
            return(
            <div className='mainContainer'>            
                <BackButton title='Buscar'/>
                <BottomMenu/>
                <Waiting open={true} size='60px'/>
            </div>)
        }*/
        return(<div className='mainContainer'>            
            <BackButton title='Buscar'/>
            <div style={{display:'flex', padding:'20px 30px', paddingBottom:'20px', backgroundColor:'#ff7000', position:'relative'}}>
                <input className='searchBar' style={{width:'100%', height:'30px', margin:'auto', border:'1px solid white', borderRadius:'5px', backgroundImage: 'url(/imgs/search.png)', backgroundRepeat:'no-repeat', backgroundPosition:'4px 1px', backgroundSize:'30px 30px', backgroundColor:'#ff7000', color:'white', paddingLeft:'40px', fontSize:'15px'}} type='text' placeholder='O que você esta procurando?' value={this.state.searchQuery} onChange={this.inputHandler.bind(this)} onClick={()=>{history.push('/buscar')}} onKeyDown={(e)=>{if (e.key==='Enter'){this.doSearch(this.state.searchQuery)}}}/>
                <div style={{width:'40px', height:'36px', position:'absolute', top:'10px'}} onClick={()=>{this.doSearch(this.state.searchQuery)}}></div>
            </div>
            <div style={{height:'27px', padding:'20px 0', display:'flex'}}>
                <div style={{width:'50%'}}onClick={()=>{this.changeSearch(0)}}>
                    <div style={{width:'fit-content', paddingRight:'20px', marginLeft:'auto', lineHeight:'27px', textAlign:'right', fontSize:'16px', fontWeight:'600', color:this.color[0], borderRight:'1px solid #ff7000'}}>Fornecedor</div>
                </div>
                    <div style={{width:'50%'}}onClick={()=>{this.changeSearch(1)}}>
                    <div style={{width:'fit-content', marginRight:'auto', paddingLeft:'20px', lineHeight:'27px', textAlign:'left', fontSize:'16px', fontWeight:'600', color:this.color[1], borderLeft:'1px solid #ff7000'}}>Produto</div>
                </div>
            </div>
            <div style={{paddingBottom:'30px'}}>
                <Filters padding='30px' filter={this.state.filter} order={this.state.order} filterReturn={(filter)=>{this.applyFilter(filter, true)}} orderReturn={(order)=>{this.applyOrder(order, true)}}/>
            </div>
            {this.displayError()}
            <div className='productSearchContainer' style={{height:'max-content', overflow:'hidden', maxHeight:'max-content'}}>
                <ProductBox type='productLine' type2='global' data={this.state.products} vendors={this.vendorData} cart={this.state.cartId}/>              
            </div>    
            <div className='vendorSearchContainer' style={{height:'max-content', overflow:'hidden', maxHeight:'0px'}}>
                <VendorBox vendors={this.state.vendors}/>
            </div>
            <Waiting open={this.state.waiting} size='60px'/>
            <BottomMenu /> 
        </div>);
    }
}

export default SearchPage;