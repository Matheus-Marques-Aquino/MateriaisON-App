import React, { Component } from 'react'

class ProductImages extends Component {

    imageRow(images){
        if (images.length > 1){
            let background = ['', '', '', '']
            let border = ['', '#f1f2f2', '#f1f2f2', '#f1f2f2']
            images.map((image, index)=>{
                if (index > 0){
                    background[index] = 'white';
                    border[index] = '#f1f2f2';
                }
            })
            return(<div>
                <div style={{width:'200px', height:'50px', display:'flex', margin:'0 auto',}}>
                    <div className='firstSpace' style={{width:'50px', height:'50px', float:'left', border:'1px solid '+border[1], backgroundColor:background[1], backgroundImage:images[1], backgroundSize:'contain'}} onClick={()=>{this.changeImage(1)}}></div>
                    <div className='secondSpace' style={{width:'50px', height:'50px', margin:'0 auto', border:'1px solid '+border[2], backgroundColor:background[2], backgroundImage:images[2], backgroundSize:'contain'}} onClick={()=>{this.changeImage(2)}}></div>
                    <div className='thirdSpace' style={{width:'50px', height:'50px', float:'right', border:'1px solid '+border[3], backgroundColor:background[3], backgroundImage:images[3], backgroundSize:'contain'}} onClick={()=>{this.changeImage(3)}}></div>
                </div>
            </div>)
        }else{return(<div></div>)}
    }

    changeImage(position){
        switch(position){
            case 1:
                if (document.querySelector('.firstSpace').style.backgroundImage != '')
                {let old_url = document.querySelector('.mainSpace').style.backgroundImage;
                document.querySelector('.mainSpace').style.backgroundImage = document.querySelector('.firstSpace').style.backgroundImage;
                document.querySelector('.firstSpace').style.backgroundImage = old_url;}
                break;

            case 2:
                if (document.querySelector('.secondSpace').style.backgroundImage != '')
                {let old_url = document.querySelector('.mainSpace').style.backgroundImage;
                document.querySelector('.mainSpace').style.backgroundImage = document.querySelector('.secondSpace').style.backgroundImage;
                document.querySelector('.secondSpace').style.backgroundImage = old_url;}
                break;

            case 3:
                if (document.querySelector('.thirdSpace').style.backgroundImage != '')
                {let old_url = document.querySelector('.mainSpace').style.backgroundImage;
                document.querySelector('.mainSpace').style.backgroundImage = document.querySelector('.thirdSpace').style.backgroundImage;
                document.querySelector('.thirdSpace').style.backgroundImage = old_url;}
                break;            
        }
    }

    render(){
        var images= [];
        
        if (this.props.images.length == 0){
            images.push('https://via.placeholder.com/200'); 
        }else{
            this.props.images.map((image, index) => {
                images.push('url('+image.src+')'); 
            });
        }
        return(<div>
            <div className='mainSpace' style={{margin:'10px auto', width:'200px', height:'200px', display:'flex', border:'1px solid #f1f2f2', backgroundImage: images[0], backgroundSize:'contain', backgroundPosition:'center', backgroundRepeat:'no-repeat'}}></div>
            {this.imageRow(images)}                      
        </div>)        
    }
}
export default ProductImages;
