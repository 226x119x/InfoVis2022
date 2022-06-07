//方針：引数で二つconfigを取ってくるようにして，二つのlinechartを描画
class LineChart {
    constructor (config1, config2, data) {
        this.config1 = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            margin: config.margin || {top:10, right:10, bottom:10, left:10},
            xlabel: config.xlabel || '',
            ylabel: config.ylabel || '',
            cscale: config.cscale
        };
        this.config2 = {
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

        //上位グラフ
        self.inner_width1 = self.config1.width - self.config1.margin.left - self.config1.margin.right;
        self.inner_height1 = self.config1.height - self.config1.margin.top - self.config1.margin.bottom;

        self.xscale1 = d3.scaleTime()
            .range([0, self.inner_width1])
            .paddingInner(0.2)
            .paddingOuter(0.1);

        self.yscale1 = d3.scaleLinear()
            .range([self.inner_height1, 0]);

        self.xaxis1 = d3.axisBottom(self.xscale1)
            //.ticks(['setosa','versicolor','virginica'])いる？？？
            .tickSizeOuter(0);

        self.yaxis1 = d3.axisLeft(self.yscale1)
            .ticks(5)
            .tickSizeOuter(0);

        //!!!!
        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height1})`);

        self.yaxis_group = self.chart.append('g');

        //下位グラフ
        //self.inner_width2 = self.config2.width - self.config2.margin.left - self.config2.margin.right;
        self.inner_height2 = self.config2.height - self.config2.margin.top - self.config2.margin.bottom;

        self.xscale2 = d3.scaleTime()
            .range([0, self.inner_width])
            .paddingInner(0.2)
            .paddingOuter(0.1);

        self.yscale2 = d3.scaleLinear()
            .range([self.inner_height2, 0]);

        self.xaxis2 = d3.axisBottom(self.xscale2)
            //.ticks(['setosa','versicolor','virginica'])いる？？？
            .tickSizeOuter(0);

        //???変更すること
        self.svg = d3.select(self.config1.parent)
            .attr('width', self.inner_width1 + self.config1.margin.left + self.config1.margin.right)
            .attr('height', self.inner_height1 + self.config1.margin.top + self.config1.margin.bottom);

        //!!!!
        //上位グラフareaオブジェクト
    var area = d3.svg.area()
        .interpolate("monotone")
        .x(F('date', xScale))
        .y0(height)
        .y1(F('access', yScale));

    //下位グラフareaオブジェクト
    var area2 = d3.svg.area()
        .interpolate("monotone")
        .x(F('date', x2Scale))
        .y0(height2)
        .y1(F('access', y2Scale));

    //フォーカス時の上位グラフの表示位置調整のためにクリップパスを作成
    svg.append("defs").append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width)
        .attr("height", height);

        self.focus = self.svg.append('g')
            .attr("transform", "translate(" + self.config1.margin.left + "," + self.config1.margin.top + ")");

        self.context = self.svg.append('g')
            .attr("transform", "translate(" + self.config2.margin.left + "," + self.config2.margin.top + ")");;

        const xlabel_space = 40;
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
            .text( self.config.ylabel );
    }

    update() {
        let self = this;

        /*
        const data_map = d3.rollup( self.data, v => v.length, d => d.species );
        self.aggregated_data = Array.from( data_map, ([key,count]) => ({key,count}) );

        self.cvalue = d => d.key;
        self.xvalue = d => d.key;
        self.yvalue = d => d.count;

        const items = self.aggregated_data.map( self.xvalue );
        self.xscale1.domain(dateExtent);
        */

        //ここmapで扱っていいのか？
        const dateExtent = d3.extent( data.map( self.data.date ) ); //dateの最小値・最大値取得
        const ymin = 0;
        const priceMax =  d3.max( data.map( self.data.price ) ); //priceの最大値取得

        self.xscale1.domain(dateExtent);
        self.yscale1.domain([ymin, priceMax]);

        self.xscale2.domain(self.xscale1.dmain());
        self.yscale2.domain(self.yscale1.dmain());

        self.render();
    }

    render() {
        let self = this;

        //includes:特定の要素が含まれているかを返す
        self.chart.selectAll(".bar")
            .data(self.aggregated_data)
            .join("rect")
            .attr("class", "bar")
            .attr("x", d => self.xscale( self.xvalue(d) ) )
            .attr("y", d => self.yscale( self.yvalue(d) ) )
            .attr("width", self.xscale.bandwidth())
            .attr("height", d => self.inner_height - self.yscale( self.yvalue(d) ))
            .attr("fill", d => self.config.cscale( self.cvalue(d) ))
            .on('click', function(ev,d) {
                const is_active = filter.includes(d.key);
                if ( is_active ) {
                    filter = filter.filter( f => f !== d.key );
                }
                else {
                    filter.push( d.key );
                }
                Filter();
                d3.select(this).classed('active', !is_active);
            });

        self.xaxis_group
            .call(self.xaxis);

        self.yaxis_group
            .call(self.yaxis);
    }
}
