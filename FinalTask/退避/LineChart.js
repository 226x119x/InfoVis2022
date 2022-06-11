//方針：引数で二つconfigを取ってくるようにして，二つのlinechartを描画
class LineChart {
    constructor (config, data) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            margin: config.margin || {top:10, right:10, bottom:10, left:10},
            xlabel: config.xlabel || '',
            ylabel: config.ylabel || '',
            cscale: config.cscale
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
            .attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.top})`);

        //上位グラフ
        self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
        self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;

        self.xscale = d3.scaleTime()
            .range([0, self.inner_width]);

        self.yscale = d3.scaleLinear()
            .range([self.inner_height, 0]);

        self.xaxis = d3.axisBottom(self.xscale)
            .tickFormat(d3.timeFormat("%Y"));

        self.yaxis = d3.axisLeft(self.yscale);

        //!!!!
        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height})`);

        self.yaxis_group = self.chart.append('g');

        self.clip = self.chart.append("defs").append("svg:clipPath")
        .attr("id", "clip")
        .append("svg:rect")
        .attr("width", self.inner_width )
        .attr("height", self.inner_height )
        .attr("x", 0)
        .attr("y", 0);

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

        self.xscale.domain([
          // データ内の日付の最小値を取得
          d3.min(self.data, function(d){return d.date;}),
          // データ内の日付の最大値を取得
          d3.max(self.data, function(d){return d.date;})
        ]);
        self.yscale.domain([
          // 0を最小値として設定
          0,
          // データ内のvalueの最大値を取得
          d3.max(self.data, function(d){return d.exchangerate;})
        ]);

        self.line = d3.line()
                       .x(function(d) { return self.xscale(d.date); })
                       .y(function(d) { return self.yscale(d.exchangerate); });

        self.render();
    }

    render() {
        let self = this;

      /*
      const area = d3.area()
                     .x( d => self.xscale1(d.date) )
                     .y1( d => self.yscale1(d.price) )
                     .y0( d3.max(self.data, d => d.price ) + 10 );//10はおそらくmargine
      */

      self.chart.append("g")
                .attr("clip-path", "url(#clip)")
                .append("path")
                .datum(self.data)
                .attr('class', 'line')
                .attr('d', self.line)
                .attr('stroke', 'red')
                .attr('fill', 'none')
                .append('g');

        self.xaxis_group
            .call(self.xaxis);

        self.yaxis_group
            .call(self.yaxis);
    }

    replot(coordinate){
      let self = this;
      console.log(coordinate)
      self.xscale.domain(coordinate);
      self.chart.select(".line")
      .attr("d", d3.line()
                   .x(function(d) { return self.xscale(d.date) })
                   .y(function(d) { return self.yscale(d.exchangerate) })
           )
           
      self.xaxis_group
          .call(self.xaxis);
      //self.render();
    }
}
