const Complex = require("./complex.js");
const FFT = require("./fft.js");

// 实数数组 转 复数数组
function RealArrayToComplexArray(realArray) {
    let complexArray = new Array();
    for(let i = 0; i < realArray.length; i++) {
        complexArray.push(new Complex(realArray[i], 0));
    }
    return complexArray;
}

let fft = new FFT(8);

let input = RealArrayToComplexArray([4, 0, 0, 0, 4, 0, 0, 0]);

let output = fft.ifft(input);

for(let i = 0; i < output.length; i++) {
    output[i].show();
}
