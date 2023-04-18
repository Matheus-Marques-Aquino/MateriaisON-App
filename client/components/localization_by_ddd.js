import React, { Component } from 'react';
import history from './subcomponents/widgets/history';
import Waiting from './subcomponents/widgets/waiting';
import BackButton from './subcomponents/back_button';


class LocalizationByDDDPage extends Component{
    constructor(props){
        super(props);
        this.error = '';
        this.state = {
            page: { location: 1, estado: -1 },
            loading: false,
            localization: false,            
            cache: false,
            address: {                
                cep: '',
                ddd: null,
                lat: null,
                lng: null
            }
        };
    }

    displayError(){
        if (this.error != ''){
            return(<div style={{padding:'25px 20px', paddingBottom:'0px', color:'red', fontSize:'13px'}}>{this.error}</div>)
        }
    }
    convertToCoords(municipio){
        if (this.state.loading){ return; }
        this.setState({loading: true});
        let dddGeo = [];
        dddGeo[11] = { lat: -23.547778, lng: -46.635833 }; dddGeo[12] = { lat: -23.203416, lng: -45.890627 };
        dddGeo[13] = { lat: -23.960833, lng: -46.333889 }; dddGeo[14] = { lat: -23.55052, lng: -46.633309 }; 
        dddGeo[15] = { lat: -23.497741, lng: -47.457983 }; dddGeo[16] = { lat: -21.170401, lng: -47.810324 };
        dddGeo[17] = { lat: -20.800433, lng: -49.365853 }; dddGeo[18] = { lat: -23.55052, lng: -46.633309 };
        dddGeo[19] = { lat: -22.905833, lng: -47.060833  }; dddGeo[22] = { lat: -21.735556, lng: -41.333019 };
        dddGeo[21] = { lat: -22.9028, lng: -43.2078 }; dddGeo[24] = { lat: -22.906847, lng: -43.172896 };
        dddGeo[27] = { lat: -20.3189, lng: -40.3378 }; dddGeo[28] = { lat: -20.846705, lng: -41.12022 };
        dddGeo[31] = { lat: -19.916667, lng: -43.933333 }; dddGeo[32] = { lat: -21.761044, lng: -43.347797 };
        dddGeo[33] = { lat: -18.85892, lng: -41.943214 }; dddGeo[34] = { lat: -18.91953, lng: -48.27742 };
        dddGeo[35] = { lat: -18.512178, lng: -44.555031 }; dddGeo[37] = { lat: -18.512178, lng: -44.555031 };
        dddGeo[38] = { lat: -16.729319, lng: -43.867126 }; dddGeo[41] = { lat: -25.4297, lng: -49.2719 }; 
        dddGeo[42] = { lat: -24.949608, lng: -53.422725 }; dddGeo[43] = { lat: -23.309641, lng: -51.148806 }; 
        dddGeo[44] = { lat: -23.450343, lng: -51.863671 }; dddGeo[45] = { lat: -24.953015, lng: -53.452892 }; 
        dddGeo[46] = { lat: -26.22972, lng: -52.671136 };  dddGeo[47] = { lat: -27.242339, lng: -50.218856 }; 
        dddGeo[48] = { lat: -27.597022, lng: -48.549583 }; dddGeo[49] = { lat: -27.242339, lng: -50.218856 }; 
        dddGeo[51] = { lat: -30.034647, lng: -51.217658 }; dddGeo[53] = { lat: -31.767898, lng: -52.337498 }; 
        dddGeo[54] = { lat: -29.179124, lng: -51.149251 }; dddGeo[55] = { lat: -29.691483, lng: -53.792261 }; 
        dddGeo[61] = { lat: -15.688838, lng: -47.817738 }; dddGeo[62] = { lat: -16.666667, lng: -49.25 };
        dddGeo[63] = { lat: -10.17528, lng: -48.298247 }; dddGeo[64] = { lat: -17.789523, lng: -50.920427 }; 
        dddGeo[65] = { lat: -15.601411, lng: -56.097892 };  dddGeo[66] = {  lat: -12.681871, lng: -56.921099 }; 
        dddGeo[67] = { lat: -12.681871, lng: -56.921099 }; dddGeo[68] = { lat: -9.023796, lng: -70.811995 }; 
        dddGeo[69] = { lat: -11.505734, lng: -63.580611 }; dddGeo[71] = { lat: -12.970833, lng: -38.51083 }; 
        dddGeo[73] = { lat: -14.788033, lng: -39.278418 }; dddGeo[74] = { lat: -9.418046, lng: -40.501062 };
        dddGeo[75] = { lat: -12.232754, lng: -38.949572 }; dddGeo[77] = { lat: -14.861924, lng: -40.844535 }; 
        dddGeo[79] = { lat: -10.574093, lng: -37.385658 }; dddGeo[81] = { lat: -8.057838, lng: -34.882897 }; 
        dddGeo[82] = { lat: -9.571306, lng: -36.78195 }; dddGeo[83] = { lat: -7.239961, lng: -36.78195 }; 
        dddGeo[84] = { lat: -5.40258, lng: -36.954107 }; dddGeo[85] = { lat: -3.78, lng: -38.59 }; 
        dddGeo[86] = { lat: -5.098041, lng: -42.758734 }; dddGeo[87] = { lat: -9.377469, lng: -40.535025 }; 
        dddGeo[88] = { lat: -7.229036, lng: -39.312446 }; dddGeo[89] = { lat: -6.776932, lng: -43.022602 }; 
        dddGeo[92] = { lat: -3.079587, lng: -60.067331 }; dddGeo[94] = { lat: -5.381136, lng: -49.133102 }; 
        dddGeo[95] = { lat: 2.737597, lng: -62.0751 }; dddGeo[96] = { lat: 2.04474, lng: -50.787422 }; 
        dddGeo[97] = { lat: -4.09449, lng: -63.14461 }; dddGeo[98] = { lat: -2.53, lng: -44.302778 }; 
        dddGeo[99] = { lat: -5.522392, lng: -47.495684 }; 
        let DDD = municipio.slice(4, 6);
        DDD = parseInt(DDD);
        let cache = {cache:true, ddd:DDD, geolocation:false, address:{cep:'', lat:dddGeo[DDD].lat, lng:dddGeo[DDD].lng }};        
        localStorage.removeItem('MateriaisON_localization');
        localStorage.setItem('MateriaisON_localization', JSON.stringify(cache));        
        if (Meteor.userId()){                                        
            Meteor.call('insertGeoloation', cache, (result, error)=>{
                if (error){
                    console.log(error);
                }
                history.push('/');
                return;                
            });
        }else{
            history.push('/');
            return;
        }           
    }

