/**
 * please import javascript source with d3js V4.10
 */



var _instance = null;
var _flowIcons = [];
var _connectLines = [];

class SVGFlow {

	
	/*
	 * Constructor
	 * @svgid: the id-name of svg tag
	 */
	constructor(svgid) {
		this._id = svgid;
		this._palletIcons = [];
		
	}
	
	init() {
		
		_instance = this;
		//TODO : template will be custom
		for(var i=0; i<10; i++ ) { 
			var icon =  {

					name : 'No.'+i
			}
			this._palletIcons.push(icon);
		}
		var svg = d3.select(this._id);
		
		
		var cg = svg.attr('height', 800)
				.attr('width', 800)
				.selectAll('g')
				.data(this._palletIcons)				
				.enter()
				.append('g')
				.call(d3.drag().on("end", function(d , i) { 
						_instance.ondragTemplete(this, d, i);
					}))	;
		
		this._svgheight =  svg.attr('height');
		this._svgwidth = svg.attr('width');
		
		var circles = cg.append('circle')
					.attr('class', 'circle_templete')
					.attr('id', function(d, i) { return 'c' + i ;})
					.attr('cx', 80)
					.attr('r', function(d, i) { return d.radius; })
					.attr('fill', function(d, i) { return d.fill; })
					.attr('cy', 60)				
					.transition()
					.duration(500)
					.attr('cy', function(d,i) { return i * 60 + 60;})
					
					
		cg.append('text')
				.attr('class', 'circle_text_templete')
				.attr('x', '80')
				.attr('y', function(d, i) { return i * 60 + 70;})
				.attr('text-anchor', 'middle')
				.text(function(d,i) {return d.name;})

				
		var gPanel = svg.append('g')
			.attr('id', 'gPanel')
		gPanel.append('g')
				.attr('id', 'gConnectLines')
		gPanel.append('g')
				.attr('id', 'gIcons')
			/*
			.call(d3.drop().on('drop', function() {
				console.log("Drop!!!");
			}))
			*/
		/*	.on('mouseup', function() {
				console.log("MouseUp");
			})*/
			;
		
	}

	ondragTemplete(sender, template=null, idx=0) {
		var group = d3.select(sender);
		//var gIcons  = d3.select('#gIcons');
		//console.log(template);
		var title = group.select('text').text();
		
		this._sid = 0;
	
		var icon =  {
				name : title + ' ' + idx,
				x : d3.event.x,
				y : d3.event.y,
				index : this._sid++ ,				
		}
			
		_flowIcons.push(icon);
		
		
		var pg = d3.select('#gIcons').selectAll('g')
				.data(_flowIcons)
				.enter()
				.append('g')
				.attr('id', function(d, i) { return 'ginp' + i ;})
				
				.call(d3.drag()
						
						.on('drag', function(d) { 											
							_instance.onremoveCircle(this, d);
						})
					
				)
				.on('mouseover', function() {
				
					//d3.event.stopPropagation(); 
					
					var center = d3.select(this).select('.circle_in_panel_center');
					center.style('visibility', 'visible')
						  .style('cursor', 'hand');
				})
				.on('mouseout', function() {
					var center = d3.select(this).select('.circle_in_panel_center');
					center.style('visibility', 'hidden');
				})
				.on('click', function(d, i) {
				
					var item = d3.select(this).select('.circle_in_panel');
					var selected = item.classed('selected');
					item.classed('selected', !selected);
					d3.select(this).classed('selected', !selected);
				})
				;
		

		pg.append('circle')
			.attr('class', 'circle_in_panel')
			.attr('id', function(d, i) { return 'c' + i ;})
			
			.attr('cx', group.select('.circle_templete').attr('cx'))		
			.attr('cy', group.select('.circle_templete').attr('cy'))				
		    .transition()
			.duration(300)
			
			.attr('cx', d3.event.x)
			.attr('cy', d3.event.y);
		
		pg.append('text')
				.attr('class', 'circle_text_templete')
				
				.attr('x', d3.event.x)
				.attr('y', d3.event.y + 10 )
				.attr('text-anchor', 'middle')
				.text(function(d,i) { return (title==='') ? d.name : title;})
				;
		pg.append('circle')
			.attr('class', 'circle_in_panel_center')
			.attr('id', function(d, i) {return 'c_center' +i ;})
			.attr('cx', d3.event.x)
			.attr('cy', d3.event.y)
			.attr('r', 5)
			.style('visibility', 'hidden')
			/*.on('click', function(d, i) {
				//d3.event.stopPropagation();
				//d3.event.preventDefault();
				//console.log('circle_in_panel_center is click!' + d3.event.defaultPrevent );
			})*/
			.call(d3.drag()
					 	.on('start', function(d, i) { 		
							
				
					 		var pgroup = d3.select(this.parentNode);
					 		var cc = d3.select(this);
					 		pgroup.append('line')
							.attr('id', 'decoration_line_' + cc.attr('id'))
							.style('opacity', 0.5)
							.style('stroke', 'gray')
							.attr('x1', cc.attr('cx'))
							.attr('y1', cc.attr('cy'))
							.attr('x2', d3.event.x)
							.attr('y2', d3.event.y)
							;
					 	})
						.on('drag', function(d, i) { 		
							var cc = d3.select(this);
							var pos = d3.mouse(this);
							d3.select(this.parentNode).select('#decoration_line_' + cc.attr('id'))
								.attr('x2', pos[0])
								.attr('y2', pos[1]);					
						})
						.on('end', function(d, i) {
							
							//remove the decoration line.
							var ghostline = d3.select(this.parentNode).select(
										'#decoration_line_' + d3.select(this).attr('id'));
							ghostline.style('opactiy', 1e-6)
									.transition()
									.duration(200)
									.style('opactiy', 0)
									.remove();
							
							d3.select(this).style('visibility', 'hidden');
							
							var target = d3.select(d3.event.sourceEvent.target);
							if(target.attr('class') !== 'circle_in_panel_center') {
								return;
							}
							if(d3.select(d3.event.sourceEvent.target).data().length <= 0) {
								return;
							}
							var targetdata = d3.select(d3.event.sourceEvent.target).data()[0];
							
							var stdata = {
									source : d,
									target : targetdata,
								};
							
							// check the line is existed
							var existed = _connectLines.some(function(element, index, array){
								
								return (element.source.index === stdata.source.index &&
									element.target.index === stdata.target.index) ||
									(element.target.index === stdata.source.index &&
									element.source.index === stdata.target.index);
							});
							
							
							//if the same line is existed
							if(existed) return;
							
							
							_instance.drawLines({
								source : this.parentNode,
								target : d3.event.sourceEvent.target.parentNode,
							}, {
								source : d,
								target : targetdata,
							});
						})
						);
				
		
		pg.exit().remove();
	}
	
	
	onremoveCircle(sender, data) {
		var group = d3.select(sender);
		var circle = group.selectAll('circle');		
		var text = group.select('text');
		

		data.x = d3.event.x < 0 ? 0 : d3.event.x > this._svgwidth ? this._svgwidth :  d3.event.x;
		data.y = d3.event.y < 0 ? 0 : d3.event.y > this._svgheight ? this._svgheight : d3.event.y;
		

		circle.attr('cx', data.x)
			.attr('cy', data.y);
		text.attr('x', data.x)
			.attr('y', data.y +10);
		
		var startlines = d3.selectAll('.start_' + group.attr('id'))
				.attr('x1',  data.x)
				.attr('y1',  data.y);
		var endlines = d3.selectAll('.end_' + group.attr('id'))
				.attr('x2',  data.x)
				.attr('y2',  data.y);
	
	}
	
