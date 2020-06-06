
const Complex = require("./complex.js");

// 对数查找表
const LOG = {
    '1':0,      '2':1,      '4':2,      '8':3,      '16':4,      '32':5,      '64':6,      '128':7,      '256':8,
    '512':9,    '1024':10,  '2048':11,  '4096':12,  '8192':13,   '16384':14,  '32768':15,  '65536':16,
};

function FFT(length) {
    if(!(length in LOG)) {
        throw '[FFT] 输入序列长度必须是2的幂';
    }

    this.length  = length;
    this.W_fft   = new Array();
    this.W_ifft  = new Array();
    this.indexIn = new Array();

    this.Init();
}

FFT.prototype = {

    // 初始化
    Init: function() {
        this.W_fft   = this.TwiddleFactor(this.length, false);
        this.W_ifft  = this.TwiddleFactor(this.length, true);
        this.indexIn = this.BinaryReverse(this.length);
    },

    // 计算旋转因子
    TwiddleFactor: function(length, isIFFT) {
        let W = new Array(length);
        // 只需要用到0~(length-1)的旋转因子
        for(let i = 0; i < (length>>1) ; i++) {
            // W[i] = exp(-2*pi*j*(i/N))
            let ReP = Math.cos(2.0 * Math.PI * ( i / length ) );
            let ImP = Math.sin(2.0 * Math.PI * ( i / length ) );
            if(!isIFFT) {
                ImP *= (-1);
            }
            W[i] = new Complex(ReP, ImP);
        }
        return W;
    },

    // 计算二进制位倒置的输入下标
    BinaryReverse: function(length) {
        let brevIndex = new Array();
        let temp = 0;
        let bitSize = LOG[length];
        for(let i = 0; i < length; i++) {
            temp = i;
            brevIndex[i] = 0;
            for(let c = 0; c < bitSize; c++) {
                if(((temp >> c) & 1) !== 0) {
                    brevIndex[i] += (1 << (bitSize - 1 - c)); // 2^(bitSize-1-c);
                }
            }
        }
        return brevIndex;
    },

    // 正变换
    BasicFFT: function(INPUT, W) {
        let length = this.length;
        let indexIn = this.indexIn;

        let M = LOG[length];

        // 两个数组，用来交替存储各级蝶形运算的结果
        let buf = new Array();
        buf[0] = new Array();
        buf[1] = new Array();
        for(let i = 0; i < length; i++) {
            buf[0][i] = new Complex(0,0);
            buf[1][i] = new Complex(0,0);
        }

        // 蝶形结计算
        let level = 0;
        for(level = 0; level < (((M & 1) === 0) ? M : (M+1)); level++) {
            for(let group = 0; group < (1 << (M-level-1)); group++) {
                for(let i = 0; i < (1<<level); i++) {
                    let indexBuf = i + (group << (level+1));
                    let scalingFactor = (1 << (M-level-1));
                    if(level === 0) {
                        (buf[0])[       indexBuf      ].copyFrom(
                            INPUT[indexIn[indexBuf]] .add( W[i*scalingFactor] .mul( INPUT[indexIn[indexBuf+(1<<level)]] )));
                        (buf[0])[indexBuf + (1<<level)].copyFrom(
                            INPUT[indexIn[indexBuf]] .sub( W[i*scalingFactor] .mul( INPUT[indexIn[indexBuf+(1<<level)]] )));
                    }
                    else {
                        (buf[level & 1])[       indexBuf      ].copyFrom(
                            (buf[(level+1) & 1])[indexBuf] .add( W[i*scalingFactor] .mul( (buf[(level+1) & 1])[indexBuf+(1<<level)] )));
                        (buf[level & 1])[indexBuf + (1<<level)].copyFrom(
                            (buf[(level+1) & 1])[indexBuf] .sub( W[i*scalingFactor] .mul( (buf[(level+1) & 1])[indexBuf+(1<<level)] )));
                    }
                }
            }
        }

        let output = ((M & 1) === 0) ? buf[(level+1) & 1] : buf[level & 1];
        return output;
    },


    // 反变换
    fft: function(INPUT) {
        return this.BasicFFT(INPUT, this.W_fft);
    },

    ifft: function(INPUT) {
        let output = this.BasicFFT(INPUT, this.W_ifft);
        return output.map((value)=>{ return value.scale(1 / this.length);});
    },

};

module.exports = FFT;
