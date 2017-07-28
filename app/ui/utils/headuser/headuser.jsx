import './headuser.css';
import React from 'react';
import { connect } from 'react-redux';
import { Button,Modal } from 'antd'; 

/**
 * ajax请使用services目录下的ajax.js
 */

class HeadUser extends React.Component{
	constructor(props) {
		super(props);
		let userData = localStorage.getItem("userData")
		if(!userData){
			location.href = location.pathname + '#/login';
		}
		else{
			let userDataObj = JSON.parse(userData);
			if(userDataObj.userName){
				this.state ={
					dispUser:userDataObj.userName
				}
			}
		}
	}
	componentDidMount() {}
    
    //确认退出提示框
    showConfirm() {
		Modal.confirm({
		    title: '是否要退出当前登录?',
		    onOk() {
				localStorage.removeItem("userData");
		      	location.href = location.pathname + '#/login';
		    },
		    onCancel() {
		      
		    },
		});
	}
    
    render() {
		return (
			<div className="page-headuser">
				<span>{this.state.dispUser}</span>
				<Button onClick={this.showConfirm} className="quit-btn" type="primary">退出</Button>
			</div>
		);
	}
}

function mapStateToProps(state) {
  return state;
}
export default connect(mapStateToProps)(HeadUser);

