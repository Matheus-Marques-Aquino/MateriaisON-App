import { ProductCache } from '../../../../imports/collections/cache/product_cache';
import { Products } from '../../../../imports/collections/products';
import {VendorCache } from '../../../../imports/collections/cache/vendor_cache';
import { Vendors} from '../../../../imports/collections/vendors';
import { CacheControl } from '../../../../imports/collections/cache/cache_control';
import { LocalCache } from '../../../../imports/collections/cache/local_cache';

class LoadCache {
    constructor(){        
        this.totalProducts = 0;
        this.totalVendors = 0;
        this.productsUpToDate = false;
        this.vendorsUpToDate = false;
        this.ready = false;
    }

    checkCache(callback){//boolean
        var localCache = LocalCache.findOne({id: 1});        
        Meteor.subscribe('_cache', ()=>{            
            var serverCache = CacheControl.findOne({id: 1});            
            if (!serverCache){ 
                if (callback){ 
                    callback(false, undefined); 
                    return;
                }
            }
            if (!localCache){ 
                if (callback){ 
                    VendorCache.remove({});
                    ProductCache.remove({});
                    LocalCache.insert(serverCache);
                    callback(false, serverCache);  
                    return;
                }
            }                        
            if (localCache.modifyDate != serverCache.modifyDate){
                if (callback){
                    VendorCache.remove({});
                    ProductCache.remove({});
                    LocalCache.remove({});
                    LocalCache.insert(serverCache);
                    callback(false, serverCache);
                    return;
                }
            }else{
                if (callback){ 
                    callback(true, localCache);
                    return; 
                }
            }
        });
    }
    loadAllCache(_load ,_product, _vendor, loadData, callback){

        var products = [];
        var vendors = [];
        
        if (!_load){ 
            if ( _product ){                
                if ( ProductCache.find({}).count() < loadData.totalProducts ){                  
                    Meteor.subscribe('products', ()=>{
                        products = Products.find({}).fetch();
                        products.map(product=>{
                            if (!ProductCache.findOne({_id: product._id})){
                                ProductCache.insert(product);
                            }
                        });                       
                        if ( !_vendor ){
                            if (callback){ callback({products: products}); }
                            return; 
                        }                                                           
                    });
                }else{
                    products = ProductCache.find({}).fetch();
                    if ( !_vendor ){
                        if (callback){ callback({product: vendors}); }
                        return;
                    }
                }
            }
            if ( VendorCache.find({}).count() < loadData.totalVendors ){
                Meteor.subscribe('vendors', ()=>{
                    vendors = Vendors.find({}).fetch();
                    vendors.map(vendor=>{
                        if (!VendorCache.findOne({_id: vendor._id})){
                            VendorCache.insert(vendor);
                        }
                    })                    
                    if ( !_product ){
                        if (callback){ callback({vendors: vendors}); }
                        return;
                    }else{                        
                        if (callback){ callback({products: products, vendors: vendors}); }
                        return;
                    }                          
                });
            }else{
                vendors = VendorCache.find({}).fetch();
                if ( !_product ){
                    if (callback){ callback({vendors: vendors}); }
                    return;
                }else{
                    if (callback){ callback({products: products, vendors: vendors}); }
                    return;
                }
            }
        }else{
            if ( _product ){
                products = ProductCache.find({}).fetch();
                if ( !_vendor ){
                    if (callback){ callback({products: products}); }
                    return;
                }                    
                vendors = VendorCache.find({}).fetch();
                if (callback){ callback({products: products, vendors:vendors}); }
                return;
            }else{
                vendors = VendorCache.find({}).fetch();
                if ( _vendor ){
                    if (callback){ callback({vendors: vendors}); }
                    return;
                }
            }            
        }
    }


