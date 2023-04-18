import React, { Component } from 'react';
import { createContainer } from 'react-meteor-data';
import history from './subcomponents/widgets/history';
import { Meteor } from 'meteor/meteor';
import Waiting from './subcomponents/widgets/waiting';

class LoginPage extends Component{
    constructor(props){
        super(props);
        this.state = {
            email: '',
            senha: '',
            error: '',
            loading: false,
        }
    }

    inputHandler(event){
        let name = event.target.name;
        let value = event.target.value;        
        this.setState({ [name]: value });        
    }

    inputSubmit(){
        if (!this.state.loading){
            this.setState({loading: true})        
            if (!(this.state.email.includes('@') && this.state.email.includes('.'))){ 
                this.setState({ 
                    loading: false,
                    error: 'Seu e-mail ou senha informados são inválidos'
                }); 
                return;
            }
            if (this.state.senha.length < 8){
                this.setState({ 
                    loading: false,
                    error: 'Seu e-mail ou senha informados são inválidos'
                }); 
                return;
            }
            Meteor.loginWithPassword(this.state.email, this.state.senha, (error, result)=>{
                if (!error){
                    this.setState({
                        loading:false
                    });
                    history.push('/')

                }else{
                    this.setState({ 
                        loading: false,
                        error: 'Seu e-mail ou senha informados são inválidos.'
                });
                }
            }) 
        }             
    }

    displayError(){
        if (this.state.error != ''){
            return(<div style={{color:'red'}}>{this.state.error}</div>)
        }
    }

    render(){ 
        console.log(JSON.parse(localStorage.getItem('MateriaisON_localization')))       
        if (Meteor.userId()){ history.push("/") }
        return(<div className='mainContainer'>
            <div style={{height:'265px', borderBottom:'1px solid #ff7000', display:'flex'}}>
                <div style={{width:'220px', height:'172px', margin:'auto', backgroundImage:'url(/imgs/logo2.png)', backgroundPosition:'center', backgroundSize:'contain', backgroundRepeat:'no-repeat'}}></div>
            </div>
            <div style={{padding:'50px 10px', backgroundColor:'white'}}>
                <div>
                    <div style={{padding:'0 5px', margin:'7px 20px', borderBottom:'1px solid #ff7000', backgroundColor:'white'}}>
                        <input id='login' style={{height:'20px', width:'100%', fontSize:'16px', border:'0px'}} value={this.state.email} onChange={this.inputHandler.bind(this)} placeholder='ENDEREÇO DE E-MAIL' name='email' onKeyDown={(e)=>{if (e.key==='Enter'){document.getElementById('senha').focus()}}} autocapitalize="none"/>
                    </div>
                </div>
                <div style={{marginTop:'20px'}}>
                    <div style={{padding:'0 5px', margin:'7px 20px', borderBottom:'1px solid #ff7000', backgroundColor:'white'}}>
                        <input id='senha' type='password' style={{height:'20px', width:'100%', fontSize:'16px', border:'0px'}} value={this.state.senha} onChange={this.inputHandler.bind(this)} placeholder='SENHA' name='senha' onKeyDown={(e)=>{if (e.key==='Enter'){this.inputSubmit()}}}/>
                    </div>
                </div>
                <div style={{ display:'flex'}}>
                    <span style={{fontSize:'13px', lineHeight:'25px', marginLeft:'auto', marginRight:'30px', fontWeight:'600', color:'#3395f5'}} onClick={()=>{history.push('/perdi-a-senha')}}>ESQUECEU A SENHA?</span>
                </div>    
                {this.displayError()}            
                <div style={{margin:'0 auto', marginTop:'50px', width:'175px', height:'40px', lineHeight:'40px', backgroundColor:'#3395f5', border:'2px solid #3395f5', borderRadius:'25px', textAlign:'center', fontSize:'17px', color:'white'}} onClick={()=>{this.inputSubmit()}}>ENTRAR</div>
                <div style={{width:'100%', textAlign:'center', fontSize:'14px', marginTop:'20px'}}>Não tem uma conta?</div>
                <div style={{width:'fit-content', margin:'3px auto', fontSize:'16px', color:'#3395f5', fontWeight:'600'}} onClick={()=>{if (!this.state.loading){history.push('/registrar')}}}>CLIQUE AQUI</div>
                <div style={{marginTop:'60px', fontSize:'11px'}}><span style={{color:'#333'}}>Ao clicar em "Entrar", você concorda com os <a style={{textDecoration:'none', color:'#3395f5'}}>Termos de Uso</a> e <a style={{textDecoration:'none', color:'#3395f5'}} onClick={()=>{history.push('/politica-de-privacidade')}}>Política de Privacidade</a>.</span></div>
            </div>            
            <Waiting open={this.state.loading} size='60px' />
        </div>);
    }
}
export default LoginPage;