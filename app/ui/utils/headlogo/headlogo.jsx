import './headlogo.css';
import React from 'react';
import { connect } from 'react-redux';

/**
 * 使用公共头部，外面要有一样的容器结构
 * 
 * <div className="page-header">
 *		<div className="page-header-main clearfix">
 *			<HeadLogo />
 *		</div>
 *	</div>
 * 
 */

class HeadLogo extends React.Component{
	constructor(props) {
		super(props);
	}
    
    render() {
		return (
			<div className="page-header-logo">
				<span className="logo-txt">飞凡地图</span>
				<span className="logo-txt2">室内地图编辑平台</span>
			</div>
		);
	}
}

function mapStateToProps(state) {
  return state;
}
export default connect(mapStateToProps)(HeadLogo);

