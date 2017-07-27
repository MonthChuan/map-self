import './plazatablepage.css';
import React from 'react';
import { connect } from 'react-redux';
import EditHistory from '../editHistory/editHistory.jsx';
import { Modal, Table, Icon , Input , Checkbox } from 'antd';
import { $ajax, $get, $post } from '../../../services/ajax.js';
import * as Service from '../../../services/plazalistsv.js';
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
			editing:true,
			verifying:true,
			myPlaza:true,
			plazaId:"",
			plazaName:"",
			userName:"",
		};
		//列名
		this.columns = [{
			  title: '广场ID',
 			  dataIndex: 'plazaId',
			  key: 'plazaId',
			  sorter: (a, b) => a.plazaId - b.plazaId,
			}, {
			  title: '广场名称',
			  dataIndex: 'plazaName',
			  key: 'plazaName',
			  sorter: (a, b) => a.plazaName.length - b.plazaName.length,
			}, {
			  title: '状态',
			  dataIndex: 'state',
			  key: 'state',
			  render: text => {return text==0?"已完成":"编辑中"} ,
			  sorter: (a, b) => a.state - b.state,
			}, 
			{
			  title: '最新编辑',
			  dataIndex: 'editor',
			  key: 'editor',
			  
			}, {
			  title: '最近审核',
			  dataIndex: 'verifier',
			  key: 'verifier',
			},
			{
			  title: '编辑/审核备注',
			  dataIndex: 'remark',
			  key: 'remark',
			}, {
			  title: '更新时间',
			  dataIndex: 'time',
			  key: 'time',
			  sorter: (a, b) => a.time - b.time,
			},{
			  title: '操作',
			  key: 'action',
			  render: (text, record) => (
			    <span>
			      <span className="editHistory" onClick={this.showModal.bind(this,record.plazaId,record.plazaName)}>编辑历史</span>
			      <span className="ant-divider" />
			      <a href={"#/detail?plazaFfanId="+record.plazaId}>查看</a>
			      <span className="ant-divider" />
			      <a href={"#/editor?plazaFfanId="+record.plazaId}>编辑</a>
			      <span className="ant-divider" />
			      <a href="#" onClick={this.verifyPlaza.bind(this,record.plazaId,record.plazaName)}>审核</a>
			   </span>
			  ),
        }];
		this.inEditChange=this.inEditChange.bind(this);
		this.inReviewChange=this.inReviewChange.bind(this);
		//this.editChange=this.editChange.bind(this);
		this.myPlazaChange=this.myPlazaChange.bind(this);
		this.plazaIdSearch=this.plazaIdSearch.bind(this);
		this.plazaNameSearch=this.plazaNameSearch.bind(this);
		this.userNameSearch=this.userNameSearch.bind(this);
		this.handleTableChange=this.handleTableChange.bind(this);
		this.showModal=this.showModal.bind(this);
		this.handleCancel=this.handleCancel.bind(this);
		this.verifyPlaza=this.verifyPlaza.bind(this);
	}
	showModal(id,name){
		let formatData={};
		formatData.plazaId = id;
		formatData.pageSize=10;
		formatData.startPage=1;
		this.fetchHistory(formatData);

		this.setState({ visible: true });
		this.setState({ plazaName:name});
		this.setState({ plazaId:id});
  	}

	fetchHistory(params){
		//this.refs["editHis"].getTableLoading(true);
		//EditHistory.getTableLoading(true);
		this.setState({
			loadingHistory:true
		});
		let self=this;
		Service.getPlazaHistoryAjax(params,(res)=>{
			let pagination = {};
			pagination.total = res.data.sum;
			this.setState({
				loadingHistory:true,
				dataHistory:res.data,
				paginationHistory:pagination
			});
			//self.refs["editHis"].getPTableState(false,res.data.list,pagination);
		});
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
	    formatData.startPage=pagination.current;
	    this.fetch(formatData);
    }
    fetch(params){
	    //console.log('params:', params);
	    this.setState({ loading: true });
	    let self=this;
		let sendParams = {};
		if(params.editing){
			sendParams.editing = 1;
		}
		else{
			delete sendParams.editing;
		}

		if(params.verifying){
			sendParams.verifying = 1;
		}
		else{
			delete sendParams.verifying;
		}

		if(params.myPlaza){
			sendParams.myPlaza = 1;
		}
		else{
			delete sendParams.myPlaza;
		}

		let plazaIdValue = document.getElementById("plazaIdS");
		//console.log("plazaIdValue:" + plazaIdValue.value);
		let plazaNameValue = document.getElementById("plazaNameS");
		let userNameValue = document.getElementById("userNameS");
		//sendParams.plazaId = plazaIdValue.props.value;
		sendParams.plazaId = plazaIdValue.value;
		sendParams.plazaName = plazaNameValue.value;
		sendParams.userName = userNameValue.value;
	    Service.getPlazaVerifyListAjax(sendParams,(res)=>{
			//let self=this;
			console.log(res);
			const pagination = self.state.pagination;
			pagination.total = res.data.sum
			self.setState({
				loading: false,
				data: res.data.plazas,
				pagination,
			});
		});
  	}

	verifyPlaza(id,plazaName){

		this.setState({ loading: true });
		let self=this;
		let sendParams = {};
		sendParams.plazaId = id;

		Service.getVerifyPlazaAjax(sendParams,(res)=>{
			//const pagination = self.state.pagination;
			//pagination.total = res.data.sum
			self.setState({
				loading: false
			});

			let msgInfo = "审核成功";
			if(res.status != 200){
				msgInfo = res.message;
			}
			Modal.info({
				title: '广场：' + plazaName + "审核结果如下：",
				content: (
					<div>
						<p>{msgInfo}</p>
					</div>
				),
				onOk() {},
			});
		});
	}

	componentDidMount() {
		this.item.pageSize=10;
		this.item.startPage=1;
	    this.fetch(this.item);
	}
	inEditChange(e) {
    	this.item.editing=!this.item.editing;
    	this.fetch(this.item);
  	}
    inReviewChange(e) {
  		this.item.verifying =!this.item.verifying;
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
					<Checkbox defaultChecked="true" onChange={this.inEditChange}>编辑中</Checkbox>
					<Checkbox defaultChecked="true" onChange={this.inReviewChange}>审核中</Checkbox>
					<Checkbox defaultChecked="true" onChange={this.myPlazaChange}>我的广场</Checkbox>
			  		<Search
						id="plazaIdS"
			  		 placeholder="广场ID"
				    style={{ width: 200 }}
				    onSearch={value => this.plazaIdSearch(value)}
				 	/>
				 	<Search
						id="plazaNameS"
				 	placeholder="广场名称"
				    style={{ width: 200 }}
				    onSearch={value => this.plazaNameSearch(value)}
				 	/>
				 	<Search
						id="userNameS"
				    placeholder="用户名称"
				    style={{ width: 200 }}
				    onSearch={value => this.userNameSearch(value)}
				 	/>
				</div>
				<EditHistory
					ref="editHis"
					visible={this.state.visible}
					onCancel={this.handleCancel}
					plazaId={this.state.plazaId}
					plazaName={this.state.plazaName}
					loadingHistory={this.state.loadingHistory}
					dataHistory={this.state.dataHistory}
					paginationHistory={this.state.paginationHistory}
				/>
				<Table columns={this.columns}
				       //rowKey={record => record.registered}
					   rowKey={record => record.plazaId}
				       dataSource={this.state.data}
				       pagination={this.state.pagination}
				       loading={this.state.loading}
				       onChange={this.handleTableChange}
      			/>
      		</div>
		);
	}
}

function mapStateToProps(state) {
  return state;
}
export default connect(mapStateToProps)(Plazatable);

