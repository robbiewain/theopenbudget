/* global d3:false */

'use strict';

var greens = ["#f7fcf5","#e5f5e0","#c7e9c0","#a1d99b","#74c476","#41ab5d","#238b45","#006d2c","#00441b"];
var reds = ["#fff5f0","#fee0d2","#fcbba1","#fc9272","#fb6a4a","#ef3b2c","#cb181d","#a50f15","#67000d"];

var current_element, hover_out_timer;
var width = 700,
    height = 700,
    radius = Math.min(width, height) / 2,
    color = d3.scale.category20c();

// Breadcrumb dimensions: width, height, spacing, width of tip/tail.
var b = {
    w: 133,
    h: 44,
    s: 3,
    t: 10
};

var firstBreadCrumbWidth = 50;

var currentYear = '1415';

var showChanges = true;

var vis = d3.select('#chart').append('svg')
    .attr('width', width)
    .attr('height', height);

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

function formatLabels(number){
    var label = "";
    if (number > 999499) {
        label = '$' + addCommas(roundToDP(number/1000000,1).toString()) + 'b';
    } else {
        label = '$' + addCommas(roundToDP(number/1000,0).toString()) + 'm';
    }
    return label;
}

function commaSeparateNumber(val) {
    while (/(\d+)(\d{3})/.test(val.toString())){
        val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
    }
    return val;
}

function populateSidebar(budgetItem) {
    var name = (budgetItem.i === 0 ? 'Total Government Expenditure' : budgetItem.n);
    $('#item_name').text(name);
    if(name.length > 100){
        $('#item_name').addClass("small");
    } else {
        $('#item_name').removeClass("small");
    }
    redrawChart(budgetItem);
    $('#individual_taxpayer').text('$' + addCommas(roundToDP(budgetItem.v2*1000/23022031, 2).toString()));
    if (!budgetItem.children) {
        $("#source_row").show();
        $('#item_source').html('<a href="' + budgetItem.u + '">' + budgetItem.sd + ' (' + budgetItem.st + ')</a>');
    } else {
        $("#source_row").hide();
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

function isChild(child, id) {
    var parent = child.parent;
    while (parent) {
        if (parent.i === id) {
            return true;
        }
        else {
            parent = parent.parent;
        }
    }
    return false;
}

function findElementFromID(pie_id) {
    var element = null;
    pieGroup.selectAll('path')
        .data(partition.nodes).each(function(d) {
            if (d.i === pie_id) {
                element = d;
            }
        });
    return element;
}

function updatePieAnnotation(element) {
    $('.total_body').text('$' + commaSeparateNumber((element.value/1000).toFixed(0)) + 'm');
    if (element.i === 0) {
        $('.total_head').text('Total Government Expenditure');
    } else {
        $('.total_head').text(element.n);
    }
}

function updatePie(year) {
    path.data(partition.value(function(d) {
        if (d.v2 === null){
            return d.value;
        }
        else {
            if (year === '1415' ) {
                return d.v2;
            }
            else if (year === '1314') {
                return d.v1;
            }
            else if (year === '1516') {
                return d.v3;
            }
            else if (year === '1617') {
                return d.v4;
            }
            else if (year === '1718') {
                return d.v5;
            }
        }
    }))
    .transition()
    .duration(1500)
    .attrTween('d', arcTween);
    currentYear = year;
    current_element = findElementFromID(0);
    updateBreadcrumbs(getAncestors(current_element));
    populateSidebar(current_element);
    updatePieAnnotation(findElementFromID(0));
}

function dive(element) {
    // reset all values if click total
    if (element.i === 0) {
        updatePie(currentYear);
    }
    else {
        path.data(partition.value(function(d) {
            if (d.i !== element.i && !isChild(d, element.i)) {
                return 0;
            } else {
                if (currentYear === '1415' ) {
                    return d.v2;
                }
                else if (currentYear === '1314') {
                    return d.v1;
                }
                else if (currentYear === '1516') {
                    return d.v3;
                }
                else if (currentYear === '1617') {
                    return d.v4;
                }
                else if (currentYear === '1718') {
                    return d.v5;
                }
            }
        }))
        .transition()
        .duration(1500)
        .attrTween('d', arcTween);
        updatePieAnnotation(element);
    }
}

function dive_and_update(element){
    updateBreadcrumbs(getAncestors(element));
    window.location.hash = '#' + encodeURIComponent(element.i);
    dive(element);
    populateSidebar(element);
    current_element = element;
}

function highlight(budgetItem) {
    d3.selectAll('path.pie_piece').style('opacity', function(d) {
        if (d.i !== budgetItem.i && !isChild(d, budgetItem.i)) {
            return 0.6;
        } else {
            return 1;
        }
    });
}

function initializeBreadcrumbTrail() {
    // Add the svg area.
    d3.select('#breadcrumbs').append('svg:svg')
        .attr('width', 740)
        .attr('height', 50)
        .attr('id', 'trail');
}

// Generate a string that describes the points of a breadcrumb polygon.
function breadcrumbPoints(d, i) {
    var bcWidth = b.w;
    if (i === 0) {
        bcWidth = firstBreadCrumbWidth;
    }
    var points = [];
    points.push('0,0');
    points.push(bcWidth + ',0');
    points.push(bcWidth + b.t + ',' + (b.h / 2));
    points.push(bcWidth + ',' + b.h);
    points.push('0,' + b.h);
    if (i > 0) { // Leftmost breadcrumb; don't include 6th vertex.
        points.push(b.t + ',' + (b.h / 2));
    }
    return points.join(' ');
}

function wrap(text, width) {
    text.each(function() {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            y = text.attr('y'),
            dy = parseFloat(text.attr('dy')),
            tspan = text.text(null).append("tspan").attr("x", 15).attr("y", y);
        var lines = [tspan];
        while ((word = words.pop()) && (lines.length < 4)) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan").attr("x", 15).attr("y", y).text(word);
                lines.push(tspan);
            }
        }
        if (lines.length == 1) {
            lines[0].attr("y", 21);
        }
        if (lines.length == 2) {
            lines[0].attr("y", 15);
            lines[1].attr("y", 31);
        }
        if (lines.length > 2) {
            lines[0].attr("y", 9);
            lines[1].attr("y", 25);
            lines[2].attr("y", 37);
        }
        if (lines.length == 4){
            lines[3].remove();
        }
    });
}

