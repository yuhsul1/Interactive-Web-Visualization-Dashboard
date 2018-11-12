

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
