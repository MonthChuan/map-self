import './editHistorypage.css';
import React from 'react';
import { connect } from 'react-redux';
import { Table, Icon , Input , Checkbox , Modal} from 'antd'; 
import { $ajax, $get, $post } from '../../../services/ajax.js';


class EditHistory extends React.Component{
	constructor(props) {
		super(props);
		this.state ={
			dataHistory:[],
			paginationHistory: {},
    		loading: false,
		}
		this.columns = [{
			  title: '广场ID',
 			  dataIndex: 'plazaId',
			  key: 'plazaId',
			}, {
			  title: '广场名称',
			  dataIndex: 'plazaName',
			  key: 'plazaName',
			}, {
			  title: '类型',
			  dataIndex: 'state',
			  key: 'state',
			}, 
			{
			  title: '人员',
			  dataIndex: 'operator',
			  key: 'operator',
			  
			}, {
			  title: '时间',
			  dataIndex: 'time',
			  key: 'time',
			  
			},{
			  title: '下载',
			  key: 'url',
			  render: (text, record) => (
			    <span>
			      <a href={record.url} disabled={record.url!=null?false:true}>下载</a>
			    </span>
			  ),
        }];
	this.handleTableChange=this.handleTableChange.bind(this);
		
    }
	handleTableChange(pagination){
		const pager = this.state.paginationHistory;
		//当前页
	    pager.current = pagination.current;
	   
	    this.setState({
			paginationHistory: pager,
	    });
	    
	    let formatData={};
		formatData.plazaId = this.props.plazaId;
	    formatData.pageSize=10;
	    formatData.startPage=pagination.current;
	    this.props.fetchHistory(formatData);
    }
    //fetch(params){
	 //   console.log('params:', params);
	 //   this.setState({ loadingHistory: true });
	 //   let self=this;
	 //   $ajax({
		//    url: 'http://yunjin.intra.sit.ffan.com/mapeditor/auth/verify/his',
		//    data: {
		//        params
		//    },
		//    success:function(res){
		//    	console.log(res);
		//      	const pagination = self.state.pagination;
		//      	pagination.total = res.data.sum
		//      	self.setState({
		//	        loadingHistory: false,
		//	        dataHistory: res.data.list,
		//			paginationHistory:pagination,
		//      	});
		//    }
	 //   });
  	//}
	componentDidMount() {

	}

	componentWillReceiveProps(nextProps) {
		//if(nextProps.loadingHistory){
		//
		//}
		this.setState({loadingHistory: nextProps.loadingHistory});
		if(nextProps.dataHistory && nextProps.dataHistory.length > 0){
			this.setState({dataHistory: nextProps.dataHistory});
		}

		if(nextProps.paginationHistory){
			this.setState({paginationHistory: nextProps.paginationHistory});
		}
	}

	render() {
		return (
			<Modal 
				footer={null}
				visible={this.props.visible}
				onCancel={this.props.onCancel}
				title={"广场编辑历史--"+this.props.plazaName}
		    >
				<Table columns={this.columns}
				       rowKey={record => record.registered}
				       dataSource={this.state.dataHistory}
				       pagination={this.state.paginationHistory}
				       loading={this.state.loadingHistory}
				       onChange={this.handleTableChange}
	  			/>
  			</Modal>
		);
	}
}

function mapStateToProps(state) {
  return state;
}
export default connect(mapStateToProps)(EditHistory);

