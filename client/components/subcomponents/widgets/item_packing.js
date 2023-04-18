import BinPacking from 'bp3d';

export class Packing{
    constructor(items){
        this.items = items;     
        this.binItems = []    
        this.itemsCount = 0;
        this.Volume = 0;
        this.Weight = 0;
        this.Boxs = [            
            {w:36 ,d:28 ,h:4 ,wg:1000 ,v:4032 },//Correios
            {w:27 ,d:18 ,h:9 ,wg:1000 ,v:4374 },
            {w:27 ,d:23 ,h:14 ,wg:1000 ,v:8202 },
            {w:36 ,d:27 ,h:18 ,wg:1000 ,v:17496 },
            {w:36 ,d:27 ,h:27 ,wg:1000 ,v:26244 },
            {w:40 ,d:40 ,h:30 ,wg:1000 ,v:48000 },//Loggi
            {w:57 ,d:36 ,h:27 ,wg:1000 ,v:55404 },
            {w:50 ,d:50, h:40, wg:1000, v:100000 },
            {w:50 ,d:50, h:50, wg:1000, v:125000 }//Custom Box            
        ];
        this.maxDimensions = {
            w: 0,
            h: 0,
            l: 0
        };
        this.lastBox = {
            index: 0,
            box: {w: 50, d:50, h:50, wg:30, v:125000 },
            offset: 0,
            lastOffset: 'W'
        };
        this.noMatch = false;
        this.itemsPackage = this.packageSort();
        this.timer = (new Date).getTime();
    }

