/*import { Meteor } from 'meteor/meteor';
import { Vendors } from '../imports/collections/vendors';
import { Products } from '../imports/collections/products';
import { HTTP } from 'meteor/http';

Meteor.startup(() => {
  Meteor.publish('products', function() {
    return Products.find({});
  });
  Meteor.publish('vendors', function() {
    return Vendors.find({});
  });
  /*var vendors = [];
  const vendors_call = HTTP.call("GET",
  "https://construcao.materiaison.com.br/wp-json/wcmp/v1/vendors?search=Vendedor/vendors&page=1", 
  {auth:"ck_832900e9e611cce84f3c5b5efb6f453a349afe1c:cs_603f857b3cdbbea8903d5ad710c25a1133b4b48f"},function(error, response){
      if (!error){
        response.data.map(vendor => {          
          let data = {id: String(vendor.id), display_name: vendor.shop.title, image: vendor.shop.image };
          vendors.push(data);                        
        }        
      );
      onCompleteVendor(); 
    }});
  function onCompleteVendor(){
    vendors.map((vendor,index)=>{
      if ( vendor.image > 0 ){
        var image = HTTP.call("GET",
        "https://construcao.materiaison.com.br/wp-json/wp/v2/media/"+vendor.image, 
        {auth:"ck_832900e9e611cce84f3c5b5efb6f453a349afe1c:cs_603f857b3cdbbea8903d5ad710c25a1133b4b48f"},function(error, response){
            if (!error){
              vendor.image = response.data.guid.rendered.replace('cropped-', '');
              if (index = vendors.length - 1){
                onCompleteImages(vendor);
              }
            }
          }
        );
      }else{
        onCompleteImages(vendor);
      }    
    });
    
  }

  function onCompleteImages(vendor){            
    if (vendor.id > 0 && Vendors.find({'id': vendor.id}).count() == 0){
      console.log(vendor);        
      Meteor.call('vendors.create', vendor, function(error, result){
        if (!error){
          console.log(Vendors.find({}).count());
        }else{console.log(error)}
      });      
    } 
  }
    
    var loop = 1;
    var count = 0;

    function product_loop(page){
      let products_get = HTTP.call("GET",
      "https://construcao.materiaison.com.br/wp-json/wc/v2/products/?vendor&per_page=50&page="+page, 
      {auth:"ck_832900e9e611cce84f3c5b5efb6f453a349afe1c:cs_603f857b3cdbbea8903d5ad710c25a1133b4b48f"},function(error, response){
          if (!error){
            if (response.data.length > 0){
              response.data.map(product => {
                if (product.vendor > 0){
                  if (Vendors.find({id: String(product.vendor)}).count() > 0){ 
                    let data = {
                      id: String(product.id), 
                      id_vendor: String(product.vendor),
                      img_url: product.images,
                      name: product.name,
                      description: product.description.replace(/<[^>]+>/g, ''),
                      price: product.price,
                      category: product.categories,
                      stock_quantity: product.stock_quantity,
                      details:[
                        {name: 'Peso (kg)',
                        detail: product.weight
                        },
                        {name: 'Largura (cm)',
                        detail: product.dimensions.width
                        },
                        {name: 'Altura (cm)',
                        detail: product.dimensions.height
                        },
                        {name: 'Comprimento (cm)',
                        detail: product.dimensions.length
                        }
                      ],
                      tags: [],
                      related_id: product.related_ids
                    } 
                    product.tags.map(tag=>{
                      data.tags.push(tag.name);
                    })                 
                    Meteor.call('vendors.product.insert', data.id_vendor, data, function(error, result){
                      if (!error){
                        count += 1;
                        console.log(count);
                      }
                    });
                  }                  
                }         
              }); 
              loop += 1;
              product_loop(loop);          }          
        }
      });
    }
    product_loop(loop);
    
  });

*/