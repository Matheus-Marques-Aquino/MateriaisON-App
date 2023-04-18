import React, { Component } from 'react';
import history from './subcomponents/widgets/history';
import Waiting from './subcomponents/widgets/waiting';

class LostMyPassword extends Component{
    constructor(props){
        super(props)
        this.error = '';
        this.success = '';
        this.state={
            loading: false,
            email: ''
        }
    }
    inputHandler(event){
        let name = event.target.name;
        let value = event.target.value;
        this.setState({
            [name]: value
        })
    }
    inputSubmit(){
        if (this.state.loading){ return; }
        this.setState({ loading: true })
        this.error = '';
        this.success = '';
        let email = this.state.email.toLowerCase()
        if (!(email.includes('@') && email.includes('.'))){ 
            this.error = 'Informe um endereço de email válido.'
            this.setState({ 
                loading: false                
            }); 
            return;
        }
        Meteor.call('forgetPassword', email, (error, result)=>{
            if (!error){                
                this.success = 'Foi enviado um e-mail com intruções para recuração da conta!';
                this.setState({
                    loading:false
                });                                
            }else{
                this.error = error.reason;
                console.log(error)
                this.setState({
                    loading:false
                })
            }
        })
    }
    displayError(){
        if (this.error != ''){
            return(<div style={{color:'red', padding:'10px 5px', fontSize:'14px'}}>{this.error}</div>)
        }else{
            if (this.success == ''){
                return (<div style={{padding:'10px'}}></div>)
            }
        }
    }
    displaySuccess(){
        if (this.success != ''){
            return(<div style={{color:'#32CD32', padding:'10px 5px', fontSize:'14px'}}>{this.success}</div>)
        }
    }
    render(){
        if (Meteor.userId()){history.push('/')} 
        return(<div className='mainContainer'>
            <div style={{height:'34px'}}>
                <div style={{width:'100%', backgroundColor:'white', borderBottom:'1px solid #ccc', position:'fixed', top:'0px', zIndex:'10', display:'flex', width: document.querySelector('.appContainer').clientWidth}}>
                    <div style={{width:'40px', height:'34px', marginLeft:'10px', position:'fixed', backgroundImage:'url(/imgs/backArrow.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat'}} onClick={()=>{history.push('/entrar')}}></div>
                    <div style={{height:'34px', lineHeight:'34px', width:'100%', textAlign:'center', fontWeight:'bold', color:'#111', backgroundColor:'white'}}>Recuperar senha</div>
                </div>
            </div>
            <div style={{height:'265px', borderBottom:'1px solid #ff7000', display:'flex'}}>
                <div style={{width:'220px', height:'172px', margin:'auto', backgroundImage:'url(/imgs/logo2.png)', backgroundPosition:'center', backgroundSize:'contain', backgroundRepeat:'no-repeat'}}></div>
            </div>
            <div style={{padding:'30px 15px'}}>
                <div style={{fontWeight:'bold', textAlign:'center'}}>ESQUECI A SENHA</div>
                <div style={{marginTop:'40px'}}>
                    <span style={{fontSize:'14px', lineHeight:'25px'}}>Digite e-mail de cadastrado abaixo</span>
                    <div style={{padding:'0 10px', border:'1px solid #ff7000', backgroundColor:'white', borderRadius:'3px', marginTop:'10px'}}>
                        <input id='email' style={{height:'30px', width:'100%', lineHeight:'30px', fontSize:'14px', textAlign:'center', border:'0px'}} value={this.state.email} onChange={this.inputHandler.bind(this)} placeholder='ENDEREÇO DE E-MAIL' name='email' onKeyDown={(e)=>{if (e.key==='Enter'){this.inputSubmit()}}}/>
                    </div>
                </div> 
                {this.displayError()}   
                {this.displaySuccess()}          
                <div style={{margin:'0 auto', marginTop:'50px', width:'175px', height:'40px', lineHeight:'40px', backgroundColor:'#3395f5', border:'2px solid #3395f5', borderRadius:'25px', textAlign:'center', fontSize:'17px', color:'white'}} onClick={()=>{this.inputSubmit()}}>ENVIAR</div>
                <div style={{width:'100%', textAlign:'center', fontSize:'14px', marginTop:'20px'}}>Não tem uma conta?</div>
                <div style={{width:'fit-content', margin:'3px auto', fontSize:'16px', color:'#3395f5', fontWeight:'600'}} onClick={()=>{if (!this.state.loading){history.push('/registrar')}}}>CLIQUE AQUI</div>
            </div>            
            <Waiting open={this.state.loading} size='60px' />
        </div>);
    }
}
export default LostMyPassword