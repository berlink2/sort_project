import swap from './Helpers';

export default  (array) => {
    const duplicateArr = [...array];
    const animations = [];
    for (let i = 1; i < duplicateArr.length; i++) {
      for (let j = i - 1; j >= 0; j--) {
        animations.push([[j, j + 1], false]);
        if (duplicateArr[j + 1] < duplicateArr[j]) {
          animations.push([[j, duplicateArr[j + 1]], true]);
          animations.push([[j + 1, duplicateArr[j]], true]);
          swap(duplicateArr, j, j + 1);
        } else {
        break;
        }
      }
    }
    return animations;
  }