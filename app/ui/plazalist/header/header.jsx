import './headerpage.css';
import React from 'react';
import { connect } from 'react-redux';
import { Button,Modal } from 'antd'; 

/**
 * ajax请使用services目录下的ajax.js
 */

class Header extends React.Component{
	constructor(props) {
		super(props);
	}
	componentDidMount() {}
    
    //确认退出提示框
    showConfirm() {
		Modal.confirm({
		    title: '是否要退出当前登录?',
		    onOk() {
		      location.href = location.pathname + '#/login';
		    },
		    onCancel() {
		      
		    },
		});
	}
    
    render() {
		return (
			<div className="topbar mid clearfix">
				<div className="logo fl"></div>
				<div className="fr">
					<span>管理员-李海洋</span>
					<Button onClick={this.showConfirm} className="quit-btn" type="primary">退出</Button>
				</div>
			</div>
		);
	}
}

function mapStateToProps(state) {
  return state;
}
export default connect(mapStateToProps)(Header);

