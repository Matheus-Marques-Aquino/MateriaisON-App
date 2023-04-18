import React, { Component } from 'react';
import { CardBank } from '../../../imports/collections/cache/card_bank';
import { Profile } from '../../../imports/collections/profile';
import { Mask } from './widgets/masks';
import ErrorBox from './widgets/error_box';
import history from './widgets/history';
import { validate } from 'simple-card';

class PaymentBox extends Component{
    constructor(props){
        super(props)
        this.start = false;
        this.cardLoad = false;
        this.cardIndex = 0;
        this.error = '';
        this.state = {
            page: 0,
            cardArray: [],
            cpfCnpj: '',
            card:{},
            newCard: {            
                numero: '',
                nome: '',
                vencimento: '',
                cvv: '',
                cpfCnpj: ''
            },          
            installment: 1,            
            cardError: false,
            addressText: '',
            editIndex: -1,
            editId: -1,
            placeholderCard: ''   

        };
    }
    inputHandler(event){
        let value = event.target.value;
        let name = event.target.name;
        if (name == 'cpfCnpj'){             
            value = Mask('cpf/cnpj', event.target.value);
            this.props.cpfHandler(value);
        }
        if (this.state.page > 0){
            let card = this.state.newCard;
            switch(name){
                case 'nome':
                if (value.length > 0){
                    if (!(/^[A-zÀ-ú/\s]+$/.test(value))){
                        return;
                    }
                }
                break;
                case 'vencimento':
                    value = Mask('validate', event.target.value); 
                    break;
                case 'cvv':
                    if (value.length > 4){ return; }
                    break;
                case 'numero':
                    value = Mask('creditCard', event.target.value);
                    break;
                case 'cpfCnpj':
                    value = Mask('cpf/cnpj', event.target.value);
                    break;
                default:
                    return;
            }
            card[name] = value;
            this.setState({
                newCard: card
            });
            return;
        }
        this.setState({
            [name]: value
        });
    }
    getCardFlag(card) {
        var cardnumber = card.numero.replace(/[^0-9]+/g, '');
        var cards = {
            Visa      : /^4[0-9]{12}(?:[0-9]{3})/,
            MasterCard : /^5[1-5][0-9]{14}/,
            Diners    : /^3(?:0[0-5]|[68][0-9])[0-9]{11}/,
            Amex      : /^3[47][0-9]{13}/,
            Discover  : /^6(?:011|5[0-9]{2})[0-9]{12}/,
            HiperCard  : /^(606282\d{10}(\d{3})?)|(3841\d{15})/,
            Elo        : /^((((636368)|(438935)|(504175)|(451416)|(636297))\d{0,10})|((5067)|(4576)|(4011))\d{0,12})/
        };
        
        for (var flag in cards) {
            if(cards[flag].test(cardnumber)) {
                return flag;
            }
        } 
        return false;
    }
    editCard(index, id){
        this.setState({
            editIndex: index,
            editId: id,
            placeholderCard: '•••• •••• •••• '+this.state.cardArray[index].lastDigits,
            newCard:{
                numero: '',
                cvv: '',
                nome: this.state.cardArray[index].nome,
                vencimento: this.state.cardArray[index].vencimento,
                cpfCnpj: this.state.cardArray[index].cpfCnpj,
            },
            page: 3
        })
    }
    validateCard(card){
        if (card.numero == '' || card.cvv == '' || card.vencimento == ''){ 
            this.error = 'Nem todos os campos foram preenchidos.';
            return false; 
        }                
        let _card = {
            number: card.numero,
            cvn: this.state.newCard.cvv,
            date: card.vencimento
        }
        let cardData = (validate(_card));
        if (!cardData.isValid || cardData.isExpired){
            this.error = 'O cartão informado não é válido.';
            return false;
        }
        return true;
    }
    saveCard(){  
        this.error = '';          
        let card = {
            nome: this.state.newCard.nome, 
            numero: this.state.newCard.numero, 
            vencimento: this.state.newCard.vencimento, 
            cpfCnpj: this.state.newCard.cpfCnpj
        } 

        let valid = this.validateCard(card);
        if (!valid){
            this.setState({cardError: true})
            return;
        }

        if (!(/^\d{2}.\d{3}.\d{3}\/\d{4}\-\d{2}$/.test(card.cpfCnpj))){
            if (!(/^\d{3}.\d{3}.\d{3}\-\d{2}$/.test(card.cpfCnpj))){
                this.error='O CPF/CNPJ informado não é válido';
                this.setState({cardError: true});
                return;
            }
        }

        card.bandeira = this.getCardFlag(card);

        if (this.state.page == 2){
            Meteor.call('saveCard', Meteor.userId(), card, (error, result)=>{
                if (!error){
                    Meteor.call('getCard', Meteor.userId(), (error, result)=>{
                        this.cardIndex = result.length - 1;
                        this.setState({  
                            card: result[this.cardIndex],                      
                            cardArray: result,
                            newCard: {            
                                numero: '',
                                nome: '',
                                vencimento: '',
                                cvv: '',
                                cpfCnpj: ''
                            },
                            page: 1 
                        });
                    });
                }
            }); 
        }  
        if (this.state.page == 3){
            if (this.state.editId < 0 || this.state.editIndex < 0){
                this.setState({
                    editId: -1,
                    editIndex: -1,
                    newCard: {            
                        numero: '',
                        nome: '',
                        vencimento: '',
                        cvv: '',
                        cpfCnpj: ''
                    },
                    page: 1 
                });
                return;
            }
            Meteor.call('editCard', Meteor.userId(), this.state.editId, card, (error, result)=>{
                if (!error){
                    Meteor.call('getCard', Meteor.userId(), (error, result)=>{
                        this.cardIndex = this.state.editIndex;
                        this.setState({  
                            card: result[this.cardIndex],                      
                            cardArray: result,
                            editId: -1,
                            editIndex: -1,
                            newCard: {            
                                numero: '',
                                nome: '',
                                vencimento: '',
                                cvv: '',
                                cpfCnpj: ''
                            },
                            page: 1 
                        });
                    });
                }
            }); 
        }           
    }
    cardSelect(card, index){
        this.cardIndex = index;
        card.index = index;
        this.setState({ card: card });
    }
    closeBox(){
        this.setState({
            cardError: false
        });
    }
    displayError(){
        if (this.error == ''){
            return(<div></div>)
        }
        return(<div style={{color:'red', padding:'10px', paddingBottom:'0px', fontSize:'14px'}}>{this.error}</div>)
    }
    
