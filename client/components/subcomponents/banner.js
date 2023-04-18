import React, { Component } from 'react';
import Carousel from 're-carousel';
import Dots from './widgets/indicator-dots';
//import Buttons from './widgets/buttons'

class Banner extends Component {
    render(){
        if (this.props.images.length > 0){
            var _height = (this.props.height/this.props.width)*document.querySelector('.appContainer').clientWidth;
            if (_height > this.props.height){_height = this.props.height}
            return(
                <div style={{height: _height+'px', maxWidth: this.props.width+'px', margin:'0 auto'}}>                 
                <Carousel loop auto widgets={[Dots]} interval={10000}>      
                    {this.props.images.map((image, index) =>{
                            let key = 'Banner_'+index;
                            return(
                                <div style={{backgroundImage: 'url('+image.src+')', backgroundSize:'cover' ,height: _height+'px'}} key={key}>
                                </div>
                            )
                        }
                    )}
                </Carousel>  
                </div>  
            )
        }    
    }   
}

export default Banner;