    validateCache(){
        Meteor.subscribe('_cache', ()=>{
            var serverCache = CacheControl.findOne({id: 1});
            var localCache = LocalCache.findOne({id: 1});
            if (serverCache){
                if (!localCache){
                    this.productsUpToDate = false;
                    this.vendorsUpToDate = false;
                    ProductCache.remove({});
                    VendorCache.remove({});
                    LocalCache.insert(serverCache);
                    this.totalProducts = serverCache.totalProducts;
                    this.totalVendors = serverCache.totalVendors;
                    this.ready = true;
                    return serverCache;
                }else{
                    if (serverCache.modifyDate > localCache.modifyDate){
                        this.productsUpToDate = false;
                        this.vendorsUpToDate = false;
                        localCache.remove({});
                        ProductCache.remove({});
                        VendorCache.remove({});
                        LocalCache.insert(serverCache);                        
                        this.totalProducts = serverCache.totalProducts;
                        this.totalVendors = serverCache.totalVendors;
                        this.ready = true;
                        return serverCache;
                    }else{                        
                        this.totalProducts = localCache.totalProducts;
                        this.totalVendors = localCache.totalVendors;
                        this.ready = true;
                        return localCache;
                    }
                }
            }
        });
    }

    loadProductCache(){      
        if (!this.ready){
            setTimeout(this.loadProductCache, 100)
        }else{        
            let products = [];
            if ( ProductCache.find({}).count() < this.totalProducts ){
                let productsSubscribe = Meteor.subscribe('products');            
                if (productsSubscribe.ready()){
                    this.productsUpToDate = false;
                    products = Products.find({}).fetch();
                    products.map(product=>{
                        if (!ProductCache.findOne({_id: product._id})){
                            ProductCache.insert(product);
                        }
                    })
                    this.productsUpToDate = true;
                }                  
            }else{ this.productsUpToDate = true; }  
        }
    }
    loadVendorCache(){
        if (!this.ready){
            setTimeout(this.loadVendorCache, 100)
        }else{
            let vendors = [];
            if ( VendorCache.find({}).count() < this.totalVendors ){
                let vendorsSubscribe = Meteor.subscribe('vendors');
                if (vendorsSubscribe.ready()){
                    this.vendorsUpToDate = false;
                    vendors = Vendors.find({}).fetch();
                    vendors.map(vendor=>{   
                        if (!VendorCache.findOne({_id: vendor._id})){
                            VendorCache.insert(vendor);
                        }
                    })
                    this.vendorsUpToDate = true;
                }       
            }else{ this.vendorsUpToDate = true; }
        }
    }

    findProductCache(){              
        let products = [];
        if (this.ready){
            if ( ProductCache.find({}).count() < this.totalProducts ){
                this.productsUpToDate = false;
                if (!productsSubscribe){ var productsSubscribe = Meteor.subscribe('products'); }            
                if (productsSubscribe.ready()){
                    products = Products.find({}).fetch();
                    products.map(product=>{
                        if (!ProductCache.findOne({_id: product._id})){
                            ProductCache.insert(product);
                        }
                    })
                    this.productsUpToDate = true;
                }
                return products;        
            }else{
                this.productsUpToDate = true;
                products = ProductCache.find({}).fetch();
                return products;
            }        
        }else{
            if (ProductCache.find({}).count() > 0){
                products = ProductCache.find({}).fetch();
                return products;
            }else{
                this.productsUpToDate = false;
                if (!productsSubscribe){ var productsSubscribe = Meteor.subscribe('products'); }
                if (productsSubscribe.ready()){
                    products = Products.find({}).fetch();
                    products.map(product=>{
                        if (!ProductCache.findOne({_id: product._id})){
                            ProductCache.insert(product);
                        }
                    })
                    this.productsUpToDate = true;
                }
                return products;
            }
        }
    }

