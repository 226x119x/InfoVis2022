class AreaChart {
    constructor (config, data) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            margin1: config.margin1 || {top:10, right:10, bottom:10, left:10},
            margin2: config.margin2 || {top:10, right:10, bottom:10, left:10},
            xlabel: config.xlabel || '',
            ylabel: config.ylabel || ''
        };
        this.data = data;
        this.init();
    }

    init() {
        let self = this;

        //描画領域
        self.svg = d3.select(self.config.parent)
            .attr('width', self.config.width)
            .attr('height', self.config.height);

        self.chart = self.svg.append('g')
            .attr('transform', `translate(${self.config.margin1.left}, ${self.config.margin1.top})`);

        //上位グラフ
        self.inner_width = self.config.width - self.config.margin1.left - self.config.margin1.right - 140;
        self.inner_height1 = self.config.height - self.config.margin1.top - self.config.margin1.bottom;
        self.inner_height2 = self.config.height - self.config.margin2.top - self.config.margin2.bottom;

        //scale定義
        self.xscale1 = d3.scaleTime()
            .range([0, self.inner_width]);
        self.xscale2 = d3.scaleTime()
            .range([0, self.inner_width]);

        self.yscale1 = d3.scaleLinear()
            .range([self.inner_height1, 0]);
        self.yscale2 = d3.scaleLinear()
            .range([self.inner_height2, 0]);

        self.xaxis1 = d3.axisBottom(self.xscale1)
            .tickFormat(d3.timeFormat("%Y/%m"));
        self.xaxis2 = d3.axisBottom(self.xscale2)
            .tickFormat(d3.timeFormat("%Y/%m"));

        self.yaxis = d3.axisLeft(self.yscale1);

        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height1})`);

        self.yaxis_group = self.chart.append('g');

        self.chart.append("defs").append("clipPath")
                .attr("id", "clip")
                .append("rect")
                .attr("width", self.inner_width)
                .attr("height", self.inner_height1);

        const xlabel_space = 20;
        self.svg.append('text')
            .style('font-size', '15px')
            .attr('x', self.config.width / 2 - 120)
            .attr('y', self.inner_height1 + self.config.margin1.top + xlabel_space)
            .attr('text-anchor', 'middle')
            .attr('dy', '1em')
            .text( self.config.xlabel );

        const ylabel_space = 40;
        self.svg.append('text')
            .style('font-size', '15px')
            .attr('transform', `rotate(-90)`)
            .attr('y', self.config.margin2.left - ylabel_space)
            .attr('x', -(self.config.height / 2) + 50)
            .attr('text-anchor', 'middle')
            .attr('dy', '1em')
            .text( self.config.ylabel );

            //凡例
            self.svg.append("line")
            .attr("x1",self.inner_width + 60)
            .attr("x2",self.inner_width + 80)
            .attr("y1",self.inner_height1 + 49)
            .attr("y2",self.inner_height1 + 49)
            .attr("stroke-width",2)
            .style("stroke", "blue");
            self.svg.append("line")
            .attr("x1",self.inner_width + 60)
            .attr("x2",self.inner_width + 80)
            .attr("y1",self.inner_height1 + 79)
            .attr("y2",self.inner_height1 + 79)
            .attr("stroke-width",2)
            .style("stroke", "red");
            self.svg.append("rect")
            .attr("x",self.inner_width + 65)
            .attr("y",self.inner_height1 + 103)
            .attr("width",10)
            .attr("height",10)
            .attr("fill","steelblue");

            self.svg.append("text")
            .attr("x", self.inner_width + 90)
            .attr("y", self.inner_height1 + 50)
            .text("Gold_Price")
            .style("font-size", "15px")
            .attr("alignment-baseline","middle");
            self.svg.append("text")
            .attr("x", self.inner_width + 90)
            .attr("y", self.inner_height1 + 80)
            .text("Gold_Exchangerate")
            .style("font-size", "15px")
            .attr("alignment-baseline","middle");
            self.svg.append("text")
            .attr("x", self.inner_width + 90)
            .attr("y", self.inner_height1 + 110)
            .text("No. of positive cases")
            .style("font-size", "15px")
            .attr("alignment-baseline","middle");
    }

    update() {
        let self = this;
        var x0;

        self.xscale1.domain([
          // データ内の日付の最小値を取得
          d3.min(self.data, function(d){return d.date;}),
          // データ内の日付の最大値を取得
          d3.max(self.data, function(d){return d.date;})
        ]);
        self.xscale2.domain(self.xscale1.domain());

        self.yscale1.domain([
          // 0を最小値として設定
          0,
          // データ内のpriceの最大値を取得
          d3.max(self.data, function(d){return d.price;})
        ]);
        self.yscale2.domain(self.yscale1.domain());

        self.line = d3.line()
                       .x(function(d) { return self.xscale1(d.date); })
                       .y(function(d) { return self.yscale1(d.price); });

        self.area1 = d3.area()
                      //.curve(d3.curveMonotoneX)
                      .x(function(d) { return self.xscale1(d.date); })
                      .y0(self.inner_height1)
                      .y1(function(d) { return self.yscale1(d.price); });

        self.area2 = d3.area()
                       //.curve(d3.curveMonotoneX)
                       .x(function(d) { return self.xscale2(d.date); })
                       .y0(self.inner_height2)
                       .y1(function(d) { return self.yscale2(d.price); });

        self.line = d3.line()
                      .x(function(d) { return self.xscale1(d.date); })
                      .y(function(d) { return self.yscale1(d.price); });

        self.brush = d3.brushX()
                       .extent([[0,0], [self.inner_width, self.inner_height2]])
                       .on("brush", brushed)
                       .on("end", record);

        self.zoom = d3.zoom()
                      .scaleExtent([1, 1000])
                      .translateExtent([[0, 0], [self.inner_width, self.inner_height1]])
                      .extent([[0, 0], [self.inner_width, self.inner_height1]])
                      .on("zoom", zoomed);

        self.focus = self.svg.append("g")
                        .attr("class", "focus")
                        .attr("transform", "translate(" + self.config.margin1.left + "," + self.config.margin1.top + ")");

        self.context = self.svg.append("g")
                          .attr("class", "context")
                          .attr("transform", "translate(" + self.config.margin2.left + "," + self.config.margin2.top + ")");

        self.render();

        var sourceEvent = null;

        function brushed(event) {
          if (sourceEvent === "zoom") return;
          sourceEvent = "brush";
          var s = event.selection || self.xscale2.range();
          self.xscale1.domain(s.map(self.xscale2.invert, self.xscale2));
          self.focus.selectAll(".area").attr("d", self.area1);
          self.focus.select(".axis--x").call(self.xaxis1);
          self.svg.select(".zoom").call(self.zoom.transform, d3.zoomIdentity
                  .scale(self.inner_width / (s[1] - s[0]))
                  .translate(-s[0], 0));
          sourceEvent = null;
        }

        function record(event) {
          if (sourceEvent === "zoom") return;
          sourceEvent = "end";
          var s = event.selection || self.xscale2.range();
          if(s){
            self.x0 = s.map(self.xscale2.invert, self.xscale2)
            console.log("check1",self.x0)
          }
          sourceEvent = null;
        }

        function zoomed(event) {
          if (sourceEvent === "brush") return;
          sourceEvent = "zoom";
          var t = event.transform;
          self.xscale1.domain(t.rescaleX(self.xscale2).domain());
          self.focus.selectAll(".area").attr("d", self.area1);
          self.focus.select(".axis--x").call(self.xaxis1);
          self.context.select(".brush").call(self.brush.move, self.xscale1.range().map(t.invertX, t));
          sourceEvent = null;
        }

    }

    render() {
        let self = this;

      self.focus.append("path")
                .datum(self.data)
                .attr("class", "area")
                .attr("d", self.area1)
                .attr("stroke-width",2)
                .attr('stroke', 'blue')
                .attr('fill', 'none');
      self.focus.append("g")
                .attr("class", "axis axis--x")
                .attr("transform", "translate(0," + self.inner_height1 + ")")
                .call(self.xaxis1);
      self.focus.append("g")
                .attr("class", "axis axis--y")
                .call(self.yaxis);

      self.context.append("path")
                  .datum(self.data)
                  .attr("class", "area")
                  .attr("d", self.area2)
                  .attr('fill', 'blue');
      self.context.append("g")
                  .attr("class", "axis axis--x")
                  .attr("transform", "translate(0," + self.inner_height2 + ")")
                  .call(self.xaxis2);
      self.context.append("g")
                  .attr("class", "brush")
                  .call(self.brush)
                  .call(self.brush.move, self.xscale1.range());

      self.chart.append("rect")
                .attr("class", "zoom")
                .attr("width", self.inner_width)
                .attr("height", self.inner_height1)
                .attr("transform", "translate(" + self.config.margin1.left + "," + self.config.margin1.top + ")")
                .call(self.zoom);

    }

    returnChart(){
      let self = this;
      return self.chart;
    }

    returnXscale(){
      let self = this;
      return self.xscale1;
    }

}
