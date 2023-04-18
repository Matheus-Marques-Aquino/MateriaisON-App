export const validate = (type, input) => {
    switch(type){
        case 'cpf':
            var cleanInput= input.replace(/\./g, '').replace(/-/g, '').replace(/\//g, '');
            var firstStep = 0;
            var secondStep = 0;
            if (input=='000.000.000-00' || 
                input=='111.111.111-11' || 
                input=='222.222.222-22' || 
                input=='333.333.333-33' || 
                input=='444.444.444-44' || 
                input=='555.555.555-55' || 
                input=='666.666.666-66' || 
                input=='777.777.777-77' || 
                input=='888.888.888-88' || 
                input=='999.999.999-99'){
                return false
            }
            for(i=0; i<9; i++){
                firstStep += cleanInput[i]*(10-i);
            }
            firstStep = firstStep * 10 % 11;
            if (firstStep == 10){ firstStep = 0; }
            if (firstStep != input[12]){
                return false
            }
            for(i=0; i<10; i++){
                secondStep += cleanInput[i]*(11-i);
            }
            secondStep = secondStep * 10 % 11;
            if (secondStep != input[13]){
                return false
            }
            return true
            break;

        case 'cnpj':
            var input = '11.222.333/0001-81';
            var cleanInput= input.replace(/\./g, '').replace(/-/g, '').replace(/\//g, '');
            var collum = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
            var multiplyCollum=[]
            var firstStep = 0;
            var secondStep = 0;
            var firstDigit = 0;
            var secondDigit = 0;
            for(i=1; i<13; i++){
                multiplyCollum[i]=collum[i]*cleanInput[i-1]
                firstStep += multiplyCollum[i]
            }
            firstDigit = firstStep % 11;
            if (firstDigit < 2){ 
                firstDigit = 0; 
            }else{
                firsDigit = 11 - firstDigit;
            }
            if (firsDigit != input[16]){
                return false;
            }
            for(i=0; i<13; i++){
                multiplyCollum[i]=collum[i]*cleanInput[i]
                secondStep += multiplyCollum[i]
            }
            secondDigit = secondStep % 11;
            if (secondDigit < 2){ 
                secondDigit = 0; 
            }else{
                secondDigit = 11 - secondDigit;
            }
            if (secondDigit != input[17]){
                console.log('error');
                return false;
            }
            return true;
            break;
    }
}
