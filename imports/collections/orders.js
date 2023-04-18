import { Mongo } from 'meteor/mongo';
import { Vendors } from './vendors';
import { Products } from './products';
import { Profile } from './profile';
import { Cart } from './cart';
import { Shipping } from './cache/shipping';

Meteor.methods({
    'orders.create': function(vendorId, userId, _profile, packages, delivery, total){ //sempre função por extenso
        
        if (userId != this.userId) {
            throw new Meteor.Error('order.createText.unauthorized', 'Erro ao finalizar o pedido.');
        }  
        let today = new Date;
        let _idArray = [];
        let qtdArray = [];
        let cartArray = [];
        let cartCheck = 0;
        let price = 0;

        
        packages.map(item=>{
            _idArray.push(item.product._id);
            qtdArray[item.product._id]=item.quantity;            
        })      

        let vendor = Vendors.findOne({'id': vendorId});
        let productArray = Products.find({'_id': { $in: _idArray}}).fetch();  
        let cart = Cart.findOne({'user_id': userId})
        let profile = Profile.findOne({'_id': userId});

        cart = cart.cart;
        cart.map(item=>{
            cartArray.push(item.product_id);
        });

        productArray.map((item, index)=>{
            productArray[index].quantity = qtdArray[item._id];
            price += item.price*qtdArray[item._id];
            if (cartArray.includes(item._id)){ 
                cartCheck += 1; 
            }else{
                throw new Meteor.Error('order.createText.unauthorized', 'Erro ao finalizar o pedido, atualize a página e tente novamente.');
            }
            
        });

        if (cart.length != productArray.length || cart.length != cartCheck){
            throw new Meteor.Error('order.createText.unauthorized', 'Erro ao finalizar o pedido, atualize a página e tente novamente.');
        }

        if (!profile){
            throw new Meteor.Error('order.createText.unauthorized', 'Erro ao finalizar o pedido');
        }
        if (profile.profile.mainAddress != _profile.mainAddress){
            throw new Meteor.Error('order.createText.unauthorized', 'Erro ao finalizar o pedido, atualize a página e tente novamente.');
        }
        
        let profileAddress = profile.profile.address[profile.profile.mainAddress];
        let places = {
            place1: {
                lat: (vendor.address.coords.selected.lat).toString(),
                lng: (vendor.address.coords.selected.lng).toString(),
                formated: vendor.address.rua + ', ' + vendor.address.numero + ' - ' + vendor.address.bairro + ', ' + vendor.address.cidade + ' - ' + vendor.address.UF,
                complement: (vendor.address.complemento)?vendor.address.complemento:'',
                phone: (vendor.phone)?vendor.phone:''
            }, 
            place2: {
                name: profile.profile.name,          
                lat: (profile.profile.address[profile.profile.mainAddress].coords.selected.lat).toString(),
                lng: (profile.profile.address[profile.profile.mainAddress].coords.selected.lng).toString(),
                formated: profileAddress.rua + ', ' + profileAddress.numero + ' - ' + profileAddress.bairro + ', ' + profileAddress.cidade + ' - ' + profileAddress.UF,
                complement: (profileAddress.complemento)?profileAddress.complemento:'',
                phone: (profileAddress.celular)?profileAddress.celular:''
            },
            vendorId: vendor.vendorId
        }
        
        if (delivery.index == 3){
            Meteor.call('getLoggi', Meteor.userId(), places, {}, function(error, result){
                if (!error){

                }else{
                    throw new Meteor.Error('order.createText.unauthorized', 'Erro ao finalizar o pedido, atualize a página e tente novamente.');
                }
            })
               
        }
        
        price += delivery.price;
        price = Math.round(price*100)/100;

        if (total != price){
            console.log(price+'/'+total);
            throw new Meteor.Error('order.createText.unauthorized', 'Erro ao finalizar o pedido, atualize a página e tente novamente.');
        }

        let order_id = 2133 + Orders.find({}).count() 
        let order = {
            orderId: order_id,
            paid: false,
            status: 0,
            trackingCode: undefined,
            date: new Date,
            userId: userId,
            vendorId: vendor.id,
            vendor_id: vendor._id,
            products: productArray,
            delivery: delivery,
            paymentMethod: undefined,
            address: profile.profile.address[profile.profile.mainAddress],
            email: profile.emails[0].address,
            price: price
        }
        let orderId = Orders.insert({order});
        order._id = orderId;
        Vendors.update({'_id': vendor._id}, {$push: {'orders': orderId}});
        Cart.update({'user_id': userId}, {$set:{'cart': []}});        
        return Profile.update({'_id': userId}, {$push:{'profile.orders': orderId}});    
        
    }
});

export const Orders = new Mongo.Collection('orders');