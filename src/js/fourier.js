const math = require("mathjs");

/**
 * Calculates the pseudoinverse of a matrix
 * @param {math.Matrix|number[]} matrix
 * @returns {math.Matrix|number[]} The pseudoinverse
 */
const pinv = function(matrix) {
    try {
        return math.multiply(math.conj(math.transpose(matrix)), math.inv(math.multiply(matrix, math.conj(math.transpose(matrix)))));
    }
    catch(e) {
        if (e.message === "Cannot calculate inverse, determinant is zero") {
            return math.transpose(math.zeros(math.size(matrix)));
        }
        else {
            throw e;
        }
    }
}

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
 * @param {string} [basis_function="complex_exponential"]
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
    basis_function = basis_function || "complex_exponential";
    if (!(typeof basis_functions[basis_function] === "function")) {
        throw new Error("Unknown basis function: " + basis_function);
    }
    const x_values = [];
    const step = (2*math.pi)/y_values.length;
    // Assume the the x-values are evenly spaced from 0 to 2*pi
    for (let i = 0; i < y_values.length*step; i+=step) {
        x_values.push(i);
    }
    const x_values_matrix = math.matrix([x_values]);
    const amplitudes = [];
    x_values.forEach(function(value, n) {
        const basis = basis_functions[basis_function](math.conj(math.transpose(x_values_matrix)), n);
        const amplitude = math.squeeze(math.multiply(math.matrix([y_values]), basis));
        amplitudes.push(math.multiply(0.25, amplitude));
    });
    return amplitudes;
};

const inverse_fourier = function(amplitudes, basis_function) {
    basis_function = basis_function || "complex_exponential";
        if (!(typeof basis_functions[basis_function] === "function")) {
        throw new Error("Unknown basis function: " + basis_function);
    }
    const x_values = [];
    const step = (2*math.pi)/amplitudes.length;
    // Assume the the x-values are evenly spaced from 0 to 2*pi
    for (let i = 0; i < amplitudes.length*step; i+=step) {
        x_values.push(i);
    }
    const x_values_matrix = math.matrix([x_values]);
    const y_values = [];
    x_values.forEach(function(value, n) {
        const basis = basis_functions[basis_function](x_values_matrix, n);
        const y_value = math.squeeze(math.multiply(4, math.multiply(amplitudes, pinv(basis))));
        y_values.push(y_value);
    });
    return y_values;
};

module.exports = {fourier, inverse_fourier};