// Update the breadcrumb trail to show the current sequence.
function updateBreadcrumbs(nodeArray) {
    // Show Total as the 'home breadcrumb' unless there are no items to display
    if (nodeArray.length > 0)
    {
        nodeArray.splice(0, 0, {
            i: 0,
            n: 'Total',
            depth: 0
        });
    }
    // Data join; key function combines name and depth (= position in sequence).
    var g = d3.select('#trail')
      .selectAll('g')
      .data(nodeArray, function(d) { return d.n + d.depth; });

    // Add breadcrumb and label for entering nodes.
    var entering = g.enter().append('svg:g');

    entering.append('svg:polygon')
      .attr('points', breadcrumbPoints)
      .style('fill', function(d) {
        if (d.depth === 0) {
            return '#777';
        } else {
            return d.color;
        }
    })
      .attr('class', 'breadcrumb')
      .attr('pie_id', function(d){
          return d.pie_piece_counter;
      })
      .on("click",function(d){
        if (d.depth == 0){
            dive_and_update(findElementFromID(0));
        } else {
            dive_and_update(d);
        }
      });

    entering.append('svg:text')
      .attr('x', 0)
      .attr('y', 10)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'left')
      .attr('class', 'breadcrumb_text')
      .text(function(d) {
            return d.n.trunc(60);
        })
      .call(wrap, b.w - 20)
      .attr('class', 'breadcrumb_text');

    $('.breadcrumb_text').click(function(){
        $(this).prev().d3Click();
    });

    // Set position for entering and updating nodes.
    g.attr('transform', function(d, i) {
        if (i === 0) {
            return '';
        } else {
            return 'translate(' + (((i - 1) * (b.w + b.s)) + firstBreadCrumbWidth + b.s) + ', 0)';
        }
    });

    // Remove exiting nodes.
    g.exit().remove();

    // Make the breadcrumb trail visible, if it's hidden.
    d3.select('#trail').style('visibility', '');
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

function updateColors(d) {
    var c;
    if (d.depth === 0) {
        c = '#fff';
    } else {
        if (showChanges) {
            var pc = 0;
            pc = (d.v2 - d.v1) / d.v2;
            if (pc < -0.64) {
                c = reds[8];
            } else if (pc < -0.32) {
                c = reds[7];
            } else if (pc < -0.16) {
                c = reds[6];
            } else if (pc < -0.08) {
                c = reds[5];
            } else if (pc < -0.04) {
                c = reds[4];
            } else if (pc < -0.02) {
                c = reds[3];
            } else if (pc < -0.01) {
                c = reds[2];
            } else if (pc < 0) {
                c = reds[1];
            } else if (pc === 0) {
                c = "ccc";
            } else if (pc < 0.01) {
                c = greens[1];
            } else if (pc < 0.02) {
                c = greens[2];
            } else if (pc < 0.04) {
                c = greens[3];
            } else if (pc < 0.08) {
                c = greens[4];
            } else if (pc < 0.16) {
                c = greens[5];
            } else if (pc < 0.32) {
                c = greens[6];
            } else if (pc < 0.64) {
                c = greens[7];
            } else {
                c = greens[8];
            }
        } else {
            c = color(d.i);
        }
    }
    d.color = c;
    return c;
}