    render(){
        var cardText = '';        
        var installment = this.props.installment;
        if (this.state.card){
            cardText = this.state.card.bandeira + ' terminado em ' + this.state.card.lastDigits;
        }
        if (!this.start){
            this.start = true;
            Meteor.subscribe('profileFields', 'CartPage', Meteor.userId(), ()=>{
                let profile = Profile.findOne({'_id': Meteor.userId()});                
                let address = profile.profile.address[profile.profile.mainAddress].address;
                let addressText = address.rua + ', ' + address.numero + ' - ' + address.bairro;
                if (!profile.profile.lastCpf){                    
                    if (!profile.profile.cpf){
                        this.setState({
                            addressText
                        });
                    }else{
                        this.props.cpfHandler(profile.profile.cpf);
                        this.setState({
                            addressText,                            
                            cpfCnpj: profile.profile.cpfCnpj
                        });
                    }                    
                }else{
                    this.props.cpfHandler(profile.profile.lastCpf);
                    this.setState({
                        addressText,                        
                        cpfCnpj: profile.profile.lastCpf
                    });
                }
            });
            Meteor.call('getCard', Meteor.userId(), (error, result)=>{
                if (!error){
                    if (result.length > 0){                        
                        this.setState({  
                            card: result[0],                      
                            cardArray: result
                        }); 
                        this.props.payment(this.state.card, this.cardIndex);
                    }                     
                }
            })             
        }
        if (this.state.page == 0){       
            if (this.state.card.lastDigits){
                return(<div>
                    <div style={{marginLeft:'10px', marginBottom:'10px', fontSize:'14px', fontWeight:'bold', color:'#555'}}>Pagamento e envio</div>
                    <div style={{backgroundColor:'white'}}>
                        <div style={{height:'40px', lineHeight:'40px', borderTop:'1px solid #ccc', borderBottom:'1px solid #ccc', padding:'0 10px', fontSize:'14px', display:'flex'}} onClick={()=>{history.push('/destinatarios/')}}>
                            <div style={{minWidth:'110px', height:'40px', lineHeight:'40px'}}>Entregar para:</div>
                            <div style={{margin:'auto 0', lineHeight:'14px', fontSize:'13px'}}>{this.state.addressText}</div>
                        </div>
                        <div style={{height:'40px', lineHeight:'40px', borderBottom:'1px solid #ccc', padding:'0 10px', fontSize:'14px', display:'flex', backgroundImage:'url(/imgs/rightArrow.png)', backgroundPositionY:'center', backgroundPositionX:'right', backgroundRepeat:'no-repeat'}} onClick={()=>{this.setState({page: 1})}}>
                            <div style={{minWidth:'110px', height:'40px', lineHeight:'40px'}}>Pagar com:</div>
                            <div style={{margin:'auto 0', lineHeight:'14px', fontSize:'13px'}}>{cardText}</div>
                        </div>
                        <div style={{height:'40px', lineHeight:'40px', borderBottom:'1px solid #ccc', padding:'0 10px', fontSize:'14px', display:'flex'}}>
                            <div style={{minWidth:'110px', height:'40px', lineHeight:'40px'}}>CPF/CNPJ:</div>
                            <div style={{height:'40px', width:'100%', lineHeight:'40px', display:'flex'}}>
                                <div style={{width:'100%', lineHeight:'28px', border:'1px solid #ccc', backgroundColor: 'white', margin:'auto 0px', display:'flex'}}>
                                    <div style={{padding:'0 10px', lineHeight:'28px', fontSize:'14px', width:'100%'}}>
                                        <input style={{width:'100%', height:'28px', border:'0px'}} value={this.state.cpfCnpj} onChange={this.inputHandler.bind(this)} name='cpfCnpj' placeholder='CPF/CNPJ'/>
                                    </div>                                    
                                </div> 
                            </div>
                        </div>
                        <div style={{height:'40px', lineHeight:'40px', borderBottom:'1px solid #ccc', padding:'0 10px', fontSize:'14px', display:'flex'}}>
                            <div style={{minWidth:'110px', height:'40px', lineHeight:'40px'}}>Parcelas:</div>
                            <div style={{height:'40px', width:'100%', lineHeight:'40px', display:'flex'}}>
                                <div style={{width:'100%', height: '28px', paddingLeft:'10px', lineHeight:'28px', border:'1px solid #ccc', backgroundColor: 'white', margin:'auto 0px', display:'flex'}} onClick={()=>{this.props.openSelect()}}>
                                    <div style={{marginLeft:'5px', lineHeight:'28px', fontSize:'14px'}}>{installment.parcel}x R${installment.price.toFixed(2).replace('.',',')}</div>
                                    <div style={{height:'20px', marginLeft:'auto', marginRight:'5px', fontSize:'16px'}}>▾</div>
                                </div> 
                            </div>
                        </div>
                    </div>
                </div>);
            }
            return(<div>
                <div style={{marginLeft:'10px', marginBottom:'10px', fontSize:'14px', fontWeight:'bold', color:'#555'}}>Pagamento e envio</div>
                <div style={{backgroundColor:'white'}}>
                    <div style={{height:'40px', lineHeight:'40px', borderTop:'1px solid #ccc', borderBottom:'1px solid #ccc', padding:'0 10px', fontSize:'14px', display:'flex'}} onClick={()=>{history.push('/destinatarios/')}}>
                        <div style={{minWidth:'110px', height:'40px', lineHeight:'40px'}}>Entregar para:</div>
                        <div style={{margin:'auto 0', lineHeight:'14px', fontSize:'13px'}}>{this.state.addressText}</div>
                    </div>
                    <div style={{height:'40px', lineHeight:'40px', borderBottom:'1px solid #ccc', padding:'0 10px', fontSize:'14px', display:'flex', backgroundImage:'url(/imgs/rightArrow.png)', backgroundPositionY:'center', backgroundPositionX:'right', backgroundRepeat:'no-repeat'}} onClick={()=>{this.setState({page: 1})}}>
                        <div style={{minWidth:'110px', height:'40px', lineHeight:'40px'}}>Pagar com:</div>
                        <div style={{margin:'auto 0', lineHeight:'14px', fontSize:'13px'}}>{cardText}</div>
                    </div>
                    <div style={{height:'40px', lineHeight:'40px', borderBottom:'1px solid #ccc', padding:'0 10px', fontSize:'14px', display:'flex'}}>
                        <div style={{minWidth:'110px', height:'40px', lineHeight:'40px'}}>CPF/CNPJ:</div>
                        <div style={{height:'40px', width:'100%', lineHeight:'40px', display:'flex'}}>
                            <div style={{width:'100%', lineHeight:'28px', border:'1px solid #ccc', backgroundColor: 'white', margin:'auto 0px', display:'flex'}}>
                                <div style={{padding:'0 10px', lineHeight:'28px', fontSize:'14px', width:'100%'}}>
                                    <input style={{width:'100%', height:'28px', border:'0px'}} value={this.state.cpfCnpj} onChange={this.inputHandler.bind(this)} name='cpfCnpj' placeholder='CPF/CNPJ'/>
                                </div>                                    
                            </div> 
                        </div>
                    </div>
                    <div style={{height:'40px', lineHeight:'40px', borderBottom:'1px solid #ccc', padding:'0 10px', fontSize:'14px', display:'flex'}}>
                        <div style={{minWidth:'110px', height:'40px', lineHeight:'40px'}}>Parcelas:</div>
                        <div style={{height:'40px', width:'100%', lineHeight:'40px', display:'flex'}}>
                            <div style={{width:'100%', height: '28px', paddingLeft:'10px', lineHeight:'28px', border:'1px solid #ccc', backgroundColor: 'white', margin:'auto 0px', display:'flex'}} onClick={()=>{this.props.openSelect()}}>
                                <div style={{marginLeft:'5px', lineHeight:'28px', fontSize:'14px'}}>{installment.parcel}x R${installment.price.toFixed(2).replace('.',',')}</div>
                                <div style={{height:'20px', marginLeft:'auto', marginRight:'5px', fontSize:'16px'}}>▾</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>)
        }
        if (this.state.page == 1){            

            let button = 'Fechar';            
            if ( this.state.cardArray.length > 0 ){ button = 'Selecionar'; }
            return(<div>
                <div style={{marginLeft:'10px', marginBottom:'10px', fontSize:'14px', fontWeight:'bold', color:'#555'}}>Métodos de pagamento</div>
                <div style={{backgroundColor:'white', padding:'5px 0', borderTop:'1px solid #ccc', borderBottom:'1px solid #ccc'}}>
                    {
                        this.state.cardArray.map((card, index)=>{
                            let _cardImage = 'url(/imgs/creditCard20x32.png)';
                            if (card.bandeira){
                                if (card.bandeira == 'MasterCard'){
                                    _cardImage = 'url(/imgs/masterCard20x32.png)';
                                }
                                if (card.bandeira == 'Visa'){
                                    _cardImage = 'url(/imgs/visa20x32.png)';
                                }
                                if (card.bandeira == 'Elo'){
                                    _cardImage = 'url(/imgs/elo20x32.png)';
                                }                                
                            }
                            let key = 'Cartao_'+index;                        
                            if (index == this.cardIndex){
                                return(
                                <div style={{height:'35px', lineHeight:'35px', borderTop:'1px solid #ccc', borderBottom:'1px solid #ccc', padding:'0 10px', fontSize:'14px', display:'flex', marginTop:'10px'}} key={key}>
                                    <div style={{height:'12px', width:'12px', borderRadius:'50%', border:'2px solid #ff7000', margin:'auto 5px', marginRight:'15px', display:'flex'}}>
                                        <div style={{width:'8px', height:'8px', margin:'auto', borderRadius:'50%', backgroundColor:'#ff7000'}}></div>
                                    </div>                                
                                    <div style={{width:'32px' ,height:'20px', margin:'auto 0', marginRight:'10px', backgroundImage:_cardImage, backgroundRepeat:'no-repeat', backgroundPosition:'center'}}></div>
                                    {card.bandeira+' '}•••• {card.lastDigits}    
                                    <div style={{width:'20px', height:'20px', margin:'auto 0', marginLeft:'auto', marginRight:'10px', backgroundImage:'url(/imgs/pencil30x30.png)', backgroundPosition:'center', backgroundSize:'contain', backgroundRepeat:'no-repeat'}} onClick={()=>{this.editCard(index, card.id)}}></div>                                
                                </div>)
                            }
                            return(
                            <div style={{height:'35px', lineHeight:'35px', borderTop:'1px solid #ccc', borderBottom:'1px solid #ccc', padding:'0 10px', fontSize:'14px', display:'flex', marginTop:'10px'}} onClick={()=>{this.cardSelect(card, index)}} key={key}>
                                <div style={{height:'12px', width:'12px', borderRadius:'50%', border:'2px solid #b3b3b3', margin:'auto 5px', marginRight:'15px'}}></div>
                                <div style={{width:'32px' ,height:'20px', margin:'auto 0', marginRight:'10px', backgroundImage:_cardImage, backgroundRepeat:'no-repeat', backgroundPosition:'center'}}></div>
                                {card.bandeira+' '}•••• {card.lastDigits}  
                                <div style={{width:'20px', height:'20px', margin:'auto 0', marginLeft:'auto', marginRight:'10px', backgroundImage:'url(/imgs/pencil30x30.png)', backgroundPosition:'center', backgroundSize:'contain', backgroundRepeat:'no-repeat'}} onClick={()=>{this.editCard(index, card.id)}}></div>                              
                            </div>)
                        })
                    }                
                    <div style={{height:'35px', lineHeight:'35px', borderTop:'1px solid #ccc', borderBottom:'1px solid #ccc', padding:'0 10px', fontSize:'14px', display:'flex', marginTop:'10px', marginBottom:'15px'}} onClick={()=>{this.setState({page: 2})}}><div style={{width:'25px' ,height:'25px', margin:'auto 0', marginRight:'10px', backgroundImage:'url(imgs/add.png)', backgroundRepeat:'no-repeat', backgroundPosition:'center'}}></div>Adicionar cartão de crédito</div>
                    <div style={{height:'30px', width:'120px', lineHeight:'30px', textAlign:'center', border:'2px solid #ff7000', borderRadius:'25px 0px', fontSize:'14px', margin:'0 auto', marginTop:'15px', marginBottom:'10px', color:'white', backgroundColor:'#ff7000', fontWeight:'bold'}} onClick={()=>{this.setState({page: 0}); this.props.payment(this.state.card, this.cardIndex);}}>{button}</div>
                </div>
            </div>)
        }
        if (this.state.page == 2){
            return(<div>
                <div style={{marginLeft:'10px', marginBottom:'10px', fontSize:'14px', fontWeight:'bold', color:'#555'}}>Novo método de pagamento</div>
                <div style={{padding:'10px', borderTop:'1px solid #ccc', borderBottom:'1px solid #ccc', backgroundColor:'white'}}>
                    <span style={{fontSize:'13px', lineHeight:'25px'}}>Número do cartão de crédito</span>
                    <div style={{padding:'0 10px', border:'1px solid #888', backgroundColor:'white'}}>
                        <input style={{height:'25px', width:'100%', lineHeight:'25px', fontSize:'14px', verticalAlign:'middle', border:'0px'}} placeholder='Número do cartão de crédito' value={this.state.newCard.numero} onChange={this.inputHandler.bind(this)} name='numero'/>
                    </div>                
                    <div style={{display: 'flex', marginTop:'5px'}}>
                        <div style={{width:'50%', paddingRight:'5px'}}>
                            <span style={{fontSize:'13px', lineHeight:'25px'}}>Vencimento (MM/AA)</span>
                            <div style={{padding:'0 10px', border:'1px solid #888', backgroundColor:'white'}}>
                                <input style={{height:'25px', width:'100%', lineHeight:'25px', fontSize:'14px', verticalAlign:'middle', border:'0px'}} placeholder='MM/AA' value={this.state.newCard.vencimento} onChange={this.inputHandler.bind(this)} name='vencimento'/>
                            </div>
                        </div>
                        <div style={{width:'50%', paddingLeft:'5px'}}>
                            <span style={{fontSize:'13px', lineHeight:'25px'}}>Código de Segurança</span>
                            <div style={{padding:'0 10px', border:'1px solid #888', backgroundColor:'white'}}>
                                <input style={{height:'25px', width:'100%', lineHeight:'25px', fontSize:'14px', verticalAlign:'middle', border:'0px'}} placeholder='CVV' value={this.state.newCard.cvv} onChange={this.inputHandler.bind(this)} name='cvv'/>
                            </div>
                        </div>
                    </div>
                    <span style={{fontSize:'13px', lineHeight:'25px'}}>Nome como esta no cartão</span>
                    <div style={{padding:'0 10px', border:'1px solid #888', backgroundColor:'white'}}>
                        <input style={{height:'25px', width:'100%', lineHeight:'25px', fontSize:'14px', verticalAlign:'middle', border:'0px'}} placeholder='Nome do titular' value={this.state.newCard.nome} onChange={this.inputHandler.bind(this)} name='nome'/>
                    </div>
                    <div style={{marginTop:'5px'}}>
                        <span style={{fontSize:'13px', lineHeight:'25px'}}>CPF/CNPJ</span>
                        <div style={{padding:'0 10px', border:'1px solid #888', backgroundColor:'white'}}>
                            <input style={{height:'25px', width:'100%', lineHeight:'25px', fontSize:'14px', verticalAlign:'middle', border:'0px'}} placeholder='CPF/CNPJ' value={this.state.newCard.cpfCnpj} onChange={this.inputHandler.bind(this)} name='cpfCnpj'/>
                        </div>
                    </div> 
                    {this.displayError()}
                    <div style={{width:'100%', display:'flex'}}>
                    <div style={{margin:'20px auto', width:'140px', padding:'8px 0', border:'2px solid #ff7000', borderRadius:'25px 0px', textAlign:'center', fontSize:'14px', fontWeight:'bold', color:'white', backgroundColor:'#ff7000'}} onClick={()=>{this.setState({ page: 1, newCard:{ numero:'', vencimento:'', cvv:'', nome:'', cpfCnpj:'' }})}}>Voltar</div>
                    <div style={{margin:'20px auto', width:'140px', padding:'8px 0', border:'2px solid #ff7000', borderRadius:'25px 0px', textAlign:'center', fontSize:'14px', fontWeight:'bold', color:'white', backgroundColor:'#ff7000'}} onClick={()=>{this.saveCard()}}>Salvar</div>
                    </div>
                </div>                            
            </div>)
        }
        if (this.state.page == 3){
            return(<div>
                <div style={{marginLeft:'10px', marginBottom:'10px', fontSize:'14px', fontWeight:'bold', color:'#555'}}>Editando método de pagamento</div>
                <div style={{padding:'10px', borderTop:'1px solid #ccc', borderBottom:'1px solid #ccc', backgroundColor:'white'}}>
                    <span style={{fontSize:'13px', lineHeight:'25px'}}>Número do cartão de crédito</span>
                    <div style={{padding:'0 10px', border:'1px solid #888', backgroundColor:'white'}}>
                        <input style={{height:'25px', width:'100%', lineHeight:'25px', fontSize:'14px', verticalAlign:'middle', border:'0px'}} placeholder={this.state.placeholderCard} value={this.state.newCard.numero} onChange={this.inputHandler.bind(this)} name='numero'/>
                    </div>                
                    <div style={{display: 'flex', marginTop:'5px'}}>
                        <div style={{width:'50%', paddingRight:'5px'}}>
                            <span style={{fontSize:'13px', lineHeight:'25px'}}>Vencimento (MM/AA)</span>
                            <div style={{padding:'0 10px', border:'1px solid #888', backgroundColor:'white'}}>
                                <input style={{height:'25px', width:'100%', lineHeight:'25px', fontSize:'14px', verticalAlign:'middle', border:'0px'}} placeholder='MM/AA' value={this.state.newCard.vencimento} onChange={this.inputHandler.bind(this)} name='vencimento'/>
                            </div>
                        </div>
                        <div style={{width:'50%', paddingLeft:'5px'}}>
                            <span style={{fontSize:'13px', lineHeight:'25px'}}>Código de Segurança</span>
                            <div style={{padding:'0 10px', border:'1px solid #888', backgroundColor:'white'}}>
                                <input style={{height:'25px', width:'100%', lineHeight:'25px', fontSize:'14px', verticalAlign:'middle', border:'0px'}} placeholder='CVV' value={this.state.newCard.cvv} onChange={this.inputHandler.bind(this)} name='cvv'/>
                            </div>
                        </div>
                    </div>
                    <span style={{fontSize:'13px', lineHeight:'25px'}}>Nome como esta no cartão</span>
                    <div style={{padding:'0 10px', border:'1px solid #888', backgroundColor:'white'}}>
                        <input style={{height:'25px', width:'100%', lineHeight:'25px', fontSize:'14px', verticalAlign:'middle', border:'0px'}} placeholder='Nome do titular' value={this.state.newCard.nome} onChange={this.inputHandler.bind(this)} name='nome'/>
                    </div>
                    <div style={{marginTop:'5px'}}>
                        <span style={{fontSize:'13px', lineHeight:'25px'}}>CPF/CNPJ</span>
                        <div style={{padding:'0 10px', border:'1px solid #888', backgroundColor:'white'}}>
                            <input style={{height:'25px', width:'100%', lineHeight:'25px', fontSize:'14px', verticalAlign:'middle', border:'0px'}} placeholder='CPF/CNPJ' value={this.state.newCard.cpfCnpj} onChange={this.inputHandler.bind(this)} name='cpfCnpj'/>
                        </div>
                    </div> 
                    {this.displayError()}
                    <div style={{width:'100%', display:'flex'}}>
                    <div style={{margin:'20px auto', width:'140px', padding:'8px 0', border:'2px solid #ff7000', borderRadius:'25px 0px', textAlign:'center', fontSize:'14px', fontWeight:'bold', color:'white', backgroundColor:'#ff7000'}} onClick={()=>{this.setState({ page: 1, newCard:{ numero:'', vencimento:'', cvv:'', nome:'', cpfCnpj:'' }})}}>Voltar</div>
                    <div style={{margin:'20px auto', width:'140px', padding:'8px 0', border:'2px solid #ff7000', borderRadius:'25px 0px', textAlign:'center', fontSize:'14px', fontWeight:'bold', color:'white', backgroundColor:'#ff7000'}} onClick={()=>{this.saveCard()}}>Salvar</div>
                    </div>
                </div>            
            </div>)
        }
    }
}
export default PaymentBox;