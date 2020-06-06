
class Complex {

    constructor(rep, imp) {
        this.rep = rep;
        this.imp = imp;
    }

    add(c) {
        return new Complex(c.rep + this.rep, c.imp + this.imp);
    }

    sub(c) {
        return new Complex(this.rep - c.rep, this.imp - c.imp);
    }

    scale(r) {
        return new Complex(r * this.rep, r * this.imp);
    }

    mul(c) {
        let newrep = this.rep * c.rep - this.imp * c.imp;
        let newimp = this.rep * c.imp + this.imp * c.rep;
        return new Complex(newrep, newimp);
    }

    copyFrom(c) {
        this.rep = c.rep;
        this.imp = c.imp;
    }

    // 模的平方
    energy() {
        return (this.rep * this.rep + this.imp * this.imp);
    }

    // 模
    radius() {
        return Math.sqrt(this.rep * this.rep + this.imp * this.imp);
    }

    // 相位([0, 2*pi))
    phase() {
        let angle = Math.atan2(this.imp, this.rep);
        return (angle >= 0) ? angle : (2 * Math.PI + angle);
    }

    show() {
        console.log('Complex:[ ' + this.rep + ' , ' + this.imp + ' ]');
    }

}

module.exports = Complex;