d3.json('/data/budget.json', function(json) {
    initializeBreadcrumbTrail();
    path = pieGroup.data([json]).selectAll('path')
                .data(partition.nodes).enter().append('path')
                .attr('d', arc)
                .style('opacity', 0.6)
                .style('stroke', '#fff')
                .style('fill', updateColors)
                .attr("class", "pie_piece")
                .each(stash)
                .on('click', function(d) {
                    dive_and_update(d);
                })
                .on('mouseover', function(d) {
                    clearTimeout(hover_out_timer);
                    highlight(d);
                    populateSidebar(d);
                })
                .on('mouseout', function(d){
                    hover_out_timer = setTimeout(function(){
                        populateSidebar(current_element);
                    }, 25);
                });
    updatePie(currentYear);
    if (window.location.hash) {
        var currentElement = findElementFromID(parseInt(decodeURIComponent(window.location.hash.replace('#', ''))));
        dive_and_update(currentElement);
    } else {
        current_element = findElementFromID(0);
        populateSidebar(current_element);
    }
});

$('.year_toggle').click(function(e) {
    updatePie($(this).attr("id"));
    $("#current_view_selection").text($(this).text());
    $("text.total_caption").text($(this).text() + ":");
    e.preventDefault();

});

// group for centre text
var centreGroup = vis.append('svg:g')
  .attr('class', 'centreGroup')
  .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

centreGroup.append('svg:text')
  .attr('class', 'total_body')
  .attr('dy', 15)
  .attr('text-anchor', 'middle') // text-align: right
  .text('');

centreGroup.append('svg:text')
  .attr('class', 'total_caption')
  .attr('dy', -15)
  .attr('text-anchor', 'middle') // text-align: right
  .text('14-15 BUDGET:');


$('.total_body').click(function() {
    dive(findElementFromID(0));
});

function queryTokenizer(s) { return s.replace('(', '').replace(')', '').split(/\s+/); }
function datumTokenizer(d) { return Bloodhound.tokenizers.nonword(d.t.replace(')','').replace('(','')); }

var portfolios = new Bloodhound({
    datumTokenizer: datumTokenizer,
    queryTokenizer: queryTokenizer,
    prefetch: {
        url: '/data/portfolios.json',
        ttl: 300000,
        cacheKey: 'portfoliosCache'
    }
});

var departments = new Bloodhound({
    datumTokenizer: datumTokenizer,
    queryTokenizer: queryTokenizer,
    prefetch: {
        url: '/data/departments.json',
        ttl: 300000,
        cacheKey: 'departmentsCache'
    }
});

var outcomes = new Bloodhound({
    datumTokenizer: datumTokenizer,
    queryTokenizer: queryTokenizer,
    prefetch: {
        url: '/data/outcomes.json',
        ttl: 300000,
        cacheKey: 'outcomesCache'
    }
});

var programs = new Bloodhound({
    datumTokenizer: datumTokenizer,
    queryTokenizer: queryTokenizer,
    prefetch: {
        url: '/data/programs.json',
        ttl: 300000,
        cacheKey: 'programsCache'
    }
});

var descriptions = new Bloodhound({
    datumTokenizer: datumTokenizer,
    queryTokenizer: queryTokenizer,
    prefetch: {
        url: '/data/descriptions.json',
        ttl: 300000,
        cacheKey: 'descriptionsCache'
    }
});

portfolios.initialize();
departments.initialize();
outcomes.initialize();
programs.initialize();
descriptions.initialize();

$('#searchBox').typeahead(
    {
      highlight: true
    },
    {
      name: 'portfolios',
      displayKey: 't',
      source: portfolios.ttAdapter(),
      templates: {
        header: '<h3 class="searchHeading">Portfolios</h3>'
      }
    },
    {
      name: 'departments',
      displayKey: 't',
      source: departments.ttAdapter(),
      templates: {
        header: '<h3 class="searchHeading">Departments</h3>'
      }
    },
    {
      name: 'outcomes',
      displayKey: 't',
      source: outcomes.ttAdapter(),
      templates: {
        header: '<h3 class="searchHeading">Outcomes</h3>'
      }
    },
    {
      name: 'programs',
      displayKey: 't',
      source: programs.ttAdapter(),
      templates: {
        header: '<h3 class="searchHeading">Programs</h3>'
      }
    },
    {
      name: 'descriptions',
      displayKey: 't',
      source: descriptions.ttAdapter(),
      templates: {
        header: '<h3 class="searchHeading">Line items</h3>'
      }
    }
);
$('#searchBox').bind('typeahead:selected', function(obj, datum, name) {
  dive_and_update(findElementFromID(datum.i));
});

jQuery.fn.d3Click = function () {
  this.each(function (i, e) {
    var evt = document.createEvent("MouseEvents");
    evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);

    e.dispatchEvent(evt);
  });
};

function DropDown(el) {
    this.dd = el;
    this.initEvents();
}
DropDown.prototype = {
    initEvents : function() {
        var obj = this;

        obj.dd.on('click', function(event){
            $(this).toggleClass('active');
            event.stopPropagation();
        });
    }
}

$(function() {

    var dd = new DropDown( $('#dd') );

    $(document).click(function() {
        // all dropdowns
        $('.wrapper-dropdown-2').removeClass('active');
    });

});

