import './submit.css';
import React from 'react';  
import { connect } from 'react-redux';

import * as Service from '../../../services/index';

import { Button, Modal, Radio } from 'antd'; 
const RadioGroup = Radio.Group;  

class Submit extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			checkStatus : 1
		};
		
		this.submitCheck = this.submitCheck.bind(this);
		this.onRadioChange = this.onRadioChange.bind(this);
	}

	onRadioChange(e) {
		console.log('radio')
		this.setState({'checkStatus' : e.target.value});
	}

	submitCheck(e) {
		console.log('submit')

		Service.submitCheckAjax(
			preAjaxUrl + '/mapeditor/map/editVerify/' + this.props.map.plazaId,
			this.state.checkStatus,
			() => {
				setTimeout(()=>{
					location.reload();
				}, 1000);
			}
		)
	}

	render() {
		return (
			<div className="submit">
				<RadioGroup onChange={this.onRadioChange} value={this.state.checkStatus}>
					<Radio value={0}>不通过</Radio>
					<Radio value={1}>通过</Radio>
				</RadioGroup>
				<Button type="primary" onClick={this.submitCheck}>结束审核</Button>
			</div>
		);
	}
}

function mapStateToProps(state) {
  return state;
}

export default connect(mapStateToProps)(Submit);

