//方針：引数で二つconfigを取ってくるようにして，二つのlinechartを描画
class BarChart {
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
          d3.min(self.data, function(d){return d.year;}),
          // データ内の日付の最大値を取得
          d3.max(self.data, function(d){return d.year;})
        ]);
        self.yscale.domain([
          // 0を最小値として設定
          0,
          // データ内のvalueの最大値を取得
          d3.max(self.data, function(d){return d.exchangerate;})
        ]);

        console.log("slicelog", self.data.columns)

        self.stack = d3.stack()
                       .keys(["amount"])(self.data);

        self.render();
    }

    render() {
        let self = this;

        var svgHeight = 240; // svg要素の高さ
	      var barWidth  =  50; // 棒グラフの横幅
	      var step = 80;		 // 棒グラフの横の間隔
	      var offsetX = 10;	 // Ｘ座標のずれ

      /*
      const area = d3.area()
                     .x( d => self.xscale1(d.year) )
                     .y1( d => self.yscale1(d.price) )
                     .y0( d3.max(self.data, d => d.price ) + 10 );//10はおそらくmargine
      */

      self.chart.selectAll("g")
                .data( self.stack )
                .join("g")
        .attr("fill", "red")
      .selectAll("rect")
      .data(d => d)
      .join("rect")
        .attr("x", (d, i) => self.xscale(d.data.year))
        .attr("y", d => self.yscale(d[1]))
        .attr("height", d => self.yscale(d[0]) - self.yscale(d[1]))
        .attr("width", self.xscale.bandwidth());

        self.xaxis_group
            .call(self.xaxis);

        self.yaxis_group
            .call(self.yaxis);
    }

    replot(coordinate){
      let self = this;
      console.log(coordinate)
      self.xscale.domain(coordinate);
      self.chart.selectAll("path")
                .remove();
      self.render();
    }
}
