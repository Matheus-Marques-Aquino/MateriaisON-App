import { Mongo } from 'meteor/mongo';

Meteor.methods({
    'products.create': function(data){ //sempre função por extenso
      return Products.insert({
          id: data.id,
          id_vendor: String(data.id_vendor),
          img_url: data.img_url,
          name: data.name,
          description: data.description,          
          price: data.price,
          category: data.category,
          stock_quantity: data.stock_quantity,
          details: data.details,
          tags: data.tags,
          related_id: data.realated_id           
      });
    },
    'products.popularity': function(productId){
      let product = Products.findOne({'id': productId})
      if (!product.popularity) { 
        return Products.update({'id': productId}, {$set: {'popularity': 1}})
      }else{
        return Products.update({'id': productId}, {$inc: {'popularity': 1}})
      }
    }
});

export const Products = new Mongo.Collection('products');