    packageSort(){
        this.timer = (new Date).getTime();
        const Item = BinPacking.Item;
        let itemId = 0;        
        var totalItems = [];
        var incompleItems = [];
        var totalWeight = 0;
        var totalVolume = 0;

        this.items.map(item=>{          
            if (item.quantity >= 27){                
                let reduction = Math.floor(item.quantity/27);
                let remain = item.quantity - reduction;
                for(let i=0; i<reduction; i++){
                    let _product = {};
                    let dimensions = 0;
                    let weight = 0;
                    let volume = 0; 
                    
                    itemId += 1;

                    item.product.details.map(detail=>{                           
                        switch(detail.name){
                            case('Peso (kg)'):
                                weight = 27*parseFloat(detail.detail);
                                _product.weight = 27*parseInt(detail.detail*1000);//g
                                break;
    
                            case('Altura (cm)'):
                            if (dimensions == 0){
                                volume += 3*parseFloat(detail.detail);
                                dimensions += 1;
                            }else{
                                volume = 3*volume*parseFloat(detail.detail);
                                dimensions += 1;
                            }                        
                            if (3*detail.detail > this.maxDimensions.h){ 
                                this.maxDimensions.h = 3*detail.detail;
                            }
                            _product.height = 3*parseInt(detail.detail*100);//mm
                            break;
    
                            case('Comprimento (cm)'):
                                if (dimensions == 0){
                                    volume += 3*parseFloat(detail.detail);
                                    dimensions += 1;
                                }else{
                                    volume = 3*volume*parseFloat(detail.detail);
                                    dimensions += 1;
                                }
                                if (3*detail.detail > this.maxDimensions.l){ 
                                    this.maxDimensions.l = 3*detail.detail;
                                }
                                _product.width = 3*parseInt(detail.detail*100);//mm
                                break;
        
                            case('Largura (cm)'):
                                if (dimensions == 0){
                                    volume += 3*parseFloat(detail.detail);
                                    dimensions += 1;
                                }else{
                                    volume = 3*volume*parseFloat(detail.detail);
                                    dimensions += 1;
                                }
                                if (3*detail.detail > this.maxDimensions.w){ 
                                    this.maxDimensions.w = 3*detail.detail;
                                }
                                _product.length = 3*parseInt(detail.detail*100);//mm
                                break;
                        }                                        
                    })
                    if (weight <= 0 || dimensions < 3 || volume <= 0){
                        incompleItems.push(_product);
                    }else{
                        let newProduct = new Item("Item "+itemId, _product.width, _product.length, _product.height, _product.weight); 
                        this.binItems.push(newProduct);                                
                        totalWeight += _product.weight;
                        totalVolume += volume;
                        totalItems.push(_product);      
                    }
                }
                for(let i=0; i<remain; i++){
                    let _product = {};
                    let dimensions = 0;
                    let weight = 0;
                    let volume = 0; 
                    
                    itemId += 1;

                    item.product.details.map(detail=>{                           
                        switch(detail.name){
                            case('Peso (kg)'):
                                weight = parseFloat(detail.detail);
                                _product.weight = parseInt(detail.detail*1000);//g
                                break;
    
                            case('Altura (cm)'):
                            if (dimensions == 0){
                                volume += parseFloat(detail.detail);
                                dimensions += 1;
                            }else{
                                volume = volume*parseFloat(detail.detail);
                                dimensions += 1;
                            }                        
                            if (detail.detail > this.maxDimensions.h){ 
                                this.maxDimensions.h = detail.detail;
                            }
                            _product.height = parseInt(detail.detail*100);//mm
                            break;
    
                            case('Comprimento (cm)'):
                                if (dimensions == 0){
                                    volume += parseFloat(detail.detail);
                                    dimensions += 1;
                                }else{
                                    volume = volume*parseFloat(detail.detail);
                                    dimensions += 1;
                                }
                                if (detail.detail > this.maxDimensions.l){ 
                                    this.maxDimensions.l =detail.detail;
                                }
                                _product.width = parseInt(detail.detail*100);//mm
                                break;
        
                            case('Largura (cm)'):
                                if (dimensions == 0){
                                    volume += parseFloat(detail.detail);
                                    dimensions += 1;
                                }else{
                                    volume = volume*parseFloat(detail.detail);
                                    dimensions += 1;
                                }
                                if (10*detail.detail > this.maxDimensions.w){ 
                                    this.maxDimensions.w = detail.detail;
                                }
                                _product.length = parseInt(detail.detail*100);//mm
                                break;
                        }                
                    })
                    if (weight <= 0 || dimensions < 3 || volume <= 0){
                        incompleItems.push(_product);
                    }else{
                        let newProduct = new Item("Item "+itemId, _product.width, _product.length, _product.height, _product.weight); 
                        this.binItems.push(newProduct);                                
                        totalWeight += _product.weight;
                        totalVolume += volume;
                        totalItems.push(_product);      
                    }
                }
            }else{
                for(let i=0; i<item.quantity; i++){
                    let _product = {};
                    let dimensions = 0;
                    let weight = 0;
                    let volume = 0; 
                    
                    itemId += 1;
                    
                    item.product.details.map(detail=>{                           
                        switch(detail.name){
                            case('Peso (kg)'):
                                weight = parseFloat(detail.detail);
                                _product.weight = parseInt(detail.detail*1000);//g
                                break;
    
                            case('Altura (cm)'):
                            if (dimensions == 0){
                                volume += parseFloat(detail.detail);
                                dimensions += 1;
                            }else{
                                volume = volume*parseFloat(detail.detail);
                                dimensions += 1;
                            }                        
                            if (detail.detail > this.maxDimensions.h){ 
                                this.maxDimensions.h = detail.detail;
                            }
                            _product.height = parseInt(detail.detail*100);//mm
                            break;
    
                        case('Comprimento (cm)'):
                            if (dimensions == 0){
                                volume += parseFloat(detail.detail);
                                dimensions += 1;
                            }else{
                                volume = volume*parseFloat(detail.detail);
                                dimensions += 1;
                            }
                            if (detail.detail > this.maxDimensions.l){ 
                                this.maxDimensions.l = detail.detail;
                            }
                            _product.width = parseInt(detail.detail*100);//mm
                            break;
    
                        case('Largura (cm)'):
                            if (dimensions == 0){
                                volume += parseFloat(detail.detail);
                                dimensions += 1;
                            }else{
                                volume = volume*parseFloat(detail.detail);
                                dimensions += 1;
                            }
                            if (detail.detail > this.maxDimensions.w){ 
                                this.maxDimensions.w = detail.detail;
                            }
                            _product.length = parseInt(detail.detail*100);//mm
                            break;
                        }                
                    })
                    if (weight <= 0 || dimensions < 3 || volume <= 0){
                        incompleItems.push(_product);
                    }else{
                        let newProduct = new Item("Item "+itemId, _product.width, _product.length, _product.height, _product.weight); 
                        this.binItems.push(newProduct);                                
                        totalWeight += _product.weight;
                        totalVolume += volume;
                        totalItems.push(_product);      
                    }
                }
            }         
        })
        totalVolume = Math.ceil(totalVolume);
        this.itemsCount = totalItems.length ;
        this.Volume = totalVolume;
        this.Weight = totalWeight;
        this.check();
    }

