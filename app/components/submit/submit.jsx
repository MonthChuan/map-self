import './submit.css';
import React from 'react';  
import { Button } from 'antd';   

export default class Submit extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			map : null
		};

		// this.editStart = this.editStart.bind(this);
	}
	//点击之前先获取map对象
	clickInit() {
		if(!this.state.map) {
			this.state.map = this.props.getMap().ffmap;
		}
	}

	render() {
		return (
			<div className="submit">
				<Button type="primary" onClick={this.props.editStart}>开始编辑</Button>
				<Button type="primary">保存</Button>
				<Button type="primary">完成编辑</Button>
			</div>
		);
	}
}

// export default Login;

