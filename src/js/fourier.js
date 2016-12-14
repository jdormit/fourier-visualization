const fourier = function (in_array) {
    var len = in_array.length;
    var output = [];

    for(var k = 0; k < len; k++) {
        var real = 0;
        var imag = 0;
        for(var n = 0; n < len; n++) {
            real += in_array[n]*Math.cos(-2*Math.PI*k*n/len);
            imag += in_array[n]*Math.sin(-2*Math.PI*k*n/len);
        }
        output.push([real, imag])
    }
    return output;
};

const inverse_fourier = function(in_array) {
    var len = in_array.length;
    var output = [];

    for (var n = 0; n < len; n++) {
        var out = 0;
        for (var k = 0; k < len; k++) {
            out += in_array[k][0]*Math.cos(-2*Math.PI*k*n/len);
            out += in_array[k][1]*Math.sin(-2*Math.PI*k*n/len);
        }
        out = out/len;
        output.push(out);
    }
    return output;
};

module.exports = {fourier, inverse_fourier};
