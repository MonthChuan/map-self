import './submit.css';
import React from 'react';  
import { Button, Upload, Modal } from 'antd';   

export default class Submit extends React.Component{
	constructor(props) {
		super(props);
		this.state = this.props.state;
		this.state.btnstatus = false;

		this.uploadChange = this.uploadChange.bind(this);
		this.submitAll = this.submitAll.bind(this);
	}

	uploadChange(info) {
		this.setState({uploadTip : info.file.status});
	}

	submitAll() {
		if(this.props.state.store.length > 0 && this.props.state.store[0].action != 'SHOW') {
			this.props.saveEdit();
		}
		//todo结束本次编辑。。。

		$.ajax({
			'url' : preAjaxUrl + '/mapeditor/map/editEnd/' + this.props.state.plazaId,
			'method' : 'POST'
		}).done(req => {
			if(req.status == 200) {
				Modal.success({
					title : '',
					content : '已经提交审核，请耐心等待！'
				});
				this.props.setState({status : {
					isAdd : false,
					isEdit : false,
					isDelete : false,
					isMerge : false,
					isSubMerge : false,
					isZT : false,
					isStart : false,
					isActive : 2
				}});
				this.setState({btnstatus : 'disabled'});
			}
			else {
				Modal.error({
					title : '注意',
					content : req.message
				});
			}
		});
	}

	render() {
		return (
			<div className="submit">
				<span>{this.state.uploadTip || ''}</span>
				<Upload
					className="upload-wrap"
					action=""
					name="file"
					showUploadList={false}
					onChange={this.uploadChange}
				>
					{/*<Button type="primary" disabled={this.state.btnstatus}>上传附件</Button>这期木有上传*/}
				</Upload>
				<Button type="primary" onClick={this.submitAll} disabled={this.state.btnstatus}>提交审核</Button>
			</div>
		);
	}
}

// export default Login;

