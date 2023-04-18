import React, { Component } from 'react';

class QuantityBox extends Component{  
    constructor(props){
        super(props)
        this.state={       
            startQuantity: 1,
            diference: 0,
            endQuantity: 1,
            open: false
        }
    }
    componentDidUpdate(){
        if (this.state.open != this.props.open){
            this.setState({
                open: this.props.open,
                startQuantity: this.props.select.quantity,
                endQuantity: this.props.select.quantity,
            })
        }
    }
    inputHandler(event){
        let quantity = event.target.value;
        let stock = this.props.stock;
        if (quantity != ''){ quantity = Math.floor(quantity); }
        if (quantity < 0){ quantity = 0; }
        if (quantity > stock){
            quantity = stock;
        }
        this.setState({
            endQuantity: quantity,
            diference: quantity - this.state.startQuantity
        })
    }
    quantityChange(qtd){
        let quantity = this.state.endQuantity + qtd;  
        let stock = this.props.stock;
        if (quantity < 0){ quantity = 0; }
        if (quantity > stock){
            quantity = stock;
        }
        this.setState({
            endQuantity: quantity,
            diference: quantity - this.state.startQuantity 
        })
    }

    render(){  
        let message = 'Quantidade:';
        let options = ['Ok','Cacelar'];
        var width = document.querySelector('.appContainer').clientWidth;
        if (this.props.open == false || this.state.open == false) {return(<div className='_messageBox'></div>)}
        return(<div>
            <div style={{height:'100%', width: width, backgroundColor:'black', position:'fixed', top:'0px', opacity:'0.35'}} onClick={(e)=>{this.props.cancel(); e.stopPropagation();}}></div>
            <div className='_quantityBox' style={{position:'fixed', left:'0', right:'0', top:'0', bottom:'0', margin:'auto', width:'260px', height:'145px', borderRadius:'10px', border:'1px solid #f7f7f7', backgroundColor:'white'}}>
                <div style={{backgroundColor:'white', margin:'10px', height:'80px'}}>
                    <div style={{width:'100%', textAlign:'center'}}>{message}</div>
                    <div style={{display:'flex', margin:'auto', marginTop:'13px'}}>
                        <div style={{height:'33px', width:'33px', marginLeft:'auto', border:'1px solid #ff7000', lineHeight:'33px', textAlign:'center', borderTopLeftRadius:'8px', borderBottomLeftRadius:'8px'}} onClick={(e)=>{this.quantityChange(-1); e.stopPropagation();}}>-</div>
                        <input type='number' style={{height:'31px', width:'80px', backgroundColor:'white', border:'1px solid #ff7000', borderLeft:'0px', borderRight:'0px', textAlign:'center'}} value={this.state.endQuantity} onChange={(e)=>{this.inputHandler(e); e.stopPropagation();}}/>
                        <div style={{height:'33px', width:'33px', marginRight:'auto', border:'1px solid #ff7000', lineHeight:'33px', textAlign:'center', borderTopRightRadius:'8px', borderBottomRightRadius:'8px'}} onClick={(e)=>{this.quantityChange(1); e.stopPropagation();}}>+</div>
                    </div>                
                </div>            
                <div style={{backgroundColor:'white', margin:'0 10px', marginTop:'5px', display:'flex'}}>
                    <div style={{backgroundColor:'#ff7000', width:'100px', marginLeft:'10px', padding:'4px 0', border:'2px solid #ff7000', borderRadius:'25px', textAlign:'center', color:'white'}} onClick={(e)=>{this.props.confirm(this.state.diference); e.stopPropagation();}}>{options[0]}</div>
                    <div style={{backgroundColor:'#ff7000', width:'100px', marginRight:'10px', marginLeft:'auto', padding:'4px 0', border:'2px solid #ff7000', borderRadius:'25px', textAlign:'center', color:'white'}} onClick={(e)=>{this.props.cancel(); e.stopPropagation();}}>{options[1]}</div>
                </div>
            </div>
        </div>)
    }
}

export default QuantityBox;