    findVendorCache(){       
        let vendors = [];  
        if (this.ready){      
            if ( VendorCache.find({}).count() < this.totalVendors ){
                
                if (!vendorsSubscribe){ var vendorsSubscribe = Meteor.subscribe('vendors'); }
                if (vendorsSubscribe.ready()){
                    vendors = Vendors.find({}).fetch();
                    vendors.map(vendor=>{   
                        if (!VendorCache.findOne({_id: vendor._id})){
                            VendorCache.insert(vendor);
                        }
                    })
                }
                return vendors;        
            }else{
                vendors = VendorCache.find({}).fetch();                
                return vendors;
            }    
        }else{
            if (VendorCache.find({}).count() > 0){
                vendors = VendorCache.find({}).fetch();                
                return vendors;
            }else{
                if (!vendorsSubscribe){ var vendorsSubscribe = Meteor.subscribe('vendors'); }
                if (vendorsSubscribe.ready()){
                    vendors = Vendors.find({}).fetch();
                    vendors.map(vendor=>{   
                        if (!VendorCache.findOne({_id: vendor._id})){
                            VendorCache.insert(vendor);
                        }
                    })
                }
                return vendors; 
            }
        }
            
    }

    findOneProductCache(field, value){
        let product = ProductCache.findOne({[field]: value});
        if (!product){
            let productsSubscribe = Meteor.subscribe('products');            
            if ( productsSubscribe.ready() ){
                product = Products.findOne({[field]: value});                
                if (!product){ 
                    product = undefined; 
                }
                return product;
            }
        }else{
            return product;
        } 
    }

    findOneVendorCache(field, value){  
        let vendor = VendorCache.findOne({[field]: value});
        if (!vendor){
            let vendorsSubscribe = Meteor.subscribe('vendors');            
            if ( vendorsSubscribe.ready() ){
                vendor = Vendors.findOne({[field]: value});
                if (!vendor){ 
                    vendor = undefined; 
                }
                return vendor;
            }
        }else{
            return vendor;
        } 
    }

    searchProductsCache(field, value){
        let products = [];
        if (this.ready){
            if ( ProductCache.find({[field]: value}).count() < this.totalProducts ){
                if (!productsSubscribe){ var productsSubscribe = Meteor.subscribe('products'); }            
                if (productsSubscribe.ready()){
                    products = Products.find({[field]: value}).fetch();
                    products.map(product=>{
                        if (!ProductCache.findOne({_id: product._id})){
                            ProductCache.insert(product);
                        }
                    })
                }
                return products;        
            }else{
                return ProductCache.find({}).fetch();
            }
        }else{
            if ( ProductCache.find({[field]: value}).count() > 0 ){
                products = ProductCache.find({}).fetch();
                return products;
            }else{
                if (!productsSubscribe){ var productsSubscribe = Meteor.subscribe('products'); }            
                if (productsSubscribe.ready()){
                    products = Products.find({[field]: value}).fetch();
                    products.map(product=>{
                        if (!ProductCache.findOne({_id: product._id})){
                            ProductCache.insert(product);
                        }
                    })
                }
                return products;
            }
        }
    }

    searchVendorsCache(field, value){        
        let vendors = [];
        if (this.ready){
            if ( VendorCache.find({[field]: value}).count() < this.totalVendors ){
                if (!vendorsSubscribe){ var vendorsSubscribe = Meteor.subscribe('vendors'); }           
                if (vendorsSubscribe.ready()){
                    vendors = Vendors.find({[field]: value}).fetch();
                    vendors.map(vendor=>{
                        if (!VendorCache.findOne({_id: vendor._id})){
                            VendorCache.insert(vendor);
                        }
                    })
                }
                return vendors;        
            }else{
                return VendorCache.find({}).fetch();
            }
        }else{
            if ( VendorCache.find({[field]: value}).count() > 0 ){
                vendors = VendorCache.find({}).fetch();
                return vendors;
            }else{
                if (!vendorsSubscribe){ var vendorsSubscribe = Meteor.subscribe('vendors'); }           
                if (vendorsSubscribe.ready()){
                    vendors = Vendors.find({[field]: value}).fetch();
                    vendors.map(vendor=>{
                        if (!VendorCache.findOne({_id: vendor._id})){
                            VendorCache.insert(vendor);
                        }
                    })
                }
                return vendors;
            }
        }
    }

    resetCache(){
        LocalCache.remove({});
        ProductCache.remove({});
        VendorCache.remove({});        
    }    
}
export const Cache = new LoadCache();