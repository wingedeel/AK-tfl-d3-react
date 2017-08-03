import React, { Component } from 'react';
import SimpleComponent from './SimpleComponent';
import axios from 'axios';

const appID = '45424d2e';
const appKey = '0c06da185829a08ba97d76499acd69a6';

const colorLegend = [
  // reds from dark to light
  "#67000d", "#a50f15", "#cb181d", "#ef3b2c", "#fb6a4a", "#fc9272", "#fcbba1", "#fee0d2",
  //neutral grey
  "#f0f0f0",
  // blues from light to dark
  "#deebf7", "#c6dbef", "#9ecae1", "#6baed6", "#4292c6", "#2171b5", '#08519c', "#08306b"
];

const data = [
	{
  "_id":"President",
  "colorValue":-0.09158288680865387,
  "value":270
},{
  "_id":"United States",
  "colorValue":-0.03118193632258064,
  "value":125
},{
  "_id":"Mauricio Macri",
  "colorValue":-0.09327133250000001,
  "value":112
},{
  "_id":"Egypt",
  "colorValue":0.057265332375,
  "value":110
},{
  "_id":"Syria",
  "colorValue":-0.36294321961071435,
  "value":109
},{
  "_id":"Congress",
  "colorValue":-0.15328536908809523,
  "value":103
},{
  "_id":"Bjp",
  "colorValue":-0.130340984652,
  "value":100
},{
  "_id":"Barack Obama",
  "colorValue":-0.27905116722222223,
  "value":99
},{
  "_id":"Ben Carson",
  "colorValue":-0.14682149866666666,
  "value":92
},{
  "_id":"Russia",
  "colorValue":-0.2845861297666667,
  "value":88
},{
  "_id":"Paris",
  "colorValue":-0.24081020818571425,
  "value":79
}
];

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {

    const url = 'https://api.tfl.gov.uk/Occupancy/CarPark';
    const params = {app_id: appID, app_key: appKey};
    axios.get( url, { params })
	    .then(response => {
	      	console.log('response ' , response);
	      	let data = response.data.map(item => {
		        let obj = {};
		        obj['_id'] = item.name;
		        obj['colorValue'] = -0.09158288680865387;
		        obj['value'] = item.bays[0].free;
		        return obj;
	      })
      		console.log('data ', data);
      		this.setState( {data} )

    	});
  }

  render() {
      return (
      	<div>
      		<SimpleComponent data={data} colorLegend={colorLegend} />
      	</div>
      )
  }
}

export default App;
