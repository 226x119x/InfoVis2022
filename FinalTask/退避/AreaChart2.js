//ベタがき
class AreaChart2 {
    constructor (config, data) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            margin1: config.margin1 || {top:10, right:10, bottom:10, left:10},
            margin2: config.margin2 || {top:10, right:10, bottom:10, left:10},
            xlabel: config.xlabel || '',
            ylabel: config.ylabel || '',
            cscale: config.cscale
        };
        this.data = data;
        //データを読み込み代入：rate
        d3.csv("https://226x119x.github.io/InfoVis2022/FinalTask/gold_rate.csv")
            .then( data => {
                this.data_rate = data;
                this.data_rate.forEach( d => {
                    d.date = parseTime(d.date);
                    d.exchangerate = +d.exchangerate;
                });
                console.log(this.data_rate)
            })
            .catch( error => {
                console.log( error );
            });
        console.log(this.data_rate)
        this.init();
    }

    init() {
        let self = this;
        var data_rate

        //描画領域
        self.svg = d3.select(self.config.parent)
            .attr('width', self.config.width)
            .attr('height', self.config.height);

        self.chart = self.svg.append('g')
            .attr('transform', `translate(${self.config.margin1.left}, ${self.config.margin1.top})`);

        //上位グラフ
        self.inner_width = self.config.width - self.config.margin1.left - self.config.margin1.right;
        self.inner_height1 = self.config.height - self.config.margin1.top - self.config.margin1.bottom;
        self.inner_height2 = self.config.height - self.config.margin2.top - self.config.margin2.bottom;

        //scale定義
        self.xscale1 = d3.scaleTime()
            .range([0, self.inner_width]);
        self.xscale2 = d3.scaleTime()
            .range([0, self.inner_width]);

        self.yscale1 = d3.scaleLinear()
            .range([self.inner_height1, 0]);
        self.yscale1_rate = d3.scaleLinear()
            .range([self.inner_height1, 0]);
        self.yscale2 = d3.scaleLinear()
            .range([self.inner_height2, 0]);

        self.xaxis1 = d3.axisBottom(self.xscale1)
            .tickFormat(d3.timeFormat("%Y/%m"));
        self.xaxis2 = d3.axisBottom(self.xscale2)
            .tickFormat(d3.timeFormat("%Y/%m"));

        self.yaxis = d3.axisLeft(self.yscale1);

        //!!!!
        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height1})`);

        self.yaxis_group = self.chart.append('g');

        self.chart.append("defs").append("clipPath")
                .attr("id", "clip")
                .append("rect")
                .attr("width", self.inner_width)
                .attr("height", self.inner_height1);

        /*const xlabel_space = 40;
        self.svg.append('text')
            .style('font-size', '12px')
            .attr('x', self.config.width / 2)
            .attr('y', self.inner_height + self.config.margin.top + xlabel_space)
            .text( self.config.xlabel );

        const ylabel_space = 50;
        self.svg.append('text')
            .style('font-size', '12px')
            .attr('transform', `rotate(-90)`)
            .attr('y', self.config.margin.left - ylabel_space)
            .attr('x', -(self.config.height / 2))
            .attr('text-anchor', 'middle')
            .attr('dy', '1em')
            .text( self.config.ylabel );*/
    }

    update() {
        let self = this;

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
          // データ内のvpriceの最大値を取得
          d3.max(self.data, function(d){return d.price;})
        ]);
        self.yscale1_rate.domain([
          // 0を最小値として設定
          0,
          // データ内のexchangerateの最大値を取得
          d3.max(this.data_rate, function(d){return d.exchangerate;})
        ]);
        self.yscale2.domain(self.yscale1.domain());

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
                      .y(function(d) { return self.yscale1_rate(d.exchangerate); });

        self.brush = d3.brushX()
                       .extent([[0,0], [self.inner_width, self.inner_height2]])
                       .on("brush end", brushed);

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
          if (sourceEvent === "zoom") return; // ignore brush-by-zoom
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

        function zoomed(event) {
          if (sourceEvent === "brush") return; // ignore zoom-by-brush
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
                .attr('fill', 'steelblue');
      self.focus.append("g")
                .append("path")
                .datum(self.data_rate)
                .attr("class", "area")
                .attr('d', self.line)
                .attr('stroke', 'black')
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
                  .attr('fill', 'steelblue');
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

}
