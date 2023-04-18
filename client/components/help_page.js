import React, { Component } from 'react';
import BottomMenu from './subcomponents/bottom_menu';
import BackButton from './subcomponents/back_button';
import { Mask } from './subcomponents/widgets/masks';
import Waiting from './subcomponents/widgets/waiting';

class HelpPage extends Component{
    constructor(props){
        super(props);
        this.state={
            result: '',
            nome: {value: '', text:'white', background:'transparant', border:'white', input:'whiteInput'},
            email: {value: '', text:'white', background:'transparant', border:'white', input:'whiteInput'},
            telefone: {value: '', text:'white', background:'transparant', border:'white', input:'whiteInput'},
            mensagem: {value: '', text:'white', background:'transparant', border:'white', input:'whiteInput'}
        }
    }

    validateInputs(){
        if (this.state.loading){return;}
        this.setState({loading: true});
        this.errors = []
        if (this.state.nome.value == '' || this.state.nome.value == undefined || this.state.nome.value.length < 3){
            this.errors.push('nome');
        }
        if (this.state.email.value == '' || this.state.email.value == undefined || !this.state.email.value.includes('@') || !this.state.email.value.includes('.')){
            this.errors.push('email');
        }
        if (this.state.telefone.value == '' || this.state.telefone.value == undefined || !(/^[0-9\-\(\)]+$/.test(this.state.telefone.value))){
            this.errors.push('telefone');
        }
        if (this.state.mensagem.value == '' || this.state.mensagem.value == undefined || this.state.mensagem.length < 5){
            this.errors.push('mensagem');
        }
        if (this.errors.length > 0){
            let state = this.state;         
            this.errors.map((error)=>{
                let input = this.state[error];                
                input.text = '#FF1414';
                input.border = '#FF1414';
                input.input = 'redInput';
                input.background = 'white'              
                state[error] = input;
            });
            this.errors=[];
            state.loading = false;
            this.setState(state);
            return;
        }
        let data = {
            contactName: this.state.nome.value,
            contactEmail: this.state.email.value,
            contactTelefone: this.state.telefone.value,
            contactMensagem: this.state.mensagem.value
        };
        Meteor.call('contactMail', data, Meteor.userId(), (error, result)=>{
            if (!error){
                this.setState({result: 'Mensagem enviada com sucesso!'})
            }else{
                this.setState({result: error.reason});
            }
            this.setState({loading: false});
        })
        
    }

    inputHandler(event){
        let name = event.target.name;
        let value = event.target.value;
        let input = this.state[name];        
        if ( name == 'telefone' ){ 
            value = Mask('phone', value );                         
        }
        input.value = value; 
        if (input.value.length != 0){
            input.input = 'whiteInput'; 
            input.background ='white';
            input.text = 'black';
            input.border = 'white';
        }else{
            input.border = 'white';
            input.input = 'whiteInput';
            input.background ='transparent';
        }               
        this.setState({ [name]:input });
    }

