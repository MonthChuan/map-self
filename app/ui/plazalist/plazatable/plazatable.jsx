import './plazatablepage.css';
import React from 'react';
import { connect } from 'react-redux';
import EditHistory from '../editHistory/editHistory.jsx';
import { Table, Icon , Input , Checkbox } from 'antd'; 
import { $ajax, $get, $post } from '../../../services/ajax.js';
import * as Service from '../../../services/index.js';
const Search = Input.Search;

class Plazatable extends React.Component{
	constructor(props) {
		
		super(props);
		this.state ={
			visible: false,
			data:[],
			pagination: {},
    		loading: false,
		}
		//筛选条件
		this.item={
			inEdit:false,
			inReview:false,
			edit:false,
			myPlaza:false,
			plazaId:"",
			plazaName:"",
			userName:"",
		};
		//列名
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
			  
			},
			{
			  title: '编辑/审核备注',
			  dataIndex: 'remark',
			  key: 'remark',
			  
			}, {
			  title: '更新时间',
			  dataIndex: 'date',
			  key: 'date',
			  
			},{
			  title: '操作',
			  key: 'action',
			  render: (text, record) => (
			    <span>
			      <span className="editHistory" onClick={this.showModal.bind(this,record.plazaName)}>编辑历史</span>
			      <span className="ant-divider" />
			      <a href="#">查看</a>
			      <span className="ant-divider" />
			      <a href="#">编辑</a>
			      <span className="ant-divider" />
			      <a href="#">审核</a>
			   </span>
			  ),
        }];
		this.inEditChange=this.inEditChange.bind(this);
		this.inReviewChange=this.inReviewChange.bind(this);
		this.editChange=this.editChange.bind(this);
		this.myPlazaChange=this.myPlazaChange.bind(this);
		this.plazaIdSearch=this.plazaIdSearch.bind(this);
		this.plazaNameSearch=this.plazaNameSearch.bind(this);
		this.userNameSearch=this.userNameSearch.bind(this);
		this.handleTableChange=this.handleTableChange.bind(this);
		this.showModal=this.showModal.bind(this);
		this.handleCancel=this.handleCancel.bind(this);
	}
	showModal(name){
		this.setState({ visible: true });
		this.setState({ title: '广场编辑历史--'+name});
  	}
	handleCancel(){
   	 	this.setState({ visible: false });
    }
	handleTableChange(pagination){
		const pager = this.state.pagination;
		//当前页
	    pager.current = pagination.current;
	   
	    this.setState({
	      pagination: pager,
	    });
	    
	    const formatData=this.item;
	    formatData.pageSize=10;
	    formatData.startRow=pagination.current;
	    this.fetch(formatData);
    }
    fetch(params){
	    console.log('params:', params);
	    this.setState({ loading: true });
	    let self=this;
	    Service.getPlazaListAjax();
	    console.log(params);
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
	inEditChange(e) {
    	this.item.inEdit=!this.item.inEdit;
    	this.fetch(this.item);
  	}
    inReviewChange(e) {
  		this.item.inReview =!this.item.inReview;
    	this.fetch(this.item);
	}
   	editChange(e) {
  		this.item.edit=!this.item.edit;
    	this.fetch(this.item);
	}
    myPlazaChange(e) {
  		this.item.myPlaza=!this.item.myPlaza;
    	this.fetch(this.item);
	}
    plazaIdSearch(value) {
  		this.item.plazaId=value;
    	this.fetch(this.item);
	}
    plazaNameSearch(value) {
  		this.item.plazaName=value;
    	this.fetch(this.item);
	}
    userNameSearch(value) {
  		this.item.userName=value;
    	this.fetch(this.item);
	}
	render() {
		return (
			<div id="plazatable">
				<div className="filter-item">
					<Checkbox onChange={this.inEditChange}>编辑中</Checkbox>
					<Checkbox onChange={this.inReviewChange}>审核中</Checkbox>
					<Checkbox onChange={this.editChange}>待审核</Checkbox>
					<Checkbox onChange={this.myPlazaChange}>我的广场</Checkbox>
			  		<Search
				    placeholder="广场ID"
				    style={{ width: 200 }}
				    onSearch={value => this.plazaIdSearch(value)}
				 	/>
				 	<Search
				    placeholder="广场名称"
				    style={{ width: 200 }}
				    onSearch={value => this.plazaNameSearch(value)}
				 	/>
				 	<Search
				    placeholder="用户名称"
				    style={{ width: 200 }}
				    onSearch={value => this.userNameSearch(value)}
				 	/>
				</div>
				<Table columns={this.columns}
				       rowKey={record => record.registered}
				       dataSource={this.state.data}
				       pagination={this.state.pagination}
				       loading={this.state.loading}
				       onChange={this.handleTableChange}
      			/>
      			<EditHistory  
	      			visible={this.state.visible}
	      			onCancel={this.handleCancel}
	      		/>
      		</div>
		);
	}
}

function mapStateToProps(state) {
  return state;
}
export default connect(mapStateToProps)(Plazatable);

