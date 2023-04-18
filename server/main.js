import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Vendors } from '../imports/collections/vendors';
import { Products } from '../imports/collections/products';
import { HTTP } from 'meteor/http';
import { Cart } from '../imports/collections/cart';
import { Orders } from '../imports/collections/orders';
import { Profile } from '../imports/collections/profile';
import { CacheControl } from '../imports/collections/cache/cache_control';
import { Shipping } from '../imports/collections/cache/shipping';
import { CorreiosBrasil, RastreioBrasil } from 'correios-brasil';
import { WebApp } from 'meteor/webapp';
import { Email } from 'meteor/email';
import Email_HTML from './emails';
import { Services } from '../imports/collections/services';
import bodyParser from 'body-parser';
import { Asaas } from '../imports/collections/asaas';

Meteor.startup(() => {
  WebApp.connectHandlers.use((req, res, next) => {
    if (req.url.startsWith('/d5hb3146eh4aer4r6an45t')) {
      let body = '';
      req.on('data', Meteor.bindEnvironment(function (data) { body += data; }));
      req.on('end', Meteor.bindEnvironment(function () { 
        body = JSON.parse(body); 
        console.log(body);
      }));

      res.statusCode = 200;
      res.end();
    } else {
      next();
    }
  });

  /*OPEN AND CLOSE SHOPS*/
  var startTime = new Date();
  var minutes = startTime.getMinutes().toString();
  var seconds = startTime.getSeconds();
  var milliseconds = startTime.getMilliseconds();

  if (minutes < 10){ minutes = ('0'+minutes).toString(); }
  var minutesTo = (parseInt(minutes.charAt(0))+1) * 10 - minutes;        
  var secondsTo = (60 - seconds);
  var millisecondsTo = (minutesTo * 60 - secondsTo) * 1000 - milliseconds;
   
function bulkShopProcess(){
    let vendorsShop = Vendors.find({}).fetch();
    let now = new Date();
    let week = now.getDay();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let shops = []

    vendorsShop.map(vendor=>{     
      if (!vendor.terms){
          vendor.terms = {};
      }
      if (!vendor.terms.openTime){
          vendor.terms.openTime = [
              {start:'09:30', end:'20:00', open:true},
              {start:'09:00', end:'20:30', open:true},
              {start:'09:00', end:'20:30', open:true},
              {start:'09:00', end:'20:30', open:true},
              {start:'09:00', end:'20:30', open:true},
              {start:'09:00', end:'20:30', open:true},
              {start:'09:30', end:'20:00', open:true}
          ];
      }
      let open = vendor.terms.openTime[week].open;
      let changed = false;
      if (!open){
        shops.push({id: vendor.id, open: false});
        changed = true;
      }            
      let openTime = vendor.terms.openTime[week].start.split(':');
      let openHours = parseInt(openTime[0]);
      let openMinutes = parseInt(openTime[1]);
      if (hours < openHours && changed == false){
          if (vendor.open){
            shops.push({id: vendor.id, open: false});        
          }
          changed = true;
      }else{
          if (minutes < openMinutes && hours == openHours && changed == false){
            if (vendor.open){
              shops.push({id: vendor.id, open: false});
            }
            changed = true;
          }
      }
      let closeTime = vendor.terms.openTime[week].end.split(':');
      let closeHours = parseInt(closeTime[0]);
      let closeMinutes = parseInt(closeTime[1]);
      if (hours > closeHours && changed == false){
          if (vendor.open){
            shops.push({id: vendor.id, open: false});
          }
          changed = true;
      }else{
          if (minutes > closeMinutes && hours == closeHours && changed == false){
            if (vendor.open){
              shops.push({id: vendor.id, open: false});
            }                    
            changed = true;
          }
      }           
      if (!vendor.open && changed == false){
        shops.push({id: vendor.id, open: true});             
      }
    });
    if (shops.length > 0){
      var bulkShops = Vendors.rawCollection().initializeUnorderedBulkOp();
      shops.map(shop=>{
        bulkShops.find({'id': shop.id}).update({ $set: {'open': shop.open }});
      });
      Meteor.wrapAsync(bulkShops.execute, bulkShops)();
    }
    Meteor.setTimeout(()=>{bulkShopProcess()}, 600000);
  }
  Meteor.setTimeout(()=>{bulkShopProcess()}, millisecondsTo);

  /*OPEN AND CLOSE SHOPS*/ 
  //NOVO
  Meteor.publish('Profile', function(){
    return Meteor.users.find({'_id': Meteor.userId()});
  })
  Meteor.publish('Vendors', function(){
    return Vendors.find({}, {fields:{'bankData': 0}});
  });
  Meteor.publish('Single_Vendor', function(_id){
    return Vendors.find({'_id': _id});
  });
  Meteor.publish('Vendor_Products', function(_id){
    return Products.find({'vendor_id': _id});
  });
  Meteor.publish('Services', function(){
    return Services.find({});
  });
  Meteor.publish('Single_Service', function(_id){
    return Services.find({'_id': _id});
  });
  
  //NOVO
  Meteor.publish('products', function() {//Todos os Produtos
    return Products.find({});
  });
  Meteor.publish('productList', function(){//Apenas id
    return Products.find({}, {fields:{_id: 1}});
  })
  Meteor.publish('productSearch', function(){//Apenas name para o serach
    return Products.find({}, {fields:{_id: 1, 'name': 1}});
  })
  Meteor.publish('productsBox', function(){//Apenas name para o serach
    return Products.find({}, {fields:{_id: 1, 'name': 1, 'price': 1, 'img_url': 1, 'id': 1, 'category': 1, 'id_vendor': 1}});
  })

  Meteor.publish('vendors', function() {    
    return Vendors.find({}, {fields:{products: 0, orders: 0}});    
  });
  Meteor.publish('vendorList', function() {    
    return Vendors.find({}, {fields:{_id: 1}});    
  });
  Meteor.publish('vendorsBox', function(array) {    
    return Vendors.find({'_id': { $in: array }}, {fields:{_id: 1, 'display_name': 1, 'img_url': 1, 'open': 1, 'id': 1, 'color': 1}});    
  });
  Meteor.publish('vendorPage', function(vendorId) {     
    let vendor =  Vendors.find({'id': vendorId}, {fields:{products: 0, orders: 0}}); 
    console.log(vendor)   
    return vendor
  });

  Meteor.publish('vendorFields', function(field, vendorId){
    if (field == 'ProductPage'){
      return Vendors.find({'id': vendorId}, {fields:{'id': 1, 'display_name': 1, 'color': 1, 'address': 1}});        
    }
    if (field == 'VendorPage'){
      return Vendors.find({'id': vendorId}, {fields:{'id': 1, 'display_name': 1, 'img_url': 1, 'open': 1, 'banner_url': 1, 'color': 1, 'terms': 1, 'address': 1}});
    }
    if (field == 'SearchPage'){
      return Vendors.find({}, {fields:{'id': 1, '_id': 1, 'display_name': 1, 'open': 1, 'terms': 1, 'popularity': 1, 'color': 1, 'terms': 1, 'address': 1}});        
    }
    if (field == 'VendorSearchPage'){
      return Vendors.find({'id': vendorId}, {fields:{'id': 1, '_id': 1, 'display_name': 1, 'img_url': 1, 'open': 1, 'banner_url': 1, 'popularity': 1, 'color': 1, 'terms': 1, 'address': 1}});        
    }
    if (field == 'IndexPage'){
      return Vendors.find({}, {fields:{'id': 1, '_id': 1, 'display_name': 1, 'open': 1, 'terms': 1, 'address': 1, 'img_url': 1, 'popularity': 1, 'color': 1, 'terms': 1}});
    }
    if (field == 'CartPage'){
      return Vendors.find({'id': vendorId}, {fields:{'id': 1, 'display_name': 1, 'img_url': 1, 'terms': 1, 'address': 1, 'color': 1, 'terms': 1}});        
    }
    if (field == 'CategoryPage'){
      return Vendors.find({'id': vendorId}, {fields:{'id': 1, 'display_name': 1, 'img_url': 1, 'open': 1, 'banner_url': 1, 'color': 1, 'terms': 1, 'address': 1}});
    }    
    if (field == 'OrdersPage'){
      return Vendors.find({'id': { $in: vendorId }}, {fields:{'_id': 1, 'id': 1, 'display_name': 1, 'img_url': 1, 'address': 1, 'color': 1, 'terms': 1}});    
    }
    if (field == 'OrderPage'){
      return Vendors.find({'id': vendorId}, {fields:{'_id': 1, 'id': 1, 'display_name': 1, 'img_url': 1, 'address': 1, 'color': 1, 'terms': 1}});
    }
    if (field == 'SearchPageResults'){
      return Vendors.find({'id': { $in: vendorId}}, {fields:{'id': 1, '_id': 1, 'display_name': 1, 'img_url': 1, 'open': 1, 'banner_url': 1, 'popularity': 1, 'color': 1, 'terms': 1, 'address': 1}})
    }
  });

  Meteor.publish('productFields', function(field, productId){
    var mainCategories = [
      'Banheiro','Climatização e ventilação',
      'Cozinha e área de serviço','Decoração',
      'Esporte e lazer','Ferragens',
      'Ferramentas','Iluminação',
      'Jardim e varanda','Materiais elétricos',
      'Materiais hidráulicos','Material de construção',
      'Pisos e revestimentos','Segurança e comunicação',
      'Tapetes','Tintas e acessórios','Tudo para sua casa'
    ]

    if (field == 'ProductPage'){
      return Products.find({'id': productId}, {fields: {'id': 1, 'img_url': 1, 'id_vendor': 1, 'name': 1, 'description': 1, 'price': 1, 'category': 1, 'stock_quantity': 1, 'details': 1, 'popularity': 1}});
    }
    if (field == 'VendorPage'){ 
      return Products.find({'id_vendor': productId.vendorId}, {'id': 1, '_id': 1, 'id_vendor': 1, 'name': 1, 'price': 1, 'img_url': 1, 'category': 1, 'popularity': 1})
    }
    if (field == 'SearchPage'){
      return Products.find({}, {fields: {'id': 1, '_id': 1, 'name': 1}});
    }
    if (field == 'VendorSearchPage'){
      return Products.find({'id_vendor': productId}, {fields: {'id': 1, '_id': 1, 'id_vendor': 1, 'name': 1}});
    }
    if (field == 'SearchPageResults'){
      return Products.find({'_id': { $in: productId }}, {fields: {'id': 1, '_id': 1, 'id_vendor': 1, 'name': 1, 'price': 1, 'img_url': 1, 'id': 1, 'category': 1, 'popularity': 1}});
    }  
    if (field == 'CartPage'){
      return Products.find({'_id': { $in: productId }}, {fields: {'id': 1, '_id': 1, 'id_vendor': 1, 'name': 1, 'img_url': 1, 'price': 1, 'details': 1, 'stock_quantity':1}});
    } 
    if (field == 'CategoryPage'){
      return Products.find({'category': {$elemMatch:{name: productId.categoryName}}, 'id_vendor': productId.vendorId}, {fields: {'id_vendor': 1, 'id': 1, 'img_url': 1, 'name': 1, 'price': 1, 'category': 1, 'stock_quantity': 1}});
    }
    return Products.find({});
  })

  Meteor.publish('cartFields', function(field, cartId) {
    if (field == 'CartPage'){
      return Cart.find({'user_id': this.userId}, { fields: {'user_id': 1, 'cart': 1}})
    }
    if (field == 'ProductPage'){
      return Cart.find({'user_id': this.userId}, { fields: {'user_id': 1, 'cart': 1}})
    }
    return Cart.find({'user_id': this.userId});
  }); 

  Meteor.publish('profileFields', function(field, profileId) {
    if (this.userId){
      if (field == 'ProfileCoords') {
        return Meteor.users.find({'_id': this.userId}, { fields: { '_id': 1, 'profile.mainAddress': 1, 'profile.address.coords.selected': 1}}); 
      }  
      if (field == 'IndexPage') {
        return Meteor.users.find({'_id': profileId}, { fields: { '_id': 1, 'emails': 1, 'profile': 1}}); 
      }  
      if (field == 'ProfilePage') {
        return Meteor.users.find({'_id': this.userId}, { fields: { '_id': 1, 'email': 1, 'profile.name': 1, 'profile': 1}});
      }  
      if (field == 'DeliveryPage') {
        return Meteor.users.find({'_id': this.userId}, { fields: { '_id': 1, 'emails': 1, 'profile': 1}});
      }
      if (field == 'ProfilePage') {
        return Meteor.users.find({'_id': this.userId}, { fields: { '_id': 1, 'profile.orders': 1}});
      }
      if (field == 'CartPage'){
        return Meteor.users.find({'_id': this.userId}, { fields: { '_id': 1, 'profile.mainAddress': 1, 'profile': 1}})
      }
      if (field == 'PaymentAddress'){
        return Meteor.users.find({'_id': this.userId}, { fields: { '_id': 1, 'profile': 1}})
      }
    }
  })

  Meteor.publish('orderFields', function(field, orderId){
    if (this.userId){
      if (field == 'OrdersPage'){
        return Orders.find({'order.userId': this.userId});
      }
      if (field == 'OrderPage'){
        if (this.userId == orderId.user_id){
          return Orders.find({'order.orderId': orderId.orderId, 'order.userId': this.user_id});
        }else{
          return Orders.find({'_id': -1});
        }        
      }
    }
  });

  Meteor.publish('vendorProducts', function(vendor_id) {    
    return Products.find({'id_vendor': vendor_id}, {'_id': 1,'name': 1, 'img_url': 1, 'price': 1});    
  });

  Meteor.publish('cart', function() {
    return Cart.find({'user_id': this.userId});
  });  
  Meteor.publish('cartProducts', function(id_vendor) {
    return Products.find({'id_vendor': id_vendor},{fields: {'_id': 1,'name': 1, 'img_url': 1, 'price': 1}});
  });
  
  Meteor.publish('_cache', function() {
    return CacheControl.find({});
  });

  Meteor.publish('profile', function (){
    if (this.userId) {
      return Meteor.users.find({'_id': this.userId}, {
        fields: { emails: 1, profile: 1}}); 
    } else {
      this.ready();
    }   
  }); 

  Accounts.validateNewUser((user) => {   
    if ( Meteor.users.find({'username': user.username}).count() > 0  ) { throw new Meteor.Error('0000', 'Este endereço de e-mail já esta em uso.') }
    if ( Meteor.users.find({'profile.phone': user.profile.phone}).count() > 0) { throw new Meteor.Error('0001', 'Este número de celular já esta em uso') }

    if (user.username.length == 0 || user.username == undefined){ throw new Meteor.Error('0002', 'Informe o seu endereço de e-mail.') }
    if (!user.profile.firstName){ throw new Meteor.Error('0003', 'O campo "Nome" é obrigatório.') }
    if (!user.profile.lastName){ throw new Meteor.Error('0003', 'O campo "Sobrenome" é obrigatório.') }
    if (!user.profile.phone){ throw new Meteor.Error('0004', 'Informe o número de seu celular.') }

    if (!(/^[A-zÀ-ú/\s]+$/.test(user.profile.firstName))){ throw new Meteor.Error('0005', 'O seu nome não deve conter caracteres especiais.'); }
    if (!(/^[A-zÀ-ú/\s]+$/.test(user.profile.lastName))){ throw new Meteor.Error('0006', 'O seu sobrenome não deve conter caracteres especiais.'); }
    if (!(user.username.includes('@') && user.username.includes('.'))){ throw new Meteor.Error('0007', 'Informe um endereço de e-mail válido.') }
    if (!(/^[0-9\-\(\)]+$/.test(user.profile.phone))){ throw new Meteor.Error('0008', 'Informe um número de celular válido.') }
    if (!user.profile.role){ user.profile.role = [ 'user' ]; }
    
    let firstName = user.profile.firstName.trim();
    let lastName = user.profile.lastName.trim();
    let last_id = Meteor.users.findOne({}, {sort:{'createdAt': -1}});
       
    if (!last_id){ 
      last_id = '1_' + Math.random(0).toString().slice(-5);
    }else{ 
      if (!last_id.id){ 
        last_id = '1_' + Math.random(0).toString().slice(-5); 
      }else{
        last_id = last_id.toString();
        last_id = last_id.split('_');
        last_id = last_id[0];
        last_id = parseInt(last_id);
        if (!last_id){ last_id = '1_' + Math.random(0).toString().slice(-5); }
      }
    }
    user.profile.firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
    user.profile.lastName = lastName;
    user.profile.fullName = firstName + ' ' + lastName; 
    user.profile.id = last_id;    

    let data = {
      name: user.profile.firstName,
      email: user.username,
      phone: user.profile.phone,
      to: user.profile.firstName + ' <' + user.username + '>',
      from: 'MateriaisON <contato@materiaison.com.br>',
      subject: 'Seja bem-vindo a MateriaisON, ' + firstName + '!',
    };
    let mail = {
      to: 'contato@materiaison.com.br',
      from: 'MateriaisON <contato@materiaison.com.br>',
      subject: user.profile.firstName + ' acabou de se cadastrar em nosso aplicativo!',
      html: '<div> <div>Nome: ' + user.profile.fullName + '</div> <div>E-mail: ' + user.username + '</div> <div>Celular: ' + user.profile.phone + '</div> </div>'
    };
    Email.send(mail);  

    let htmlMail = new Email_HTML(data, 'newAccount');

    return true;
  });

  function loggiCreateShopString(vendor){
    if (!vendor.phone){
      vendor.phone='11999999999';
    }
    vendor.address.cep = vendor.address.cep.replace('-', '');
    return "mutation { createShop (input: { name: \""+vendor.display_name+"\", addressCep: \""+vendor.address.cep+"\", addressNumber: \""+vendor.address.numero+"\", addressComplement: \""+vendor.address.complemento+"\", phone: \""+vendor.phone+"\", companyId: 179807, pickupInstructions: \"Falar com a recepção\", numberOfRadialZones: 1, externalId: \"MateriaisON_2020\" }) { shop { pk name address { label } pickupInstructions } }}"
  }
  function loggiEstimateString(places, pk){
    let vendor = {
      address: places.place1.address.formated,
      complement: places.place1.address.complement,
      phone: places.place1.address.phone,
      lat: places.place1.lat,
      lng: places.place1.lng
    }
    let client = {
      name: places.place2.name,
      address: places.place2.address.formated,
      complement: places.place2.address.complement,
      phone: places.place2.address.phone,
      lat: places.place2.lat,
      lng: places.place2.lng
    }
    let loggiEstimate = "query { estimateCreateOrder( shopId: "+ pk +" pickups: [{ address: { lat: "+ vendor.lat +" lng: "+ vendor.lng +" address: \""+ vendor.address +"\" complement: \""+ vendor.complement +"\" } }] packages: [{ pickupIndex: 0 recipient: { name: \""+ client.name +"\" phone: \""+ client.phone +"\" } address: { lat: "+ client.lat +" lng: "+ client.lng +" address: \""+ client.address +"\" complement: \""+ client.complement +"\" } dimensions: { width: 44 height: 38 weight: 3000 length: 38 } charge: { value: \"10.00\" method: 64 change: \"0\" } } ] ){ totalEstimate { totalCost totalEta totalDistance } ordersEstimate { packages { isReturn cost eta outOfCoverageArea outOfCityCover originalIndex resolvedAddress originalIndex } optimized { cost eta distance } } packagesWithErrors { originalIndex error resolvedAddress } } }";
    return loggiEstimate;
  }

  function clearCart(_cart){ 
    let cart = Cart.findOne({'_id': _cart._id});    
    cart.cart.map(product=>{
      let quantity = (-1) * product.quantity;
      Products.update({'_id': product.product_id}, {$inc:{ 'stock_quantity': quantity}});
    });
    Cart.update({'_id': _cart._id}, { $set:{'cart':[]} });
  }

  function createOrder(user, vendor, products, delivery, price, payment_data, cart){
    let orderId = 2133 + Orders.find({}).count();
    let orderStatus = 0
    
    if (payment_data.billingType == 'CREDIT_CARD'){      
      switch(payment_data.status){
        case 'PENDING':
          orderStatus = 0
          break;
        case 'RECEIVED':
          orderStatus = 1          
          break; 
        case 'CONFIRMED':
          orderStatus = 1
          break;       
        case 'OVERDUE':
          orderStatus = 4
          break;
        case 'REFUNDED':
          orderStatus = 4
          break;
        case 'RECEIVED_IN_CASH':
          orderStatus = 1
          break;
        case 'REFUND_REQUESTED':
          orderStatus = 4
          break;
      }
    }

    let order = {
      orderId: orderId,      
      status: orderStatus,
      trackingCode: undefined,
      date: new Date,
      userId: user.userId,
      vendorId: vendor.id,
      vendor_id: vendor._id,
      products: products,
      delivery: delivery,
      vendor_id: vendor.vendor_id,
      vendorId: vendor.vendorId,
      payment:{
        cardFlag: payment_data.creditCard.creditCardBrand,
        cardDigits: payment_data.creditCard.creditCardNumber        
      },      
      address: user.address,
      email: user.email,
      price: price
    }

    let order_id = Orders.insert({order})

    Vendors.update({'_id': vendor.vendor_id}, {$push: {'orders': order_id}});

    Meteor.users.update({'_id': user.userId}, {$push:{'profile.orders': order_id}})

    Asaas.insert({'userId': user.userId, 'orderId': order_id, 'payId': payment_data.id,
    'status': payment_data.status, 'value': payment_data.value, 'paymentDate': payment_data.paymentDate, 
    'clientPaymentDate': payment_data.clientPaymentDate, 'dueDate': payment_data.dueDate, 
    'customer': payment_data.customer, 'cart': cart});   

    clearCart(cart);

    return orderId;
  }  
  
  function deliveryUpdate(userId, places, data, ready){    

    console.log(places)

    let today = (new Date).getTime();
    today = Math.round(today / 1000 / 60);

    let place1 = places.place1;
    let place2 = places.place2;
    let price = [0, 0, 0, 0, 0]
    let minPrice = [0, 0, 0, 10, 0]

    if (!ready){      
      let loggi = {
        ambient: 'https://www.loggi.com/graphql/?==',
        apiKey: 'ApiKey contato@materiaison.com.br:754b9af678caca971947df092abae2fe9e3b87b2',
        price: -2
      }       
      let correios = {
        pac: {
          price: -1
        },
        sedex: {
          price: -1
        }
      }
      let transportadora = {
        price: -1,
        pricePerKm: 4,
        googleUrl: 'https://maps.googleapis.com/maps/api/distancematrix/json?units=metric',
        origin: '&origins='+places.place2.lat+','+places.place2.lng,
        destination: '&destinations='+places.place1.lat+','+places.place1.lng,
        key: '&key=AIzaSyB2cI2xl2b40J1NNg4EZ2VXuD2JTBJ2GTg' 
      }
      let retirar = {
        price: -1
      }
      if (data.doRetirar){
        retirar.price = minPrice[4];
      }else{
        retirar.price = -2;
      }
      if (!data.doRetirar && !data.doCorreios && !data.doTransportadora && !data.doRetirar){
        throw new Meteor.Error('2004', 'Não há nenhuma forma de envio disponível para esta lista de produtos.')
      }
      //CORREIOS
      if (data.doCorreios){
        //PAC
        let correiosData = {
          sCepOrigem:  data.vendor.address.cep.replace('-', ''),
          sCepDestino:  place2.address.cep.replace('-', ''),
          nVlPeso: data.data.wg.toString(),
          nCdFormato:  "1",
          nVlComprimento:  data.data.d,
          nVlAltura:  data.data.h,
          nVlLargura:  data.data.w,
          nCdServico:  "04510",
          nVlDiametro:  "0",
        }
        let callCorreios = new CorreiosBrasil();
        callCorreios.calcPrecoPrazo(correiosData).then((response) => {
          if (response.Valor){
            correios.pac.price = parseFloat(response.Valor.replace(',', '.')) + minPrice[1];
          }else{
            correios.pac.price = -3;
            price[1] = correios.pac.price ;
            if (loggi.price != -1 && correios.sedex.price != -1 && transportadora.price != -1 && retirar.price != -1){          
              data.price = price;
              return deliveryUpdate(userId, places, data, true);
            } 
          }
          price[1] = correios.pac.price + minPrice[1];
          if (loggi.price != -1 && correios.sedex.price !=1 && transportadora.price != -1 && retirar.price != -1){          
            data.price = price;
            return deliveryUpdate(userId, places, data, true);
          }            
        });
        //SEDEX
        correiosData.nCdServico = "04014";
        callCorreios.calcPrecoPrazo(correiosData).then((response) => {
          if (response.Valor){
            correios.sedex.price = parseFloat(response.Valor.replace(',', '.')) + minPrice[2];
          }else{
            correios.sedex.price = -3;
            price[2] = correios.sedex.price;
            if (loggi.price != -1 && correios.pac.price != -1 && transportadora.price != -1 && retirar.price != -1){          
              data.price = price;            
              return deliveryUpdate(userId, places, data, true);
            } 
          }
          price[2] = correios.sedex.price + minPrice[2];
          if (loggi.price != -1 && correios.pac.price != -1 && transportadora.price != -1 && retirar.price != -1){          
            data.price = price;            
            return deliveryUpdate(userId, places, data, true);
          }                 
        });
      }else{
        correios.pac.price = -2;
        price[1] = correios.pac.price ;
        correios.sedex.price = -2;
        price[2] = correios.sedex.price;
        if (loggi.price != -1 && transportadora.price != -1 && retirar.price != -1){
          data.price = price;            
          return deliveryUpdate(userId, places, data, true);
        }
      }                 
      //LOGGI
      if (data.doLoggi){
        let callLoggiEstimate = HTTP.call('POST', loggi.ambient, {
          headers: {
            'Content-Type':'application/json',
            'Authorization':loggi.apiKey},
          data:{ 
            query: loggiEstimateString(places, data.vendor.pk)},
            timeout: 10000
        });
        let loggiData = callLoggiEstimate.data.data.estimateCreateOrder;
        if (!callLoggiEstimate.data.errors){    
          loggi.price = parseFloat(loggiData.ordersEstimate[0].optimized.cost);
          price[0] = loggi.price + minPrice[0];
          if (correios.pac.price != -1 && correios.sedex.price != -1 && transportadora.price != -1 && retirar.price != -1){          
            data.price = price;
            return deliveryUpdate(userId, places, data, true);
          }
        }else{
          loggi.price = -3;
          price[0] = loggi.price;
          if (correios.pac.price != -1 && correios.sedex.price != -1 && transportadora.price != -1 && retirar.price != -1){          
            data.price = price;
            return deliveryUpdate(userId, places, data, true);
          }
        } 
      }else{
        loggi.price = -2;
        price[0] = loggi.price;
        if (correios.pac.price != -1 && correios.sedex.price != -1 && transportadora.price != -1 && retirar.price != -1){
          data.price = price;
          return deliveryUpdate(userId, places, data, true);
        }
      }
      //TRANSPORTADORA
      if (data.doTransportadora){
        let transportadoraUrl = transportadora.googleUrl + transportadora.origin + transportadora.destination + transportadora.key
        let callTransportadoraEstimate = HTTP.call('GET', transportadoraUrl, {
          headers: {
            'Content-Type':'application/json'
          },
          timeout: 10000
        });
        let transportadoraData = callTransportadoraEstimate.data.rows[0].elements[0];
        if (transportadoraData.status == 'OK'){
          transportadora.price = Math.round( transportadora.pricePerKm * (transportadoraData.distance.value/1000) * 100 )/100;
          price[3] = transportadora.price + minPrice[3];
          if (loggi.price != -1 && correios.pac.price != -1 && correios.sedex.price != -1 && retirar.price != -1){
            data.price = price;
            return deliveryUpdate(userId, places, data, true);
          }
        }else{
          transportadora.price = -3;
          price[3] = transportadora.price;
          if (loggi.price != -1 && correios.pac.price != -1 && correios.sedex.price != -1 && retirar.price != -1){
            data.price = price;
            return deliveryUpdate(userId, places, data, true);
          }
        }
      }else{
        transportadora.price = -2;
        price[3] = transportadora.price;
        if (loggi.price != -1 && correios.pac.price != -1 && correios.sedex.price != -1 && retirar.price != -1){
          data.price = price;
          return deliveryUpdate(userId, places, data, true);
        }
      }
    }else{
      price = data.price;
      if (data.empty){
        Shipping.insert({
          'user_id': userId, 
          'shipping': [{
            'place1': {
              'lat': place1.lat, 
              'lng': place1.lng}, 
              'place2': {
                lat: place2.lat, 
                lng: place2.lng}, 
              'data': data.data, 
              'price': price, 
              'lastUpdate': today, 
              'type': 0
            }], 
          'lastUpdate': today
          }
        );        
      }else{
        if (data.insert){
          Shipping.update({'user_id': userId}, 
          {$push: {'shipping': {
            'place1':{
              lat: place1.lat, 
              lng: place1.lng}, 
            'place2':{
              lat: place2.lat, 
              lng: place2.lng}, 
            'data': data.data, 
            'price': price, 
            'lastUpdate': today, 
            'type': 0
          }}});
        }else{
          Shipping.update({'user_id': userId}, 
          {$set: {['shipping.'+ data.offset]: {
            'place1':{
              lat: place1.lat, 
              lng: place1.lng}, 
            'place2':{
              lat: place2.lat, 
              lng: place2.lng}, 
            'data': data.data, 
            'price': price, 
            'lastUpdate': today, 
            'type': 0
          }}});
        }        
        Shipping.update({'user_id': userId}, 
        {$set: {
          'lastUpdate': today
        }});
      }    
      console.log('Shipping cache updated')
      return price;
    }
  }
  function checkDelivery(price, weight, places, delivery){
    let _price = 0
    switch(delivery.index){
      case 0:
        if (delivery.error){ throw new Meteor.Error('4017', 'Ocorreu um erro a validação do método de envio, atualize a página ou tente novamente mais tarde.'); }
        if (delivery.box.wg != weight){ throw new Meteor.Error('4018', 'Ocorreu um erro a validação do método de envio, atualize a página ou tente novamente mais tarde.'); }
        let callLoggiEstimate = HTTP.call('POST', loggi.ambient, {
          headers: {
            'Content-Type':'application/json',
            'Authorization':loggi.apiKey},
          data:{ 
            query: loggiEstimateString(places, data.vendor.pk)},
            timeout: 10000
        });
        let loggiData = callLoggiEstimate.data.data.estimateCreateOrder;
        _price = parseFloat(loggiData.ordersEstimate[0].optimized.cost);
        if (price == _price){
          return true;
        }else{
          throw new Meteor.Error('4012', 'Ocorreu um erro a validação do método de envio, atualize a página ou tente novamente mais tarde.');
        }
        break;
      case 1:
        if (delivery.error){ throw new Meteor.Error('4017', 'Ocorreu um erro a validação do método de envio, atualize a página ou tente novamente mais tarde.'); }
        console.log('1')
        console.log(weight)
        console.log(delivery.box.wg)
        if (delivery.box.wg != weight){ throw new Meteor.Error('4018', 'Ocorreu um erro a validação do método de envio, atualize a página ou tente novamente mais tarde.'); }        
        console.log('2')
        let callPac = new CorreiosBrasil();
        let correiosPac = {
          sCepOrigem:  places.place1.address.cep.replace('-', ''),
          sCepDestino:  places.place2.address.cep.replace('-', ''),
          nVlPeso: delivery.box.wg.toString(),
          nCdFormato:  "1",
          nVlComprimento:  delivery.box.d,
          nVlAltura:  delivery.box.h,
          nVlLargura:  delivery.box.w,
          nCdServico:  "04510",
          nVlDiametro:  "0",
        }
        return callPac.calcPrecoPrazo(correiosPac).then((response) => {
          _price = parseFloat(response.Valor.replace(',','.'));
          if (price == _price){
            return true;
          }else{
            throw new Meteor.Error('4013', 'Ocorreu um erro a validação do método de envio, atualize a página ou tente novamente mais tarde.');
          }          
        });
        break;
      case 2:
        if (delivery.error){ throw new Meteor.Error('4017', 'Ocorreu um erro a validação do método de envio, atualize a página ou tente novamente mais tarde.'); }
        if (delivery.box.wg != weight){ throw new Meteor.Error('4018', 'Ocorreu um erro a validação do método de envio, atualize a página ou tente novamente mais tarde.'); }
        let callSedex = new CorreiosBrasil();
        let correiosSedex = {
          sCepOrigem:  places.place1.address.cep.replace('-', ''),
          sCepDestino:  places.place2.address.cep.replace('-', ''),
          nVlPeso: delivery.box.wg.toString(),
          nCdFormato:  "1",
          nVlComprimento:  delivery.box.d,
          nVlAltura:  delivery.box.h,
          nVlLargura:  delivery.box.w,
          nCdServico:  "04014",
          nVlDiametro:  "0",
        }
        return callSedex.calcPrecoPrazo(correiosSedex).then((response) => {
          _price = parseFloat(response.Valor.replace(',','.'));
          if (price == _price){
            return true;
          }else{
            throw new Meteor.Error('4014', 'Ocorreu um erro a validação do método de envio, atualize a página ou tente novamente mais tarde.');
          }          
        });
        break;  
      case 3:
        if (delivery.error){ throw new Meteor.Error('4017', 'Ocorreu um erro a validação do método de envio, atualize a página ou tente novamente mais tarde.'); }
        if (delivery.box.wg != weight){ throw new Meteor.Error('4018', 'Ocorreu um erro a validação do método de envio, atualize a página ou tente novamente mais tarde.'); }        
        let transportadora = {
          pricePerKm: 4,
          googleUrl: 'https://maps.googleapis.com/maps/api/distancematrix/json?units=metric',
          origin: '&origins='+places.place2.lat+','+places.place2.lng,
          destination: '&destinations='+places.place1.lat+','+places.place1.lng,
          key: '&key=AIzaSyB2cI2xl2b40J1NNg4EZ2VXuD2JTBJ2GTg',
          minPrice: 10
        }
        let transportadoraUrl = transportadora.googleUrl + transportadora.origin + transportadora.destination + transportadora.key
        let callTransportadoraEstimate = HTTP.call('GET', transportadoraUrl, {
          headers: {
            'Content-Type':'application/json'
          },
          timeout: 10000
        });
        let transportadoraData = callTransportadoraEstimate.data.rows[0].elements[0];
        _price = Math.round( transportadora.pricePerKm * (transportadoraData.distance.value/1000) * 100 )/100 + transportadora.minPrice;
        if (price == _tPrice){
          return true;
        }else{
          throw new Meteor.Error('4015', 'Ocorreu um erro a validação do método de envio, atualize a página ou tente novamente mais tarde.');
        }
        break;
      case 4:
        if (delivery.error){ throw new Meteor.Error('4017', 'Ocorreu um erro a validação do método de envio, atualize a página ou tente novamente mais tarde.'); }
        if (delivery.box.wg != weight){ throw new Meteor.Error('4018', 'Ocorreu um erro a validação do método de envio, atualize a página ou tente novamente mais tarde.'); }        
        _price = 0;
        if (price == _dPrice){
          return true;
        }else{
          return false;
        }
        break;     
      default:
        throw new Meteor.Error('4016', 'Ocorreu um erro a validação do método de envio, atualize a página ou tente novamente mais tarde.');
        break;
    }
  }

  Meteor.methods({
    'registerUser': function(options){
      let errors = []
      if (options.email.length == 0 || options.email == undefined){ errors.push('Informe o seu endereço de e-mail.');}
      if (options.profile.name.length == 0 || options.profile.name == undefined){ errors.push('Preecha os campos nome e sobrenome.');}
      if (options.profile.phone.length == 0 || options.profile.phone == undefined){ errors.push('Informe o número de seu celular.');}
      if (options.password.length < 8 || options.password == undefined){ errors.push('Sua senha de ter ao menos 8 caracteres.');}
      if (options.password != options.confirmPassword){ errors.push('As senhas não conhencidem.');}

      if (!(/^[A-zÀ-ú/\s]+$/.test(options.profile.name))){ errors.push('O seu nome não deve conter caracteres especiais.');}
      if (!(options.email.includes('@') && options.email.includes('.'))){ errors.push('Informe um endereço de e-mail válido.');}
      if (!(/^[0-9\-\(\)]+$/.test(options.profile.phone))){ errors.push('Informe um número de celular válido.');}

      let phoneCheck = Meteor.users.find({'profile.phone': options.profile.phone}).count();
      let emailCheck = Meteor.users.find({'username': options.email}).count();
      
      if (phoneCheck + emailCheck == 0 && errors.length == 0){        
        return {validate:true, errors: []}
      }else{
        return {validate:false, errors: errors}
      }
    },
    'forgetPassword': function(email){
      let user = Meteor.users.findOne({'username': email});
      let resetToken = {
        token: '',
        date: new Date,
        valid: true
      };
      if (!user){ 
        throw new Meteor.Error('1001', 'Não foi encontrado nenhum usuário com este endereço de email.'); 
      }
      if (user.resetToken){
        let token = user.resetToken;
        let now = (new Date).getTime()/1000/60;
        if (now - token.date.getTime()/1000/60 < 15){
          throw new Meteor.Error('1002', 'Aguarde o e-mail com instruções para recuperação da conta, isto pode levar alguns minutos.');
        }
      }
      for (let i=0; i<7; i++){
        resetToken.token += Math.random(0).toString(36).slice(-10);
      }
      let name = user.profile.name.split(' ');
      name = name[0].charAt(0).toUpperCase() + name[0].slice(1).toLowerCase();
      let data = {
        name: name,
        to: name + ' <' + email + '>',
        from: 'MateriaisON <contato@materiaison.com.br>',
        subject: 'Solicitação para alteração de senha',
        resetLink: 'http://materiaison.meteorapp.com/redefinir-senha/'+resetToken.token
      }
      let htmlMail = new Email_HTML(data, 'forgetPassword');    
      Meteor.users.update({'_id': user._id}, {$set:{'resetToken': resetToken}});
      return true
    },
    '_changePassword': function(email, senha, token){
      let user = Meteor.users.findOne({'username': email});
      let now = (new Date).getTime()/1000/60/60/24;
      
      if (!user){ 
        throw new Meteor.Error('1003', 'Não foi encontrado nenhum usuário com este endereço de email'); 
      }
      if (!user.resetToken){
        throw new Meteor.Error('1004', 'Verifique se você esta no link correto, este usuário não solicitou uma recuperação de senha.');
      }
      let tokeDate = (user.resetToken.date).getTime()/1000/60/60/24;
      if (user.resetToken.token != token){
        throw new Meteor.Error('1005', 'Verifique em seu e-mail se você entrou no link correto.');
      }
      if (now - tokeDate > 2){
        Meteor.users.update({'_id': user._id}, {$set:{'resetToken.valid': false}});
        throw new Meteor.Error('1006', 'Este link de recuperação de conta está expirou. Solicite um novo link na página de entrada em "Esqueceu a senha?".');
      }
      if (!user.resetToken.valid){
        throw new Meteor.Error('1007', 'Este link de recuperação já foi utilizado. Solicite um novo link na página de entrada em "Esqueceu a senha?".');
      }
      if (senha.length < 8){
        throw new Meteor.Error('1008', 'Sua senha deve conter no mínimo 8 caracteres.');
      }
      let name = user.profile.name.split(' ');
      name = name[0].charAt(0).toUpperCase() + name[0].slice(1).toLowerCase();
      let data = {
        name: name,
        to: name + ' <' + email + '>',
        from: 'MateriaisON <contato@materiaison.com.br>',
        subject: name + ' , sua senha foi alterada :)',
      }
      let htmlMail = new Email_HTML(data, 'passwordReset');    
      Meteor.users.update({'_id': user._id}, {$set:{'resetToken.valid': false}});
      Accounts.setPassword(user._id, senha, true);
      return true;
    },
    'contactMail': function(data, userId){
      let user = Meteor.users.findOne({'_id': userId});
      let now = (new Date()).getTime();
      if (!user){ throw new Meteor.Error('6001', 'Erro na verificação de usuário.'); }
      if (!user.profile.lastContact){
        Meteor.users.update({'_id': userId}, {$set:{'profile.lastContact': new Date()}});
      }else{
        if ((now - user.profile.lastContact.getTime()) < 1000*60*15){
          throw new Meteor.Error('6002', 'Aguarda ao menos 15 minutos antes de entrar em contato novamente.');
        }
        Meteor.users.update({'_id': userId}, {$set:{'profile.lastContact': new Date()}})
      }
      let userName = user.profile.name.split(' ');
      let userEmail = user.username;
      userName = userName[0].charAt(0).toUpperCase() + userName[0].slice(1).toLowerCase();
      let mail = {
        contactName:data.contactName,
        contactEmail:data.contactEmail,
        contactTelefone:data.contactTelefone,
        contactMensagem:data.contactMensagem,
        
        userName: userName,
        userEmail: userEmail,

        name: userName,
        to: 'MateriaisON <contato@materiaison.com.br>',
        from: 'Contato pelo APP <contato@materiaison.com.br>',
        subject: 'Email de contato de ' + userName,
      }
      let htmlMail = new Email_HTML(mail, 'contact');
      return;
    },
    'inserLocationCache': function(pack){
      let user = Meteor.users.findOne({'_id': Meteor.userId()});
      if (!user){ throw new Meteor.Error('0000', 'Não foi possível identificar o usuário.'); }
      if (!user.profile){ throw new Meteor.Error('0001', 'Não foi possível identificar o usuário.'); }
      if (!user.profile.cache){ user.profile.cache = {}; }
      if (!user.profile.cache.location){user.profile.cache.location = {}; }
      user.profile.cache.location = pack;
      cache = user.profile.cache;
      Meteor.users.update({'_id': user._id}, {$set:{'profile.cache':cache}})
      return;
    },
    'checkCart': function(userId){
      let user = Meteor.users.findOne({'_id': userId});
      if (!user){ throw new Meteor.Error('2001', 'Erro na verificação de usuário.'); }
      let cart = Cart.findOne({'user_id': userId});
      let newCart = [];
      if (!cart){ throw new Meteor.Error('2002', 'Nenhum carrinho foi encontrado para esta usuário.'); }
      cart = cart.cart;
      if (cart.lenght == 0){ return {success:true, messages:['O carrinho está atualizado.']}}
      let errors = []      
      cart.map((item, index)=>{
        let product = Products.findOne({'_id': item.product_id});
        if (!product){
          errors.push('O produto '+index+' não está mais disponível.');
        }else{
          if (product.stock_quantity == 0){
            errors.push('O produto '+index+' está fora de estoque.');            
          }else{
            if (item.quantity > product.stock_quantity){
              let unidade = 'unidades';
              let _item = item
              _item.quantity = product.stock_quantity
              newCart.push(_item);
              if (product.stock_quantity == 1){
                unidade = 'unidade'
              }
              errors.push('O produto '+index+' só tem '+ product.stock_quantity +' '+ unidade +' em estoque.');
            }else{
              newCart.push(item);
            }
          }
        }
      });
      Cart.update({ 'user_id': userId }, { $set: {'cart': newCart}});     
      if (errors.length > 0){
        return {success:false, cart: newCart, messages: ['Alguns produtos do seu carrinho foram atualizados por conta do estoque.']};
      }
      return {success:true, messages:['O carrinho está atualizado.']};
    },
    'trackCorreios': function(userId, orderId){
      let user = Meteor.users.findOne({'_id': userId});
      let order = Orders.findOne({'order.orderId': orderId});

      if (!user){throw new Meteor.Error('5001', 'Erro na verificação de usuário.');}
      if (!order){throw new Meteor.Error('5002', 'Pedido não encontrado.');}      
      order = order.order;
      if (!order.delivery.trackingCode){
        throw new Meteor.Error('5003', 'O código de rastreamento não foi encontrado.');
      }
      if (order.delivery.trackingCode == ''){
        throw new Meteor.Error('5004', 'O vendedor ainda não forneceu o código de rastreio.');
      } 
      if (order.status > 3){
        if (order.delivery.tranckingHistory){
          return order.delivery.trackingHistory
        }
      }
      async function trackingResolve(){
        let tracking = new RastreioBrasil();
        let code = await tracking.rastrearEncomendas([order.delivery.trackingCode]);
        Orders.update({'order.orderId': orderId}, {$set: {'order.delivery.trackingHistory': code}});
        return code;
      } 
      return trackingResolve()
    },
    'getDelivery': function(userId, places, data){
      let today = (new Date).getTime();
      today = Math.round(today / 1000 / 60);

      let loggi = {
        price: 0,
        ambient: 'https://www.loggi.com/graphql/?==',
        apiKey: 'ApiKey contato@materiaison.com.br:754b9af678caca971947df092abae2fe9e3b87b2',
      };
      let correios = {
        pac: { price: 0 },
        sedex: { price: 0 }
      };
      let doLoggi = false;
      let doCorreios = false;
      let doRetirar = true
      let doTransportadora = true

      if (data.error){ 
        throw new Meteor.Error('2001', 'Ocorreu um erro ao calcular o tamanho das embalagens dos produtos.');  
      }
      if (data.wg < 28 && data.w <= 100 && data.d <=100 && data.h <= 100 ){ 
        doCorreios = true; 
      }
      if (data.wg < 18 && data.w <= 38 && data.d <=38 && data.h <= 28 ){ 
        doLoggi = true; 
      }
      let vendor = Vendors.findOne({'id': places.vendorId});
      if (!vendor){
        throw new Meteor.Error('2002', 'Não for encontrado o vendedor do qual os produtos pertencem.');
      }
      let shippingCache = Shipping.findOne({'user_id': userId});
      if (!vendor.pk){
        let callLoggiShop = HTTP.call('POST', loggi.ambient, {
          headers: {
          'Content-Type':'application/json',
          'Authorization':loggi.apiKey },
          data: { query: loggiCreateShopString(vendor)},
          timeout: 5000
        });

        if (!callLoggiShop.data.errors){
          vendor.pk = callLoggiShop.data.data.createShop.shop.pk;
          Vendors.update({'_id': vendor._id}, { $set: {'pk': vendor.pk} });
          console.log('Loja adicionada com sucesso');
        }else{
          console.log(callLoggiShop.data.errors)
          throw new Meteor.Error('2003', 'Ocorreu um erro ao adicionar a loja do vendedor à Loggi');
        }
      }
      
      if (!shippingCache){
        console.log('1')
        let _data = {              
          empty: true,              
          doLoggi: doLoggi,
          doCorreios: doCorreios,
          doTransportadora: doTransportadora,
          doRetirar: doRetirar,
          data: data,
          vendor: vendor
        };
        let _places = {
          place1: places.place1,
          place2: places.place2
        }            
        return deliveryUpdate(userId, _places, _data, false);
      }else{      
        if (today > (shippingCache.lastUpdate + 60)){
          Shipping.update({'user_id': userId}, {$set: {'lastUpdate': today, 'shipping': []}});
        }        
        let shippingArray = shippingCache.shipping;

        for (let i=0; i<shippingArray.length; i++){
          
          let shippingCache = {}
          if (shippingArray[i]){
            shippingCache = {
              place1: shippingArray[i].place1,
              place2: shippingArray[i].place2,
              data: shippingArray[i].data
            }
          }else{
            continue;
          }
          let shippingNow = {
            place1: {
              lat: places.place1.lat, 
              lng: places.place1.lng},
            place2: {
              lat: places.place2.lat, 
              lng: places.place2.lng},
            data: data
          }

          if (JSON.stringify(shippingNow) == JSON.stringify(shippingCache)){
            if (today < shippingArray[i].lastUpdate + 60){              
              console.log('Shipping on date')
              console.log(shippingArray[i].price)
              for (let k=0; k<shippingArray[i].price.length; k++){
                if (shippingArray[i].price[k] == -3){ 
                  console.log(shippingArray[i].price[k])      
                  let _data = {  
                    insert: false,            
                    offset: i,              
                    doLoggi: doLoggi,
                    doCorreios: doCorreios,
                    doTransportadora: doTransportadora,
                    doRetirar: doRetirar,
                    data: data,
                    vendor: vendor
                  };
                  let _places = {
                    place1: places.place1,
                    place2: places.place2
                  }
                  return deliveryUpdate(userId, _places, _data, false);                  
                }
              }
              return shippingArray[i].price;
            }
            let _data = {  
              insert: false,            
              offset: i,              
              doLoggi: doLoggi,
              doCorreios: doCorreios,
              doTransportadora: doTransportadora,
              doRetirar: doRetirar,
              data: data,
              vendor: vendor
            };
            let _places = {
              place1: places.place1,
              place2: places.place2
            }            
            return deliveryUpdate(userId, _places, _data, false);
            break;     
          }
        }
        let _data = {              
          insert: true,              
          doLoggi: doLoggi,
          doCorreios: doCorreios,
          doTransportadora: doTransportadora,
          doRetirar: doRetirar,
          data: data,
          vendor: vendor
        };
        let _places = {
          place1: places.place1,
          place2: places.place2
        }            
        return deliveryUpdate(userId, _places, _data, false);        
      }
    },    
    'createOrder': function(userId, card){      
      let user = Meteor.users.findOne({'_id': userId})
      let client = {}
      if (!user.ASAAS_ID){
        client.name = user.profile.name;
        client.cpf = user.profile.cpf.replace(/\./g, '').replace(/-/g, '');
        let asaasCall = HTTP.call("POST", "https://sandbox.asaas.com/api/v3/customers", {headers: {'Content-Type':'application/json','access_token':'bee30a60b2f12795197e9277ff3064d94c51d90d34133dc38bab0ead7d3a3ee0'},data:{ 'name': client.name, 'cpfCnpj':client.cpf },timeout: 10000})
        if (!asaasCall.error){
          Meteor.users.update({'_id': userId},{$set:{'ASAAS_ID': asaasCall.data.id}})
          client.asaasId = asaasCall.data.id
        }
      }else{
        client={
          name: user.profile.name,
          cpf: user.profile.cpf.replace(/\./g, '').replace(/-/g, ''),
          asaasId: user.ASAAS_ID
        }
      }
      return client;
    },
    'saveCard': function(user_id, card){
      let user = Meteor.users.findOne({'_id': user_id});
      let _card = card
      if (!user){ return false; }

      if (!user.profile.cards){
        _card.id = 0;
        _card.lastDigits = _card.numero.slice(-4)
        Meteor.users.update({'_id': user_id}, {$set:{'profile.cards':[_card]}});
      }else{
        if (user.profile.cards.length > 0){
          _card.id = user.profile.cards[user.profile.cards.length-1].id + 1;
        }else{
          _card.id = 0
        }
        _card.lastDigits = _card.numero.slice(-4)
        Meteor.users.update({'_id': user_id}, {$push:{'profile.cards':_card}});        
      }      
      return _card.id
    },
    'getCard': function(user_id){
      let user = Meteor.users.findOne({'_id': user_id});
      if (!user){ return false; }      
      let _cards = []
      user.profile.cards.map(card=>{
        _cards.push({
          id: card.id,
          nome: card.nome,
          vencimento: card.vencimento,
          cpfCnpj: card.cpfCnpj,
          bandeira: card.bandeira,
          lastDigits: card.lastDigits
        });
      });
      return _cards;
    },
    'removeCard': function(user_id, card_id){
      let user = Meteor.users.findOne({'_id': user_id});
      if (!user){ return false; }
      let cardList = user.profile.cards;
      for (i = 0; i < cardList.length; i++){
        if (cardList[i].id == card_id){
          cardList.splice(i, 1);
          Meteor.users.update({'_id': user_id}, {$set:{'profile.cards': cardList}})
          return true;          
        }
      }
      return false;
    },
    'editCard': function(user_id, card_id, card){
      let user = Meteor.users.findOne({'_id': user_id});
      if (!user){ return false; }
      let cardList = user.profile.cards;
      for (i = 0; i < cardList.length; i++){
        if (cardList[i].id == card_id){
          cardList[i].nome = card.nome;
          cardList[i].lastDigits = card.numero.slice(-4);
          cardList[i].vencimero = card.vencimento;
          cardList[i].cpfCnpj = card.cpfCnpj;
          cardList[i].bandeira = card.bandeira;     
          Meteor.users.update({'_id': user_id}, {$set:{'profile.cards': cardList}})
          return true;          
        }
      }
      return false;
    },
    'freshProducts': function(list, time){
      let today = new Date;
      let products = Products.find({'_id': {$in: list}}).fetch();
      let reload = false;
      products.map(product=>{
        if (!product.lastUpdate){
          Products.update({'_id': product._id}, {$set:{'lastUpdate': today}});
        }else{
          if (product.lastUpdate > time){
            reload = true;
          }
        }
      });  
      return reload;    
    },
    'finishOrder': function(user_id, mainAddress, vendor_id, list, delivery, total, subtotal, installments, cpfCnpj, deliveryPrice, card){
      let _subtotal = 0;
      let _weight = 0;
      let _quantity = [];      
      let _idArray = [];      
      let _shippingArray = [];
      let user = Meteor.users.findOne({'_id': user_id});
      let vendor = Vendors.findOne({'id': vendor_id});
      let cart = Cart.findOne({'user_id': user_id});
      let shippingCache = Shipping.findOne({'user_id': user_id});
      let today = new Date()       
      if (!user){ throw new Meteor.Error('4001', 'Erro na verificação de usuário.'); }
      if (!vendor){ throw new Meteor.Error('4002', 'Ocorreu um erro durante a verificação do vendedor, tente novamente mais tarde.'); }
      if (!cart){ throw new Meteor.Error('4003', 'Ocorreu um erro durante a verificação do carrinho, atualize a página ou tente novamente mais tarde.'); }
      if (user.profile.mainAddress != mainAddress){ throw new Meteor.Error('4004', 'Ocorreu um erro durante a validação do endereço do destinatario, atualize a página ou volte tente novamente mais tarde.'); }   
      if (!user.profile.address[mainAddress]){ throw new Meteor.Error('4005', 'Ocorreu um erro durante a validação do endereço do destinatario, atualize a página ou volte tente novamente mais tarde.'); }
      list.map(item=>{
        _quantity[item.product._id] = item.quantity;
        _idArray.push(item.product._id);
      });

      let cartErrors = 0;
      let newCart = [];
      cart.cart.map(item=>{        
        if (!_idArray.includes(item.product_id)){ 
          cartErrors += 1; 
        } 
      });
      let products = Products.find({'_id': {$in: _idArray}}).fetch();      
      products.map((product, index)=>{        
        if (products[index].stock_quantity <= 0){
          cartErrors += 1;
        }else{
          if (_quantity[product._id] > products[index].stock_quantity){
            newCart.push({
              quantity: products[index].stock_quantity,
              product_id: products[index]._id,
              vendor_id: products[index].id_vendor
            });           
            cartErrors += 1;            
          }else{
            newCart.push({
              quantity: _quantity[product._id],
              product_id: products[index]._id,
              vendor_id: products[index].id_vendor 
            });
            products[index].quantity = _quantity[product._id];
          }  
        }
        if (cartErrors > 0){
          Cart.update({ 'user_id': user_id }, { $set: {'cart': newCart}});
          throw new Meteor.Error('4019', 'Seu carrinho foi atualizado por conta da disponibilidade de estoque dos produtos, verifique os itens novamente antes de finalizar a compra novamente.');
        }
                      
        _subtotal += _quantity[product._id]*parseFloat(product.price);
        product.details.map(detail=>{
          if (detail.name == 'Peso (kg)'){
            _weight += _quantity[product._id]*parseInt(detail.detail*1000);
          }
        })         
      });

      _weight = _weight/1000;

      _subtotal = Math.round(_subtotal*100)/100;
      let _total = _subtotal + delivery.price;
      let _lastTotal = 0;
      let _installmentArray = [];
      for (let i=1; i<=installments; i++){
        let _price = _total;
        let _totalPrice = _total;
        let installment = _total;
        if (i > 1){  
          installment = _total / i;
          let asaasTax = 0.3;
          let juros = (1 - 0.0279);
          if (i > 6){ juros = (1 - 0.0299);}
          _price = (Math.round(_total / i / juros * 100) / 100 + asaasTax / i);
          _totalPrice = (_price * i);
        }
        if (_lastTotal > _total){
          _price += 0.05;
          _totalPrice = (_price * i);
        }
        _lastTotal = _totalPrice;
        _installmentArray.push({
          parcel: i, 
          price: Math.round(_price*100)/100,
          total: Math.round(_totalPrice*100)/100
        })
        console.log(Math.round(_totalPrice*100)/100)
        if (installment < 30){                
          break;
        }
      }
      _total = _installmentArray[installments-1].total;
      
      if (_subtotal != subtotal){ throw new Meteor.Error('4007', 'Ocorreu um erro durante a finalização da compra, atualize a página ou tente novamente mais tarde.'); }
      let _address = user.profile.address[mainAddress].address;
      let places = {
        place1: {
          lat: (vendor.address.coords.selected.lat).toString(),
          lng: (vendor.address.coords.selected.lng).toString(),
          address: {
            formated: vendor.address.rua + ', ' + vendor.address.numero + ' - ' + vendor.address.bairro + ', ' + vendor.address.cidade + ' - ' + vendor.address.UF,
            complement: (vendor.address.complemento)?vendor.address.complemento:'',
            phone: (vendor.celular)?vendor.celular:'',
            cep: vendor.address.cep 
          }
        },
        place2: {
          name: user.profile.address[mainAddress].name,
          lat: (user.profile.address[mainAddress].coords.selected.lat).toString(),
          lng: (user.profile.address[mainAddress].coords.selected.lng).toString(),
          address: {
            formated: _address.rua + ', ' + _address.numero + ' - ' + _address.bairro + ', ' + _address.cidade + ' - ' + _address.UF,
            complement: (_address.complemento)?_address.complemento:'',
            phone: (_address.celular)?_address.celular:'',
            cep:_address.cep
          }
        }
      }
      if (shippingCache){
        _shippingArray = shippingCache.shipping;
        for (let i=0; i<_shippingArray.length; i++){
          
          if (!_shippingArray[i]){ continue; }
          if (!_shippingArray[i].place1){ continue; }
          if (!_shippingArray[i].place2){ continue; }
          if (!_shippingArray[i].data){ continue; }
          if (!_shippingArray[i].price){ continue; }
          if (!_shippingArray[i].lastupdate){ continue; }

          let __shippingCache = {
            place1: _shippingArray[i].place1,
            place2: _shippingArray[i].place2,
            data: _shippingArray[i].data
          }
          let __shippingNow = {
            place1: {
              lat: places.place1.lat, 
              lng: places.place1.lng},
            place2: {
              lat: places.place2.lat, 
              lng: places.place2.lng},
            data: delivery.box
          }
          if (JSON.stringify(__shippingNow) == JSON.stringify(__shippingCache)){
            if (Math.round(today / 1000 / 60) < _shippingArray[i].lastUpdate + 60){
              break;
            }            
          }
          if (i == _shippingArray.length-1){            
            let _deliveryPrice = checkDelivery(deliveryPrice, _weight, places, delivery)
            if (!_deliveryPrice){ throw new Meteor.Error('4008', 'Ocorreu um erro durante a finalização da compra, atualize a página ou tente novamente mais tarde.'); }
          }
        }
      }else{
        let _deliveryPrice = checkDelivery(deliveryPrice, _weight, places, delivery)  
        if (!_deliveryPrice){ throw new Meteor.Error('4009', 'Ocorreu um erro durante a finalização da compra, atualize a página ou tente novamente mais tarde.'); }
      }      

      if (!(/^\d{2}.\d{3}.\d{3}\/\d{4}\-\d{2}$/.test(cpfCnpj))){
        if (!(/^\d{3}.\d{3}.\d{3}\-\d{2}$/.test(cpfCnpj))){
          throw new Meteor.Error('4020', 'Ocorreu um erro durante a finalização da compra, atualize a página ou tente novamente mais tarde.');
        }
      } 
      if (_total != total){ throw new Meteor.Error('4021', 'Ocorreu um erro durante a finalização da compra, atualize a página ou tente novamente mais tarde.'); }
      
      Meteor.users.update({'_id': user_id},{$set:{'profile.lastCpf': cpfCnpj}});
      
      let _user = {
        userId: user._id,
        address: user.profile.address[mainAddress],
        email: user.username
      }
      let _vendor ={
        vendorId: vendor.id,
        vendor_id: vendor._id
      }
      delivery.trackingCode = '';
      //ASAAS
      if (!user.profile.asaas){
        let asaasUser = HTTP.call("POST", "https://sandbox.asaas.com/api/v3/customers",
        {headers: {
          'Content-Type':'application/json',
          'access_token':'bee30a60b2f12795197e9277ff3064d94c51d90d34133dc38bab0ead7d3a3ee0'
        },
        data:{ 
          'name': user.profile.name, 
          'cpfCnpj':cpfCnpj.replace(/\./g, '').replace(/-/g, '').replace(/\//g, ''),
          'phone': user.profile.phone.replace(/\(/g, '').replace(/-/g, '').replace(/\)/g, '')},
        timeout: 10000});
        if (asaasUser.statusCode == 200){
          Meteor.users.update({'_id': user_id}, {$set:{'profile.asaas.id': asaasUser.data.id}});
          var client = {
            id: asaasUser.data.id,
            name: user.profile.name,
            cpfCnpj: cpfCnpj.replace(/\./g, '').replace(/-/g, '').replace(/\//g, ''),
            phone: user.profile.phone.replace(/\(/g, '').replace(/-/g, '').replace(/\)/g, '')
          }
        }else{
          throw new Meteor.Error('4021', 'Ocorreu um erro durante a finalização da compra, atualize a página ou tente novamente mais tarde.');
        }        
      }else{
        var client = {
          id: user.profile.asaas.id,
          name: user.profile.name,
          cpfCnpj: cpfCnpj.replace(/\./g, '').replace(/-/g, '').replace(/\//g, ''),
          phone: user.profile.phone.replace(/\(/g, '').replace(/-/g, '').replace(/\)/g, '')
        }
      }
      let dueDay = (today.getDate()).toString();
      if (dueDay < 10){ dueDay = '0' + dueDay; }

      let dueMonth = (today.getMonth()+1).toString();
      if (dueMonth < 10){ dueMonth = '0' + dueMonth}      

      let dueDate = today.getFullYear()+'-'+dueMonth+'-'+dueDay;
      
      let clientIp = this.connection.clientAddress;
      let _card = { id: -1 };
      if (user.profile.cards){
        if (user.profile.cards.length > 0){
          user.profile.cards.map(__card=>{
            if (__card.id == card.id){
              _card = __card;
            }
          })
        }else{
          throw new Meteor.Error('4011', 'Ocorreu um erro ao efetuar o pagamento da compra, verifique os dados inseridos ou tente novamente mais tarde.');
        }
      }else{
        throw new Meteor.Error('4011', 'Ocorreu um erro ao efetuar o pagamento da compra, verifique os dados inseridos ou tente novamente mais tarde.');
      }
      if (_card.id == -1){ 
        throw new Meteor.Error('4011', 'Ocorreu um erro ao efetuar o pagamento da compra, verifique os dados inseridos ou tente novamente mais tarde.');
      }
      _card.cvv = card.cvv;
      let asaasFinish = HTTP.call("POST", "https://sandbox.asaas.com/api/v3/payments", {
        headers: {
          'Content-Type':'application/json',
          'access_token':'bee30a60b2f12795197e9277ff3064d94c51d90d34133dc38bab0ead7d3a3ee0'}, 
          timeout: 10000,
          data:{ "customer": client.id, "billingType": "CREDIT_CARD", "dueDate": dueDate,
            "remoteIp": clientIp, "installmentCount": _installmentArray[installments-1].parcel,	
            "installmentValue": _installmentArray[installments-1].price,
            "creditCard":{ 
              "holderName": _card.nome, "number": _card.numero.replace(/\s/g, ''), "ccv": _card.cvv,
              "expiryMonth": _card.vencimento.slice(0, 2), "expiryYear": "20" + _card.vencimento.slice(-2)              
            },
            "creditCardHolderInfo": {
              "name": _card.nome, "email": user.username, "cpfCnpj": _card.cpfCnpj,
              "postalCode": user.profile.address[mainAddress].address.cep, "phone": client.phone,
              "addressNumber": user.profile.address[mainAddress].address.numero              
            }
          }
        }
      );
      if (asaasFinish.statusCode == 200){
        let _user = {
          userId: user._id,
          address: user.profile.address[mainAddress],
          email: user.username
        }
        let _vendor ={
          vendorId: vendor.id,
          vendor_id: vendor._id
        }        
        let order_id = createOrder(_user, _vendor, products, delivery, total, asaasFinish.data, cart)
        if (order_id > 0){
          return order_id
        }else{
          throw new Meteor.Error('4010', 'Ocorreu um erro durante a finalização da compra, atualize a página ou tente novamente mais tarde.');
        }        
      }else{
        throw new Meteor.Error('4011', 'Ocorreu um erro ao efetuar o pagamento da compra, verifique os dados inseridos ou tente novamente mais tarde.');
      }
      /*
      let order_id = createOrder(_user, _vendor, products, delivery, total, assas);
      if (order_id > 0){
        return order_id;
      }else{
        throw new Meteor.Error('4010', 'Ocorreu um erro durante a finalização da compra, atualize a página ou tente novamente mais tarde.');
      }
      
      let client = {
        name: user.profile.name,
        cpfCnpj: cpfCnpj.replace(/\./g, '').replace(/-/g, '').replace(/\//g, ''),
        phone: user.profile.phone.replace(/\(/g, '').replace(/-/g, '').replace(/\)/g, '')
      }      
      let asaasCall = HTTP.call("POST", "https://sandbox.asaas.com/api/v3/customers", {headers: {'Content-Type':'application/json','access_token':'bee30a60b2f12795197e9277ff3064d94c51d90d34133dc38bab0ead7d3a3ee0'},data:{ 'name': client.name, 'cpfCnpj':cpfCnpj },timeout: 10000})
      client.id = asaasCall.data.id;
      today.setDate(today.getDate()+3);
      
      let dueDay = (today.getDate()).toString();
      if (dueDay < 10){ dueDay = '0' + dueDay; }

      let dueMonth = (today.getMonth()+1).toString();
      if (dueMonth < 10){ dueMonth = '0' + dueMonth}      

      let dueDate = today.getFullYear()+'-'+dueMonth+'-'+dueDay;
      
      let clientIp = this.connection.clientAddress;
      let _card = { id: -1 };
      if (user.profile.cards){
        if (user.profile.cards.length > 0){
          user.profile.cards.map(__card=>{
            if (__card.id == card.id){
              _card = __card;
            }
          })
        }else{
          throw new Meteor.Error('4011', 'Ocorreu um erro ao efetuar o pagamento da compra, verifique os dados inseridos ou tente novamente mais tarde.');
        }
      }else{
        throw new Meteor.Error('4011', 'Ocorreu um erro ao efetuar o pagamento da compra, verifique os dados inseridos ou tente novamente mais tarde.');
      }
      if (_card.id == -1){ 
        throw new Meteor.Error('4011', 'Ocorreu um erro ao efetuar o pagamento da compra, verifique os dados inseridos ou tente novamente mais tarde.');
      }
      _card.cvv = card.cvv;

      let asaasFinish = HTTP.call("POST", "https://sandbox.asaas.com/api/v3/payments", {
        headers: {
          'Content-Type':'application/json',
          'access_token':'bee30a60b2f12795197e9277ff3064d94c51d90d34133dc38bab0ead7d3a3ee0'}, 
          timeout: 10000,
          data:{
            "customer": client.id,
            "billingType": "CREDIT_CARD",
            "dueDate": dueDate,
            "remoteIp": clientIp,
            "installmentCount": _installmentArray[installments-1].parcel,	
            "installmentValue": _installmentArray[installments-1].price,
            "creditCard":{
              "holderName": _card.nome,
              "number": _card.numero.replace(/\s/g, ''),
              "expiryMonth": _card.vencimento.slice(0, 2),
              "expiryYear": "20" + _card.vencimento.slice(-2),
              "ccv": _card.cvv
            },
            "creditCardHolderInfo": {
              "name": _card.nome,
              "email": user.username,
              "cpfCnpj": _card.cpfCnpj,
              "postalCode": user.profile.address[mainAddress].address.cep,
              "addressNumber": user.profile.address[mainAddress].address.numero,
              "phone": client.phone
            }
          }
        }
      )

      if (asaasFinish.statusCode == 200){
        let _user = {
          userId: user._id,
          address: user.profile.address[mainAddress],
          email: user.username
        }
        let _vendor ={
          vendorId: vendor.id,
          vendor_id: vendor._id
        }        
        let order_id = createOrder(_user, _vendor, products, delivery, total, asaasFinish.data)
        if (order_id > 0){
          return order_id
        }else{
          throw new Meteor.Error('4010', 'Ocorreu um erro durante a finalização da compra, atualize a página ou tente novamente mais tarde.');
        }        
      }else{
        throw new Meteor.Error('4011', 'Ocorreu um erro ao efetuar o pagamento da compra, verifique os dados inseridos ou tente novamente mais tarde.');
      }*/
    },
  })
})

  

