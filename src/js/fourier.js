const math = require("mathjs");

/**
 * An implementation of a one-dimensional Fourier Transform
 *
 * @param {number[]} input - 
 *     An array representing a sampled 2*pi-periodic function. Each element 
 *     represents a y-value from the input function. It is assumed that
 *     the function is sampled at 2*pi/input.length, so the x-value for each
 *     element is 2*pi/i, where i is the element's index.
 *
 * @returns {number[]}
 *     An array representing the magnitudes of each frequency of the Fourier
 *     transform of the input. Each element represents a magnitude of a
 *     sin function. The index of each element represents its frequency, so
 *     the first element has the lowest frequency (representing the average
 *     value of the input) and each subsequent element has a higher frequncy.
 */
const fourier = function(input) {
    const reasonable_input = [];
    const step = (2*math.pi)/input.length;
    for (let i = 0; i < input.length*step; i+=step) {
        reasonable_input.push(i);
    }
    const reasonable_input_matrix = math.matrix([reasonable_input]);
    const out = [];
    reasonable_input.forEach(function(value, n) {
        const neg_i = math.multiply(-1, math.i);
        const c = math.exp(math.multiply(neg_i, n, math.transpose(reasonable_input_matrix)));
        const magnitude = math.squeeze(math.multiply(math.matrix([input]), c));
        out.push(math.multiply(0.25, magnitude));
    });
    return out;
}

module.exports = fourier;
