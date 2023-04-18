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
        this.cardIndex = 0;
        this.error = '';
        this.state = {
            page: 0,
            cardArray: [],
            card: {},
            newCard:{ numero: '', cvv: '', nome: '', vencimento: '', cpfCnpj: ''},
            addressText: '',
            cpfCnpj: '',
            placeholder: ''            
        };
    }
    inputHandler(event){
        let value = event.target.value;
        let name = event.target.name;
        if (name == 'cpfCnpj'){             
            value = Mask('cpf/cnpj', event.target.value);
            this.props.cpfHandler(value);
        }
        this.setState({
            [name]: value
        });
    }
    displayError(){
        if (this.error == ''){
            return(<div></div>)
        }
        return(<div style={{color:'red', padding:'10px', paddingBottom:'0px', fontSize:'14px'}}>{this.error}</div>)
    }
    goToIndex(index){
        if (index == 0){ history.push('/destinatarios/'); }
        if (index == 1){ this.setState({page: 1}); }
    }
    cardSelect(card, index){
        if (index != this.cardIndex){
            this.cardIndex = index;
            card.index = index;
            this.setState({ card: card });
        }
    }
    editCard(index, id){
        this.error = '';
        this.setState({
            editIndex: index,
            editId: id,
            placeholder: '•••• •••• •••• '+this.state.cardArray[index].lastDigits,
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
    saveCard(){  
        this.error = '';          
        let card = { nome: this.state.newCard.nome, numero: this.state.newCard.numero, 
            vencimento: this.state.newCard.vencimento, cpfCnpj: this.state.newCard.cpfCnpj } 

        let valid = this.validateCard(card);
        if (!valid){ this.setState({cardError: true}); return; }

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
                            card: result[this.cardIndex], cardArray: result,
                            newCard: { numero: '', nome: '', vencimento: '', cvv: '', cpfCnpj: '' },
                            page: 1 
                        });
                    });
                }
            }); 
        }  
        if (this.state.page == 3){
            if (this.state.editId < 0 || this.state.editIndex < 0){
                this.setState({
                    editId: -1, editIndex: -1,
                    newCard: { numero: '', nome: '', vencimento: '', cvv: '', cpfCnpj: '' },
                    page: 1 
                });
                return;
            }
            Meteor.call('editCard', Meteor.userId(), this.state.editId, card, (error, result)=>{
                if (!error){
                    Meteor.call('getCard', Meteor.userId(), (error, result)=>{
                        this.cardIndex = this.state.editIndex;
                        this.setState({ card: result[this.cardIndex], cardArray: result,
                            editId: -1, editIndex: -1,
                            newCard: { numero: '', nome: '', vencimento: '', cvv: '', cpfCnpj: '' },
                            page: 1 
                        });
                    });
                }
            }); 
        }           
    }
    frontGenerator(){
        var cardText = '';
        if (this.state.card.bandeira && this.state.card.lastDigits){
            cardText = this.state.card.bandeira + ' terminado em ' + this.state.card.lastDigits;
        }        
        var addressText = this.state.addressText;
        var installment = this.props.installment;
        var labels = ['Entregar para:', 'Pagar com:', 'CPF/CNPJ:', 'Parcelas:'];
        var inputs = [addressText, cardText, '', ''];
        var displayInput = ['none', 'block', 'block', 'none'];
        var displaySelect = ['none', 'none', 'none', 'flex'];        
        return(<div>
            {
                labels.map((label, index)=>{
                    let key = 'input_'+index;            
                    let display = 'none';
                    let _display = 'flex';
                    if (index > 1){                
                        display = 'flex';
                        _display = 'none';
                    }            
                    return(            
                    <div style={{display:'flex', borderBottom:'1px solid #FFDBBF', fontSize:'13px'}} key={key}>
                        <div style={{minWidth: '100px', height:'40px', display:'flex'}}>
                            <div style={{margin:'auto 0'}}>{label}</div>
                        </div>
                        <div style={{width:'100%', height:'40px', fontSize:'12px', display:_display}} onClick={()=>{ this.goToIndex(index); }}>
                            <div style={{margin:'auto 0'}}>{inputs[index]}</div>
                            <div style={{width:'10px', height:'10px', margin:'auto 0', marginLeft:'auto', display:displayInput[index], backgroundImage:'url(/imgs/icons/icon-rightArrow.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></div>
                        </div>
                        <div style={{height:'30px', width:'100%', paddingLeft:'15px', margin:'auto 0', lineHeight:'30px', border:'1px solid #ff7000', borderRadius:'3px', backgroundColor:'white', display:display}}>
                            <input style={{width:'100%', height:'30px', border:'0px', padding:'0px', display:displayInput[index]}} value={this.state.cpfCnpj} onChange={this.inputHandler.bind(this)} name='cpfCnpj' placeholder='CPF/CNPJ'/>
                            <div style={{width:'100%', height: '30px', lineHeight:'30px', margin:'auto 0px', display:displaySelect[index]}} onClick={()=>{this.props.openSelect()}}>
                                <div>{installment.parcel}x R$ {installment.price.toFixed(2).replace('.',',')}</div>
                                <div style={{height:'30px', width:'12px', marginLeft:'auto', marginRight:'10px', backgroundImage:'url("/imgs/icons/icon-downArrow.png")', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></div>
                            </div>
                        </div>
                    </div>)
                })
            }
        </div>)        
    }
    listGenerator(){
        var cardArray = this.state.cardArray;
        return(<div style={{lineHeight:'35px', fontSize:'14px'}}>
            {
                cardArray.map((card, index)=>{
                    let cardImage = 'url(/imgs/icons/icon-simpleCard.png)';
                    let select = ['none', '#b3b3b3'];
                    let key = 'cards_'+index;
                    if (card.bandeira){
                        switch(card.bandeira){
                            case 'MasterCard':
                                cardImage = 'url(/imgs/masterCard20x32.png)';
                                break;
                            case 'Visa':
                                cardImage = 'url(/imgs/visa20x32.png)';
                                break;
                            case 'Elo':
                                cardImage = 'url(/imgs/elo20x32.png)';
                                break;
                        }
                    }
                    if (index == this.cardIndex){ select = ['block', '#ff7000']; }
                    return(
                    <div style={{height:'34px', marginTop:'10px', borderBottom:'1px solid #FFDBBF', borderTop:'1px solid #FFDBBF', display:'flex'}} onClick={()=>{this.cardSelect(card, index)}} key={key}>
                        <div style={{height:'12px', width:'12px', borderRadius:'50%', border:'2px solid '+select[1], margin:'auto 5px', marginRight:'15px', display:'flex'}}>
                            <div style={{width:'8px', height:'8px', margin:'auto', borderRadius:'50%', backgroundColor:'#ff7000', display:select[0]}}></div>
                        </div>
                        <div style={{width:'32px', height:'20px', margin:'auto 0', marginRight:'10px', backgroundImage:cardImage, backgroundRepeat:'no-repeat', backgroundPosition:'center'}}></div>
                        {card.bandeira+' '}•••• {card.lastDigits}    
                        <div style={{width:'25px', height:'23px', margin:'auto 0', marginLeft:'auto', marginRight:'10px', backgroundImage:'url(/imgs/lapis1.png)', backgroundPosition:'center', backgroundSize:'contain', backgroundRepeat:'no-repeat'}} onClick={()=>{this.editCard(index, card.id)}}></div>
                    </div>);                
                })
            }
        </div>);
    }
    formGenerator(type){
        var placeholder = 'NÚMERO DO CARTÃO'
        if (type == 1){
            placeholder = this.state.placeholder
        }
        return(
        <div style={{padding:'10px'}}>
            <div style={{padding:'0 10px', border:'1px solid #ff7000', borderRadius:'3px', backgroundColor:'white'}}>
                <input style={{height:'30px', width:'100%', lineHeight:'30px', fontSize:'14px', textAlign:'center', border:'0px'}} placeholder={placeholder} value={this.state.newCard.numero} onChange={this.inputHandler.bind(this)} name='numero'/>
            </div>
            <div style={{display: 'flex', marginTop:'10px'}}>
                <div style={{width:'50%', paddingRight:'5px'}}>
                    <div style={{padding:'0 10px', border:'1px solid #ff7000', borderRadius:'3px', backgroundColor:'white'}}>
                        <input className='tinyInput' style={{height:'30px', width:'100%', lineHeight:'30px', fontSize:'14px', textAlign:'center', border:'0px'}} placeholder='VENCIMENTO (MM/AA)' value={this.state.newCard.vencimento} onChange={this.inputHandler.bind(this)} name='vencimento'/>
                    </div>
                </div>
                <div style={{width:'50%', paddingLeft:'5px'}}>
                    <div style={{padding:'0 10px', border:'1px solid #ff7000', borderRadius:'3px', backgroundColor:'white'}}>
                        <input className='smallInput' style={{height:'30px', width:'100%', lineHeight:'30px', fontSize:'14px', textAlign:'center', border:'0px'}} placeholder='CVV' value={this.state.newCard.cvv} onChange={this.inputHandler.bind(this)} name='cvv'/>
                    </div>
                </div>
            </div>
            <div style={{padding:'0 10px', marginTop:'10px', border:'1px solid #ff7000', borderRadius:'3px', backgroundColor:'white'}}>
                <input style={{height:'30px', width:'100%', lineHeight:'30px', fontSize:'14px', textAlign:'center', border:'0px'}} placeholder='NOME COMO ESTÁ NO CARTÃO' value={this.state.newCard.nome} onChange={this.inputHandler.bind(this)} name='nome'/>
            </div>
            <div style={{padding:'0 10px', marginTop:'10px', border:'1px solid #ff7000', borderRadius:'3px', backgroundColor:'white'}}>
                <input style={{height:'30px', width:'100%', lineHeight:'30px', fontSize:'14px', textAlign:'center', border:'0px'}} placeholder='CPF/CNPJ' value={this.state.newCard.cpfCnpj} onChange={this.inputHandler.bind(this)} name='cpfCnpj'/>
            </div>
            {this.displayError()}
            <div style={{display:'flex', marginTop:'10px'}}>
                <div style={{height:'25px', width:'110px', lineHeight:'25px', textAlign:'center', border:'2px solid #ff7000', borderRadius:'25px', fontSize:'14px', margin:'0 auto', marginTop:'15px', marginBottom:'10px', color:'white', backgroundColor:'#ff7000'}} onClick={()=>{this.setState({ page: 1, newCard:{ numero:'', vencimento:'', cvv:'', nome:'', cpfCnpj:'' }})}}>Voltar</div>
                <div style={{height:'25px', width:'110px', lineHeight:'25px', textAlign:'center', border:'2px solid #ff7000', borderRadius:'25px', fontSize:'14px', margin:'0 auto', marginTop:'15px', marginBottom:'10px', color:'white', backgroundColor:'#ff7000'}} onClick={()=>{this.saveCard()}}>Salvar</div>
            </div>            
        </div>)
    }
    pageManager(page){
        switch(page){
            case 0:
                return(
                <div style={{margin:'0 5px', borderTop:'1px solid #FFDBBF'}}>
                    {this.frontGenerator()}
                </div>)
                break;
            case 1:
                let button = 'Fechar';
                if ( this.state.cardArray.length > 0 ){ button = 'Selecionar'; }
                return(
                <div>
                    {this.listGenerator()}
                    <div style={{display:'flex', marginTop:'15px'}}>
                        <div style={{height:'25px', width:'110px', lineHeight:'25px', textAlign:'center', border:'2px solid #ff7000', borderRadius:'25px', fontSize:'14px', margin:'0 auto', marginTop:'15px', marginBottom:'10px', color:'white', backgroundColor:'#ff7000'}} onClick={()=>{this.error = ''; this.setState({page: 2}); this.props.payment(this.state.card, this.cardIndex);}}>Adicionar</div>
                        <div style={{height:'25px', width:'110px', lineHeight:'25px', textAlign:'center', border:'2px solid #ff7000', borderRadius:'25px', fontSize:'14px', margin:'0 auto', marginTop:'15px', marginBottom:'10px', color:'white', backgroundColor:'#ff7000'}} onClick={()=>{this.setState({page: 0}); this.props.payment(this.state.card, this.cardIndex);}}>{button}</div>
                    </div>
                </div>)                
                break;
            case 2:
                return(<div>{this.formGenerator(0)}</div>)
                break;
            case 3:
                return(<div>{this.formGenerator(1)}</div>)
                break;
            
        }
    }
    render(){
        if (!this.start){
            this.start = true;
            Meteor.subscribe('profileFields', 'CartPage', Meteor.userId(), ()=>{
                let profile = Profile.findOne({'_id': Meteor.userId()}); 
                profile = profile.profile  ;
                let address = profile.address[profile.mainAddress].address;
                let addressText = address.rua + ', ' + address.numero + ' - ' + address.bairro;
                if (!profile.lastCpf){
                    if (!profile.cpf){ 
                        this.setState({ addressText }); 
                    }else{
                        this.props.cpfHandler(profile.cpf);
                        this.setState({ addressText, cpfCnpj: profile.cpfCnpj});
                    }
                }else{
                    this.props.cpfHandler(profile.lastCpf);
                    this.setState({ addressText, cpfCnpj: profile.lastCpf });
                }
            });
            Meteor.call('getCard', Meteor.userId(), (error, result)=>{
                if (!error){
                    if (result.length > 0){                
                        this.setState({ card: result[0], cardArray: result }); 
                        this.props.payment(this.state.card, this.cardIndex);
                    }                     
                }
            });            
        }     
        var titleArray = ['Pagamento e envio', 'Métodos de pagamento', 'Novo método de pagamento', 'Editando método de pagamento'];
        var page = this.state.page;
        return(<div style={{padding:'10px', backgroundColor:'#F7F7F7'}}>
            <div style={{marginBottom:'20px', fontSize:'15px', fontWeight:'bold', color:'#ff7000', display:'flex'}}>
                <div style={{width:'10px', height:'10px', margin:'auto 0', backgroundImage:'url(/imgs/icons/icon-rightArrow.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></div>
                <div style={{marginLeft:'5px'}}>{titleArray[page]}</div>                        
            </div>
            {this.pageManager(page)}
        </div>);
    }
}

export default PaymentBox;