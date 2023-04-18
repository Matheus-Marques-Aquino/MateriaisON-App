import React, { Component } from 'react';
import history from './widgets/history';
import ResumeContainer from './widgets/resume_container';
import VendorContainer from './widgets/vendor_container';

class ProductBox extends Component{

    goToVendor(page_id){        
        let link = "/fornecedor/"+page_id;
        history.push(link);
    }
    
    render(){
        const screenSize = document.querySelector('.appContainer').clientWidth;
        const type = this.props.type;
        const data = this.props.data;
        var hContainer = 70;
        var wContainer = screenSize / 2 - 10;         

        if (type == 'product'){
            return(<div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax('+wContainer+'px, '+wContainer+'px))',
                    gridGap: '10px',
                    justifyContent: 'center'
                }}>
                {
                    data.map((product, index)=>{
                        let key = "Product_"+index;
                        return(<ResumeContainer type='product' data={product} key={key}/>);
                    })
            }</div>);
        }
        if (type == 'productLine'){
            let cartId = this.props.cart
            let vendorArray = []
            if (this.props.type2 == 'global'){
                vendorArray = this.props.vendors
            }            
            return(<div>
                {
                    data.map((product, index)=>{
                        let vendorName = '';
                        let vendorColor = '#ff7000'
                        let key = "Product_"+index;
                        if (product.id_vendor == cartId || cartId == -1){
                            product.canCart = true;
                        }else{
                            product.canCart = false;
                        }
                        if (this.props.type2 == 'vendor'){
                            product.vendorPage = true
                        }else{
                            product.vendorPage = false;
                            vendorName = vendorArray[product.id_vendor].name;
                            vendorColor = vendorArray[product.id_vendor].color;
                            product.vendorName = vendorName;
                            product.vendorColor = vendorColor;
                        }                        
                        return(<ResumeContainer type='productLine' data={product} key={key}/>);
                    })
            }</div>);
        }
        if (type == 'vendor'){
            return(
            <div>{
                data.map((vendor, index)=>{
                    let key = "Vendor_"+index;
                    return(<VendorContainer vendor={vendor} key={key}/>);
                })
            }</div>);
        }
        if (type == 'cart'){
            return(
            <div style={{padding:'10px', marginTop:'10px', backgroundColor:'#F7F7F7'}}>
                <div style={{marginBottom:'10px', fontSize:'15px', fontWeight:'bold', color:'#ff7000', display:'flex'}}>
                    <div style={{width:'10px', height:'10px', margin:'auto 0', backgroundImage:'url(/imgs/icons/icon-rightArrow.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></div>
                    <div style={{marginLeft:'5px'}}>
                        Produtos adicionados ao carrinho
                    </div>
                </div>
                <div style={{}}>{
                data.map((container, index)=>{
                    let pKey = "cartProduct_"+index;
                    let isSelect = false;
                    if (index == this.props.selectIndex){ isSelect = true; }
                    return(
                    <ResumeContainer 
                        type='cart' data={container} 
                        select={(index)=>{this.props.select(index)}} 
                        removeItem={(index)=>{this.props.removeItem(index)}} 
                        index={index} isSelect={isSelect} key={pKey}
                    />);
                })
            }</div>
            </div>);
        }
        return(<div></div>);
    }
}
export default ProductBox;