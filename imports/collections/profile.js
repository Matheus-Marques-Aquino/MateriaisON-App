import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import moment from 'moment';

var coordsSchema = new SimpleSchema({
    lat: { type: String },
    lng: { type: String }
});
var addressSchema = new SimpleSchema({
    name: { type: String },
    address: { type: Array },
    'address.$': { type: String },
    coords: { type: Array },
    'coords.$': { type: coordsSchema }
});
Meteor.methods({
    'profile.update': function(data){
        myProfile = Profile.findOne({'_id': Meteor.userId()})
        if (!myProfile){ 
            throw new Meteor.Error('5001', 'Ocorreu um erro na autenticação de usuário.'); 
        }
        let email = data.email.toLowerCase();        
        if (myProfile.username != email){
            throw new Meteor.Error('5002', 'Ocorreu um erro na autenticação do endereço de e-mail.');
        }
        let phone = data.phone;
        if (phone == ''){
            throw new Meteor.Error('5004', 'O número de celular informado não é válido.');
        } 
        if (!(/^(\([0-9]{2}\)([0-9]{5}|[0-9]{4}))\-[0-9]{4}/.test(phone))){
            throw new Meteor.Error('5004', 'O número de celular informado não é válido.');
        }        
        let cpfCnpj = data.cpfCnpj;
        if (cpfCnpj.length > 0){
            if (!(/^\d{2}.\d{3}.\d{3}\/\d{4}\-\d{2}$/.test(cpfCnpj))){            
                if (!(/^\d{3}.\d{3}.\d{3}\-\d{2}$/.test(cpfCnpj))){                
                    throw new Meteor.Error('5005', 'O CPF/CNPJ informado não é válido.');
                }
            }
        }        
        let birthday = data.birthday;
        if (birthday.length > 0){
            if (!(/^[0-9]{2}\/[0-9]{2}\/[0-9]{4}/.test(birthday))){
                throw new Meteor.Error('5006', 'A data de nascimento informada não esta em um formato válido(DD/MM/AAAA).');
            }  
            if (!moment(birthday, 'DD/MM/YYYY',true).isValid()){
                throw new Meteor.Error('5007', 'A data de nascimento informada não esta em um formato válido (Dia/Mês/Ano).');
            }
        }        
        let name = data.name;
        if (!(/^[A-zÀ-ú/\s]+$/.test(name))){
            throw new Meteor.Error('5007', 'Seu nome não pode conter caracteres especiais.');
        }        
        return Profile.update({_id: Meteor.userId()}, {$set: {
            'profile.name': data.name,
            'profile.cpfCnpj': data.cpfCnpj,
            'profile.birthday': data.birthday,
            'profile.phone': data.phone
            }
        });
    },
    'profile.create.address': function(){
        var myProfile = Profile.findOne({_id: Meteor.userId()}) 
        if (!myProfile.profile.address){
            return Profile.update({_id: Meteor.userId()}, {$set: {
                'profile.address': []
            }})
        }        
    },
    'profile.insert.address': function(data){
        var myProfile = Profile.findOne({_id: Meteor.userId()})
        var listLength = 0;
        if (myProfile){
            if (myProfile.profile.address){
                listLength = myProfile.profile.address.length;               
            }
        }
        if (!Meteor.userId()){
            throw new Meteor.Error('profile.addressText.unauthorized', 'Você deve estar logado para fazer isto');
        }
        if (data.name.length < 3){
            throw new Meteor.Error('profile.addressText.unauthorized', 'O campo nome deve ser preenchido e ter no mínimo 3 caracteres');
        }
        if (data.address.rua == '' || data.address.numero == '' || data.address.cidade == '' || data.address.uf == '' || data.address.pais == '' || 
        data.coords.selected == '' || data.coords.selected == '' || data.coords.address == '' || data.coords.address == ''){
            throw new Meteor.Error('profile.addressText.unauthorized', 'Houve um erro na verificação de seu endereço, tente novamente')
        }
        data.name = data.name.charAt(0).toUpperCase() + data.name.slice(1);

        return Profile.update({_id: Meteor.userId()}, {$push: { 'profile.address': data }, $set: { 'profile.mainAddress': listLength }} );    
    },
    'profile.select.address': function(index){

        if (!Meteor.userId()){
            throw new Meteor.Error('profile.addressText.unauthorized', 'Você deve estar logado para fazer isto');
        }
        var myProfile = Profile.findOne({_id: Meteor.userId()})
        if (!myProfile){
            throw new Meteor.Error('profile.addressText.unauthorized', 'Houve um erro verificação de usuário, tente novamente mais tarde');
        }
        if (myProfile.profile.address.length - 1 < index){
            throw new Meteor.Error('profile.addressText.unauthorized', 'Destinatario inválido');
        }        
        return Profile.update({_id: Meteor.userId()}, {$set:{'profile.mainAddress': index}});
    },
    'profile.remove.address': function(data, index){

        if (!Meteor.userId()){
            throw new Meteor.Error('profile.addressText.unauthorized', 'Você deve estar logado para fazer isto');
        }
        var myProfile = Profile.findOne({_id: Meteor.userId()})
        if (!myProfile){
            throw new Meteor.Error('profile.addressText.unauthorized', 'Houve um erro verificação de usuário, tente novamente mais tarde');
        }
        if (myProfile.profile.address.length - 1 < index){
            throw new Meteor.Error('profile.addressText.unauthorized', 'Destinatario inválido');
        }
        if (myProfile.profile.mainAddress == index){
            throw new Meteor.Error('profile.addressText.unauthorized', 'Selecione outro destinario antes de deletar o atual');
        }
        if (myProfile.profile.mainAddress > index){
            return Profile.update({_id: Meteor.userId()}, {$inc:{'profile.mainAddress': -1}, $pull:{'profile.address': data}});            
        }else{
            return Profile.update({_id: Meteor.userId()}, {$pull:{'profile.address': data}});
        }
    },
    'profile.remove.nullAddress': function(index){
        if (!Meteor.userId()){
            throw new Meteor.Error('profile.addressText.unauthorized', 'Você deve estar logado para fazer isto');
        }
        var myProfile = Profile.findOne({_id: Meteor.userId()})
        if (!myProfile){
            throw new Meteor.Error('profile.addressText.unauthorized', 'Houve um erro verificação de usuário, tente novamente mais tarde');
        }        
        return Profile.update({_id: Meteor.userId()}, {$pull:{'profile.address': null}});
    },
    'profile.update.paymentAddress': function(profile){
        if (!Meteor.userId()){
            throw new Meteor.Error('profile.addressText.unauthorized', 'Você deve estar logado para fazer isto');
        }
        var myProfile = Profile.findOne({_id: Meteor.userId()})
        if (!myProfile){
            throw new Meteor.Error('profile.addressText.unauthorized', 'Houve um erro verificação de usuário, tente novamente mais tarde');
        }
        if (!profile.enabled){
            return Profile.update({_id: Meteor.userId()}, {$set:{'profile.paymentAddress.enabled': false}});
        }
        if (profile.nome == '' || profile.nome == undefined || profile.nome.length < 3){
            throw new Meteor.Error('Autenticação dos dados', 'O campo Nome é obrigatório.');
        }else{
            if (!(/^[A-zÀ-ú/\s]+$/.test(profile.nome))){
                throw new Meteor.Error('Autenticação dos dados', 'O campo nome não deve conter caracteres especiais.');
            }
        }
        if (profile.sobrenome == '' || profile.sobrenome == undefined || profile.sobrenome.length < 3){
            throw new Meteor.Error('Autenticação dos dados', 'O campo Sobrenome é obrigatório.');
        }else{
            if (!(/^[A-zÀ-ú/\s]+$/.test(profile.sobrenome))){
                throw new Meteor.Error('Autenticação dos dados', 'O campo sobrenome não deve conter caracteres especiais.');
            }
        }
        if (profile.cep == '' || profile.cep == undefined || profile.cep.length < 9){
            throw new Meteor.Error('Autenticação dos dados', 'O campo CEP é obrigatório.');
        }else{
            if (!(/^\d{5}-\d{3}$/.test(profile.cep))){
                throw new Meteor.Error('Autenticação dos dados', 'O campo CEP não esta preenchido corretamente.');
            }
        }
        if (profile.rua == '' || profile.rua == undefined || profile.rua.length < 3){
            throw new Meteor.Error('Autenticação dos dados', 'O campo Rua é obrigatório.');
        }
        if (profile.numero == '' || profile.numero == undefined){
            throw new Meteor.Error('Autenticação dos dados', 'O campo Número é obrigatório.');
        }
        if (profile.cidade == '' || profile.cidade == undefined || profile.cidade.length < 3){
            throw new Meteor.Error('Autenticação dos dados', 'O campo Cidade é obrigatório.');
        }
        if (profile.estado == '' || profile.estado == undefined || profile.estado.length < 2){
            throw new Meteor.Error('Autenticação dos dados', 'O campo Estado é obrigatório.');      
        }
        return Profile.update({_id: Meteor.userId()}, {$set:{'profile.paymentAddress': profile}})
    }
})

export const Profile = Meteor.users;