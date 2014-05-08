/* global d3:false */

'use strict';

var width = 700,
    height = 700,
    radius = Math.min(width, height) / 2,
    color = d3.scale.category20c();

// Breadcrumb dimensions: width, height, spacing, width of tip/tail.
var b = {
    w: 140,
    h: 30,
    s: 3,
    t: 10
};

var currentYear = '1314';

var vis = d3.select('#chart').append('svg')
    .attr('width', width)
    .attr('height', height);

// group for pie
var pieGroup = vis.append('svg:g')
    .attr('class', 'pie')
    .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

var partition = d3.layout.partition()
    .sort(null)
    .size([2 * Math.PI, radius * radius])
    .value(function(d) { return d.value; });

var arc = d3.svg.arc()
    .startAngle(function(d) { return d.x; })
    .endAngle(function(d) { return d.x + d.dx; })
    .innerRadius(function(d) { return Math.sqrt(d.y); })
    .outerRadius(function(d) { return Math.sqrt(d.y + d.dy); });

var path;

String.prototype.trunc =
    function(n) {
        var tooLong = this.length>n,
            s = tooLong ? this.substr(0,n-1) : this;
        s = tooLong ? s.substr(0, n) : s;
        return  tooLong ? s + '...' : s;
    };

function addCommas(string) {
    return string.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
}

function roundToDP(number, decimalPlaces) {
    var factor = Math.pow(10,decimalPlaces);
    return Math.round(factor*number)/factor;
}

function commaSeparateNumber(val) {
    while (/(\d+)(\d{3})/.test(val.toString())){
        val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
    }
    return val;
}

function populateSidebar(budgetItem) {
    var name = (budgetItem.name === 'total' ? 'Total Government Expenditure' : budgetItem.name);
    $('#item_name').text(name);
    $('#value1213').text('$' + addCommas(roundToDP(budgetItem.value1213/1000,0).toString()) + ' million');
    $('#value1314').text('$' + addCommas(roundToDP(budgetItem.value1314/1000,0).toString()) + ' million');
    $('#value_change').text(roundToDP(100*budgetItem.value1314/budgetItem.value1213 - 100, 1).toString() + '%');
    $('#individual_taxpayer').text('$' + addCommas(roundToDP(budgetItem.value1314*1000/23022031, 2).toString()));
    if (!budgetItem.children) {
        $('#item_description').text(budgetItem.description || 'None available');
        $('#item_source').html('<a href="' + budgetItem.url + '">' + budgetItem.sourceDocument + ' (' + budgetItem.sourceTable + ')</a>');
    } else {
        $('#item_description').text(budgetItem.description || 'None available');
        $('#item_source').html('');
    }
}

// Stash the old values for transition.
function stash(d) {
    d.x0 = d.x;
    d.dx0 = d.dx;
}

// Interpolate the arcs in data space.
function arcTween(a) {
    var i = d3.interpolate({x: a.x0, dx: a.dx0}, a);
    return function(t) {
        var b = i(t);
        a.x0 = b.x;
        a.dx0 = b.dx;
        return arc(b);
    };
}

function isChild(child, name) {
    var parent = child.parent;
    while (parent) {
        if (parent.name === name) {
            return true;
        }
        else {
            parent = parent.parent;
        }
    }
    return false;
}

function findElementFromName(name) {
    var element = null;
    pieGroup.selectAll('path')
        .data(partition.nodes).each(function(d) {
            if (d.name === name) {
                element = d;
            }
        });
    return element;
}

function updatePieAnnotation(element) {
    $('.total_body').text('$' + commaSeparateNumber((element.value/1000).toFixed(0)) + 'm');
    if (element.name === 'total') {
        $('.total_head').text('Total Government Expenditure');
    } else {
        $('.total_head').text(element.name);
    }
}

function updatePie(year) {
    path.data(partition.value(function(d) {
        if (d.value1314 === null){
            return d.value;
        }
        else {
            if (year === '1314' ) {
                return d.value1314;
            }
            else if (year === '1213') {
                return d.value1213;
            }
        }
    }))
    .transition()
    .duration(1500)
    .attrTween('d', arcTween);
    currentYear = year;

    updatePieAnnotation(findElementFromName('total'));
}

function dive(element) {
    // reset all values if click total
    if (element.name === 'total') {
        $('.click_reset').hide();
        updatePie(currentYear);
    }
    else {
        path.data(partition.value(function(d) {
            if (d.name !== element.name && !isChild(d, element.name)) {
                return 0;
            } else {
                if (currentYear === '1314' ) {
                    return d.value1314;
                }
                else if (currentYear === '1213') {
                    return d.value1213;
                }
            }
        }))
        .transition()
        .duration(1500)
        .attrTween('d', arcTween);
        updatePieAnnotation(element);
        $('.click_reset').show();
    }
}

