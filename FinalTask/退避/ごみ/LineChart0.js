//方針：引数で二つconfigを取ってくるようにして，二つのlinechartを描画
class LineChart0 {
    constructor (config1, data) {
        this.config1 = {
            parent: config1.parent,
            width: config1.width || 256,
            height: config1.height || 256,
            margin: config1.margin || {top:10, right:10, bottom:10, left:10},
            xlabel: config1.xlabel || '',
            ylabel: config1.ylabel || '',
            cscale: config1.cscale
        };
        this.data = data;
        this.init();
    }

    init() {
        let self = this;

        //描画領域
        self.svg = d3.select(self.config1.parent)
            .attr('width', self.config1.width)
            .attr('height', self.config1.height);

        self.chart = self.svg.append('g')
            .attr('transform', `translate(${self.config1.margin.left}, ${self.config1.margin.top})`);

        //上位グラフ
        self.inner_width1 = self.config1.width - self.config1.margin.left - self.config1.margin.right;
        self.inner_height1 = self.config1.height - self.config1.margin.top - self.config1.margin.bottom;

        self.xscale1 = d3.scaleTime()
            .range([0, self.inner_width1]);

        self.yscale1 = d3.scaleLinear()
            .range([self.inner_height1, 0]);

        self.xaxis1 = d3.axisBottom(self.xscale1)
            .tickFormat(d3.timeFormat("%Y/%m"));

        self.yaxis1 = d3.axisLeft(self.yscale1);

        //!!!!
        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height1})`);

        self.yaxis_group = self.chart.append('g');

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
        self.yscale1.domain([
          // 0を最小値として設定
          0,
          // データ内のvalueの最大値を取得
          d3.max(self.data, function(d){return d.price;})
        ]);

        self.line = d3.line()
                       .x(function(d) { return self.xscale1(d.date); })
                       .y(function(d) { return self.yscale1(d.price); });

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

      self.chart.append("path")
                .datum(self.data)
                .attr('d', self.line)
                .attr('stroke', 'black')
                .attr('fill', 'none')
                //.attr('d', area(self.data))
                .attr('stroke', 'black')
                //.attr('fill', 'red')
                .append('g');

        self.xaxis_group
            .call(self.xaxis1);

        self.yaxis_group
            .call(self.yaxis1);
    }
}
