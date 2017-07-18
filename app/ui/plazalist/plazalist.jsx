import React from 'react'; 
import { connect } from 'react-redux';
/**
 * ajax请使用services目录下的ajax.js
 */

class PlazaList extends React.Component{
	constructor(props) {
		super(props);
	}

	componentDidMount() {}

	render() {
		return (<p>PlazaList</p>);
	}
}

function mapStateToProps(state) {
  return state;
}
export default connect(mapStateToProps)(PlazaList);

