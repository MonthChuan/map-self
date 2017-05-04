import './submit.css';
import React from 'react';  
import { Button, Upload } from 'antd';   

export default class Submit extends React.Component{
	constructor(props) {
		super(props);
		this.state = this.props.state;

		this.uploadChange = this.uploadChange.bind(this);
	}

	uploadChange(info) {
		this.setState({uploadTip : info.file.status});
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
					<Button>上传CAD</Button>
				</Upload>
				<Button type="primary">完成编辑</Button>
			</div>
		);
	}
}

// export default Login;

