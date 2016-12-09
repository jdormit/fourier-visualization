const math = require("mathjs");

/**
 * Possible choices for the basis_function parameter of fourier()
 */
const basis_functions = {
    complex_exponential: function(x_values_matrix, n) {
        const neg_i = math.multiply(-1, math.i);
        return math.exp(math.multiply(neg_i, n, x_values_matrix));
    },
    sin: function(x_values_matrix, n) {
        return math.sin(math.multiply(n, x_values_matrix));
    },
    cos: function(x_values_matrix, n) {
        return math.cos(math.multiply(n, x_values_matrix));
    }
}

/**
 * An implementation of a one-dimensional Fourier Transform
 *
 * @param {number[]} y_values
 *     An array representing a sampled 2*pi-periodic function. Each element 
 *     represents a y-value from the input function. It is assumed that
 *     the function is sampled at 2*pi/input.length, so the x-value for each
 *     element is 2*pi/i, where i is the element's index.
 *
 * @param {string} [basis_function="sin"]
 *     The function on which to project the input function, i.e. the function
 *     that forms the basis for the frequency space. One of "complex_exponential",
 *     "sin", "cos".
 *
 * @returns {number[]}
 *     An array representing the magnitudes of each frequency of the Fourier
 *     transform of the input. Each element represents a magnitude of a
 *     sin function. The index of each element represents its frequency, so
 *     the first element has the lowest frequency (representing the average
 *     value of the input) and each subsequent element has a higher frequncy.
 */
const fourier = function(y_values, basis_function) {
    basis_function = basis_function || "sin";
    if (!(typeof basis_functions[basis_function] === "function")) {
        throw new Error("Invalid c_function: " + basis_function);
    }
    const x_values = [];
    const step = (2*math.pi)/y_values.length;
    // Assume the the x-values are evenly spaced from 0 to 2*pi
    for (let i = 0; i < y_values.length*step; i+=step) {
        x_values.push(i);
    }
    const x_values_matrix = math.transpose(math.matrix([x_values]));
    const out = [];
    x_values.forEach(function(value, n) {
        const basis = basis_functions[basis_function](x_values_matrix, n);
        const magnitude = math.squeeze(math.multiply(math.matrix([y_values]), basis));
        out.push(math.multiply(0.25, magnitude));
    });
    return out;
}

module.exports = fourier;
