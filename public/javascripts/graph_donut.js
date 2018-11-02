// import email from '/Users/josephrato/Desktop/RejectionEmail/db/emails.js'
console.log(email)
let margin = {top: 60, right: 0, bottom: 0, left: 0};

let width = 600-margin.left-margin.right;
let height = 600-margin.top - margin.bottom;
let fullWidth = width + margin.left+margin.right;
let fullHeight = height+margin.top+margin.bottom;
// console.log('width')
let radius = Math.min(width, height) / 2;

let color = d3.scaleOrdinal(d3.schemeCategory20b);

let svg = d3.select("#chart").append("svg")
    .attr("width", fullWidth)
    .attr("height", fullHeight);

let g = svg.append("g")
    .attr("transform","translate(" + (fullWidth / 2) + "," + (fullHeight / 2) +")")
    .attr("class","chartGroup");

let donutWidth = ( width / 4);

let arc = d3.arc()
    .innerRadius(donutWidth)
    .outerRadius(radius);

let pie = d3.pie()
    .value(function(d) { return d.count})
    .sort(null);

let tooltip = d3.select('#chart')
    .append('div')
    .attr('class','tooltip')

tooltip.append('div')
    .attr('class','label');
tooltip.append('div')
    .attr('class', 'count');
tooltip.append('div')
    .attr('class','percent');



 function graph_viewing(email) {
    // dataset = Object.keys(email).map( idx => {
    //     email[key].payload.body
    // });
    let dataset = email;
    console.log(dataset)
    console.log(email)
let path = g.selectAll('path')
    .data(pie(dataset))
    .enter()
    .append('path')
        .attr('d',arc)
        .attr('fill', function(d,i){
            return color(d.data.label);
        })
    .each(function(d){this._current = d;});

path.on('mousemove', function(d){
      let xposSub = document.getElementById("chart").getBoundingClientRect().left; 
      let xpos = d3.event.x - xposSub + 20  
      let ypos = d3.event.y    
      tooltip.style("left" ,xpos + "px")
      tooltip.style("top", ypos + "px")  
    let total = d3.sum(dataset.map(function(d){
      return (d.enabled) ? d.count : 0;
    }));
  let percent = Math.round(10000 * d.data.count / total) / 100;
  tooltip.select('.label').html(d.data.label);
  tooltip.select('.count').html(d.data.count);
  tooltip.select('.percent').html(percent + '%');
  tooltip.style('display', 'block');
});
   
     
     
path.on('mouseout', function(d){
    tooltip.style('display','none');

});
   
let legendRectSize = 18;
let legendSpacing = 10; 

let legend = g.selectAll('.legend')
    .data(color.domain()) 
    .enter()
        .append('g')
        .attr('class','legend')
        .attr('transform', function(d,i){
            let height = legendRectSize + legendSpacing;
            let offset = height * color.domain().length / 2;
            let horz = -2 * legendRectSize;
            let vert = i * height-offset;
            return 'translate(' + horz + ',' + vert + ')';
        });

    legend.append('rect')
        .attr('width',legendRectSize)
        .attr('height',legendRectSize)
        .style('fill',color)
        .style('stroke',color)

        .on('click', function(label){
        let rect = d3.select(this);
  let enabled = true;
  let totalEnabled = d3.sum(dataset.map(function(d) {
    return (d.enabled) ? 1 : 0;
  }));

  if (rect.attr('class') === 'disabled') {
    rect.attr('class', '');
  } else {
    if (totalEnabled < 2) return;
    rect.attr('class', 'disabled');
    enabled = false;
  }

  pie.value(function(d) {
    if (d.label === label) d.enabled = enabled;
    return (d.enabled) ? d.count : 0;
  });

  path = path.data(pie(dataset));

  path.transition()
    .duration(750)
    .attrTween('d', function(d) {
      let interpolate = d3.interpolate(this._current, d);
      this._current = interpolate(0);
      return function(t) {
        return arc(interpolate(t));
      };
    });
    });


legend.append('text')
  .attr('x', legendRectSize + legendSpacing)
  .attr('y', legendRectSize - legendSpacing)
  .attr('style','font-size: 18')
  .attr('alignment-baseline','middle')
  .text(function(d) { return d; });

 };

 graph_viewing(email);