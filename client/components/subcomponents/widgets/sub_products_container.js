import React, { Component } from 'react';
import NameBreaker from './name_break';
import FormatNumber from './format_number';

class SubProductsContainer extends Component{
    constructor(props){
        super(props)
        this.state = {
            display: false
        }
    }
    openDisplay(){
        let productBox = document.querySelector('.order_'+this.props.id);
        if (productBox){
            if (productBox.style.maxHeight == '0px'){                
                productBox.style.maxHeight = 'max-content';
                productBox.style.padding = '5px'
                productBox.style.transition = '0.3s all ease-in';
                return;
            }
            if (productBox.style.maxHeight == 'max-content'){
                productBox.style.maxHeight = '0px';
                productBox.style.padding = '0px 5px'
                productBox.style.transition = '0.3s all ease-in';
            }
        }
    }
    render(){
        var products = this.props.products
        let _display = '0px'
        if (products.lenght == 0){ return(<div></div>); }        
        this._id = products[0]._id
        let classe = 'order_'+this.props.id;
        return(<div className={classe} style={{maxHeight:'0px', overflow:'hidden', margin:'0px 5px'}}>{
            products.map((product, index)=>{
                let product_qtd = product.quantity+'x';
                let key = 'subProduct_'+index;
                return(<div style={{display:'flex', margin:'0 5px', borderTop:'1px solid #FFDBBF'}} key={key}>
                    <div style={{display:'flex', margin:'2px 0'}}>
                        <div style={{display:'flex'}}><div style={{minWidth:'19.5px', fontSize:'11px', margin:'auto'}}>{product_qtd}</div></div>
                        <div style={{fontSize:'11px', marginLeft:'10px', whiteSpace:'wrap'}}>{product.name}</div>
                    </div>                    
                </div>)
            })
        }</div>);       
    }
}
export default SubProductsContainer;

