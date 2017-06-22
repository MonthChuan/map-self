import './submit.css';
import React from 'react';  
import { connect } from 'react-redux';
import { Button, Upload, Modal, Radio } from 'antd'; 
const RadioGroup = Radio.Group;  

class Submit extends React.Component{
	constructor(props) {
		super(props);
		this.state = {};
		
		this.state.checkStatus = 1;

		this.uploadChange = this.uploadChange.bind(this);
		
		this.submitCheck = this.submitCheck.bind(this);
		this.onRadioChange = this.onRadioChange.bind(this);
	}

	uploadChange(info) {
		this.setState({uploadTip : info.file.status});
	}

	

	onRadioChange(e) {
		this.setState({'checkStatus' : e.target.value});
	}

	submitCheck() {
		$.ajax({
			'url' : preAjaxUrl + '/mapeditor/map/editVerify/' + this.props.state.plazaId,
			'method' : 'POST',
			'data' : {"verifyResult" : this.state.checkStatus}
		}).done(req => {
			if(req.status == 200) {
				Modal.success({
					title : '',
					content : req.message
				});

				setTimeout(()=>{
					location.reload();
				}, 1000);
			}
			else {
				if(req.status == 460) {
					location.href = location.pathname + '#/login';
				}
				else {
					Modal.error({
						title : '注意',
						content : req.message
					});
				}
			}
		});
	}

	render() {
		return (
			<div className="submit">
				<span>{this.state.uploadTip || ''}</span>
				{/*<Upload
					className="upload-wrap"
					action=""
					name="file"
					showUploadList={false}
					onChange={this.uploadChange}
				>
					<Button type="primary" disabled={this.state.btnstatus}>上传附件</Button>
				</Upload>*/}
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

