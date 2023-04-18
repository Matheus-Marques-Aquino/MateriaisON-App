import { Mongo } from 'meteor/mongo';
import { Products } from '../products';
import { Vendors } from '../vendors';

Meteor.methods({
    'cache.create':function(){
        var vendorsCount = 0;
        var productsCount = 0;
        var date = new Date;
        date = date.getTime();

        console.log('Cache created')
        return CacheControl.insert({
            id: 1, 
            totalProducts: productsCount,
            totalVendors: vendorsCount,
            modifyDate: date
        });
    },
    'cache.update':function(){

        var vendorsCount = 0;
        var productsCount = 0;
        var date = new Date;
        date = date.getTime();
        if (Meteor.isClient) {
            var vendorsSubscribe = Meteor.subscribe('vendorList')
            var productsSubscribe = Meteor.subscribe('productList')   
            if (vendorsSubscribe.ready()){
                vendorsCount = Vendors.find({}).count();
            }
            if(productsSubscribe.ready()){
                productsCount = Products.find({}).count();
            }     
        }
        if (Meteor.isServer) {
            var vendorsCount = Vendors.find({}).count();
            var productsCount = Products.find({}).count();
        }

        console.log('Cache updated')
        return CacheControl.update({id: 1}, {$set:{
            totalProducts: productsCount,
            totalVendors: vendorsCount,
            modifyDate: date
        }});
    }

});

export const CacheControl = new Mongo.Collection('cache');