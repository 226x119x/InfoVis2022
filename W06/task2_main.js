d3.csv("https://226x119x.github.io/InfoVis2022/W04/data.csv")
    .then( data => {
        data.forEach( d => { d.x = +d.x; d.y = +d.y; d.r = +d.r; });

        var config = {
            parent: '#drawing_region',
            width: 600,
            height: 300,
            margin: {top:70, right:70, bottom:70, left:70}
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

        self.yscale = d3.scaleLinear()
            .range( [self.inner_height, 0] );

        self.xaxis = d3.axisBottom( self.xscale )
            .ticks(17);

        self.yaxis = d3.axisLeft( self.yscale )
            .ticks(8);

        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height})`);

        self.yaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, 0)`);

        self.label_text = self.chart.append('g')
            .attr('transform', `translate(0, 0)`);
    }

    update() {
        let self = this;

        const xmin = d3.min( self.data, d => d.x );
        const xmax = d3.max( self.data, d => d.x );
        //self.xscale.domain( [xmin, xmax] );
        self.xscale.domain( [0, xmax] );

        const ymin = d3.min( self.data, d => d.y );
        const ymax = d3.max( self.data, d => d.y );
        //self.yscale.domain( [ymin, ymax] );
        self.yscale.domain( [0, ymax] );

        self.render();
    }

    render() {
        let self = this;

        self.chart.selectAll("circle")
            .data(self.data)
            .enter()
            .append("circle")
            .attr("cx", d => self.xscale( d.x ) )
            .attr("cy", d => self.yscale( d.y ) )
            .attr("r", d => d.r );

        self.xaxis_group
            .call( self.xaxis )
            .append("text")
            .attr("fill", "black")
            .attr("x", self.inner_width / 2)
            .attr("y", 35)
            .attr("text-anchor", "middle")
            .attr("font-size", "10pt")
            .attr("font-weight", "bold")
            .text("X-label");

        self.yaxis_group
            .call( self.yaxis )
            .append("text")
            .attr("fill", "black")
            .attr("x", -(self.inner_height / 2))
            .attr("y", -35)
            .attr("text-anchor", "middle")
            .attr("font-size", "10pt")
            .attr("transform", "rotate(-90)")
            .attr("font-weight", "bold")
            .text("Y-label");

        self.label_text
            .append("text")
            .attr("x", self.inner_width / 2)
            .attr("y", -30)
            .attr("text-anchor", "middle")
            .attr("font-size", "15pt")
            .attr("font-weight", "bold")
            .text("Scatter plot");

        self.label_text
            .append("text")
            .attr("x", -40)
            .attr("y", self.inner_height)
            .attr("text-anchor", "middle")
            .attr("font-size", "8pt")
            .attr("font-weight", "middle")
            .text("ymin");

        self.label_text
            .append("text")
            .attr("x", -40)
            .attr("y", 0)
            .attr("text-anchor", "middle")
            .attr("font-size", "8pt")
            .attr("font-weight", "middle")
            .text("ymax");

        self.label_text
            .append("text")
            .attr("x", 0)
            .attr("y", self.inner_height + 30)
            .attr("text-anchor", "middle")
            .attr("font-size", "8pt")
            .attr("font-weight", "middle")
            .text("xmin");

        self.label_text
            .append("text")
            .attr("x", self.inner_width)
            .attr("y", self.inner_height + 30)
            .attr("text-anchor", "middle")
            .attr("font-size", "8pt")
            .attr("font-weight", "middle")
            .text("xmax");
    }
}
