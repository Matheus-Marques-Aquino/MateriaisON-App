import { Mongo } from 'meteor/mongo';
import { Products } from './products';

import SimpleSchema from 'simpl-schema';

/*var detailsSchema = new SimpleSchema({
    name: { type: String},
    detail: { type: String} 
});

var categorySchema = new SimpleSchema({
    id: { type: SimpleSchema.Integer },
    name: { type: String },
    slug: { type: String }
});

var imageSchema = new SimpleSchema({
    id: { type: SimpleSchema.Integer },
    date_created: { type: String },
    date_created_gmt: { type: String },
    date_modified: { type: String },
    date_modified_gmt: { type: String },
    src: { type: String },
    name: { type: String },
    alt: { type: String },
    position: { type: SimpleSchema.Integer }
});

var productSchema = new SimpleSchema({
    id: { type: String },
    id_vendor: { type: String },
    img_url: { type: Array },
    'img_url.$': { type: imageSchema },
    name: { type: String },
    description: {type: String },
    price: { type: String },
    category: { type: Array },
    'category.$': { type: categorySchema },
    stock_quantity: { type: SimpleSchema.Integer },
    details: { type: Array },
    'details.$':{ type: detailsSchema },
    tags: { type: Array },
    'tags.$': { type: String },
    related_id: { type: Array },
    'related_id.$': { type: SimpleSchema.Integer }
})

var cartSchema = new SimpleSchema({
    _id: { type: String },
    user_id: { type: String },
    cart: { type: Array },
    'cart.$':{ type:productSchema }
});

Meteor.methods({
  'cart.insert'({user_id, quantity, product}) {
    
    new SimpleSchema({
        user_id: { type: String },
        quantity: { type: Number },
        product: { type: productSchema }
    }).validate({ user_id, quantity, product});


    if (user_id != this.userId) {
        throw new Meteor.Error('cart.updateText.unauthorized', 'Erro ao adicionar o produto');
    }
    if (product.stock_quantity < 1) {
        throw new Meteor.Error('cart.updateText.unauthorized', 'O produto fora de estoque');
    }
    
    Cart.schema = cartSchema;
    
    var cartArray = Cart.find({'user_id': user_id}).fetch();
        
    if (Meteor.isServer) {
        for(let i=0; i<cartArray[0].cart.length; i++){
            if (cartArray[0].cart[i].product.id == product.id){
                cartIncrease();                
                break;
            }
            if (i == cartArray[0].cart.length-1){
                cartInsert();
            }
        }
    }
        
    function cartInsert(){
        Cart.update({'user_id': user_id},{ $push: {
            cart:{
                quantity: quantity,
                product: product
            }
        }});
    }

    function cartIncrease(){
        Cart.update({'user_id': user_id, 'cart.product.id': product.id},{ $inc: {            
            'cart.$.quantity': quantity            
        }});
    }    
  },*/
