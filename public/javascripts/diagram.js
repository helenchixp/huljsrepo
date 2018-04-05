/**
 * please import javascript source with d3js V4.10
 */

const scaleX = 60,
	  scaleY = 250000;

var xScale, yScale, xAxis, yAxis;

const processfill = ['gray', 'lightsteelblue', 'skyblue', 'lightpink', 'plum', 'khaki', 'linen', 'white'];

const margin = {top: 30, right: 20, bottom: 30, left: 50};




class PolylineGraph {

	/*
	 * コンストラクタ
	 * @svg : 表示するd3のsvgオブジェクトを指定
	 * @costdata : コストテーブルから取得したJSONデータを格納
	 */
	constructor(svg, costdata) {
		
		this._costdata = costdata;
		
		//ヘッド文字列
		this._header = [];
		this._svg = svg;
	}
	/*
	 * SVGのサイズや、座標を初期化します。
	 */
	initGraph() {
		
		var header = [];
		var cols = 0;
		var minValue = 0, maxValue = 0;
		
		//データによって、ヘッダ、最大値、最小値を計算
		this._costdata.forEach(function(data) {
			header.push(data.scheduleMonth);
			
			if(data.planValue < minValue) minValue = data.planValue;
			if(data.actualValue < minValue) minValue = data.actualValue;
			if(data.expectValue < minValue) minValue = data.expectValue;
			
			if(data.planValue > maxValue) maxValue = data.planValue;
			if(data.actualValue > maxValue) maxValue = data.actualValue;
			if(data.expectValue > maxValue) maxValue = data.expectValue;
			
			cols ++;
		});		
		this._header = header;
		this._minValue = minValue / scaleY;
		this._maxValue = minValue / scaleY;
		
		this._width = (header.length -1) * scaleX;
		this._height = (maxValue - minValue) / scaleY;
		this._svggroup = this._svg.attr('width', this._width + margin.left + margin.right)
			.attr('height', this._height + margin.top + margin.bottom)	
			.call(d3.zoom().scaleExtent([0.5, 3]).on("zoom", function() {
							var svgg = d3.select(this).select('g');
							svgg.attr('transform', d3.event.transform);
					}))
			.append("g")
				.attr('transform', "translate(" + margin.left + "," + margin.top + ")"); 		
			
		//座標など初期化
		// Scale指定(座標データを指定)
		xScale = d3.scaleLinear()
					.domain(d3.extent(header, function(d, i){ return i;}))
					.range([0, this._width]);
		
		yScale = d3.scaleLinear()
					.domain(d3.extent([minValue, maxValue], function(d, i){ return d; }))
					.range([this._height, 0]);
		
		// 軸
		xAxis = d3.axisBottom(xScale)
					.tickSize(6, -(this._height))
	                .tickFormat(function(d){ return header[d]; });
		yAxis = d3.axisLeft(yScale)
					.tickSize(6, -(this._width))
					.tickFormat(function(d){ return d/scaleY*25 + ""; });
		
		// グループ要素にX軸を追加
		this._svggroup.append("g")
		    .attr("class", "x axis")
		    .attr("transform", "translate(" + margin.left + "," + (this._height + margin.bottom + this._minValue ) + ")") 
		    .call(xAxis);

		// グループ要素にY軸を追加
		this._svggroup.append("g")
		    .attr("class", "y axis")
		    .attr("transform", "translate(" + margin.left + "," + margin.top + ")") 
		    .call(yAxis);
		this._svggroup.append("text")
		    .attr("transform", "translate(-10,0)") 
		    .text("単位：万円");
	}
	
	/*
	 * 折線を描く。
	 * @rowdata : コストデータ
	 * @id : 表示する線のID
	 */
	drawlinear(rowdata, id="") {
		
		var line = d3.line()
					.x(function(d, i) { return xScale(i);})
					.y(function(d, i) { return yScale(d);})
					.curve(d3.curveLinear);
		var serie = this._svggroup.append("g")
					.datum(rowdata)
					.attr("class", "serie");
		serie.append('path')
			.attr("class", "line" + id)
			.attr('d', line)			
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")") ;
	

