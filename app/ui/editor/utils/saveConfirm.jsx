import React from 'react'; 
import { Modal } from 'antd';

class SaveConfirm extends React.Component{
	constructor(props) {
		super(props);
		this.state = {};
	}

	//DOM加载完毕之后，初始化map
	componentDidMount() {
		this.state = { visible: false };

		this.handleCancel = this.handleCancel.bind(this);
		this.handleOk = this.handleOk.bind(this);
		this.showConfirm = this.showConfirm.bind(this);
	}

	handleCancel() {
		this.setState({ visible: false });
		window.location.reload();
	}

	handleOk() {
		this.setState({ visible: false });
	}

	showConfirm() {
		this.setState({ visible: true });
	}

	render () {
	    return (
			<Modal 
				title="提示" 
				visible={this.state.visible} 
				onOk={this.handleOk} 
				onCancel={this.handleCancel} 
				okText="继续编辑" 
				cancelText="放弃编辑"
			>
				<p>您有编辑内容还未保存，是否离开？</p>
			</Modal>
	    );
	  }
}

export default SaveConfirm;

