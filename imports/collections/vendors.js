import { Mongo } from 'meteor/mongo';

Meteor.methods({
    'vendors.create': function(data){
        var _data = {}
        _data.id = data.id;
        _data.user_id = data.id;
        _data.display_name = data.display_name;
        _data.adress = {};
        _data.img_url = data.image;
        _data.banner_url = '';
        _data.products = [];
        _data.open = true;
        _data.terms = {};
        _data.orders = [];

        return Vendors.insert({
            user_id: _data.id,
            id: _data.id,    
            display_name: _data.display_name,            
            address: _data.address,
            img_url: _data.img_url,
            banner_url: '',          
            products: [],
            open: true,
            terms: {},
            orders:[]          
        });
    },
    'vendors.update': function(vendor_id, data){
        return Vendors.update({'id': vendor_id},{$set: {
            user_id: data.id,
            display_name: data. display_name,
            address: data.address,
            img_url: data.img_url,
            banner_url: data.banner_url,
            products: data.products_url,
            open: data.open,            
            terms: data.terms,
            orders:data.orders            
            }});
      },
    'vendors.product.insert': function(vendor_id, product){
        return Vendors.update({'id': vendor_id}, { $push: { products: product } });
    },
    'vendors.popularity': function(_id){
      let vendor = Vendors.findOne({'_id': _id});
      if (!vendor.popularity){ vendor.popularity = []; }
      if (!vendor.popularity.includes(Meteor.userId())){ vendor.popularity.push(Meteor.userId()); }
      Vendors.update({'_id': _id}, {$set: {'popularity': vendor.popularity}})
      return;          
    }
});

export const Vendors = new Mongo.Collection('vendors');