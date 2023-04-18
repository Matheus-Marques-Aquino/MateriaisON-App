import React, { Component } from 'react';
import FormatNumber from './format_number';

class InstallmentBox extends Component{
    constructor(props){
        super(props)
        this.installmentArray = []
        this.state={
            index: 1,
            installments: 1,
            minInstallmentPrice: 30,
            maxInstallments: 1,
            deliveryIndex: -1,
            display: true
        }
    }
    componentDidUpdate(){
        let delivery = this.props.delivery;
        if (this.state.deliveryIndex != delivery.index){
            this.setState({deliveryIndex: delivery.index})
            var total = this.props.subtotal + delivery.price;
            let lastTotal = 0;
            this.installmentArray = [];
            for (let i=1; i<=12; i++){
                let price = total;
                let totalPrice = total;
                let installment = total;
                if (i > 1){    
                    installment = total / i;
                    let asaasTax = 0.3;
                    let juros = (1 - 0.0279);
                    if (i > 6){ juros = (1 - 0.0299);}            
                    price = (Math.round(total / i / juros * 100) / 100 + asaasTax / i);
                    totalPrice = (price * i);
                    if (lastTotal > total){
                        price += 0.05;
                        totalPrice = (price * i);
                    }
                    lastTotal = totalPrice;
                }
                this.installmentArray.push({
                    parcel: i, 
                    price: Math.round(price*100)/100,
                    total: Math.round(totalPrice*100)/100
                })            
                if (installment < this.state.minInstallmentPrice){                
                    break;
                }            
            }
            let index = this.state.index-1;
            if (this.state.index > this.installmentArray.lenght){
                index = this.installmentArray.lenght-1;
            }
            this.props.installment(this.installmentArray[index]);
        }
    }
    selectInstallment(installment){
        this.props.installment(installment);
        this.setState({ 
            index: installment.parcel
        });
    }
    closeBox(){
        this.setState({
            display: !this.state.display
        });
    }
    render(){        
        var total = this.props.subtotal + this.props.delivery.price; 
        var showSelection = this.props.open;
        let lastTotal = 0;
        this.installmentArray = [];
        for (let i=1; i<=12; i++){
            let price = total;
            let totalPrice = total;
            let installment = total;
            if (i > 1){
                installment = total / i;
                let asaasTax = 0.3;
                let juros = (1 - 0.0279);
                if (i > 6){ juros = (1 - 0.0299);}            
                price = (Math.round(total / i / juros * 100) / 100 + asaasTax / i);
                totalPrice = (price * i);
                if (lastTotal > total){
                    price += 0.05;
                    totalPrice = (price * i);
                }
                lastTotal = totalPrice;
            }
            this.installmentArray.push({
                parcel: i, 
                price: Math.round(price*100)/100,
                total: Math.round(totalPrice*100)/100
            });            
            if (installment < this.state.minInstallmentPrice){                
                break;
            }            
        }
        if (!showSelection){ return(<div></div>); }
        let width = document.querySelector('.appContainer').clientWidth
        return(<div>
            <div style={{height:'100%', width: width, backgroundColor:'black', position:'absolute', top:'0px', opacity:'0.35'}} onClick={(e)=>{this.props.close(); e.stopPropagation();}}></div>
            <div style={{width: width, backgroundColor:'white', position:'fixed', bottom:'45px'}}>
                <div style={{height:'40px', fontSize:'14px', border:'1px solid #ccc', backgroundColor:'#f2f2f2', lineHeight:'40px', fontWeight:'bold', textAlign:'center'}}>
                    Selecione o número de parcelas
                    <div style={{width:'40px', height:'40px', position:'absolute', right:'0px', top:'0px', backgroundImage:'url(/imgs/cancel.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat'}} onClick={(e)=>{ this.props.close(); e.stopPropagation();}}></div>
                </div>            
                <div style={{maxHeight:'240px', padding:'0 10px', fontSize:'14px', border:'1px solid #ccc', borderTop:'0px', backgroundColor:'white', lineHeight:'40px', overflow:'hidden', overflowY:'auto'}}>
                    {this.installmentArray.map((installment, index)=>{
                        let color = '#b3b3b3';
                        let display = 'none';
                        let key = 'Installment_'+index;
                        if (index == this.state.index-1){
                            color = '#ff7000';
                            display = 'block';
                        }
                        if (index == 0){
                            return(
                            <div style={{width:'100%', height:'40px', display:'flex'}} onClick={(e)=>{ this.selectInstallment( installment ); e.stopPropagation();}} key={key}>
                                <div style={{width:'12px', height:'12px', margin:'auto 0', border:'2px solid '+color, borderRadius:'50%', display:'flex'}}>
                                    <div style={{width:'8px', height:'8px', margin:'auto', borderRadius:'50%', backgroundColor:'#ff7000', display: display}}></div>
                                </div>
                                <div style={{marginLeft:'10px'}}>{installment.parcel}x R${installment.price.toFixed(2).replace('.', ',')}</div>
                                <div style={{marginRight:'10px', marginLeft:'auto', color:'#646464'}}>Sem juros</div>
                            </div>);
                        }
                        return(
                            <div style={{width:'100%', height:'40px', display:'flex'}} onClick={(e)=>{ this.selectInstallment( installment ); e.stopPropagation();}} key={key}>
                                <div style={{width:'12px', height:'12px', margin:'auto 0', border:'2px solid '+color, borderRadius:'50%', display:'flex'}}>
                                    <div style={{width:'8px', height:'8px', margin:'auto', borderRadius:'50%', backgroundColor:'#ff7000', display: display}}></div>
                                </div>
                                <div style={{marginLeft:'10px'}}>{installment.parcel}x R${installment.price.toFixed(2).replace('.', ',')}</div>                            
                                <div style={{marginRight:'10px', marginLeft:'auto', color:'#646464'}}>Total: {installment.total.toFixed(2).replace('.', ',')}</div>
                            </div>);  
                    })}                
                </div>
            </div>
        </div>)
    }    
}
export default InstallmentBox;