		 var label = serie.selectAll(".label" + id)
			 	.data(function(d, i) { return d;})
			 	.enter().append("g")
	     		.attr("class", "label" + id)
	     		.attr("transform", function(d, i) { return "translate(" +( margin.left + xScale(i) )+ "," + (margin.top + yScale(d)) + ")"; });
	
		 label.append("text")
		 		.attr("dx", ".5em")
	     		.attr("dy", ".35em")
	     		.attr("class", "label-value" + id)
	     		.text(function(d) { return parseInt(d/10000)+"万" ; });
			 
		 label.append("circle", "text")
		 		.attr("class", "linear-dot" + id)
		 		.attr("r", 3)
		 		.attr("fill", "lightgray");
		
	}
	
	/*
	 * 折線の表示制御
	 * @id:線のID
	 * @isshow:表示するかどうか
	 * @isshowlabel:線のラベルを表示するかどうか
	 * @isshowdot:折り目を表示するかどうか
	 */
	showhiddenlinear(id, isshow, isshowlabel=true, isshowdot=true) {
		var line = d3.selectAll('.line'+id);

		if(line) {
			line.transition()
				.duration(500)
				.style('opacity', !isshow ? 1 : 0)
				.transition()
				.duration(500)
				.style('opacity', isshow ? 1 : 0);
			var label = d3.selectAll(".label-value" + id);
			var dot = d3.selectAll(".linear-dot" + id);

			//dot and label is shown with together.
			if(!isshow) {				
				label.style('opacity', 0);
				dot.style('opacity',  0);
			} else {
				label.transition()
					.duration(500)
					.style('opacity', !isshowlabel ? 1 : 0)
					.transition()
					.duration(500)
					.style('opacity', isshowlabel ? 1 : 0);
				dot.transition()
					.duration(500)
					.style('opacity', !isshowdot ? 1 : 0)
					.transition()
					.duration(500)
					.style('opacity', isshowdot ? 1 : 0);
			}
			
				
		}
	}
	
	/*
	 * 帯グラフを描く
	 * @plandata :進捗データ
	 * @start : 進捗テーブルの開始カラム名
	 * @end : 進捗テーブルの終了カラム名
	 * @canresize : 帯のサイズをリサイズできるかどうか 
	 */
	drawband(plandata, start="startPlan", end="endPlan", canresize=false) {
		//this height is reset.
		this._height += 60;
		this._svg.attr('height', this._height);
		
		var header = this._header;
		
	
		var proArray = processMaster.filter(function(item, index) {
			if(item.processid == index) return true;
		});	
		
		var getIndex = function(yyyymm) {
			return header.indexOf(yyyymm);
		}
		
		var getYearMonthDayFromXAxis = function(x) {
			var ymIdx = Math.floor((x - margin.left) / scaleX);
			if (ymIdx >= header.length ) ymIdx = header.length -1;
			else if(ymIdx < 0) ymIdx = 0;
			var yyyymm = header[ymIdx];
			var day = Math.round((x - margin.left) / scaleX / 0.3) + 1;
			if (day > 28) day = 28;
			else if(day=0) day =1;
			return yyyymm + ("00" + day).slice(-2);
		}
		
		
		var bandid =  start + '_' + end;
		
		this._svggroup.append('g').attr('id', bandid)
			
		var bandgroup = this._svggroup.select('#' + bandid)
			.selectAll('g')
			.data(plandata)
			.enter()
				.append("g")
				.attr('id', function(d) { return start + '_' + end + d.processid; });
		
		
		bandgroup.append('rect')
			.attr('id', function(d) {return  start + '_' + end + d.processid + '_rect';})
			.attr('x',  function(d) {
							return getIndex(d[start].slice(0, 6)) * scaleX  + margin.left; 
						})
			.attr('y', this._height - 80)
			.attr('width', function(d) {								
								return (getIndex(d[end].slice(0, 6)) - getIndex(d[start].slice(0, 6)) + 1) * scaleX;
							})
			.attr('height' , 60)
			.attr('fill', function(d) { return processfill[d.processid]; })
			.attr('data-startdate', function(d) { return d[start];} )
			.attr('data-enddate', function(d) { return d[end];} )
			//show this band by animation		
			.transition()
			.duration(1500)
			.attr('opacity', 0)
			.transition()
			.duration(1500)
			.attr('opacity', 1);
		bandgroup.append('text')
			.attr('y', this._height - 60)
			.text(function(d) { return proArray[d.processid].processName; })				
			//show text by animation
			.transition()
			.duration(1000)
			.attr('x', margin.left)
			.attr('opacity', 0)
			.transition()
			.duration(1000)
			.attr('x', function(d) { return getIndex(d[start].slice(0, 6)) * scaleX + margin.left;})
			.attr('opacity', 1);
		
		// resize handle function
		var onresize = function(obj, orient) {			
			var bar = d3.select(obj);
			
			var bgid = bar.attr('id').slice(0, -orient.length);				
			var rect = d3.select('#' + bgid + '_rect');
			var btext = d3.select('#' + bgid).select('text');
			
		
			bar.attr('x', function(d) { return d3.event.x ; });
			var oldwidth = parseFloat(rect.attr('width'));
	
			if(orient==='_left') {
								
				var newwidth = oldwidth + parseFloat(rect.attr('x')) - d3.event.x ;
				if(newwidth >= 0) {
					btext.attr('x', function(d) { return d3.event.x ; });
					rect.attr('width', newwidth)
						.attr('x', function(d) { return d3.event.x ; });
					bar.attr('data-startdate', getYearMonthDayFromXAxis(d3.event.x))
				}
			} else if (orient==='_right') {
				if(d3.event.x > parseFloat(rect.attr('x')) ) {
					rect.attr('width', d3.event.x - parseFloat(rect.attr('x')));
					bar.attr('data-enddate', getYearMonthDayFromXAxis(d3.event.x))
				}
				else {
					rect.attr('width', 0);
				}
			}
		};
		
		// if bar can resize, will show left and right bar.
		if(canresize) {
			var bandleft = bandgroup.append('rect')
					.attr('id', function(d) { return  start + '_' + end  + d.processid + '_left'; } )
					.attr('y', this._height - 80)
					.attr('width', 5)
					.attr('height' , 60)
					.attr('fill', 'lightgray')
					.attr('data-startdate', function(d) { return d[start]; })
					.call(d3.drag().on("drag", function() {
						onresize(this, '_left')
					}))
					//show the bar by animation
					.transition()
					.duration(1000)
					.attr('x', margin.left)
					.attr('opacity', 0)
					.transition()
					.duration(1000)
					.attr('x', function(d) { return getIndex(d[start].slice(0, 6)) * scaleX + margin.left;})
					.attr('opacity', 1) 
					;
			
			var bandright = bandgroup.append('rect')
					.attr('id', function(d) { return start + '_' + end + d.processid + '_right'; })
					.attr('y', this._height - 80)
					.attr('width', 5)
					.attr('height' , 60)
					.attr('fill', 'gray')
					.attr('data-enddate', function(d) { return d[end]; })
					.call(d3.drag().on("drag", function() {
						onresize(this, '_right')
					}))
					//show the bar by animation
					.transition()
					.duration(1000)
					.attr('x', margin.left)
					.attr('opacity', 0)
					.transition()
					.duration(1000)
					.attr('x', function(d) { return  (getIndex(d[end].slice(0, 6)) + 1) * scaleX  + margin.left - 5;})
					.attr('opacity', 1) 
					;
			
		}
	}
	
	/*
	 * 今日の縦線を描く
	 * @currentdate ：　表示する縦線のデータ
	 */
	drawcurrentline(currentdate) {
		
		//既存の線をクリア
		this._svggroup.select('.currentdate').remove();
		
		var cidx = this._header.indexOf(currentdate);
		var line = d3.line()
		.x(function(d) {return d[0];})
		.y(function(d) {return d[1];});
		
		if(cidx <= -1 ) 
			if(currentdate < d3.min(this._header)) cidx = 0
			else cidx = this._header.length; 
		
		this._svggroup.append("path")
			.attr('class', 'currentdate')
			.attr("d", line([[cidx * scaleX + margin.left, 10 ],[cidx * scaleX + margin.left, this._height]]));
	}

}
