import React, { Component } from 'react';

class ConfirmPayment extends Component{
    constructor(props){
        super(props)
        this.state = {
            cvv: ''
        }
    }
    inputHandler(event){   
        let value = event.target.value; 

        if (value.length < 5){            
            this.setState({
                cvv: value
            }); 
        }        
    }
    render(){
        if (!this.props.open){return(<div></div>)}
        return(<div>
            <div style={{height:'100%', width: document.querySelector('.appContainer').clientWidth, backgroundColor:'black', position:'fixed', top:'0px', opacity:'0.35'}} onClick={(e)=>{ this.props.close(); e.stopPropagation();}}></div>
            <div style={{width: document.querySelector('.appContainer').clientWidth, borderTop:'1px solid #ccc', borderBottom:'1px solid #ccc', backgroundColor:'#f4f4f4', position:'fixed', bottom:'45px'}}>
                <div style={{height:'40px', fontSize:'15px', lineHeight:'40px', fontWeight:'bold', borderBottom:'1px solid #ccc', textAlign:'center'}}>
                    Finalizar compra
                    <div style={{width:'40px', height:'40px', position:'absolute', right:'0px', top:'0px', backgroundImage:'url(/imgs/cancel.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat'}} onClick={(e)=>{ this.props.close(); this.setState({cvv:''}); e.stopPropagation();}}></div>
                </div>
                <div style={{height:'250px', fontSize:'15px', backgroundColor:'white', textAlign:'center'}}>
                    <div style={{margin:'0 auto', paddingTop:'10px', lineHeight:'70px'}}>Código de segurança do cartão:</div>
                    <div style={{width:'110px', margin:'0 auto', lineHeight:'30px', border:'1px solid #ff7000', borderRadius:'3px', backgroundColor: 'white', display:'flex'}}>
                        <div style={{padding:'0 10px', lineHeight:'30px', fontSize:'15px', width:'100%'}}>
                            <input type='number' style={{padding:'0px', width:'100%', height:'30px', border:'0px', textAlign:'center'}} placeholder='CVV' onChange={this.inputHandler.bind(this)} value={this.state.cvv}/>
                        </div>
                    </div>
                    <div style={{margin:'40px auto', width:'140px', padding:'8px 0', border:'2px solid #ff7000', borderRadius:'25px', textAlign:'center', fontSize:'14px', fontWeight:'bold', color:'white', backgroundColor:'#ff7000'}} onClick={(e)=>{ this.props.confirm(this.state.cvv); this.setState({cvv:''}); e.stopPropagation();}}>
                        Confirmar
                    </div> 
                </div>
            </div>
        </div>)
    }
}
export default ConfirmPayment;