    render(){  
        let estados = ['São Paulo', 'Minas Gerais', 'Rio de Janeiro', 'Bahia', 'Paraná', 'Rio Grande do Sul', 
        'Pernambuco', 'Ceará', 'Pará', 'Santa Catarina', 'Maranhão', 'Goiás', 'Amazonas', 'Espírito Santo', 
        'Paraíba', 'Rio Grande do Norte', 'Mato Grosso', 'Alagoas', 'Piauí', 'Distrito Federal', 
        'Mato Grosso do Sul', 'Sergipe', 'Rondônia', 'Tocantins', 'Acre', 'Amapá', 'Roraima'];        
        let municipios = [];
        municipios[0] = ['DDD 11 - Região Metropolitana de São Paulo', 'DDD 12 - São José dos Campos e Região', 
        'DDD 13 - Região Metropolitana da Baixada Santista', 'DDD 14 - Bauru, Jaú, Marília, Botucatu e Região', 
        'DDD 15 - Sorocaba e Região', 'DDD 16 - Ribeirão Preto, São Carlos e Região', 'DDD 17 - São José do Rio Preto e Região', 
        'DDD 18 - Presidente Prudente, Araçatuba e Região', 'DDD 19 - Região Metropolitana de Campinas'];
        municipios[1] = ['DDD 31 - Região Metropolitana de Belo Horizonte', 'DDD 32 - Juiz de Fora e Região', 
        'DDD 33 - Governador Valadares e Região', 'DDD 34 - Uberlândia e região', 'DDD 35 - Poços de Caldas, Pouso Alegre e Região', 
        'DDD 37 - Divinópolis, Itaúna e Região', 'DDD 38 - Montes Claros e Região'];
        municipios[2] = ['DDD 21 - Região Metropolitana do Rio de Janeiro', 'DDD 22 - Campos dos Goytacazes e Região', 
        'DDD 24 - Volta Redonda, Petrópolis e Região'];
        municipios[3] = ['DDD 71 - Região Metropolitana de Salvador', 'DDD 73 - Itabuna, Ilhéus e Região', 'DDD 74 - Juazeiro e Região', 
        'DDD 75 - Feira de Santana e Região', 'DDD 77 - Vitória da Conquista e Região'];
        municipios[4] = ['DDD 41 - Região Metropolitana de Curitiba', 'DDD 42 - Ponta Grossa e Região', 'DDD 43 - Londrina e Região', 
        'DDD 44 - Maringá e Região', 'DDD 45 - Cascavel e Região', 'DDD 46 - Francisco Beltrão, Pato Branco e Região'];
        municipios[5] = ['DDD 51 - Região Metropolitana de Porto Alegre', 'DDD 53 - Pelotas e Região', 'DDD 54 - Caxias do Sul e Região', 
        'DDD 55 - Santa Maria e Região'];
        municipios[6] = ['DDD 81 - Região Metropolitana de Recife', 'DDD 87 - Região de Petrolina'];
        municipios[7] = ['DDD 85 - Região Metropolitana de Fortaleza', 'DDD 88 - Região de Juazeiro do Norte'];
        municipios[8] = ['DDD 91 - Região Metropolitana de Belém', 'DDD 93 - Região de Santarém', 'DDD 94 - Região de Marabá'];
        municipios[9] = ['DDD 47 - Joinville, Blumenau, Balneário Camboriú e Região', 
        'DDD 48 - Região Metropolitana de Florianópolis e Criciúma', 'DDD 49 - Chapecó, Lages e Região'];
        municipios[10] = ['DDD 98 - Região Metropolitana de São Luís', 'DDD 99 - Região de Imperatriz'];
        municipios[11] = ['DDD 62 - Região Metropolitana de Goiânia ', 'DDD 64 - Rio Verde e Região'];
        municipios[12] = ['DDD 92 - Região de Manaus', 'DDD 97 - Região de Tefé e Coari'];
        municipios[13] = ['DDD 27 - Região Metropolitana de Vitória', 'DDD 28 - Cachoeiro de Itapemirim e Regiãos'];
        municipios[14] = ['DDD 83 - Todos os municípios de Paraíba']; municipios[15] = ['DDD 84 - Todos os municípios do Rio Grande do Norte'];
        municipios[16] = ['DDD 65 - Região Metropolitana de Cuiabá', 'DDD 66 - Rondonópolis, Sinop e Região'];
        municipios[17] = ['DDD 82 - Todos os municípios do Mato Grosso'];
        municipios[18] = ['DDD 86 - Região de Teresina', 'DDD 89 - Região de Picos e Floriano'];
        municipios[19] = ['DDD 61 - Brasília e Região']; municipios[20] = ['DDD 67 - Todos os municípios do Mato Grosso do Sul'];
        municipios[21] = ['DDD 79 - Todos os municípios de Sergipe']; municipios[22] = ['DDD 69 - Todos os municípios de Rondônia'];
        municipios[23] = ['DDD 63 - Todos os municípios de Tocantins']; municipios[24] = ['DDD 68 - Todos os municípios do Acre'];
        municipios[25] = ['DDD 96 - Todos os municípios do Amapá']; municipios[26] = ['DDD 95 - Todos os municípios de Roraima'];
      
        if (this.state.loading){
            return(
            <div className='mainContainerWithoutTop'>
                <BackButton title='Brasil' invert={true}/>               
                <Waiting size='60px' open={this.state.loading}/>
            </div>) 
        }
        if (this.state.page.location == 1){
            return(
            <div className='mainContainerWithoutTop'>
                <BackButton title='Regiões' invert={true}/>                
                    <div style={{marginTop:'36px', color:'#585858'}}>
                        <div style={{width:'100%', height:'30px', borderBottom:'1px solid #FFDBBF', display:'flex'}}>
                            <div style={{width:'100%', margin:'auto 20px', fontWeight:'bold', fontSize:'13px', display:'flex'}}>
                                <div style={{width:'10px', height:'10px', margin:'auto 0', backgroundImage:'url(/imgs/icons/icon-rightArrow.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></div>
                                <div style={{marginLeft:'5px'}}>Brasil</div>
                            </div>
                        </div>
                        {estados.map((estado, index)=>{
                            let key = 'estado_'+index;
                            return(
                            <div style={{width:'100%', height:'30px', borderBottom:'1px solid #FFDBBF', display:'flex'}} key={key} onClick={()=>{console.log('a');this.setState({ page: { location: 2, estado: index}})}}>
                                <div style={{margin:'auto 20px', fontSize:'13px'}}>{estado}</div>
                            </div>
                            );
                        })}      
                    </div>
            </div>);            
        }
        return(
        <div className='mainContainerWithoutTop'>
            <div style={{height:'34px', backgroundColor:'#ff7000', position:'fixed', top:'0', zIndex:'100'}}>
                <div style={{position:'relative', borderBottom:'1px solid #FF7000', top:'0px', zIndex:'10', display:'flex', width: document.querySelector('.appContainer').clientWidth, backgroundColor:'#FF7000'}}>
                    <div style={{width:'40px', height:'34px', marginLeft:'10px', position:'fixed', backgroundImage:'url(/imgs/backArrow2.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat'}} onClick={ ()=>{this.setState({page:{location:1, estado:-1}, address:{lat: null, lng:null }});} }></div>
                    <div style={{height:'34px', lineHeight:'34px', width:'100%', textAlign:'center', fontWeight:'bold', color:'white'}}>Regiões</div>
                </div>
            </div>                
            <div style={{marginTop:'36px', color:'#585858'}}>  
                <div style={{width:'100%', height:'30px', borderBottom:'1px solid #FFDBBF', display:'flex'}}>
                    <div style={{margin:'auto 20px', fontWeight:'bold', fontSize:'14px', display:'flex'}}>
                        <div style={{width:'10px', height:'10px', margin:'auto 0', backgroundImage:'url(/imgs/icons/icon-rightArrow.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></div>
                        <div style={{marginLeft:'5px'}}>{estados[this.state.page.estado]}</div>
                    </div>
                </div>
                {municipios[this.state.page.estado].map((municipio, index)=>{
                    let key = 'municipio_'+index;
                    return(
                    <div style={{width:'100%', padding:'8px 0', borderBottom:'1px solid #FFDBBF', display:'flex'}} key={key} onClick={()=>{this.convertToCoords(municipio)}}>
                        <div style={{margin:'auto 20px', fontSize:'13px'}}>{municipio}</div>
                    </div>);
                })}
            </div>
            <Waiting size='60px' open={this.state.loading}/>
        </div>);        
        
    }
}
export default LocalizationByDDDPage;