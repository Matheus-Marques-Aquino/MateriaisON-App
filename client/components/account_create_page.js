import React, { Component } from 'react';
import { Mask } from './subcomponents/widgets/masks';
import BackButton from './subcomponents/back_button';
import history from './subcomponents/widgets/history';
import { Meteor } from 'meteor/meteor';
import Waiting from './subcomponents/widgets/waiting';

class AccountCreatePage extends Component{
    constructor(props){
        super(props);
        this.errors = []
        this.state = {
            nome: '',
            sobrenome: '',
            email: '',
            celular: '',
            senha:'',
            senha2:'',
            error: false,
            loading: false
        };
    }
    inputHandler(event){
        let value = event.target.value;
        let name = event.target.name;
        if ( name == 'celular' ){ value = Mask('phone', value ); }
        this.setState({
            [name]: value
        })
    }
    validateInputs(){
        if (this.state.loading){return;}
        this.setState({loading: true});
        this.errors = []
        if (this.state.nome == '' || this.state.nome == undefined || this.state.nome.length < 3){
            this.errors.push('O campo nome é obrigatório.')
        }else{
            if (!(/^[A-zÀ-ú/\s]+$/.test(this.state.nome))){this.errors.push('O campo nome não deve conter caracteres especiais.')}
        }
        
        if (this.state.sobrenome == '' || this.state.sobrenome == undefined || this.state.sobrenome.length < 3){
            this.errors.push('O campo sobrenome é obrigatório.')
        }else{
            if (!(/^[A-zÀ-ú/\s]+$/.test(this.state.sobrenome))){this.errors.push('O campo sobrenome não deve conter caracteres especiais.')}
        }
        
        if (this.state.email == '' || this.state.email == undefined){
            this.errors.push('O campo email é obrigatório.')
        }else{
            if (!(this.state.email.includes('@') && this.state.email.includes('.'))){this.errors.push('O e-mail inserido é inválido.')}
        }
        
        if (this.state.celular == '' || this.state.celular == undefined){
            this.errors.push('Você deve fornecer um celular para se cadastrar.')
        }else{
            if (!(/^[0-9\-\(\)]+$/.test(this.state.celular))){this.errors.push('O celular informado é inválido.')}
        }
        
        if (this.state.senha.length < 8 || this.state.senha == undefined){this.errors.push('Sua senha deve ter no mínimo 8 caracteres.')}

        if (this.state.senha != this.state.senha2){this.errors.push('As senhas não conhencidem.')}

        if (this.errors.length > 0){
            this.setState({ error: true, loading:false })
        }else{
            let nome = this.state.nome.trim();
            let sobrenome = this.state.sobrenome.trim();
            let options = {
                username: this.state.email.toLowerCase(),
                email: this.state.email.toLowerCase(),
                password: this.state.senha,
                confirmPassword: this.state.senha2,
                profile:{
                    firstName: nome,
                    lastName: sobrenome,
                    birthday: '',
                    phone: this.state.celular,
                    mainAddress: 0,
                    address: [],
                    cpfCnpj: '',
                    orders:[],
                    cards:[],
                    filter:{ distance: 30 }
                }
            }
            Accounts.createUser(options, (error)=>{
                if (error) { 
                    console.log(error) 
                    if (error.reason == 'Username already exists.'){
                        this.errors.push('Este endereço de e-mail já esta em uso.');
                    }
                    if (error.reason == 'Este número de celular já esta em uso'){
                        this.errors.push('Este número de celular já esta em uso');
                    }
                    this.setState({ error: true })
                }else{ 
                    history.push('/') 
                }
                this.setState({ loading: false })
            })
        }
    }
    displayErrors(){        
        if (this.errors.length > 0){return(<div style={{marginTop:'5px'}}>
            {this.errors.map((error, index)=>{
                let key = 'input_'+index
                return(<div style={{color:'red', fontSize:'14px'}} key={key}>{error}</div>)
            })}
        </div>)}        
    }

