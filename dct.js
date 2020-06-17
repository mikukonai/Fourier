/////////////////////////////////////////////////////////////////
//
//  dct.js - 离散余弦变换
//
//  参考资料：
//  [1] Makhoul J . A Fast Cosine Transform in One and Two Dimensions[J]. IEEE Transactions on Acoustics Speech and Signal Processing, 1980, 28(1):27-34.
//  [2] https://www.nayuki.io/page/fast-discrete-cosine-transform-algorithms
//  [3] https://dsp.stackexchange.com/questions/2807/fast-cosine-transform-via-fft
//
/////////////////////////////////////////////////////////////////

const FFT = require("./fft.js");

function DCT(length) {
    this.fft = new FFT(length);
    this.SQRT_8 = Math.sqrt(8);
}

DCT.prototype = {

    // 一维 DCT-2 (The DCT)
    dct: function(input) {
        let fft = this.fft;
        let N = input.length;
        let SQRT_8 = this.SQRT_8;

        let input2_r = new Array();

        // 序列重排：[01234567]->[02467531]
        for(let n = 0; n < (N >> 1); n++) {
            input2_r[n] = input[n << 1];
            input2_r[N-1-n] = input[(n << 1) + 1];
        }

        // FFT
        let input2_i = new Array(); // Im (All 0)
        for(let i = 0; i < N; i++) { input2_i[i] = 0; }
        let fftout = fft.fft([input2_r, input2_i]);

        fftout_r = fftout[0];
        fftout_i = fftout[1];

        let output = new Array();
        // 平移（乘因子）
        for(let n = 0; n < N; n++) {
            let scale = (n === 0) ? SQRT_8 : 2;

            let factor_r = Math.cos( (-n * Math.PI) / (N << 1) ); // * 2
            let factor_i = Math.sin( (-n * Math.PI) / (N << 1) ); // * 2

            // output[n] = fftout[n].mul(factor).rep * ((n === 0) ? 1/Math.sqrt(8) : 1/2);
            output[n] = (fftout_r[n] * factor_r - fftout_i[n] * factor_i) / scale;
        }

        return output;
    },

    // 一维 DCT-3 (The IDCT, Makhoul)
    idct: function(input) {
        let fft = this.fft;
        let N = input.length;
        let SQRT_8 = this.SQRT_8;

        let input2_r = new Array();
        let input2_i = new Array();

        input[N] = 0;

        for(let n = 0; n < N; n++) {
            let scale = (n === 0) ? SQRT_8 : 2;

            let W_r = Math.cos( (n * Math.PI) / (N << 1) ) * scale; // * 0.5
            let W_i = Math.sin( (n * Math.PI) / (N << 1) ) * scale; // * 0.5

            let I_r = input[n];
            let I_i = -input[N - n];

            // input2[n] = W.mul(I);
            input2_r[n] = W_r * I_r - W_i * I_i;
            input2_i[n] = W_r * I_i + W_i * I_r;
        }

        let fftout = fft.ifft([input2_r, input2_i]);

        let output = new Array();
        // 序列重排：[02467531]->[01234567]
        for(let n = 0; n < (N >> 1); n++) {
            output[n << 1] = fftout[0][n]; // Re
            output[(n << 1) + 1] = fftout[0][N-1-n]; // Re
        }

        return output;
    }
};


function DCT_2D(size) {
    this.size = size;
    this.dct_1d = new DCT(size);
}

DCT_2D.prototype = {

    // 对简单方块作DCT，宽度必须是2的幂
    // input: [row]每一行形成的列向量
    dct: function(input) {
        let size = this.size;
        let dct_1d = this.dct_1d;

        if(input.length !== size) throw `DCT_2D: 输入矩阵的尺寸必须为${size}×${size}的方阵。`;

        // 对每行作DCT
        let output = new Array(); // 按行作DCT的中间结果
        for(let y = 0; y < size; y++) {
            output[y] = dct_1d.dct(input[y]);
        }

        // 对每列作DCT
        for(let x = 0; x < size; x++) {
            let col = new Array();
            for(let y = 0; y < size; y++) {
                col[y] = output[y][x];
            }
            let dctcol = dct_1d.dct(col);
            // 结果写回temp1
            for(let y = 0; y < size; y++) {
                output[y][x] = dctcol[y];
            }
        }

        return output;
    },

    // 对简单方块作IDCT，宽度必须是2的幂
    // input: [row]每一行形成的列向量
    idct: function(input) {
        let size = this.size;
        let dct_1d = this.dct_1d;

        if(input.length !== size) throw `DCT_2D: 输入矩阵的尺寸必须为${size}×${size}的方阵。`;

        // 对每列作IDCT
        let output = new Array(); // 按列作IDCT的中间结果
        for(let y = 0; y < size; y++) { // 初始化
            output[y] = new Array();
        }
        for(let x = 0; x < size; x++) {
            let dctcol = new Array();
            for(let y = 0; y < size; y++) {
                dctcol[y] = input[y][x];
            }
            let col = dct_1d.idct(dctcol);
            // 结果写回output
            for(let y = 0; y < size; y++) {
                output[y][x] = col[y];
            }
        }

        // 对每行作DCT
        for(let y = 0; y < size; y++) {
            output[y] = dct_1d.idct(output[y]);
        }

        return output;
    }
};

module.exports.DCT = DCT;
module.exports.DCT_2D = DCT_2D;
