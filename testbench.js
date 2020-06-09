const FFT = require("./fft.js");

let fft = new FFT(8);
let output = fft.fft([
    [1, 0, 1, 0, 1, 0, 1, 0], // Re
    [0, 0, 0, 0, 0, 0, 0, 0]  // Im
]);
console.log(output);
