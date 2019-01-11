
    $(function() {

        let donutData = directEmailData();
        let donuts = new DonutCharts();
        donuts.create(donutData);
        $('#refresh-btn').on('click', function refresh() {
            let newData = directEmailData()
            donuts.update(newData);
        });
    
    });
    
    

    function DonutCharts() {

        let charts = d3.select('#donut-charts');
        let holyData
        let selectedData = new Array();
        let chart_m,
            chart_r,
            color = d3.scale.category20();

        let getCatNames = function(cat) {
            
            let catNames = new Array();
            for (let i = 0; i < holyData.length; i++) {
                for (let j = 0; j < holyData[i].data.length; j++)
                catNames.push(holyData[i].data[j].cat);
            }
            let idx = catNames.findIndex((el) => el === cat)
            return idx;
        }


        let createLegend = function(catNames) {
            
            let legends = charts.select('.legend')
                            .selectAll('g')
                                .data(catNames)
                            .enter().append('g')
                                .attr('transform', function(d, i) {
                                    return 'translate(' + (i * 150 + 50) + ', 10)';
                                });
    
            legends.append('circle')
                .attr('class', 'legend-icon')
                .attr('r', 6)
                .style('fill', function(d, i) {
                    let colorI = getCatNames(d)
                    return color(colorI);
                });
            
            legends.append('text')
                .attr('dx', '1em')
                .attr('dy', '.3em')
                .text(function(d) {
                    
                    return d;
                    
                });
        }

        let createCenter = function(pie) {

            let eventObj = {
                'mouseover': function(d, i) {
                    d3.select(this)
                        .transition()
                        .attr("r", chart_r * 0.65);
                },

                'mouseout': function(d, i) {
                    d3.select(this)
                        .transition()
                        .duration(500)
                        .ease('bounce')
                        .attr("r", chart_r * 0.6);
                },

                'click': function(d, i) {
                    let paths = charts.selectAll('.clicked');
                    pathAnim(paths, 0);
                    paths.classed('clicked', false);
                    resetAllCenterText();
                }
            }

            let donuts = d3.selectAll('.donut');

            // The circle displaying total data.
            donuts.append("svg:circle")
                .attr("r", chart_r * 0.6)
                .style("fill", "#E7E7E7")
                .on(eventObj);
    
            donuts.append('text')
                    .attr('class', 'center-txt type')
                    .attr('y', chart_r * -0.16)
                    .attr('text-anchor', 'middle')
                    .style('font-weight', 'bold')
                    .text(function(d, i) {
                        return d.type;
                    });
            donuts.append('text')
                .attr('class', 'center-txt catagory')
                .attr('y', chart_r * .36)
                .attr('text-anchor', 'middle')
                .text(function() {
                    return '';
                 });
            donuts.append('text')
                    .attr('class', 'center-txt value')
                    .attr('text-anchor', 'middle');
            donuts.append('text')
                    .attr('class', 'center-txt percentage')
                    .attr('y', chart_r * 0.16)
                    .attr('text-anchor', 'middle')
                    .style('fill', '#A2A2A2');
        }

        let setCenterText = function(thisDonut) {
            let sum = d3.sum(thisDonut.selectAll('.clicked').data(), function(d) {
                return d.data.val;
            });

            thisDonut.select('.catagory')
                .text(function() {
                    return '';
                })

            thisDonut.select('.value')
                .text(function(d) {
                    return (sum)? sum + ' ' + d.unit
                                : d.total + ' ' + d.unit;
                });
            thisDonut.select('.percentage')
                .text(function(d) {
                    return (sum)? (sum/d.total*100).toFixed(2) + '%'
                                : '';
                });
        }

        let resetAllCenterText = function() {
            charts.selectAll('.value')
                .text(function(d) {
                    return d.total + ' ' + d.unit;
                });
            charts.selectAll('.percentage')
                .text('');
        }

        let pathAnim = function(path, dir) {
            switch(dir) {
                case 0:
                    path.transition()
                        .duration(500)
                        .ease('bounce')
                        .attr('d', d3.svg.arc()
                            .innerRadius(chart_r * 0.7)
                            .outerRadius(chart_r)
                        );
                    break;

                case 1:
                    path.transition()
                        .attr('d', d3.svg.arc()
                            .innerRadius(chart_r * 0.7)
                            .outerRadius(chart_r * 1.08)
                        );
                    break;
            }
        }

        let updateDonut = function() {

            let eventObj = {

                'mouseover': function(d, i, j) {
                    pathAnim(d3.select(this), 1);

                    let thisDonut = charts.select('.type' + j);
                                    
                   thisDonut.select('.catagory').text(function() {
                       return d.data.cat;
                   });
                    

                    thisDonut.select('.value').text(function(donut_d) {
                        return d.data.val + ' ' + donut_d.unit;
                    });
                    thisDonut.select('.percentage').text(function(donut_d) {
                        return (d.data.val/donut_d.total*100).toFixed(2) + '%';
                    });
                },
                
                'mouseout': function(d, i, j) {
                    let thisPath = d3.select(this);
                    if (!thisPath.classed('clicked')) {
                        pathAnim(thisPath, 0);
                    }
                    let thisDonut = charts.select('.type' + j);
                    setCenterText(thisDonut);
                },

                'click': function(d, i, j) {
                    let thisDonut = charts.select('.type' + j);
                    if (0 === thisDonut.selectAll('.clicked')[0].length) {
                        thisDonut.select('circle').on('click')();
                    }
                    
                    let thisPath = d3.select(this);
                    let clicked = thisPath.classed('clicked');
                    pathAnim(thisPath, ~~(!clicked));
                    thisPath.classed('clicked', !clicked);
                    selectedData.push(d.data.cat)
                    createLegend(selectedData);

                    setCenterText(thisDonut);
                }
            };

            let pie = d3.layout.pie()
                            .sort(null)
                            .value(function(d) {
                                return d.val;
                            });

            let arc = d3.svg.arc()
                            .innerRadius(chart_r * 0.7)
                            .outerRadius(function() {
                                return (d3.select(this).classed('clicked'))? chart_r * 1.08
                                                                           : chart_r;
                            });

            let paths = charts.selectAll('.donut')
                            .selectAll('path')
                            .data(function(d, i) {
                                return pie(d.data);
                            });

            paths
                .transition()
                .duration(1000)
                .attr('d', arc);

            paths.enter()
                .append('svg:path')
                    .attr('d', arc)
                    .style('fill', function(d, i) {
                        let colorI = getCatNames(d.data.cat)
                        return color(colorI);
                    })
                    .style('stroke', '#FFFFFF')
                    .on(eventObj)

            paths.exit().remove();

            resetAllCenterText();
        }

        this.create = function(dataset) {
            holyData = dataset
            let $charts = $('#donut-charts');
            chart_m = $charts.innerWidth() / dataset.length / 2 * 0.14;
            chart_r = $charts.innerWidth() / dataset.length / 2 * 0.85;


            charts.append('svg')
                .attr('class', 'legend')
                .attr('width', '100%')
                .attr('height', 50)
                .attr('transform', 'translate(0, 500)');

            let donut = charts.selectAll('.donut')
                            .data(dataset)
                        .enter().append('svg:svg')
                            .attr('width', (chart_r + chart_m) * 2)
                            .attr('height', (chart_r + chart_m) * 2)
                        .append('svg:g')
                            .attr('class', function(d, i) {
                                return 'donut type' + i;
                            })
                            .attr('transform', 'translate(' + (chart_r+chart_m) + ',' + (chart_r+chart_m) + ')');

            // createLegend(getCatNames(dataset));
            createCenter();

            updateDonut();
        }
    
        this.update = function(dataset) {
            // Assume no new categ of data enter
            let donut = charts.selectAll(".donut")
                        .data(dataset);

            updateDonut();
        }
    }


    // will need to transl
    //  might need the positive and negative responses to be on a spread sheet
    function directEmailData() {
        let dataset = new Array();
        let data = new Array();

        let noResponse = Math.floor((Math.random() * 100) + 1)
        let pValue = Math.floor((Math.random() * noResponse) + 1)
        let nValue = Math.floor((Math.random() * noResponse) + 1)
        let total = noResponse + pValue + nValue
        let resTotal = pValue + nValue 
        

        function randombetween(min, max){
            return Math.floor(Math.random()*(max - min + 1) + min)
        }
        let day1 = randombetween(1, resTotal - 7)
        let day2 = randombetween(1, resTotal - 6 - day1)
        let day3 = randombetween(1, resTotal - 5 - day1 - day2)
        let day4 = randombetween(1, resTotal - 4 - day1 - day2 - day3)
        let day5 = randombetween(1, resTotal - 3 - day1 - day2 - day3 - day4 )
        let day6 = randombetween(1, resTotal - 2 - day1 - day2 - day3 - day4 - day5)
        let day7 = resTotal - day1 - day2 - day3 - day4 - day5 - day6

        attempt1 = randombetween(1, resTotal - 3)
        attempt3 = randombetween(1, resTotal - 2 - attempt1)
        attempt2 = resTotal - attempt3 - attempt1
        let catagors = ['no response', 'positive', 'negative', 'first day', 'second day',
         'third day', 'fourth day', 'fifth day', 'sixth day', 'seventh day', 
         'first attempt', 'second attempt', 'third attempt']
        let valArr = [noResponse, pValue, nValue, day1, day2, day3, day4, day5, day6, day7, 
            attempt1, attempt2, attempt3]
        for (let j = 0; j < catagors.length; j++){
             data.push({
                'cat': catagors[j],
                'val': valArr[j]
            })
        }

        let types = ['Responses', 'Days', 'Attempts']
        for (let i = 0; i < types.length; i++){
            if (types[i] === 'Responses') {
                dataset.push({
                    'type': types[i], 
                    'data': data.slice(0, 3),
                    'unit': 'emails',
                    'total': total
                }) 
            } else if (types[i] === 'Days') {
                dataset.push({
                    'type': types[i], 
                    'data': data.slice(3, 10),
                    'unit': 'times',
                    'total': resTotal
                })  
            } else if (types[i] === 'Attempts') {
                dataset.push({
                    'type': types[i], 
                    'data': data.slice(10),
                    'unit': 'times',
                    'total': resTotal
                })  
            }
        }
        return dataset;
    }
   