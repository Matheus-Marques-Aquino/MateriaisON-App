import react, { Component } from 'react';
import { Email } from 'meteor/email';

class Email_HTML {
    constructor(data, type){
        this.type = type;
        switch(type){
            case 'newAccount':
                this.newAccountEmail(data)
                break;
            case 'forgetPassword':
                this.forgetPassword(data)
                break;
            case 'passwordReset':
                this.passwordReset(data)
                break;
            case 'finishOrder':
                this.finishOrder(data)
                break;
            case 'contact':
                this.contactMail(data)

        }
    }
    newAccountEmail(data){
        let html = 
        `<head>
            <meta charset="UTF-8" />
            <meta http-equiv="Content-type" content="text/html; charset=UTF-8" />
        </head>
        <html style="background-color: #f0f0f0;">
            <body style="background-color: transparent; font-family: Tahoma; margin: 0px;">
                <div style="max-width: 640px; margin: 0 auto; background-color: white;">
                    <div style="width: 100%; height: 220px; border-bottom: 1px solid #ff7000; display: flex;">
                        <img src="https://construcao.materiaison.com.br/wp-content/uploads/2020/06/6kEmA.png" style="margin: auto; width: 220px; height: 172px;" />
                    </div>
                    <div style="width: 100%; border-bottom: 1px solid #ffdbbf;">
                        <div style="width: 400px; margin: 0 auto;">
                            <div style="width: 100%; padding-top: 60px; font-size: 14px; font-weight: 600; text-align: center;">Seja bem-vindo, ` + data.name + `</div>
                            <div style="width: 100%; padding-top: 50px; text-align: center;">
                                Obrigado por criar uma conta no aplicativo da <span style="font-weight: bold;">Materiais<span style="color: #ff7000;">ON</span></span>
                            </div>
                            <div style="width: 100%; padding-top: 30px; padding-bottom: 60px; font-size: 12px; text-align: center;">Esperamos que encontre tudo o que precise e fique sempre de olho nas promoções.</div>
                        </div>
                    </div>
                    <div style="width: 100%; height: 150px; border-bottom: 1px solid #ffdbbf; display: flex;">
                        <div style="height: fit-content; margin: auto;">
                            <div style="font-size: 15px; color: #ff7000; font-weight: bold; text-align: center;">ACOMPANHE NOSSAS REDES SOCIAIS:</div>
                            <div style="text-align: center; height: 45px; margin: 0 auto; margin-top: 25px;">
                                <a href="https://facebook.com/materiaison.online" target="_blank" style="text-decoration: none;">
                                    <img src="https://construcao.materiaison.com.br/wp-content/uploads/2020/06/zImcM.png" style="width: 45px; height: 45px; margin-right: 25px;" />
                                </a>
                                <a href="https://instagram.com/materiaison_" target="_blank" style="text-decoration: none;">
                                    <img src="https://construcao.materiaison.com.br/wp-content/uploads/2020/06/PGTtN.png" style="width: 45px; height: 45px;" />
                                </a>
                            </div>
                        </div>
                    </div>
                    <div style="height: 240px; margin: 50px 85px; background-color: #ff7000; border-radius: 10px; display: flex;">
                        <div style="height: fit-content; font-size: 14px; color: white; margin: auto;">
                            <div style="font-weight: bold; text-align: center;">Dúvidas?</div>
                            <div style="width: 250px; line-height: 19px; padding-top: 25px; padding-bottom: 25px; text-align: center; text-decoration: none;">
                                Envie um e-mail para: <a style="text-decoration: none !important; color: white !important;">contato@materiaison.com.br</a>
                            </div>
                            <div style="width: 150px; margin-left: 50px;">
                                <div style="width: fit-content; height: 20px; display: flex;">
                                    <img src="https://construcao.materiaison.com.br/wp-content/uploads/2020/06/5GqOI.png" style="width: 20px; height: 20px; margin: auto 0;" />
                                    <div style="padding-left: 5px;">(11) 93289-7996</div>
                                </div>
                                <div style="width: fit-content; height: 20px; display: flex;">
                                    <img src="https://construcao.materiaison.com.br/wp-content/uploads/2020/06/Wb7E6.png" style="width: 20px; height: 20px; margin: auto 0;" />
                                    <div style="padding-left: 5px;">(11) 4226-7099</div>
                                </div>
                                <div style="width: fit-content; height: 20px; display: flex;">
                                    <img src="https://construcao.materiaison.com.br/wp-content/uploads/2020/06/Wb7E6.png" style="width: 20px; height: 20px; margin: auto 0;" />
                                    <div style="padding-left: 5px;">(11) 4318-7223</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </body>
        </html>
        `;
        this.sendMail(html, data);
    }
    forgetPassword(data){
        let html = "<head> <meta charset='UTF-8'> <meta http-equiv='Content-type' content='text/html; charset=UTF-8'> </head><html style='background-color:#F0F0F0'> <body style='background-color:transparent; font-family:Tahoma; margin:0px'> <div style='max-width:640px; margin:0 auto; background-color:white; '> <div style='width:100%; height:220px; border-bottom: 1px solid #ff7000; display: flex;'> <img src='https://construcao.materiaison.com.br/wp-content/uploads/2020/06/6kEmA.png' style='margin: auto; width:220px; height:172px'/> </div><div style='width:100%; padding-top:25px; padding-bottom:40px; text-align:center; font-size:12px; color:#C7C7C7'> Este é um e-mail automático, não é necessário respondê-lo. </div><div style='margin:0 40px; font-size:13px;'> <div style='margin-bottom:25px;'>Olá, " + data.name + ".</div><div style='margin-bottom:15px; font-size:11px;'>Esqueceu a senha, né? Tudo bem, acontece!</div><div style='margin-bottom:40px; font-size:11px;'>Estamos aqui para te ajudar a trocar :)</div><a href='" + data.resetLink + "' style='text-decoration:none !important; color:white !important;'><div style='width:195px; height:40px; margin:0 auto; margin-bottom:25px; background-color:#ff7000; border-radius:8px; font-size:14px; text-align:center; color:white; display:flex'><div style='margin:auto'>criar nova senha</div></div></a> <div style='margin-bottom:40px; font-size:12px; font-weight:600; text-align:center; color:#007AF3;'>O link expira em 24 horas, viu?</div></div><div style='margin:0 20px; border-bottom:1px solid #FFDBBF;'> <div style='margin-bottom:25px; font-size:14px;'>Se o botão não funcionar, é só copiar e colar o link abaixo no seu navegador e continuar com o cadastro da nova senha.</div><div style='margin-bottom:40px; font-size:14px; text-align:center;'>" + data.resetLink + "</div><div style='margin-bottom:20px; font-size:14px; text-align:center;'>Não foi você? <span style='font-weight:600; color:#007AF3;'>Clique aqui!</span></div></div><div style='width:100%; height:150px; border-bottom:1px solid #FFDBBF; display:flex'> <div style='height:fit-content; margin:auto;'> <div style='font-size:15px; color:#ff7000; font-weight:bold; text-align:center;'> ACOMPANHE NOSSAS REDES SOCIAIS: </div><div style='text-align:center; height:45px; margin:0 auto; margin-top:25px'> <a href='https://facebook.com/materiaison.online' target='_blank ' style='text-decoration:none;'> <img src='https://construcao.materiaison.com.br/wp-content/uploads/2020/06/zImcM.png' style='width:45px; height:45px; margin-right:25px;'> </a> <a href='https://instagram.com/materiaison_' target='_blank' style='text-decoration:none;'> <img src='https://construcao.materiaison.com.br/wp-content/uploads/2020/06/PGTtN.png' style='width:45px; height:45px'> </a> </div></div></div><div style='height:80px; border-bottom:1px solid #FFDBBF;'></div><div style='width:100%; background-color:#ff7000;'> <div style='padding:15px 0; font-size:14px; text-align:center; color:white'> Dúvidas? Envie um e-mail para: <a style='text-decoration:none !important; color:white !important;'>contato@materiaison.com.br</a> </div></div></div></body></html>";
        this.sendMail(html, data);
    }
    passwordReset(data){
        let html = "<head> <meta charset='UTF-8'> <meta http-equiv='Content-type' content='text/html; charset=UTF-8'> </head><html style='background-color:#F0F0F0'> <body style='background-color:transparent; font-family:Tahoma; margin:0px'> <div style='max-width:640px; margin:0 auto; background-color:white; '> <div style='width:100%; height:220px; border-bottom: 1px solid #ff7000; display: flex;'> <img src='https://construcao.materiaison.com.br/wp-content/uploads/2020/06/6kEmA.png' style='margin: auto; width:220px; height:172px'/> </div><div style='width:100%; padding-top:25px; padding-bottom:40px; text-align:center; font-size:12px; color:#C7C7C7'> Este é um e-mail automático, não é necessário respondê-lo. </div><div style='margin-left:40px; font-size:13px; border-bottom:1px solid #FFDBBF;'> <div style='padding-bottom:35px;'>Olá, " + data.name + ".</div><div style='padding-bottom:35px;'>Você pediu e sua senha foi alterada :)</div><div style='padding-bottom:80px;'>Sempre que quiser, você pode solicitar uma nova senha na página inicial do aplicativo.</div><div style='padding-bottom:8px; text-align:center; font-weight:bold;'>Não foi você que alterou a senha?</div><div style='padding-bottom:65px; text-align:center;'>Envie um e-mail para: <a style='text-decoration:none !important; color:black !important;'>contato@materiaison.com.br</a></div></div><div style='width:100%; height:150px; border-bottom:1px solid #FFDBBF; display:flex'> <div style='height:fit-content; margin:auto;'> <div style='font-size:15px; color:#ff7000; font-weight:bold; text-align:center;'> ACOMPANHE NOSSAS REDES SOCIAIS: </div><div style='text-align:center; height:45px; margin:0 auto; margin-top:25px'> <a href='https://facebook.com/materiaison.online' target='_blank ' style='text-decoration:none;'> <img src='https://construcao.materiaison.com.br/wp-content/uploads/2020/06/zImcM.png' style='width:45px; height:45px; margin-right:25px;'> </a> <a href='https://instagram.com/materiaison_' target='_blank' style='text-decoration:none;'> <img src='https://construcao.materiaison.com.br/wp-content/uploads/2020/06/PGTtN.png' style='width:45px; height:45px'> </a> </div></div></div><div style='height:80px; border-bottom:1px solid #FFDBBF;'></div><div style='width:100%; background-color:#ff7000;'> <div style='padding:15px 0; font-size:14px; text-align:center; color:white'> Dúvidas? Envie um e-mail para: <a style='text-decoration:none !important; color:white !important;'>contato@materiaison.com.br</a> </div></div></div></body></html>";
        this.sendMail(html, data);
    }    
    contactMail(data){
        let date = new Date();
        
        let day = date.getDate().toString();
        if (day < 10){ day = '0' + day; }
        let mounth = date.getMonth().toString();
        if (mounth < 10){ mounth = '0' + mounth; }
        let year = date.getFullYear().toString(); 
        
        let hours = date.getHours().toString();
        if (hours < 10){ hours = '0' + hours; }
        let minutes = date.getMinutes().toString();
        if (minutes < 10){ minutes = '0' + minutes; }
        let seconds = date.getSeconds().toString();
        if (seconds < 10){ seconds = '0' + seconds; }

        let sendDate = day + '/' + mounth + '/' + year + ' - ' + hours + ':' + minutes + ':' + seconds;
        let html = `
        <head> 
            <meta charset='UTF-8'> 
            <meta http-equiv='Content-type' content='text/html; charset=UTF-8'> 
        </head>
        <body>
            <span style='font-weight:bold'>E-mail de contato APP MateriaisON:</span><br><br>
            <span><span style='font-weight:bold'>Data de envio: </span>` + sendDate + `</span><br><br>
            <span style='font-weight:bold'>Dados do usuário: </span><br>
            <span>Nome: `+data.userName+`</span><br>
            <span>E-mail: `+data.userEmail+`<\span><br><br>
            <span style='font-weight:bold'>Dados do contato:</span><br>
            <span>Nome: `+data.contactName+`</span><br>
            <span>E-mail: `+data.contactEmail+`<\span><br>
            <span>Telefone: `+data.contactTelefone+`<\span><br>
            <span>Mensagem: `+data.contactMensagem+`<\span>
        </body>`
        this.sendMail(html, data);
    }
    sendMail(html, data){
        let mail = {
            to: data.to,
            from: data.from,
            subject: data.subject,
            html: html
        }
        Email.send(mail); 
    }
    finishOrder(data){
        let productsHTML = ''
        data.productsList.map((product)=>{
            let tableHTML = `
            <div style='padding-bottom:10px; margin-left:20px; background-color:#F0F0F0; border-radius:5px;'>
                <div style='display:flex; height:60px; padding:10px; border-bottom:1px solid #FFDBBF;'>
                    <div style='width:60px; height:60px; border:1px solid #F2F2F2; border-radius:5px; background-color:white; background-image:url(` + product.img_url + `); background-position:center; background-repeat:no-repeat; background-size:contain></div>
                    <div style='height:60px; margin:0 10px; display:flex;'>
                        <div style='font-size:12px; margin:auto 0;'>` + product.name + `</div>
                    </div>
                    <div style='height:60px; width:75px; margin-left:auto; display:flex;'>
                        <div style='margin:auto 0; font-size:12px; text-align:center;'>` + product.quantity + `<br>Quantidade </div>                                                  
                    </div>
                    <div style='height:60px; width:100px; display:flex;'>
                        <div style='margin:auto 0; margin-left:auto; font-size:12px; text-align:right'>
                            R$ ` + product.totalPrice + `<br><div style='font-size:10px;'>Unidade: R$ ` + product.unitPrice + `</div>
                        </div> 
                    </div>
                </div>                            
            </div>
            `;
            productsHTML += tableHTML;
        })
        let html = `
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="Content-type" content="text/html; charset=UTF-8"> 
        </head>
        <html style='background-color:#F0F0F0'>
            <body style='background-color:transparent; font-family:Tahoma; margin:0px'>
                <div style='max-width:640px; margin:0 auto; background-color:white; '>
                    <div style='width:100%; height:220px; border-bottom: 1px solid #ff7000; display: flex;'>
                        <img src='https://construcao.materiaison.com.br/wp-content/uploads/2020/06/6kEmA.png' style='margin: auto; width:220px; height:172px'/>
                    </div>
                    <div style='height:55px; margin-left:40px; margin-top:20px; font-size:12px'>
                        <div style='height:15px; line-height:15px;'>Olá, ` + userName + `!</div>
                        ` + data.statusText + `
                    </div>
                    <div style='height:22px; margin:0 40px; margin-top:35px; background-image:url("https://construcao.materiaison.com.br/wp-content/uploads/2020/06/Nlp7P.png"); background-repeat: repeat-x;'>
                        <div style='display:flex;'>
                        ` + data.statusProgress + `
                        </div>
                    </div>
                    <div>
                    </div>        
                    <div style='height:24px; margin:0 40px; margin-top:15px; font-size:9px;'>            
                        <div style='display:flex'>
                            <div style='width:125px; margin: 0 auto'>
                                <div style='height:12px; margin: 0 auto; line-height:12px; text-align:center;'>
                                    Pedido realizado
                                </div>
                                <div style='height:12px; margin: 0 auto; line-height:12px; text-align:center;'>
                                    ` + data.progressDate[0] + `
                                </div>  
                            </div>    
                            <div style='width:125px; margin: 0 auto'>
                                <div style='height:12px; margin: 0 auto; line-height:12px; text-align:center;'>
                                    Pagamento Aprovado
                                </div>
                                <div style='height:12px; margin: 0 auto; line-height:12px; text-align:center;'>
                                    ` + data.progressDate[1] + `
                                </div>  
                            </div>
                            <div style='width:125px; margin: 0 auto'>
                                <div style='height:12px; margin: 0 auto; line-height:12px; text-align:center;'>
                                    Pedido em transporte
                                </div>
                                <div style='height:12px; margin: 0 auto; line-height:12px; text-align:center;'>
                                    ` + data.progressDate[2] + `
                                </div>  
                            </div>
                            <div style='width:125px; margin: 0 auto'>
                                <div style='height:12px; margin: 0 auto; line-height:12px; text-align:center;'>
                                    Pedido finalizado
                                </div>
                                <div style='height:12px; line-height:12px; text-align:center;'>
                                    ` + data.progressDate[3] + `
                                </div>  
                            </div>                          
                        </div>
                    </div>
                    <div style='margin-left:40px; margin-right:30px; margin-top:25px;'>
                        <div style='height:20px; line-height:20px; font-size:13px; display:flex'>
                            <img src='https://construcao.materiaison.com.br/wp-content/uploads/2020/06/UuqXW.png' style='width:10px; height:10px; margin:auto 0'/>
                            <div style='margin: auto 5px;'>Pedido #2160</div>
                        </div>
                        <div style='height:16px; margin-bottom:10px; padding-left:15px; line-height:16px; font-size:9px;'>
                            Vendido por: ` + data.vendorName + `
                        </div>
                        ` + productsHTML + `
                    </div>
                    <div style='margin-left:40px; margin-right:25px; margin-top:25px;'>
                        <div style='height:20px; line-height:20px; font-size:13px; display:flex'>
                            <img src='https://construcao.materiaison.com.br/wp-content/uploads/2020/06/UuqXW.png' style='width:10px; height:10px; margin:auto 0'/>
                            <div style='margin: auto 5px;'>Entrega</div>
                        </div>            
                        <div style='margin-left:20px; margin-top:10px; border:1px solid #FF7000; border-radius:5px;'>
                            <div style='padding:15px 20px; font-size:13px'>
                                <div style='font-weight:600;'>Destinatário:</div>
                                <div>` + data.address[0] + `</div>
                                <div>` + data.address[1] + `</div>
                                <div>` + data.address[2] + `</div>
                            </div>
                        </div>
                    </div>
                    <div style='margin-left:40px; margin-right:25px; margin-top:25px;'>
                        <!-- <div style='height:20px; line-height:20px; font-size:13px; display:flex'>
                            <img src='https://construcao.materiaison.com.br/wp-content/uploads/2020/06/UuqXW.png' style='width:10px; height:10px; margin:auto 0'/>
                            <div style='margin: auto 5px;'>Pagamento</div>
                        </div> -->
                    </div>            
                    <div style='width:100%; height:130px; border-top:1px solid #FFDBBF;'>
                        <div style='width:100%; height:20px; margin:0 auto; margin-top:20px; font-size:14px; font-weight:600; text-align:center; color:#ff7000'>
                            Obrigado por comprar com a MateriaisON!
                        </div>
                        <div style='width:330px; height:60px; margin:auto;'>                    
                            <div style='width:100%; height:35px; font-size:12px; line-height:35px; text-align:center; color:#1C2F59'>
                                Siga nossas redes sociais:
                            </div>
                            <div style='width:100%; height:18px; font-size:12px; display:flex'>
                                <a href='https://facebook.com/materiaison.online' target="_blank" style='text-decoration:none; color:#1C2F59; margin:0 auto; margin-right:18px;'>
                                    <div style='height:18px; display:flex'>
                                        <img src='https://construcao.materiaison.com.br/wp-content/uploads/2020/06/zImcM.png' style='width:16px; height:16px'>
                                        <div style='margin:auto 0; margin-left:4px; line-height:18px;'>
                                            materiaison.online
                                        </div>
                                    </div>
                                </a>
                                <a href='https://instagram.com/materiaison_' target="_blank" style='text-decoration:none; color:#1C2F59; margin:0 auto; margin-left:18px;'>
                                    <div style='height:18px; display:flex'>
                                        <img src='https://construcao.materiaison.com.br/wp-content/uploads/2020/06/PGTtN.png' style='width:16px; height:16px'>
                                        <div style='margin:auto 0; margin-left:4px; line-height:18px; '>
                                            materiaison_
                                        </div>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div style='width:100%; background-color:#ff7000;'>
                        <div style='padding:15px 0; font-size:14px; text-align:center; color:white'>
                            Dúvidas? Envie um e-mail para: <a style='text-decoration:none !important; color:white !important;'>contato@materiaison.com.br</a>
                        </div>
                    </div>
                </div>
            </body>
        </html>
        `;
        this.sendMail(html, data);
    }
}
export default Email_HTML;