Meteor.methods({
    'cart.insert':function( user_id, quantity, product_id, vendor_id){ //sempre função por extenso        
        if (!Meteor.userId()){
            throw new Meteor.Error('profile.addressText.unauthorized', 'Você deve estar logado para fazer isto');
        }
        var cartArray = Cart.findOne({'user_id': user_id});
        if (!cartArray){
            cartArray = { user_id: user_id, cart: [] };
            Cart.insert({ user_id: user_id, cart: [] });
        }
        if (Meteor.isServer) {
            for(let i=0; i<=cartArray.cart.length; i++){
                if (i == cartArray.cart.length){
                    cartInsert();
                    break;
                }
                console.log('V:'+cartArray.cart[0].vendor_id)
                console.log(cartArray.cart[i].vendor_id)
                if (cartArray.cart[0].vendor_id != cartArray.cart[i].vendor_id){
                    let item = {
                        quantity: cartArray.cart[i].quantity,
                        product: {
                            _id: cartArray.cart[i]._id,
                            id_vendor: cartArray.cart[i].vendor_id
                        }
                    }
                    Meteor.call('cart.remove', item)
                    //throw new Meteor.Error('profile.addressText.unauthorized', 'Finalize a compra antes de adicionar produtos de outros vendedores');
                }
                if (cartArray.cart[i].product_id == product_id){
                    cartIncrease();                
                    break;
                }                
            }
        }
        function cartInsert(){           
            return Cart.update({'user_id': user_id},{ $push: {
                cart:{
                    quantity: quantity,
                    product_id: product_id,
                    vendor_id: vendor_id
                }
            }});
        }
        function cartIncrease(){
            return Cart.update({'user_id': user_id, 'cart.product_id': product_id},{ $inc: {            
                'cart.$.quantity': quantity            
            }});
        }
    },
    'cart.create': function(user_id){ 
        return Cart.insert({
            user_id: user_id,
            cart: []                    
        });
    },
    'cart.remove': function(item){
        if (!Meteor.userId()){
            throw new Meteor.Error('profile.addressText.unauthorized', 'Você deve estar logado para fazer isto');
        }
        var myCart = Cart.findOne({'user_id': Meteor.userId()})
        if (!myCart){
            throw new Meteor.Error('profile.addressText.unauthorized', 'Houve um erro validação do carrinho');
        }
        return Cart.update({'user_id': Meteor.userId()}, {$pull:{'cart': { quantity: item.quantity, product_id: item.product._id, vendor_id: item.product.id_vendor }}});
    },
    'cart.changeQuantity': function(item, qtd){
        
        if (!Meteor.userId()){
            throw new Meteor.Error('profile.addressText.unauthorized', 'Você deve estar logado para fazer isto');
        }
        var myCart = Cart.findOne({'user_id': Meteor.userId()})
        if (!myCart){
            throw new Meteor.Error('profile.addressText.unauthorized', 'Houve um erro validação do carrinho');
        }
        let increase = qtd - item.quantity; 

        return Cart.update({'user_id': Meteor.userId(), 'cart': { quantity: item.quantity, product_id: item.product._id, vendor_id: item.product.id_vendor }}, {$inc:{'cart.$.quantity': increase }});
    },
    'cart.increaseQuantity': function(item, qtd){

        if (!Meteor.userId()){
            throw new Meteor.Error('profile.addressText.unauthorized', 'Você deve estar logado para fazer isto');
        }
        var myCart = Cart.findOne({'user_id': Meteor.userId()})
        if (!myCart){
            throw new Meteor.Error('profile.addressText.unauthorized', 'Houve um erro validação do carrinho');
        }        

        return Cart.update({'user_id': Meteor.userId(), 'cart': { quantity: item.quantity, product_id: item.product._id, vendor_id: item.product.id_vendor }}, {$inc:{'cart.$.quantity': qtd }});
    },
    'cart.fix': function(products){
        if (!Meteor.userId()){
            throw new Meteor.Error('8001', 'Erro durante a autenticação do usuário.')
        }
        let cart = Cart.findOne({'user_id': Meteor.userId()});
        if (!cart){ throw new Meteor.Error('8002', 'O usuário não possui produtos no carrinho.') }
        let productArray = products
        if (productArray.length == 0){ throw new Meteor.Error('8003', 'Erro no processamento dos produtos.') }
        let cartArray = cart.cart;
        if (cartArray.length == 0){ throw new Meteor.Error('8004', 'O usuário não possui produtos no carrinho.') }
        let newCart = [];
        cartArray.map((item, index)=>{
            for (let i=0; i<productArray.length; i++){
                if (item.product_id == productArray[i]._id){
                    if (item.quantity > productArray[i].stock_quantity){
                        cartArray[index].quantity = productArray[i].stock_quantity;                        
                        productArray[i].splice(i, 1);
                    }                    
                    break;
                }
            }
        });
        cartArray.map(item=>{
            if (item.quantity > 0){
                newCart.push(item);
            }
        });
        return Cart.update({'user_id': Meteor.userId()}, {$set:{'cart': newCart}})
    }
});

export const Cart = new Mongo.Collection('cart');