import swap from './Helpers';

export default (array) => {

    const duplicateArr = [...array];
    const animations = [];

    let swapped;

    for (let i=0;i<duplicateArr.length-1;i++) {
        swapped = false;
        
        for (let j=0;j<duplicateArr.length-i-1;j++){
            animations.push([[i,j], false]);
            if (duplicateArr[j]>duplicateArr[j+1]){

                animations.push([[j+1,duplicateArr[j]], true]);
                animations.push([[j,duplicateArr[j+1]], true]);
                // let temp =  duplicateArr[j];
                // duplicateArr[j] = duplicateArr[j+1];
                // duplicateArr[j+1] = temp;
                
                swap(duplicateArr, j,j+1);
                swapped =true;
                
            } 
        }
        if (swapped===false) {
            break;
        }
    }
    return animations;
}
