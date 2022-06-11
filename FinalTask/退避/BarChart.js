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

        //グループ
        self.countries = self.data.columns.slice(1)
        self.years = self.data.map(d => d.year)
        console.log(self.countries)
        console.log(self.years)

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

        self.color = d3.scaleOrdinal( d3.schemeCategory10 )
                       .domain(self.countries);
                       //.range(["red", "yellow", "blue"]);

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
          d3.min(self.years),
          // データ内の日付の最大値を取得
          d3.max(self.years)
        ]);
        self.yscale.domain([0,2300
          //d3.max(self.data, function(d){return d.United_States + d.Australia + d.Canada + d.China + d.Ghana + d.Indonesia + d.Mexico + d.Perud + d.Russia + d.South_Africa + d.Uzbekistan;})
        ]);
        console.log(d3.max(self.data, function(d){return d.China;}))

        self.stack = d3.stack()
                       .keys(self.countries)
                       .order(d3.stackOrderDescending)
                       (self.data);
        console.log("stack", self.stack)

        self.render();
    }

    render() {
        let self = this;
      /*
      const area = d3.area()
                     .x( d => self.xscale1(d.year) )
                     .y1( d => self.yscale1(d.price) )
                     .y0( d3.max(self.data, d => d.price ) + 10 );//10はおそらくmargine
      */


      self.chart.append("g")
                .attr("clip-path", "url(#clip)")
                .append("g")
                .selectAll("g")
                .data(self.stack)
                .join("g")
                .attr("class", "bar")
                .attr("fill", d => self.color(d.key))
                .selectAll("rect")
                .data(d => d)
                .join("rect")
                .attr("x", d => self.xscale(d.data.year))
                .attr("y", d => self.yscale(d[1]))
                .attr("height", d => self.yscale(d[0]) - self.yscale(d[1]))
                .attr("width",10);

                /*
                self.chart.append("g")
                .selectAll("g")
    // Enter in the stack data = loop key per key = group per group
    .data(self.stack)
    .enter().append("g")
      .attr("fill", function(d,i) { return self.color(i); })
      .selectAll("rect")
      // enter a second time = loop subgroup per subgroup to add all rectangles
      .data(function(d) { return d; })
      .enter().append("rect")
        .attr("x", function(d) { return self.xscale(d.data.year); })
        .attr("y", function(d) { return self.yscale(d[1]); })
        .attr("height", function(d) { return self.yscale(d[0]) - self.yscale(d[1]); });
        //.attr("width",self.xscale.bandwidth());
        */

        self.xaxis_group
            .call(self.xaxis);

        self.yaxis_group
            .call(self.yaxis);
    }

    replot(coordinate){
      let self = this;
      console.log(coordinate)
      self.xscale.domain(coordinate);
      self.chart.selectAll(".bar")
                .remove();
      self.render();
    }
}
