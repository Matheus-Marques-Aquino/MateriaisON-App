import React, { Component } from 'react';
import BackButton from './subcomponents/back_button';
import BottomMenu from './subcomponents/bottom_menu';
import { LoadScript, Autocomplete} from '@react-google-maps/api';
import { Mask } from './subcomponents/widgets/masks';
import { Profile } from '../../imports/collections/profile';
import { CepBrasil } from 'correios-brasil';

class PaymentAddressPage extends Component{
    constructor(props){
        super(props);
        this.ready = ['white', '#ff7000']
        this.errors = []
        this.success = []
        this.state = {
            start: false,
            waiting: false,
            loaded:false,
            enabled: false,
            nome:'',
            sobrenome:'',
            cep:'',
            rua:'',
            numero:'',
            complemento:'',
            bairro:'',
            cidade:'',
            estado:'',
            UF:'',
            inputs: ['#ff7000', '#ff7000', '#ff7000', '#ff7000', '#ff7000', '#ff7000', '#ff7000', '#ff7000', '#ff7000', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent'],
        };
        
    }
    getState(UF){
        switch(UF){
            case '':
                return ''
                break;

                case 'AC': 
                    return 'Acre';
                    break;

                case 'AL': 
                    return 'Alagoas';
                    break;
                
                case 'AP': 
                    return 'Amapá';
                    break;
                
                case 'AM': 
                    return 'Amazonas';
                    break;
                
                case 'BA': 
                    return 'Bahia';
                    break;
                
                case 'CE': 
                    return 'Ceará';
                    break;
                
                case 'DF': 
                    return 'Distrito Federal';
                    break;
                
                case 'ES': 
                    return 'Espírito Santo';
                    break;
                
                case 'GO': 
                    return 'Goiás';
                    break;
                
                case 'MA': 
                    return 'Maranhão';
                    break;
                
                case 'MT': 
                    return 'Mato Grosso';
                    break;

                case 'MS': 
                    return 'Mato Grosso do Sul';
                    break;
                
                case 'MG': 
                    return 'Minas Gerais';
                    break;
                
                case 'PA': 
                    return 'Pará';
                    break;
                
                case 'PB': 
                    return 'Paraíba';
                    break;
                
                case 'PR': 
                    return 'Paraná';
                    break;
                
                case 'PE': 
                    return 'Pernambuco';
                    break;
                
                case 'PI': 
                    return 'Piauí';
                    break;
                
                case 'RJ': 
                    return 'Rio de Janeiro';
                    break;
                
                case 'RN': 
                    return 'Rio Grande do Norte';
                    break;
                
                case 'RS': 
                    return 'Rio Grande do Sul';
                    break;
                
                case 'RO': 
                    return 'Rondônia';
                    break;
                
                case 'RR': 
                    return 'Roraima';
                    break;
                
                case 'SC': 
                    return 'Santa Catarina';
                    break;
                
                case 'SP': 
                    return 'São Paulo';
                    break;
                
                case 'SE': 
                    return 'Sergipe';
                    break;
                
                case 'TO': 
                    return 'Tocantins';
                    break;                
                
                default:
                    return '';
                    break;                
        }
    }
    inputHandler(event){
        let value = event.target.value;
        let name = event.target.name;
        if (name == 'cep'){ 
            value = Mask('cep', value );
            if (value.length == 9){
                this.ready = ['white', '#ff7000'];
            }else{
                this.ready = ['#ff7000', 'white'];
            } 
        }
        this.setState({
            [name]: value
        });
    }
    onLoad(){         
        if (this.state.cep.length == 9){
            this.ready = ['white', '#ff7000', ];
        }
        this.setState({loaded: true});        
    }    
    autoFill(){
        if (this.state.loaded){
            let inputs = this.state.inputs;
            if (this.state.cep < 9){ 
                inputs[2]='red'
                this.setState({ inputs: inputs }); 
                return; 
            }   
            ;
            if (this.state.waiting){ return; }             
            this.setState({waiting: true}) ;
            let correios = new CepBrasil();
            let finds = 0;
            let address = {
                rua: '',
                bairro:'',
                cidade:'',
                estado:'',
                UF:''
            }
            correios.consultarCEP(this.state.cep).then((response) => {
                if (response.bairro != ''){
                    address.bairro = response.bairro;
                    finds += 1;
                } 
                if (response.localidade != ''){
                    address.cidade = response.localidade;
                    finds += 1;
                }
                if (response.logradouro != ''){
                    address.rua = response.logradouro;
                    finds += 1;
                }
                if (response.uf != ''){
                    address.UF = response.uf;
                    finds += 1;
                } 
                address.estado = this.getState(address.UF)
                if (finds == 0){
                    inputs[2]='red';
                    inputs[11]='#ffd4d4';
                    this.setState({
                        inputs: inputs,
                        waiting:false                    
                    });
                }else{
                    inputs[2]='#ff7000';
                    inputs[11]='transparent';
                    this.setState({
                        inputs: inputs,
                        waiting:false,
                        rua: address.rua,
                        bairro: address.bairro,
                        cidade: address.cidade,
                        estado: address.estado,
                        UF: address.UF
                    });
                }                            
            });
        }
    }  
    validateInputs(){
        if (this.state.waiting){ return; }
        this.setState({waiting: true});        
        if (!this.state.enabled){ 
            if (this.errors.length == 0){
                Meteor.call('profile.update.paymentAddress', {enabled: false}, (error, result)=>{
                    if (!error){
                        this.success = [];
                        this.success.push('Endereço de cobrança atualizado com sucesso!')
                        this.setState({waiting: false})
                    }else{
                        this.setState({waiting: false})
                    }
                })
            }
            return; }
        this.errors = [];
        let input = this.state.inputs;
        if (this.state.nome == '' || this.state.nome == undefined || this.state.nome.length < 3){
            this.errors.push('O campo Nome é obrigatório.');
            input[0]='red';
            input[9]='#ffd4d4';
        }else{
            if (!(/^[A-zÀ-ú/\s]+$/.test(this.state.nome))){
                this.errors.push('O campo nome não deve conter caracteres especiais.');
                input[0]='red';
                input[9]='#ffd4d4';
            }else{
                input[0]='#ff7000';
                input[9]='transparent';
            }
        }

        if (this.state.sobrenome == '' || this.state.sobrenome == undefined || this.state.sobrenome.length < 3){
            this.errors.push('O campo Sobrenome é obrigatório.');
            input[1]='red';
            input[10]='#ffd4d4';
        }else{
            if (!(/^[A-zÀ-ú/\s]+$/.test(this.state.sobrenome))){
                this.errors.push('O campo sobrenome não deve conter caracteres especiais.');
                input[1]='red';
                input[10]='#ffd4d4';
            }else{
                input[1]='#ff7000';
                input[10]='transparent';
            }
        }

        if (this.state.cep == '' || this.state.cep == undefined || this.state.cep.length < 9){
            this.errors.push('O campo CEP é obrigatório.');
            input[2]='red';
            input[11]='#ffd4d4';
        }else{
            if (!(/^\d{5}-\d{3}$/.test(this.state.cep))){
                this.errors.push('O campo CEP não esta preenchido corretamente.');
                input[2]='red';
                input[11]='#ffd4d4';
            }else{
                input[2]='#ff7000';
                input[11]='transparent';
            }
        }

        if (this.state.rua == '' || this.state.rua == undefined || this.state.rua.length < 3){
            this.errors.push('O campo Rua é obrigatório.');
            input[3]='red';
            input[12]='#ffd4d4';
        }else{
            input[3]='#ff7000';
            input[12]='transparent';
        }

        if (this.state.numero == '' || this.state.numero == undefined){
            this.errors.push('O campo Número é obrigatório.');
            input[4]='red';
            input[13]='#ffd4d4';
        }else{
            input[4]='#ff7000';
            input[13]='transparent';
        }

        if (this.state.cidade == '' || this.state.cidade == undefined || this.state.cidade.length < 3){
            this.errors.push('O campo Cidade é obrigatório.');
            input[7]='red';
            input[16]='#ffd4d4';
        }else{
            input[7]='#ff7000';
            input[16]='transparent';
        }

        if (this.state.estado == '' || this.state.estado == undefined || this.state.estado.length < 2){
            this.errors.push('O campo Estado é obrigatório.');
            input[8]='red';
            input[17]='#ffd4d4';
        }else{
            input[8]='#ff7000';
            input[17]='transparent';
        }        
        let profile = {
            enabled: this.state.enabled,
            nome: this.state.nome,
            sobrenome: this.state.sobrenome,
            cep: this.state.cep,
            rua: this.state.rua,
            numero: this.state.numero,
            complemento: this.state.complemento,
            bairro: this.state.bairro,
            cidade: this.state.cidade,
            estado: this.state.estado,
        }
        if (this.errors.length == 0){
            Meteor.call('profile.update.paymentAddress', profile, (error, result)=>{
                if (!error){
                    this.success = [];
                    this.success.push('Endereço de cobrança atualizado com sucesso!');
                    this.setState({waiting: false})
                }else{
                    this.setState({waiting: false})
                }
            })
        }
        this.setState({
            inputs: input
        });
    }

    displayErrors(){
        if (!this.state.otherAddress){ return(<div></div>); }
        return(<div style={{margin:'10px 0'}}>{
            this.errors.map((error, index)=>{
                let key='Error_'+index;
                return(<div style={{color:'red'}} key={key}>{error}</div>);                
            })
        }</div>)
    }
    displaySuccess(){
        if (this.success.length == 0){ return(<div></div>); }
        return(<div style={{margin:'10px 0', color:'#32CD32'}}>{this.success}</div>)
    }

    render(){ 
        if (!this.state.start){
            Meteor.subscribe('profileFields', 'PaymentAddress', Meteor.userId(), ()=>{
                let profile = Profile.findOne({'_id': Meteor.userId()});
                profile = profile.profile;
                if (!profile.paymentAddress){
                    profile = {
                        enabled:false,
                        nome:'',
                        sobrenome:'',
                        cep:'',
                        rua:'',
                        numero:'',
                        complemento:'',
                        bairro:'',
                        cidade:'',
                        estado:'',
                        UF:'',
                    }
                }else{
                    profile = profile.paymentAddress;
                }
                this.setState({
                    enabled: profile.enabled,
                    nome: profile.nome,
                    sobrenome: profile.sobrenome,
                    cep: profile.cep,
                    rua: profile.rua,
                    numero: profile.numero,
                    complemento: profile.complemento,
                    bairro: profile.bairro,
                    cidade: profile.cidade,
                    estado: profile.estado,
                    UF: profile.UF,
                    start: true
                })
            })
        }
        if (!this.state.start){ return(<div></div>);}
        let select = ['#b3b3b3', '#b3b3b3','none', 'none'] 
        let maxHeight = '0px'
        if (this.state.enabled){
            select = ['#b3b3b3', '#ff7000', 'none', 'block', '1px solid #FFDBBF']
            maxHeight = '425px';
        }else{
            select = ['#ff7000', '#b3b3b3', 'block', 'none', '']
            maxHeight = '0px';
        }  
        return(<div className='mainContainer'>   
            <BackButton/>  
            <LoadScript id="script-loader" googleMapsApiKey="AIzaSyB2cI2xl2b40J1NNg4EZ2VXuD2JTBJ2GTg" libraries={["places"]} onLoad={()=>{this.onLoad()}}>
                <div style={{height:'55px', display:'flex', backgroundColor:'#ff7000'}}>
                    <div style={{margin:'auto', color:'white', fontSize:'19px', fontWeight:'bold'}}>Endereço de</div>    
                </div> 
                <div style={{padding:'20px 10px'}}>
                    <div style={{fontSize:'14px', display:'flex', height:'20px', lineHeight:'20px', paddingLeft:'10px'}} onClick={()=>{ if (this.state.enabled){ this.setState({enabled:false}); }}}>                    
                        <div style={{height:'12px', width:'12px', borderRadius:'50%', border:'2px solid '+select[0], margin:'auto 0', marginRight:'10px', display:'flex'}}>
                            <div style={{width:'8px', height:'8px', margin:'auto', borderRadius:'50%', backgroundColor:'#ff7000', display:select[2]}}>
                            </div>
                        </div>
                        <span>Usar o mesmo da entrega.</span>
                    </div>
                    <div style={{fontSize:'14px', display:'flex', height:'20px', lineHeight:'20px', paddingLeft:'10px', marginTop:'10px',marginBottom:'15px'}} onClick={()=>{ if (!this.state.enabled){ this.setState({enabled:true}); }}}>
                        <div style={{height:'12px', width:'12px', borderRadius:'50%', border:'2px solid '+select[1], margin:'auto 0', marginRight:'10px', display:'flex'}}>
                            <div style={{width:'8px', height:'8px', margin:'auto', borderRadius:'50%', backgroundColor:'#ff7000', display:select[3]}}>
                            </div>
                        </div>
                        <span>Usar um endereço diferente.</span>
                    </div>
                    <div style={{maxHeight:maxHeight, overflowY:'hidden', transition:'0.3s ease-in', marginBottom:'10px'}}>                    
                        <div style={{borderTop:select[4]}}>
                            <div style={{height:'80px', fontSize:'16px', fontWeight:'bold', display:'flex'}}>
                                <div style={{margin:'auto'}}>Editar informações</div>
                            </div>
                            <div style={{display:'flex'}}>
                                <div style={{width:'50%', paddingRight:'5px'}}>                                     
                                    <div style={{padding:'0 10px', border:'1px solid '+this.state.inputs[0], borderRadius:'3px', backgroundColor:this.state.inputs[9]}}>
                                        <input id='nome' style={{height:'30px', width:'100%', padding:'0px', lineHeight:'30px', fontSize:'14px', textAlign:'center', border:'0px', backgroundColor:'transparent'}} value={this.state.nome} onChange={this.inputHandler.bind(this)} placeholder='Nome' name='nome' onKeyDown={(e)=>{if (e.key==='Enter'){document.getElementById('sobrenome').focus();}}}/>
                                    </div>
                                </div>
                                <div style={{width:'50%', paddingLeft:'5px'}}>                                
                                    <div style={{padding:'0 10px', border:'1px solid '+this.state.inputs[1], borderRadius:'3px', backgroundColor:this.state.inputs[10]}}>
                                        <input id='sobrenome' style={{height:'30px', width:'100%', padding:'0px', lineHeight:'30px', fontSize:'14px', textAlign:'center', border:'0px', backgroundColor:'transparent'}} value={this.state.sobrenome} onChange={this.inputHandler.bind(this)} placeholder='Sobrenome' name='sobrenome' onKeyDown={(e)=>{if (e.key==='Enter'){document.getElementById('cep').focus();}}}/>
                                    </div>
                                </div>
                            </div>                            
                        </div>
                        <div style={{marginTop:'10px', display:'flex'}}>
                            <div style={{width:'100%'}}>                                
                                <div style={{padding:'0 10px', border:'1px solid '+this.state.inputs[2], borderRadius:'3px', backgroundColor:this.state.inputs[11]}}>    
                                    <input id='cep' style={{height:'30px', width:'100%', padding:'0px', lineHeight:'30px', fontSize:'14px', textAlign:'center', border:'0px', backgroundColor:'transparent'}} value={this.state.cep} onChange={this.inputHandler.bind(this)} placeholder='CEP' name='cep' onKeyDown={(e)=>{if (e.key==='Enter'){this.autoFill();}}}/>
                                </div>
                            </div> 
                            <div style={{ minWidth:'120px', height:'26px', marginTop:'auto', color:this.ready[0], border:'2px solid #ff7000', borderRadius:'25px', textAlign:'center', display:'flex', fontSize:'14px', marginLeft:'10px', backgroundColor:this.ready[1] }}><span style={{margin:'auto'}} onClick={()=>{this.autoFill()}}>PREENCHER</span></div>
                        </div>
                        <div style={{marginTop:'10px', display:'flex'}}>
                            <div style={{width:'80%', paddingRight:'5px'}}>
                                <div style={{padding:'0 10px', border:'1px solid '+this.state.inputs[3], borderRadius:'3px', backgroundColor:this.state.inputs[12]}}>    
                                    <input id='rua' style={{height:'30px', width:'100%', padding:'0px', lineHeight:'30px', fontSize:'14px', textAlign:'center', border:'0px', backgroundColor:'transparent'}} value={this.state.rua} onChange={this.inputHandler.bind(this)} placeholder='Rua' name='rua' onKeyDown={(e)=>{if (e.key==='Enter'){document.getElementById('numero').focus();}}}/>
                                </div> 
                            </div>
                            <div style={{width:'20%', paddingLeft:'5px'}}>
                                <div style={{padding:'0 10px', border:'1px solid '+this.state.inputs[4], borderRadius:'3px', backgroundColor:this.state.inputs[13]}}>
                                    <input id='numero' style={{height:'30px', width:'100%', padding:'0px', lineHeight:'30px', fontSize:'14px', textAlign:'center', border:'0px', backgroundColor:'transparent'}} value={this.state.numero} onChange={this.inputHandler.bind(this)} placeholder='Número' name='numero' onKeyDown={(e)=>{if (e.key==='Enter'){document.getElementById('complemento').focus();}}}/>
                                </div>
                            </div>
                        </div>
                        <div style={{paddingTop:'10px', display:'flex'}}>
                            <div style={{width:'50%', paddingRight:'5px'}}>                                
                                <div style={{padding:'0 10px', border:'1px solid '+this.state.inputs[5], borderRadius:'3px', backgroundColor:this.state.inputs[14]}}>
                                    <input id='complemento' style={{height:'30px', width:'100%', padding:'0px', lineHeight:'30px', fontSize:'14px', textAlign:'center', border:'0px', backgroundColor:'transparent'}} value={this.state.complemento} onChange={this.inputHandler.bind(this)} placeholder='Complemento' name='complemento' onKeyDown={(e)=>{if (e.key==='Enter'){document.getElementById('bairro').focus();}}}/>
                                </div>
                            </div>
                            <div style={{width:'50%', paddingLeft:'5px'}}>                            
                                <div style={{padding:'0 10px', border:'1px solid '+this.state.inputs[6], borderRadius:'3px', backgroundColor:this.state.inputs[15]}}>    
                                    <input id='bairro' style={{height:'30px', width:'100%', padding:'0px', lineHeight:'30px', fontSize:'14px', textAlign:'center', border:'0px', backgroundColor:'transparent'}} value={this.state.bairro} onChange={this.inputHandler.bind(this)} placeholder='Bairro' name='bairro' onKeyDown={(e)=>{if (e.key==='Enter'){document.getElementById('cidade').focus();}}}/>
                                </div>
                            </div>
                        </div>
                        <div style={{marginTop:'10px', display:'flex'}}>                            
                            <div style={{width:'50%', paddingRight:'5px'}}>
                                <div style={{padding:'0 10px', border:'1px solid '+this.state.inputs[7], borderRadius:'3px', backgroundColor:this.state.inputs[16]}}>    
                                    <input id='cidade' style={{height:'30px', width:'100%', padding:'0px', lineHeight:'30px', fontSize:'14px', textAlign:'center', border:'0px', backgroundColor:'transparent'}} value={this.state.cidade} onChange={this.inputHandler.bind(this)} placeholder='Cidade' name='cidade' onKeyDown={(e)=>{if (e.key==='Enter'){document.getElementById('estado').focus();}}}/>
                                </div>
                            </div>
                            <div style={{width:'50%', paddingLeft:'5px'}}>                       
                                <div style={{padding:'0 10px', border:'1px solid '+this.state.inputs[8], borderRadius:'3px', backgroundColor:this.state.inputs[17]}}>    
                                    <input id='estado' style={{height:'30px', width:'100%', padding:'0px', lineHeight:'30px', fontSize:'14px', textAlign:'center', border:'0px', backgroundColor:'transparent'}} value={this.state.estado} onChange={this.inputHandler.bind(this)} placeholder='Estado' name='estado' onKeyDown={(e)=>{if (e.key==='Enter'){this.validateInputs();}}}/>
                                </div> 
                            </div>
                        </div>
                    </div> 
                    {this.displayErrors()}
                    {this.displaySuccess()}
                    <div style={{marginTop:'60px'}}>
                        <div style={{width:'fit-content', padding:'14px 45px', margin:'0 auto', borderRadius:'25px', color:'white', backgroundColor:'#3395F5', fontSize:'17px', backgroundColor:'#3395F5'}} onClick={()=>{this.validateInputs()}}>SALVAR</div>               
                    </div>
                </div>      
            </LoadScript>      
            <BottomMenu/>
        </div>);
    }
}
export default PaymentAddressPage;