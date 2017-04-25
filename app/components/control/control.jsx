import './control.css';
import React from 'react';  
import { Button, Input, Upload, Icon } from 'antd';   

const Search = Input.Search;

export default class Control extends React.Component{
	constructor(props) {
		super(props);
		this.state = this.props.state;
		this.drawLine = this.drawLine.bind(this);
		this.drawPloy = this.drawPloy.bind(this);
		this.seachStore = this.seachStore.bind(this);
		this.uploadChange = this.uploadChange.bind(this);
	}

	//画线
	drawLine(evt) {
		this.state.ffmap.startPolyline();
	}
	
	//画面
	drawPloy() {
		this.state.ffmap.startPolygon();
	}

	//合并
	//搜索店铺
	seachStore(value) {
		let stores = [];

		if(/^[0-9]*$/.test(value)) {
			stores = this.state.ffmap.searchStoreByID(value);
		}
		else {
			stores = this.state.ffmap.serachStoreByName(value);
		}
		stores.forEach(function(store, i) {
			store.selected = true;
		});
	}
	uploadChange(info) {
		this.setState({uploadTip : info.file.status});
	}
	render() {
		return (
			<div className="control">
				<Button type="primary" onClick={this.drawLine}>线</Button><br />
				<Button type="primary" onClick={this.drawPloy}>面</Button><br />
				<Button type="primary">合并</Button><br />
				<Search
					placeholder="搜索店铺"
					style={{ width: 100 }}
					onSearch={this.seachStore}
				/>
				<Upload
					className="upload-wrap"
					action=""
					name="file"
					showUploadList={false}
					onChange={this.uploadChange}
				>
					<Button>
						<Icon type="upload" /> 上传CAD
					</Button>
				</Upload>
				<p>{this.state.uploadTip || ''}</p>
			</div>
		);
	}
}

// export default Login;