	drawLines(sender, data=null) {
		if(data !== null ) _connectLines.push(data);

		var startcircle = d3.select(sender.source);
		var endcircle = d3.select(sender.target);
		
		
		var startname = 'start_' + startcircle.attr('id'),
			endname = 'end_' + endcircle.attr('id');
			
		var glines = d3.select('#gConnectLines');
		glines.selectAll('line')
				.data(_connectLines)
				.enter()		
					.append('line')
					.attr('id', startname + '_' + endname)
					.attr('class', 'connect_line ' + startname + ' ' + endname)
					.attr('x1', function(d) {return d.source.x;})
					.attr('y1', function(d) {return d.source.y;})
					.attr('x2', function(d) {return d.target.x;})
					.attr('y2', function(d) {return d.target.y;})
					.attr('stroke-width', 5)
					.on('click', function(d, i) {
						var item = d3.select(this);
						var selected = item.classed('selected');
						item.classed('selected', !selected);
						d3.select(this).classed('selected', !selected);
					})
					;
			
	}
	
	
	deleteNode() {
		
		var svg = d3.select(this._id);
		var selectedCircles = svg.selectAll('g.selected');
		var removedatas = selectedCircles.data();
		
		
		
		
		if(removedatas) {
			
			removedatas.forEach(function(data) {
				//Search the start connect line and delete it. 
				var startlines = d3.select('#gConnectLines').selectAll('line.connect_line')
						.filter('.start_ginp' + data.index);

				_instance.deleteLine(startlines);
				
				//Search the end connect line and delete it. 
				var endlines = d3.select('#gConnectLines').selectAll('line.connect_line')
						.filter('.end_ginp' + data.index);

				_instance.deleteLine(endlines);
	
				//Delete the icon in flow of data.
				var index = _flowIcons.indexOf(data);
				if(index >-1 ) _flowIcons.splice(index, 1);	
				
				
			});
		}
		
		selectedCircles.remove();

		
		
	}
	
	
	
	deleteLine(lines=null) {
		var svg = d3.select(this._id);
		if(lines===null) {
			
			lines = svg.selectAll('line.selected');

		}
			
		var removedatas = lines.data();
		if(removedatas) {
			removedatas.forEach(function(data) {
				var index = _connectLines.indexOf(data);
				if(index > -1 ) _connectLines.splice(index, 1);				
			});0
		}

		lines.remove();
	
		console.log(_connectLines);
	}
	
	reset() {
		var svg = d3.select(this._id);
		console.log(svg.selectAll());
		console.log("RESET!!");
	}

	createnewcircle() {
		
	}
	
}