    check(){
        const Bin = BinPacking.Bin;
        const Packer = BinPacking.Packer;

        let packer = new Packer();   
        let binSize = {h: 0, w: 0, d: 0, wg: 0};
        
        if (this.Volume > 1000000){
            this.result = {
                error: true,
                w: 100,
                h: 100,
                d: 100,
                wg: this.Weight
            }
            return this.result;
        };

        for(let i=0; i<this.Boxs.length; i++){
            if (this.Boxs[i].v > this.Volume || i == this.Boxs.length - 1){                
                this.lastBox.index = i; 
                let offset = this.lastBox.offset;
                binSize.w = this.Boxs[i + offset].w;
                binSize.h = this.Boxs[i + offset].h;
                binSize.d = this.Boxs[i + offset].d;
                binSize.wg = this.Boxs[i + offset].wg;
                break;
            }
        }
        packer.addBin(new Bin("Box", binSize.w*100, binSize.h*100, binSize.d*100, binSize.wg*1000));
        for(let i=0; i<this.binItems.length; i++){
            packer.addItem(this.binItems[i]);
        };

        packer.pack();
        let mainBox = this.Boxs[this.Boxs.length-1];    
        if (packer.unfitItems.length > 0){
            if (mainBox.w == 100 && mainBox.h == 100 && mainBox.d == 100){
                this.result = {
                    error: true,
                    w: packer.bins[0].width/100,
                    h: packer.bins[0].height/100,
                    d: packer.bins[0].depth/100,
                    wg: this.Weight/1000
                }
                return this.result;
            }
            if (this.lastBox.index + this.lastBox.offset < this.Boxs.length - 1){
                this.lastBox.offset += 1                
                this.check();
                return
            }else{
                this.customShapeBox();                
                return                
            }            
        }    
        this.result = {
            error: false,
            w: packer.bins[0].width/100,
            h: packer.bins[0].height/100,
            d: packer.bins[0].depth/100,
            wg: this.Weight/1000
        }
        return;
    }
    customShapeBox(){
        let customBox = this.Boxs[this.Boxs.length-1];                

        if (this.maxDimensions.w > customBox.w){
            customBox.w = this.maxDimensions.w + 5;
        }
        if (this.maxDimensions.h > customBox.h){
            customBox.h = this.maxDimensions.h + 5;
        }
        if (this.maxDimensions.d > customBox.d){
            customBox.d = this.maxDimensions.d + 5;
        }
        if (this.lastBox.lastOffset == 'W'){
            if (customBox.h+10 > 100){
                this.Boxs[this.Boxs.length-1].h = 100;
            }else{
                if (customBox.h == 100){
                    return;
                }
                this.Boxs[this.Boxs.length-1].h += 10;                
            }            
            this.lastBox.lastOffset = 'H';
            this.check();
            return;
        }
        if (this.lastBox.lastOffset == 'H'){
            if (customBox.d+10 > 100){
                this.Boxs[this.Boxs.length-1].d = 100;
            }else{
                if (customBox.d == 100){
                    return;
                }
                this.Boxs[this.Boxs.length-1].d += 10;
            }            
            this.lastBox.lastOffset = 'D';
            this.check();
            return;
        }
        if (this.lastBox.lastOffset == 'D'){
            if (customBox.w+10 > 100){
                this.Boxs[this.Boxs.length-1].w = 100;
            }else{
                if (customBox.w == 100){
                    return;
                }
                this.Boxs[this.Boxs.length-1].w += 10;
            }            
            this.lastBox.lastOffset = 'W';
            this.check();
            return;
        }

    }

}

export default Packing;