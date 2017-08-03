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


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {data:[]};
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
      		<SimpleComponent data={this.state.data} colorLegend={colorLegend} />
      	</div>
      )
  }
}

export default App;
