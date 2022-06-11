//方針：引数で二つconfigを取ってくるようにして，二つのlinechartを描画
class BarChart2 {
    constructor (config, data, chart, xscale) {
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
        this.chart = chart;
        this.xscale = xscale;
        this.plot_flag = 1;
        this.init();
    }

    init() {
        let self = this;

        //描画領域
        /*
        self.svg = d3.select(self.config.parent)
            .attr('width', self.config.width)
            .attr('height', self.config.height);

        self.chart = self.svg.append('g')
            .attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.top})`);
        */

        //グループ
        self.countries = self.data.columns.slice(1)
        self.years = self.data.map(d => d.year)
        console.log(self.countries)
        console.log(self.years)

        //上位グラフ
        self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
        self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;

        //self.xscale = d3.scaleTime()
        //    .range([0, self.inner_width]);

        self.yscale = d3.scaleLinear()
            .range([self.inner_height, 0]);

        self.xaxis = d3.axisBottom(self.xscale)
            .tickFormat(d3.timeFormat("%Y"));

        self.yaxis = d3.axisLeft(self.yscale);

        //!!!!
        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height})`);

        self.yaxis_group = self.chart.append('g')
            .attr('transform', `translate(${self.inner_width + 7}, 0)`);

        self.color = d3.scaleOrdinal( d3.schemeSet3 )
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
            .text( self.config.xlabel );*/

         self.text_group = self.chart.append("g");
         /*
         self.chart.append('text')
             .style('font-size', '15px')
             .attr('transform', `rotate(90)`)
             .attr('y', -(self.inner_width + 27))
             .attr('x', self.config.width / 4 - 50)
             .attr('text-anchor', 'middle')
             .attr('dy', '1em')
             .text( self.config.ylabel );
             */
    }

    update() {
        let self = this;

        /*
        self.xscale.domain([
          // データ内の日付の最小値を取得
          d3.min(self.years),
          // データ内の日付の最大値を取得
          d3.max(self.years)
        ]);
        */

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

      /*
      const tooltip = d3.select(self.config.parent)
          .append("div")
          .style("opacity", 0)
          .attr("class", "tooltip")
          .style("background-color", "white")
          .style("border", "solid")
          .style("border-width", "1px")
          .style("border-radius", "5px")
          .style("padding", "10px");*/

      const mouseover = function(event, d) {
      const subgroupName = d3.select(this.parentNode).datum().key;
      const subgroupValue = d.data[subgroupName];
      d3.select('#tooltip')
          //.html("Country: " + subgroupName + "<br>" + "Production: " + subgroupValue)
          .html(`<div class="tooltip-label">${subgroupName}</div>Production: ${subgroupValue}`)
          .style("opacity", 1);

      }
      const mousemove = function(event, d) {
        d3.select('tooltip')
               .style("transform","translateY(-55%)")
               .style("left",(event.x)/2+"px")
               .style("top",(event.y)/2-30+"px");
      }
      //const mouseleave = function(event, d) {
      //  d3.select('tooltip')
      //   .style("opacity", 0);
      //}

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
                .attr("width",80)
                .attr("stroke", "grey")
                .on("mouseover", mouseover)
                .on('mousemove', (e) => {
                const padding = 10;
                d3.select('#tooltip')
                    .style('left', (e.pageX + padding) + 'px')
                    .style('top', (e.pageY + padding) + 'px');
                })
                .on('mouseleave', () => {
                d3.select('#tooltip')
                    .style('opacity', 0);
                });

      self.text_group.append('text')
          .attr("class", "text")
          .style('font-size', '15px')
          .attr('transform', `rotate(90)`)
          .attr('y', -(self.inner_width + 27))
          .attr('x', self.config.width / 4 - 50)
          .attr('text-anchor', 'middle')
          .attr('dy', '1em')
          .text( self.config.ylabel );

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

        /*
        self.xaxis_group
            .call(self.xaxis);
        */

        self.yaxis_group.append("g")
            .attr("class", "axis axis--y")
            .call(self.yaxis);
    }

    replot(coordinate){
      let self = this;

      if(self.plot_flag == 1){
        console.log(coordinate)
        //self.xscale.domain(coordinate);
        //xscale関係いらんかも
        self.chart.selectAll(".bar")
                  .remove();
        self.render();
      }
        else{
          //self.xscale.domain(coordinate);
        }
    }

    display(){
      let self = this;

      if(self.plot_flag == 1){
        self.chart.selectAll(".bar")
                  .remove();

        self.text_group.selectAll(".text")
                  .remove();

        self.yaxis_group.select(".axis--y")
                  .remove();

        self.plot_flag = 0;
      }
      else{
        self.render();

        self.plot_flag = 1;
      }
    }
}
