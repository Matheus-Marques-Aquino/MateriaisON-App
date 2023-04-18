import React, { Component } from 'react';
import FormatNumber from './widgets/format_number';

class DetailsOrderBox extends Component{
    constructor(props){
        super(props)
    }
    render(){        
        const products = this.props.products;
        const delivery = this.props.delivery;
        var subtotal = 0
        var deliveryPrice = delivery.price;
        return(<div style={{marginBottom:'10px', backgroundColor:'#F7F7F7', borderRadius:'5px'}}>
        <div style={{height:'20px', lineHeight:'20px', padding:'5px 10px', fontSize:'15px', fontWeight:'bold', color:'#ff7000', display:'flex'}}>
            <div style={{width:'10px', height:'10px', margin:'auto 0', backgroundImage:'url(/imgs/icons/icon-rightArrow.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></div>
            <div style={{marginLeft:'5px'}}> Detalhes:</div>           
        </div>
        <div style={{margin:'0 10px', marginTop:'5px', borderBottom:'1px solid #FFDBBF'}}>
            <table style={{width:'100%'}}>
                <tbody>
                    {
                        products.map((product, index)=>{
                            let key = 'Product_'+index;
                            let qtd = product.quantity;
                            let name = product.name;
                            let price = product.price
                            subtotal += qtd*price;
                            return(<tr key={key}>
                                <td style={{textAlign:'right', fontSize:'13px'}}><div style={{whiteSpace:'nowrap'}}>{qtd} x</div></td>
                                <td style={{paddingLeft:'5px', fontSize:'12px'}}>{name}</td>
                                <td style={{textAlign:'right', fontSize:'13px', whiteSpace:'wrap'}}>R$<FormatNumber number={price}/></td>
                            </tr>)
                        })
                    }
                </tbody>                        
            </table>
        </div>
        <div style={{padding:'5px 10px', paddingBottom:'15px'}}>
            <table style={{width:'100%'}}>
                <tbody>
                    <tr>
                        <td style={{width:'50px', textAlign:'right', fontSize:'13px'}}>Subtotal</td>
                        <td style={{width:'50px', textAlign:'right', fontSize:'13px'}}>R$<FormatNumber number={subtotal}/></td>
                    </tr>
                    <tr style={{fontSize:'14px'}}>
                        <td style={{width:'50px', textAlign:'right', fontSize:'13px'}}>Taxa de entrega</td>
                        <td style={{width:'50px', textAlign:'right', fontSize:'13px'}}>R$<FormatNumber number={deliveryPrice}/></td>
                    </tr>
                    <tr>
                        <td style={{width:'50px', textAlign:'right', fontSize:'13px', fontWeight:'bold'}}>Total</td>
                        <td style={{width:'50px', textAlign:'right', fontSize:'13px', fontWeight:'bold'}}>R$<FormatNumber number={parseFloat(deliveryPrice) + parseFloat(subtotal)}/></td>
                    </tr> 
                </tbody>                                                   
            </table>
        </div>
    </div>)
    }
}
export default DetailsOrderBox;