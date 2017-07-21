import './plazalistpage.css';
import React from 'react';
import { connect } from 'react-redux';
import Header from './header/header.jsx';
import Plazatable from './plazatable/plazatable.jsx';



/**
 * ajax请使用services目录下的ajax.js
 */

class PlazaList extends React.Component{
	constructor(props) {
		super(props);
		
	}
    componentDidMount() {}
    render() {
		return (
			<div id="plazalist">
				<Header />
				<div className="table-content">
					<Plazatable />
				</div>
			</div>
		);
	}
}

function mapStateToProps(state) {
  return state;
}
export default connect(mapStateToProps)(PlazaList);

