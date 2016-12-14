const vis = require("vis");
const Vue = require("./lib/vue");
const {fourier, inverse_fourier} = require("./fourier");

const $inputGraph = document.getElementById("input-graph");
const $polarGraph = document.getElementById("polar-graph");
const $outputGraph = document.getElementById("output-graph");

// This script needs to hook into some controls over what signal values to encode
// (represented as sampled y-values). It needs to display 2 or 3 graphs - the
// circular polar coordinates graph and the resulting frequencies graph, each with
// an imaginary axix and a real axix, and possibly a third graph that is a representation
// of the original signal (reconstructed from the sampled values in the simplest, most naive
// way possible. There will be a checkbox under the Fourier frequencies graph with the option to
// combine them back into the original graph
//
const inputYValuesVue = new Vue({
    el: '#input-y-values',
    data: {
        numYValues: 3,
        yValues: [1, 2, 3]
    },
    mounted: function() {
        makeInputGraph(this.yValues);
        makeOutputGraph(this.yValues, this.yValues.length);
    },
    watch: {
        yValues: function (values) {
            makeInputGraph(values);
            makeOutputGraph(values);
        }
    },
    template: '<div>' +
    '<input v-for="n in parseInt(numYValues)" v-model="yValues[n - 1]" type="text"><br><br>' +
    '<input v-model.number="numYValues" type="range" min="0" max="10" step="1">' +
    '</div>'
});

function makeInputGraph(yValues) {
    document.getElementById("input-graph").innerHTML = "";
    let lineData = [];
    const xValues = makeXValues(yValues);
    for (let i = 0; i < yValues.length; i++) {
        const dataPoint = {
            x: xValues[i],
            y: parseInt(yValues[i])
        };
        lineData.push(dataPoint);
    }
    var vis = d3.select('#input-graph'),
        WIDTH = 1000,
        HEIGHT = 500,
        MARGINS = {
            top: 20,
            right: 20,
            bottom: 20,
            left: 50
        },
        xRange = d3.scale.linear().range([MARGINS.left, WIDTH - MARGINS.right]).domain([d3.min(lineData, function (d) {
            return d.x;
        }), d3.max(lineData, function (d) {
            return d.x;
        })]),
        yRange = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([d3.min(lineData, function (d) {
            return d.y;
        }), d3.max(lineData, function (d) {
            return d.y;
        })]),
        xAxis = d3.svg.axis()
            .scale(xRange)
            .tickSize(5)
            .tickSubdivide(true),
        yAxis = d3.svg.axis()
            .scale(yRange)
            .tickSize(5)
            .orient('left')
            .tickSubdivide(true);

    vis.append('svg:g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + (HEIGHT - MARGINS.bottom) + ')')
        .call(xAxis);

    vis.append('svg:g')
        .attr('class', 'y axis')
        .attr('transform', 'translate(' + (MARGINS.left) + ',0)')
        .call(yAxis);

    var lineFunc = d3.svg.line()
        .x(function(d) {
            return xRange(d.x);
        })
        .y(function(d) {
            return yRange(d.y);
        })
        .interpolate('linear');

    vis.append('svg:path')
        .attr('d', lineFunc(lineData))
        .attr('stroke', 'blue')
        .attr('stroke-width', 2)
        .attr('fill', 'none');
}

function makePolarGraph(data) {

}

function makeOutputGraph(yValues, numFrequencies) {
    yValues = yValues.map(function(val) { return parseInt(val )});
    document.getElementById("output-graph").innerHTML = "";
    let lineData = [];
    const xValues = makeXValues(yValues);
    const amplitudes = fourier(yValues);
    for (let freq = 0; freq < numFrequencies; freq++) {
        for (let i = 0; i < yValues.length; i++) {
            const dataPoint = {
                x: xValues[i],
                y: yValues[i],
                group: freq
            };
            lineData.push(dataPoint);
        }
    }
     var vis = d3.select('#output-graph'),
        WIDTH = 1000,
        HEIGHT = 500,
        MARGINS = {
            top: 20,
            right: 20,
            bottom: 20,
            left: 50
        },
        xRange = d3.scale.linear().range([MARGINS.left, WIDTH - MARGINS.right]).domain([d3.min(lineData, function (d) {
            return d.x;
        }), d3.max(lineData, function (d) {
            return d.x;
        })]),
        yRange = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([d3.min(lineData, function (d) {
            return d.y;
        }), d3.max(lineData, function (d) {
            return d.y;
        })]),
        xAxis = d3.svg.axis()
            .scale(xRange)
            .tickSize(5)
            .tickSubdivide(true),
        yAxis = d3.svg.axis()
            .scale(yRange)
            .tickSize(5)
            .orient('left')
            .tickSubdivide(true);

    vis.append('svg:g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + (HEIGHT - MARGINS.bottom) + ')')
        .call(xAxis);

    vis.append('svg:g')
        .attr('class', 'y axis')
        .attr('transform', 'translate(' + (MARGINS.left) + ',0)')
        .call(yAxis);

    var lineFunc = d3.svg.line()
        .x(function(d) {
            return xRange(d.x);
        })
        .y(function(d) {
            return yRange(d.y);
        })
        .interpolate('curve');

    vis.append('svg:path')
        .attr('d', lineFunc(lineData))
        .attr('stroke', 'blue')
        .attr('stroke-width', 2)
        .attr('fill', 'none');
}

function makeCombinedOutputGraph(data) {

}

function makeXValues(yValues) {
    var  xValues = [];
    var step = 2*Math.PI/yValues.length;
    for (var x = 0; x < yValues.length * step; x += step) {
        xValues.push(x);
    }
    return xValues;
}