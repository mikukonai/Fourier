
//////////////////////////////////////////////////////////////////
//  FFT
//////////////////////////////////////////////////////////////////

const FFT = require("./fft.js");

let fft = new FFT(8);
let output = fft.fft([
    [1, 0, 1, 0, 1, 0, 1, 0], // Re
    [0, 0, 0, 0, 0, 0, 0, 0]  // Im
]);
console.log(output);


//////////////////////////////////////////////////////////////////
//  DCT
//////////////////////////////////////////////////////////////////

const { DCT, DCT_2D } = require("./dct.js");

// DCT 1d

let dct = new DCT(8);
let dct_out = dct.dct([1,2,3,4,5,6,7,8]);
console.log(dct_out);
let idct_out = dct.idct(dct_out);
console.log(idct_out);

// DCT 2d

let dct_2d_input = [
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1]
];
let dct_2d = new DCT_2D(8);
let dct_2d_out = dct_2d.dct(dct_2d_input);
console.log(dct_2d_out);
let dct_2d_idct_out = dct_2d.idct(dct_2d_out);
console.log(dct_2d_idct_out);
