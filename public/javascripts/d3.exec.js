
d3.csv('./data.csv', function(csvdata) {
    var dataset = [];
    for(var i=0; i < csvdata.length; i++) {
        dataset.push(csvdata[i]['value']);
    };
    drawcsv(dataset);
});

d3.json('./schdata.json', function(err, jsondata) {
    var dataset = [];

    jsondata.children.forEach(function(child) 
        {
            dataset.push({
                week: child.week,
                value: child.value
            });
        });

    drawjson(dataset);
});

// draw csvdata in svg 
function drawcsv(dataset) {

    var maindiv = d3.select('.col-sm-10.text-left');
    var svg1 = maindiv.append('svg')
        .attr('width',500)
        .attr('height',300);
    svg1.selectAll('rect')
      .data(dataset)
      .enter()
          .append('rect')
          .attr('x', function(d, i) { return i * 30; })
          .attr('y', function(d, i) { return 300 - d; })
          .attr('width', 15)
          .attr('height', function(d) { return d; })
          .attr('fill', '#ddbaf6')
      ;

    var svg2 = maindiv.append('svg')
        .attr('width',500)
        .attr('height',300);
    svg2.selectAll('circle')
        .data(dataset)
        .enter()
            .append('circle')
            .attr('r', function(d, i) { return d / 10 })
            .attr('fill', '#ddf6ba')
            .attr('cx', function(d) { return d  })
            .attr('cy', function(d, i) { 
                if(i >= 6)
                {
                   return ( i%6*50) 
                }
                else {
                 return (i+1) * 50
                }})
    ;
}

function drawjson(dataset) {
    let maindiv = d3.select('.col-sm-10.text-left');
    let svg1 = maindiv.append('svg')
        .attr('width', 500)
        .attr('height', 300);
    let boxes = svg1.selectAll('boxes')
        .data(dataset)
        .enter()
            .append('g');
    boxes.append('rect')
        .attr('x', function(d, i) { return i * 30; })
        .attr('y', function(d, i) { return 300 - d['value']; })
        .attr('width', function(d) { return d['value']; })
        .attr('height', function(d) { return (d['value'] * 10) - 500;  })
        .attr('fill', '#f6ddba')
    ;
    boxes.append('text')
        .text(function(d) { return d['week'];})
        .attr('y', function(d) { return d['value']; })
        .attr('x', function(d, i) { return i * 30; })
    ;
}
/*
d3.csv("./data.csv", function(error, list){
    d3.select("#result")
        .append("table")
        .selectAll("tr")
        .data(list)
        .enter()
        .append("tr")
        .append("td")
        .text(function(d){
            return d["value"];
        })
});
*/
