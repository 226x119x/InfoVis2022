let input_data;
let scatter_plot;
let bar_chart;
let filter = [];

const parseTime = d3.timeParse("%y-%m);
const parseTime2 = d3.timeParse("%y);

/*d3.csv("https://vizlab-kobe-lecture.github.io/InfoVis2021/W12/iris.csv")
    .then( data => {
        input_data = data;
        input_data.forEach( d => {
            d.sepal_length = +d.sepal_length;
            d.sepal_width = +d.sepal_width;
        });*/
//データを読み込み代入：price
d3.csv("https://226x119x.github.io/InfoVis2022/FinalTask/gold_price.csv")
    .then( data => {
        price_data = data;
        price_data.forEach( d => {
            d.date = parseTime(d.date);
            d.price = +d.price;
        });

        const color_scale = d3.scaleOrdinal( d3.schemeCategory10 );
        //color_scale.domain(['setosa','versicolor','virginica']);

        scatter_plot = new ScatterPlot( {
            parent: '#drawing_region_scatterplot',
            width: 256,
            height: 256,
            margin: {top:10, right:10, bottom:50, left:50},
            xlabel: 'Sepal length [cm]',
            ylabel: 'Sepal width [cm]',
            cscale: color_scale
        }, input_data );
        scatter_plot.update();

        bar_chart = new LineChart( {
            parent: '#drawing_region_barchart',
            width: 960,
            height: 500,
            margin: {top:10, right:10, bottom:100, left:40},
            xlabel: 'Species',
            cscale: color_scale
        },{
            parent: '#drawing_region_barchart',
            width: 256,
            height: 500,
            margin: {top:430, right:10, bottom:20, left:40},
            xlabel: 'Species',
            cscale: color_scale
        }, input_data );
        bar_chart.update();
    })
    .catch( error => {
        console.log( error );
    });

    //データ読み込み：rate
    d3.csv("https://226x119x.github.io/InfoVis2022/FinalTask/gold_rate.csv")
        .then( data => {
            rate_data = data;
            rate_data.forEach( d => {
                d.date = parseTime(d.date);
                d.exchangerate = +d.exchangerate;
            });

            const color_scale = d3.scaleOrdinal( d3.schemeCategory10 );
            color_scale.domain(['setosa','versicolor','virginica']);

            scatter_plot = new ScatterPlot( {
                parent: '#drawing_region_scatterplot',
                width: 256,
                height: 256,
                margin: {top:10, right:10, bottom:50, left:50},
                xlabel: 'Sepal length [cm]',
                ylabel: 'Sepal width [cm]',
                cscale: color_scale
            }, input_data );
            scatter_plot.update();

            bar_chart = new BarChart( {
                parent: '#drawing_region_barchart',
                width: 256,
                height: 256,
                margin: {top:10, right:10, bottom:50, left:50},
                xlabel: 'Species',
                cscale: color_scale
            }, input_data );
            bar_chart.update();
        })
        .catch( error => {
            console.log( error );
        });

        //データ読み込み：amount
        d3.csv("https://226x119x.github.io/InfoVis2022/FinalTask/gold_amount.csv")
            .then( data => {
                amount_data = data;
                amount_data.forEach( d => {
                    d.date = parseTime2(d.year);
                    d.country = d.country;
                    d.amount = +d.amount;
                });

                const color_scale = d3.scaleOrdinal( d3.schemeCategory10 );
                color_scale.domain(['setosa','versicolor','virginica']);

                scatter_plot = new ScatterPlot( {
                    parent: '#drawing_region_scatterplot',
                    width: 256,
                    height: 256,
                    margin: {top:10, right:10, bottom:50, left:50},
                    xlabel: 'Sepal length [cm]',
                    ylabel: 'Sepal width [cm]',
                    cscale: color_scale
                }, input_data );
                scatter_plot.update();

                bar_chart = new BarChart( {
                    parent: '#drawing_region_barchart',
                    width: 256,
                    height: 256,
                    margin: {top:10, right:10, bottom:50, left:50},
                    xlabel: 'Species',
                    cscale: color_scale
                }, input_data );
                bar_chart.update();
            })
            .catch( error => {
                console.log( error );
            });

function Filter() {
    if ( filter.length == 0 ) {
        scatter_plot.data = input_data;
    }
    else {
        scatter_plot.data = input_data.filter( d => filter.includes( d.species ) );
    }
    scatter_plot.update();
}