function highlight(budgetItem) {
    d3.selectAll('path').style('opacity', function(d) {
        if (d.name !== budgetItem.name && !isChild(d, budgetItem.name)) {
            return 0.6;
        } else {
            return 1;
        }
    });
}

function initializeBreadcrumbTrail() {
    // Add the svg area.
    var trail = d3.select('#breadcrumbs').append('svg:svg')
        .attr('width', width)
        .attr('height', 50)
        .attr('id', 'trail');
}

// Generate a string that describes the points of a breadcrumb polygon.
function breadcrumbPoints(d, i) {
    var points = [];
    points.push('0,0');
    points.push(b.w + ',0');
    points.push(b.w + b.t + ',' + (b.h / 2));
    points.push(b.w + ',' + b.h);
    points.push('0,' + b.h);
    if (i > 0) { // Leftmost breadcrumb; don't include 6th vertex.
        points.push(b.t + ',' + (b.h / 2));
    }
    return points.join(' ');
}

// Update the breadcrumb trail to show the current sequence.
function updateBreadcrumbs(nodeArray) {
    // Data join; key function combines name and depth (= position in sequence).
    var g = d3.select('#trail')
      .selectAll('g')
      .data(nodeArray, function(d) { return d.name + d.depth; });

    // Add breadcrumb and label for entering nodes.
    var entering = g.enter().append('svg:g');

    entering.append('svg:polygon')
      .attr('points', breadcrumbPoints)
      .style('fill', function(d) { return color(d.y); });

    entering.append('svg:text')
      .attr('x', (b.w + b.t) / 2)
      .attr('y', b.h / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'middle')
      .text(function(d) {
            return d.name.trunc(16);
        });

    // Set position for entering and updating nodes.
    g.attr('transform', function(d, i) {
        return 'translate(' + i * (b.w + b.s) + ', 0)';
    });

    // Remove exiting nodes.
    g.exit().remove();

    // Make the breadcrumb trail visible, if it's hidden.
    d3.select('#trail')
      .style('visibility', '');
}

// Given a node in a partition layout, return an array of all of its ancestor
// nodes, highest first, but excluding the root.
function getAncestors(node) {
    var path = [];
    var current = node;
    while (current.parent) {
        path.unshift(current);
        current = current.parent;
    }
    return path;
}

d3.json('/data/budget.json', function(json) {
    initializeBreadcrumbTrail();
    path = pieGroup.data([json]).selectAll('path')
                .data(partition.nodes).enter().append('path')
                .attr('d', arc)
                .attr('fill-rule', 'evenodd')
                .style('opacity', 0.6)
                .style('stroke', '#fff')
                .style('fill', function(d, i) {
                    if (d.depth === 0) {
                        return '#fff';
                    }
                    return color(i);
                })
                .each(stash)
                .on('click', function(d) {
                    window.location.hash = '#' + encodeURIComponent(d.name);
                    dive(d);
                })
                .on('mouseover', function(d) {
                    updateBreadcrumbs(getAncestors(d));
                    highlight(d);
                    populateSidebar(d);
                });
    updatePie(currentYear);
    if (window.location.hash) {
        var currentElement = findElementFromName(decodeURIComponent(window.location.hash.replace('#', '')));
        dive(currentElement);
        populateSidebar(currentElement);
    } else {
        populateSidebar([json][0]);
    }
});

$('#1213').click(function() {
    updatePie('1213');
});
$('#1314').click(function() {
    updatePie('1314');
});

// group for centre text
var centreGroup = vis.append('svg:g')
  .attr('class', 'centreGroup')
  .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

centreGroup.append('svg:text')
  .attr('class', 'total_head')
  .attr('dy', -15)
  .attr('text-anchor', 'middle') // text-align: right
  .text('');
centreGroup.append('svg:text')
  .attr('class', 'total_body')
  .attr('dy', 15)
  .attr('text-anchor', 'middle') // text-align: right
  .text('');
centreGroup.append('svg:text')
  .attr('class', 'click_reset')
  .attr('dy', 60)
  .attr('text-anchor', 'middle') // text-align: right
  .text('click to zoom out');

$('.total_head, .total_body, .click_reset').click(function() {
    dive(findElementFromName('total'));
});

$('.click_reset').hide();
