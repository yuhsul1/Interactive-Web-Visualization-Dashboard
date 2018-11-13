

function buildMetadata(sample) {
  let url = "/metadata/"+ sample
  d3.json(url).then(function(response){
    console.log(response)
    var sampleMetadata = d3.select("#sample-metadata");
    sampleMetadata.html("")
    Object.entries(response).forEach(function ([key, value]) {
      var row = sampleMetadata.append("p");
      row.text(`${key}: ${value}`);
      
      })
    console.log(response.WFREQ)
    
    
    //extract WashFrequency and return degree based on wash frequency
    var washFreq = response.WFREQ
    if (washFreq <1) {var degrees = 0}
    else if (washFreq <2) {var level = 20}
    else if (washFreq <3) {var level = 40}
    else if (washFreq <4) {var level = 60}
    else if (washFreq <5) {var level = 80}
    else if (washFreq <6) {var level = 100}
    else if (washFreq <7) {var level = 120}
    else if (washFreq <8) {var level = 140}
    else if (washFreq <9) {var level = 160}
    else {var level = 180};



    // Trig to calc meter point
    var degrees = 180-level,
        radius = .5;
    var radians = degrees * Math.PI / 180;
    var x = radius * Math.cos(radians);
    var y = radius * Math.sin(radians);

    // Path: may have to change to create a better triangle
    var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
        pathX = String(x),
        space = ' ',
        pathY = String(y),
        pathEnd = ' Z';
    var path = mainPath.concat(pathX,space,pathY,pathEnd);

    var data = [{ type: 'scatter',
      x: [0], y:[0],
        marker: {size: 28, color:'850000'},
        showlegend: false,
        name: 'speed',
        text: level,
        hoverinfo: 'text+name'},
      { values: [10/9, 10/9, 10/9, 10/9, 10/9, 10/9, 10/9, 10/9, 10/9, 10],
      rotation: 90,
      text: ['8-9', '7-8', '6-7', '5-6',
                '4-5', '3-4', '2-3','1-2','0-1',''],
      textinfo: 'text',
      textposition:'inside',
      marker: {colors:['rgba(14, 127, 0, .5)', 'rgba(110, 154, 22, .5)',
                            'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
                            'rgba(210, 206, 145, .5)', 'rgba(232, 226, 202, .5)',
                            'rgba(242, 226, 202, .5)','rgba(252, 246, 202, .5)',
                            'rgba(255, 255, 202, .5)','rgba(255, 255, 255, 0)']},
      labels: ['8-9 times', '7-8 times', '6-7 times', '5-6 times', '4-5 times', '3-4 times',
                '2-3 times', '1-2 times', '0-1 times', ''],
      hoverinfo: 'label',
      hole: .5,
      type: 'pie',
      showlegend: false
    }];

    var layout = {
      shapes:[{
          type: 'path',
          path: path,
          fillcolor: '850000',
          line: {
            color: '850000'
          }
        }],
      title: 'Bellybutton Scrubing Frequency', 
      Speed: 0-100,
      height: 500,
      width: 500,
      xaxis: {zeroline:false, showticklabels:false,
                showgrid: false, range: [-1, 1]},
      yaxis: {zeroline:false, showticklabels:false,
                showgrid: false, range: [-1, 1]}
    };

    Plotly.newPlot('gauge', data, layout);


        }
  )
  d3.select("#sample-metadata")
  
  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`

    // Use `.html("") to clear any existing metadata

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
  // Enter a speed between 0 and 180




}








function buildCharts(sample) {
  var url = `/samples/${sample}`;

  //Organize raw data into array of objects
  d3.json(url).then(function(data) {
    console.log(data)
    
    let limit = data.sample_values.length 
    let patientInfo=[]
    for (i=0; i<limit; i++) {
      patientInfo.push({
        "Label": data.otu_labels[i],
        "ID": data.otu_ids[i],
        "Value":data.sample_values[i]
      })
    }

  //sort the array of objects by the sample Value
    patientInfo.sort(function compareFunction(first, second){
      return second.Value-first.Value
    })

  //collect the top ten values
    topBacteria = patientInfo.slice(0,10)
    console.log(topBacteria)

    //preparing array for pie data
    var value = []
    var label = []
    var ids = []

    let long = topBacteria.length
    for (i = 0; i<long ; i++) {
      value.push(topBacteria[i].Value)
      label.push(topBacteria[i].Label)
      ids.push(topBacteria[i].ID)
    }
    //Setting up pie chart params
    var trace = {
      values: value,
      labels: ids,
      hovertext: label,
      type: 'pie'
    }
    var pieData = [trace];
    var layout = {
      title: "Pie Chart"
    };
    

    Plotly.newPlot('pie', pieData, layout);

    //Bubble Chart
    //preparing array for bubble data
    var bubbleId=[]
    var bubbleValue=[]
    var markerSize=[]
    var markerColors=[]
    var markerLabel=[]
  
    let loopLength = patientInfo.length
    for (i = 0; i<loopLength ; i++) {
      bubbleId.push(patientInfo[i].ID)
      bubbleValue.push(patientInfo[i].Value)
      markerSize.push(patientInfo[i].Value)
      markerColors.push(patientInfo[i].ID)
      markerLabel.push(patientInfo[i].Label)
    }
    //Setting up bubble chart params
    var trace1 = {
      x: bubbleId,
      y: bubbleValue,
      text: markerLabel,
      mode: 'markers',
      marker: {
        color: markerColors,
        size: markerSize
      } 
    };
  
    var bubbleData = [trace1];
    var layout = {
      xaxis: { title: "OTU ID"},
    };
  
    Plotly.newPlot('bubble', bubbleData, layout);
  

  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
