import './submit.css';
import React from 'react';  
import { Button } from 'antd';   

export default class Submit extends React.Component{
	constructor(props) {
		super(props);
		this.state = this.props.state;

		this.editStart = this.editStart.bind(this);
		this.saveEdit = this.saveEdit.bind(this);
	}

	editStart() {
		this.setState({tip : '正处于编辑状态！'});
		this.props.editStart();
	}

	saveEdit() {
		this.props.saveEdit();
	}

	render() {
		return (
			<div className="submit">
				<span>{this.state.tip || '点击开始编辑'}</span>
				<Button type="primary" onClick={this.editStart}>开始编辑</Button>
				<Button type="primary" onClick={this.saveEdit}>保存</Button>
				<Button type="primary">完成编辑</Button>
			</div>
		);
	}
}

// export default Login;

