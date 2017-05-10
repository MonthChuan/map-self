import './submit.css';
import React from 'react';  
import { Button, Upload } from 'antd';   

export default class Submit extends React.Component{
	constructor(props) {
		super(props);
		this.state = this.props.state;

		this.uploadChange = this.uploadChange.bind(this);
		this.submitAll = this.submitAll.bind(this);
	}

	uploadChange(info) {
		this.setState({uploadTip : info.file.status});
	}

	submitAll() {
		if(this.props.state.store.length > 0) {
			this.props.saveEdit();
		}
		//todo结束本次编辑。。。
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
					<Button type="primary">上传附件</Button>
				</Upload>
				<Button type="primary" onClick={this.submitAll}>提交审核</Button>
			</div>
		);
	}
}

// export default Login;

