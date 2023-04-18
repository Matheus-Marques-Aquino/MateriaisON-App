import React, { Component } from 'react';

class DetailsTable extends Component{
    constructor(props){
        super(props);
        this.state={

        };
    }
    render(){
        var title = this.props.title;
        var detailsArray = this.props.details;
        var details = [];
        detailsArray.map(detail=>{
            switch(detail.name){
                case('Peso (kg)'):
                    details.push({
                        name:'Peso',
                        detail:detail.detail+' kg'
                    })
                    break;
                case('Largura (cm)'):
                    details.push({
                        name:'Largura',
                        detail:detail.detail+' cm'
                    })
                break;
                case('Altura (cm)'):
                    details.push({
                        name:'Altura',
                        detail:detail.detail+' cm'
                    })
                break;
                case('Comprimento (cm)'):
                    details.push({
                        name:'Comprimento',
                        detail:detail.detail+' cm'
                    })
                    break;
            }
        });       
        
        return(<div>
            <table className='productTable' style={{width:'100%'}}>                
                <tbody>
                    {details.map((detail, index)=>{
                        let key = 'Detail_'+index;
                        return(
                        <tr key={key}>
                            <th style={{padding:'0 15px', fontWeight:'normal', textAlign:'left', fontSize:'14px', width:'50%'}}>{detail.name}</th>
                            <td style={{padding:'0 15px', fontWeight:'normal', textAlign:'left', fontSize:'14px', width:'50%', textAlign:'center'}}>{detail.detail}</td>
                        </tr>)
                    })}
                </tbody>
            </table>
            
        </div>);
    }
}
export default DetailsTable;