    render(){    
        if (Meteor.userId()){history.push('/')}    
        return(
        <div className='mainContainer'>
            <BackButton title='Cadastro'/>
            <div style={{height:'265px', borderBottom:'1px solid #ff7000', display:'flex'}}>
                <div style={{width:'220px', height:'172px', margin:'auto', backgroundImage:'url(/imgs/logo2.png)', backgroundPosition:'center', backgroundSize:'contain', backgroundRepeat:'no-repeat'}}></div>
            </div>
            <div style={{padding:'30px 13px', backgroundColor:'white'}}>
                <div style={{fontWeight:'bold', textAlign:'center'}}>CADASTRE-SE</div>
                <div style={{marginTop:'40px', display:'flex'}}>
                    <div style={{width:'50%', paddingRight:'5px'}}>
                        <div style={{padding:'0 10px', border:'1px solid #ff7000', backgroundColor:'white', borderRadius:'3px'}}>
                            <input id='nome' style={{height:'30px', width:'100%', lineHeight:'30px', fontSize:'14px', textAlign:'center', border:'0px'}} value={this.state.nome} onChange={this.inputHandler.bind(this)} placeholder='NOME' name='nome' onKeyDown={(e)=>{if (e.key==='Enter'){document.getElementById('sobrenome').focus();}}}/>
                        </div>
                    </div>
                    <div style={{width:'50%', paddingLeft:'5px'}}>
                        <div style={{padding:'0 10px', border:'1px solid #ff7000', backgroundColor:'white', borderRadius:'3px'}}>
                            <input id='sobrenome' style={{height:'30px', width:'100%', lineHeight:'30px', fontSize:'14px', textAlign:'center', border:'0px'}} value={this.state.sobrenome} onChange={this.inputHandler.bind(this)} placeholder='SOBRENOME' name='sobrenome' onKeyDown={(e)=>{if (e.key==='Enter'){document.getElementById('email').focus();}}}/>
                        </div>
                    </div>
                </div>
                <div style={{marginTop:'10px'}}>
                    <div style={{padding:'0 10px', border:'1px solid #ff7000', backgroundColor:'white', borderRadius:'3px'}}>
                        <input id='email' style={{height:'30px', width:'100%', lineHeight:'30px', fontSize:'14px', textAlign:'center', border:'0px'}} value={this.state.email} onChange={this.inputHandler.bind(this)} placeholder='E-MAIL' name='email' onKeyDown={(e)=>{if (e.key==='Enter'){document.getElementById('celular').focus();}}} autocapitalize="none"/>
                    </div>
                </div>
                <div style={{marginTop:'10px'}}>
                    <div style={{padding:'0 10px', border:'1px solid #ff7000', backgroundColor:'white', borderRadius:'3px'}}>
                        <input id='celular' type='tel' style={{height:'30px', width:'100%', lineHeight:'30px', fontSize:'14px', textAlign:'center', border:'0px'}} value={this.state.celular} onChange={this.inputHandler.bind(this)} placeholder='CELULAR' name='celular' onKeyDown={(e)=>{if (e.key==='Enter'){document.getElementById('senha').focus();}}}/>
                    </div>
                </div>
                <div style={{marginTop:'10px', display:'flex'}}>
                    <div style={{width:'50%', paddingRight:'5px'}}>
                        <div style={{padding:'0 10px', border:'1px solid #ff7000', backgroundColor:'white', borderRadius:'3px'}}>
                            <input id='senha' type='password' style={{height:'30px', width:'100%', lineHeight:'30px', fontSize:'14px', textAlign:'center', border:'0px'}} value={this.state.senha} onChange={this.inputHandler.bind(this)} placeholder='SENHA' name='senha' onKeyDown={(e)=>{if (e.key==='Enter'){document.getElementById('senha2').focus();}}} autocapitalize="none"/>
                        </div>
                    </div>
                    <div style={{width:'50%', paddingLeft:'5px', marginBottom:'10px'}}>
                        <div style={{padding:'0 10px', border:'1px solid #ff7000', backgroundColor:'white', borderRadius:'3px'}}>
                            <input id='senha2' type='password' style={{height:'30px', width:'100%', lineHeight:'30px', fontSize:'14px', textAlign:'center', border:'0px'}} value={this.state.senha2} onChange={this.inputHandler.bind(this)} placeholder='CONFIRMAR SENHA' name='senha2' onKeyDown={(e)=>{if (e.key==='Enter'){this.validateInputs();}}} autocapitalize="none"/>
                        </div>
                    </div>                    
                </div>
                {this.displayErrors()}
                <div style={{margin:'0 auto', marginTop:'60px', width:'220px', height:'40px', lineHeight:'40px', backgroundColor:'#3395f5', border:'2px solid #3395f5', borderRadius:'15px', textAlign:'center', fontSize:'17px', color:'white'}} onClick={()=>{this.validateInputs()}}>
                    CRIAR CONTA
                </div>
                <div style={{marginTop:'60px', fontSize:'11px'}}>
                    <span style={{color:'#333'}}>
                        Ao clicar em "Criar Conta", você concorda com os 
                        <a style={{textDecoration:'none', color:'#3395f5'}}>
                            Termos de Uso
                        </a> e 
                        <a style={{textDecoration:'none', color:'#007af3'}} onClick={()=>{history.push('/politica-de-privacidade')}}>
                                Política de Privacidade
                        </a>.
                    </span>
                </div>
            </div>
            <Waiting open={this.state.loading} size='60px'/>
        </div>);
    }
}
export default AccountCreatePage