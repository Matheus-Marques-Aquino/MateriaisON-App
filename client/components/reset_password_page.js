import React, { Component } from 'react';
import history from './subcomponents/widgets/history';
import Waiting from './subcomponents/widgets/waiting';

class ResetPasswordPage extends Component{
    constructor(props){
        super(props)
        this.errors = [];
        this.success = '';
        this.state={
            loading: false,
            email: '',
            senha: '',
            senha2: ''
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
        this.setState({
            loading: true
        });
        this.errors = [];
        this.success = '';
        let token = history.location.pathname.split('/redefinir-senha/');
        token = token[token.length - 1];
        if (this.state.email == '' || this.state.email == undefined){
            this.errors.push('O campo email é obrigatório.')
        }else{
            if (!(this.state.email.includes('@') && this.state.email.includes('.'))){
                this.errors.push('O e-mail inserido é inválido.')
            }
        }
        if (this.state.senha.length < 8 || this.state.senha == undefined){
            this.errors.push('Sua senha deve ter no mínimo 8 caracteres.')
        }
        if (this.state.senha != this.state.senha2){
            this.errors.push('As senhas não conhencidem.')
        }
        if (token.length < 2){
            this.errors.push('Verifique em seu e-mail se você entrou no link correto.')
        }
        if (this.errors.length > 0){
            this.setState({ 
                loading: false 
            })
            return;
        }
        let email = this.state.email.toLowerCase()
        Meteor.call('_changePassword', email, this.state.senha, token, (error, result)=>{
            if (!error){
                this.success = 'Sua senha foi alterada com sucesso!'
                this.setState({
                    loading:false
                })
            }else{
                this.errors.push(error.reason);
                this.setState({
                    loading:false
                })
            }
        })
    }
    displayError(){
        if (this.errors.length > 0 ){
            return(<div style={{padding:'10px 5px'}}>{
                this.errors.map((error, index)=>{
                    let key = 'Error_'+index;
                    return(<div style={{color:'red', fontSize:'14px'}} key={key}>{error}</div>)
                })
                }</div>)
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
                    <div style={{height:'34px', lineHeight:'34px', width:'100%', textAlign:'center', fontWeight:'bold', color:'#111', backgroundColor:'white'}}>Redefinir senha</div>
                </div>
            </div>
            <div style={{height:'265px', borderBottom:'1px solid #ff7000', display:'flex'}}>
                <div style={{width:'220px', height:'172px', margin:'auto', backgroundImage:'url(/imgs/logo2.png)', backgroundPosition:'center', backgroundSize:'contain', backgroundRepeat:'no-repeat'}}></div>
            </div>
            <div style={{padding:'30px 15px'}}>
                <div style={{fontWeight:'bold', textAlign:'center'}}>REDEFINIR SENHA</div>
                <div style={{marginTop:'40px'}}>
                    <span style={{fontSize:'14px', lineHeight:'25px'}}>Digite e-mail de cadastrado abaixo</span>
                    <div style={{padding:'0 10px', marginTop:'15px', border:'1px solid #ff7000', backgroundColor:'white', borderRadius:'3px'}}>
                        <input id='email' style={{height:'30px', width:'100%', lineHeight:'30px', fontSize:'14px', border:'0px', textAlign:'center'}} value={this.state.email} onChange={this.inputHandler.bind(this)} placeholder='E-MAIL' name='email' onKeyDown={(e)=>{if (e.key==='Enter'){document.getElementById('senha').focus();}}}/>
                    </div>                    
                </div> 
                <div style={{marginTop:'10px', display:'flex'}}>
                    <div style={{width:'50%', paddingRight:'5px'}}>
                        <div style={{padding:'0 10px', border:'1px solid #ff7000', backgroundColor:'white', borderRadius:'3px'}}>
                            <input id='senha' type='password' style={{height:'30px', width:'100%', lineHeight:'30px', fontSize:'14px', border:'0px', textAlign:'center'}} value={this.state.senha} onChange={this.inputHandler.bind(this)} placeholder='NOVA SENHA' name='senha' onKeyDown={(e)=>{if (e.key==='Enter'){document.getElementById('senha2').focus();}}}/>
                        </div>
                    </div>
                    <div style={{width:'50%', paddingLeft:'5px', marginBottom:'10px'}}>
                        <div style={{padding:'0 10px', border:'1px solid #ff7000', backgroundColor:'white', borderRadius:'3px'}}>
                            <input id='senha2' type='password' style={{height:'30px', width:'100%', lineHeight:'30px', fontSize:'14px', border:'0px', textAlign:'center'}} value={this.state.senha2} onChange={this.inputHandler.bind(this)} placeholder='CONFIRMAR SENHA' name='senha2' onKeyDown={(e)=>{if (e.key==='Enter'){this.inputSubmit()}}}/>
                        </div>
                    </div>                    
                </div>
                {this.displayError()}   
                {this.displaySuccess()}          
                <div style={{margin:'0 auto', marginTop:'35px', width:'175px', height:'40px', lineHeight:'40px', backgroundColor:'#3395f5', border:'2px solid #3395f5', borderRadius:'25px', textAlign:'center', fontSize:'17px', color:'white'}} onClick={()=>{this.inputSubmit()}}>CONFIRMAR</div>
            </div>
            <Waiting open={this.state.loading} size='60px' />
        </div>);
    }
}
export default ResetPasswordPage