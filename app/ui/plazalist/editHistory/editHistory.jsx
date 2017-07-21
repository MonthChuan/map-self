import './editHistorypage.css';
import React from 'react';
import { connect } from 'react-redux';
import { Table, Icon , Input , Checkbox , Modal} from 'antd'; 
import { $ajax, $get, $post } from '../../../services/ajax.js';


class EditHistory extends React.Component{
	constructor(props) {
		super(props);
		this.state ={
			data:[],
			pagination: {},
    		loading: false,
		}
		this.columns = [{
			  title: '广场ID',
 			  dataIndex: 'plazaFfanId',
			  key: 'plazaFfanId',
			}, {
			  title: '广场名称',
			  dataIndex: 'plazaName',
			  key: 'plazaName',
			}, {
			  title: '状态',
			  dataIndex: 'status',
			  key: 'status',
			}, 
			{
			  title: '最新编辑',
			  dataIndex: 'lastEdit',
			  key: 'lastEdit',
			  
			}, {
			  title: '最近审核',
			  dataIndex: 'lastExamine',
			  key: 'lastExamine',
			  
			},{
			  title: '下载',
			  key: 'download',
			  render: (text, record) => (
			    <span>
			      <a href="#">下载</a>
			    </span>
			  ),
        }];
	this.handleTableChange=this.handleTableChange.bind(this);
		
    }
	handleTableChange(pagination){
		const pager = this.state.pagination;
		//当前页
	    pager.current = pagination.current;
	   
	    this.setState({
	      pagination: pager,
	    });
	    
	    const formatData={};
	    formatData.results=5;
	    formatData.page=pagination.current;
	    this.fetch(formatData);
    }
    fetch(params){
	    console.log('params:', params);
	    this.setState({ loading: true });
	    let self=this;
	    $ajax({
		    url: 'http://yunjin.intra.sit.ffan.com/mapeditor/plaza/v1/indoor/plazas',
		    data: {
		        params
		    },
		    success:function(res){
		    	console.log(res);
		      	const pagination = self.state.pagination;
		      	pagination.total = res.data.sum
		      	self.setState({
			        loading: false,
			        data: res.data.list,
			        pagination,
		      	});
		    }
	    });
  	}
	componentDidMount() {
	     this.fetch(this.item);
	}
	render() {
		return (
			<Modal 
				visible={this.props.visible}
				onCancel={this.props.onCancel}
				title="编辑广场"
		    >
				<Table columns={this.columns}
				       rowKey={record => record.registered}
				       dataSource={this.state.data}
				       pagination={this.state.pagination}
				       loading={this.state.loading}
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