    render(){         
        let display = 'none'
        if (this.state.result.length > 0){ display = 'block'; }
        return(<div className='mainContainer'>
            <BackButton/>
            <div style={{height:'55px', display:'flex', backgroundColor:'#ff7000'}}>
                <div style={{margin:'auto', color:'white', fontSize:'19px', fontWeight:'bold'}}>Ajuda</div>    
            </div>  
            <div style={{margin:'35px 20px', marginBottom:'0px', padding:'15px 20px', border:'1px solid #ff7000', borderBottom:'0px'}}>
                <div style={{fontSize:'13px', textIndent:'19px', lineHeight:'16px', color:'#444', position:'relative'}}>
                    Entre em contato através das nossas centrais de atendimento ou redes sociais:
                    <div style={{width:'15px', height:'15px', position:'absolute',top:'0px', left:'0px', backgroundImage:'url(/imgs/icons/icon-info.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></div>
                </div>              
                <div style={{marginTop:'17px', fontSize:'14px', color:'#444', lineHeight:'22px'}}>
                    <div style={{width:'fit-content', margin:'0 auto', display:'flex'}}><div style={{width:'16px', height:'16px', margin:'auto 0', marginRight:'5px', backgroundImage:'url(/imgs/icons/icon-whatsapp.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></div>(11) 93289-7996</div>
                    <div style={{width:'fit-content', margin:'0 auto', display:'flex'}}><div style={{width:'16px', height:'16px', margin:'auto 0', marginRight:'5px', backgroundImage:'url(/imgs/icons/icon-telefone.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></div>(11) 4226-7099</div>
                    <div style={{width:'fit-content', margin:'0 auto', display:'flex'}}><div style={{width:'16px', height:'16px', margin:'auto 0', marginRight:'5px', backgroundImage:'url(/imgs/icons/icon-telefone.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></div>(11) 4318-7223</div>    
                </div> 
                <div style={{marginTop:'12px', padding:'10px 0', lineHeight:'18px', borderTop:'1px solid #FFDBBF', borderBottom:'1px solid #FFDBBF', fontSize:'16px', color:'#444'}}>
                    <div style={{width:'fit-content', display:'flex', margin:'0 auto'}}>
                        <div style={{width:'19px', height:'19px', margin:'auto 0', marginRight:'5px', backgroundImage:'url(/imgs/icons/icon-email.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></div>
                        <div>contato@materiaison.com.br</div>
                    </div>    
                </div>
                <div style={{marginTop:'8px', fontSize:'15px', color:'#444'}}>
                    <div style={{width:'fit-content', margin:'0 auto', display:'flex'}}>
                        <div style={{width:'18px', height:'18px', margin:'auto 0', marginRight:'5px', backgroundImage:'url(/imgs/icons/icon-facebook.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></div>
                        <div>materiaison.online</div>
                    </div>
                    <div style={{width:'fit-content', margin:'0 auto', marginTop:'8px', display:'flex'}}>
                        <div style={{width:'18px', height:'18px', margin:'auto 0', marginRight:'5px', backgroundImage:'url(/imgs/icons/icon-instagram.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></div>
                        <div>_materiaison</div>
                    </div>    
                </div>
            </div>    
            <div style={{margin:'20px', marginTop:'0px', backgroundColor:'#ff7000'}}>
                <div style={{height:'39px', backgroundImage:'url(/imgs/whiteDownArrow.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></div>
                <div style={{margin:'20px'}}>
                    <div style={{fontSize:'13px', textAlign:'center', color:'white'}}>
                        Deixe uma sugestão ou esclareça suas dúvidas:
                    </div>
                    <div style={{marginTop:'25px'}}>
                        <div style={{border:'1px solid '+this.state.nome.border, borderRadius:'3px'}}>
                            <input className={this.state.nome.input} id='nome' style={{height:'30px', width:'100%', lineHeight:'30px', fontSize:'14px', textAlign:'center', border:'0px', borderRadius:'3px', backgroundColor:this.state.nome.background, color:this.state.nome.text}} value={this.state.nome.value} onChange={this.inputHandler.bind(this)} placeholder='NOME' name='nome' onKeyDown={(e)=>{if (e.key==='Enter'){document.getElementById('email').focus();}}}/>
                        </div>
                        <div style={{marginTop:'5px', border:'1px solid '+this.state.email.border, borderRadius:'3px'}}>
                            <input className={this.state.email.input} id='email' style={{height:'30px', width:'100%', lineHeight:'30px', fontSize:'14px', textAlign:'center', border:'0px', borderRadius:'3px', backgroundColor:this.state.email.background, color:this.state.email.text}} value={this.state.email.value} onChange={this.inputHandler.bind(this)} placeholder='E-MAIL' name='email' onKeyDown={(e)=>{if (e.key==='Enter'){document.getElementById('telefone').focus();}}} autocapitalize="none"/>
                        </div>
                        <div style={{marginTop:'5px', border:'1px solid '+this.state.telefone.border, borderRadius:'3px'}}>
                            <input className={this.state.telefone.input} id='telefone' style={{height:'30px', width:'100%', lineHeight:'30px', fontSize:'14px', textAlign:'center', border:'0px', borderRadius:'3px', backgroundColor:this.state.telefone.background, color:this.state.telefone.text}} value={this.state.telefone.value} onChange={this.inputHandler.bind(this)} placeholder='TELEFONE' name='telefone' onKeyDown={(e)=>{if (e.key==='Enter'){document.getElementById('mensagem').focus();}}}/>
                        </div>                        
                        <div style={{height:'95px', marginTop:'5px', backgroundColor:this.state.mensagem.background, border:'1px solid '+this.state.mensagem.border, borderRadius:'3px'}}>
                            <textarea className={this.state.mensagem.input} id='mensagem' style={{width:'100%', height:'95px', padding:'5px', border:'0px', borderRadius:'3px', fontSize:'14px', color:this.state.mensagem.text, color:this.state.mensagem.text, resize:'none', boxSizing: 'border-box'}} value={this.state.mensagem.value} onChange={this.inputHandler.bind(this)} placeholder='MENSAGEM' name='mensagem' onKeyDown={(e)=>{if (e.key==='Enter'){}}}/>
                        </div>
                        <div style={{fontSize:'13px', paddingTop:'15px', color:'white', display: display}}>{this.state.result}</div>
                        <div style={{paddingTop:'15px', paddingBottom:'25px'}}>
                            <div style={{width:'fit-content', margin:'0 auto', padding:'7px 14px', fontSize:'14px', backgroundColor:'white', borderRadius:'20px', color:'#ff7000'}} onClick={()=>{this.validateInputs()}}>ENVIAR</div>
                        </div>
                    </div>
                </div>
            </div>
            <Waiting open={this.state.loading} size='60px'/>                    
            <BottomMenu/>
        </div>)
    }
}

export default HelpPage