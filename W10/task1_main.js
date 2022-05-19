d3.csv("https://226x119x.github.io/InfoVis2022/W10/w10_task1.csv")
    .then( data => {
        data.forEach( d => { d.label = d.label; d.value = +d.value; });

        var config = {
            parent: '#drawing_region',
            width: 270,
            height: 170,
            margin: {top:30, right:10, bottom:50, left:80}
        };

        const scatter_plot = new ScatterPlot( config, data );
        scatter_plot.update();
    })
    .catch( error => {
        console.log( error );
    });

class ScatterPlot {

    constructor( config, data ) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            margin: config.margin || {top:10, right:10, bottom:10, left:10}
        }
        this.data = data;
        this.init();
    }

    init() {
        let self = this;

        self.svg = d3.select( self.config.parent )
            .attr('width', self.config.width)
            .attr('height', self.config.height);

        self.chart = self.svg.append('g')
            .attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.top})`);

        self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
        self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;

        self.xscale = d3.scaleLinear()
            .range( [0, self.inner_width] );

        self.yscale = d3.scaleBand()
            .range( [0, self.inner_height] )
            .paddingInner(0.1);

        self.xaxis = d3.axisBottom( self.xscale )
                       .ticks(5)
                       .tickSizeOuter(0);

        self.yaxis = d3.axisLeft( self.yscale )
                       .tickSizeOuter(0);

        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height})`);

        self.yaxis_group = self.chart.append('g');

        self.label_text = self.chart.append('g')
            .attr('transform', `translate(0, 0)`);
    }

    update() {
        let self = this;

        const xmax = d3.max( self.data, d => d.value );
        self.xscale.domain( [0, xmax] );

        self.yscale.domain( self.data.map(d => d.label) );

        self.render();
    }

    render() {
        let self = this;

        self.chart.selectAll("rect")
                  .data(self.data)
                  .join("rect")
                  .attr("x", 0 )
                  .attr("y", d => self.yscale(d.label) )
                  .attr("width", d => self.xscale(d.value))
                  .attr("height", self.yscale.bandwidth());

                  d3.select('#reverse')
                      .on('click', d => {
                          self.data.reverse();
                          self.update();
                      });

        self.xaxis_group
            .call( self.xaxis )
            .append("text")
            .attr("fill", "black")
            .attr("x", self.inner_width / 2)
            .attr("y", 30)
            .attr("text-anchor", "middle")
            .attr("font-size", "8pt")
            .attr("font-weight", "bold")
            .text("Value");

        self.yaxis_group
            .call( self.yaxis )
            .append("text")
            .attr("fill", "black")
            .attr("x", -(self.inner_height / 2))
            .attr("y", -67)
            .attr("text-anchor", "middle")
            .attr("font-size", "8pt")
            .attr("transform", "rotate(-90)")
            .attr("font-weight", "bold")
            .text("Foodstuff");

        self.label_text
            .append("text")
            .attr("x", self.inner_width / 2)
            .attr("y", -13)
            .attr("text-anchor", "middle")
            .attr("font-size", "13pt")
            .attr("font-weight", "bold")
            .text("Bar chart");
    }
}
