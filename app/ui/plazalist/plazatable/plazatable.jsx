import './plazatablepage.css';
import React from 'react';
import { connect } from 'react-redux';
import EditHistory from '../editHistory/editHistory.jsx';
import { Modal, Table, Icon , Input , Checkbox , Button } from 'antd';
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
			columns: this.columns,
			
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
			//发布页表头
			this.ssiueColumns = [{
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
			  //render: text => {return text==0?"已完成":"编辑中"} ,
			  sorter: (a, b) => a.state - b.state,
			}, {
				title: '用户名',
				dataindex: 'user',
				key: 'user',

				 },{
				title: '用户id',
				dataIndex: 'userId',
				key: 'userId',
			},
			 {
			  title: '开始时间',
			  dataIndex: 'time',
			  key: 'time',
			 
			},
		
			 {
			  title: '结束时间',
			  dataIndex: 'time',
			  key: 'endtime',
			 
			},{
			  title: '操作',
			  key: 'action',
			  render: (text, record) => (
			    <span>
			      <span className="editHistory" onClick={this.showModal.bind(this,record.plazaId,record.plazaName)}>发布</span>
				 <span className="ant-divider" />
			      <a href={"#/"+record.plazaId +"/skim/"+record.plazaName} target="_blank" >出入库记录</a>
			      <span className="ant-divider" />
			      <a href={"#/"+record.plazaId +"/skim/"+record.plazaName} target="_blank" >查看地图</a>
			      <span className="ant-divider" />
					<a href="#" onClick={this.editPlaza.bind(this,record.plazaId,record.plazaName)}>解锁</a>
			      <span className="ant-divider" />
					<a href="#" onClick={this.verifyPlaza.bind(this,record.plazaId,record.plazaName)}>加锁</a>
			   </span>
			  ),
        }];
			//列表页表头
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
			  //render: text => {return text==0?"已完成":"编辑中"} ,
			  sorter: (a, b) => a.state - b.state,
			}, {
				title: '锁定用户',
				dataindex: 'user',
				key: 'user',

				 },{
				title: '锁定id',
				dataIndex: 'userId',
				key: 'userId',
			},
			
		
			 {
			  title: '更新时间',
			  dataIndex: 'time',
			  key: 'time',
			  sorter: (a, b) => a.time - b.time,
			},{
			  title: '操作',
			  key: 'action',
			  render: (text, record) => (
			    <span>
			      <span className="editHistory" onClick={this.showModal.bind(this,record.plazaId,record.plazaName)}>发布</span>
				 <span className="ant-divider" />
			      <a href={"#/"+record.plazaId +"/skim/"+record.plazaName} target="_blank" >出入库记录</a>
			      <span className="ant-divider" />
			      <a href={"#/"+record.plazaId +"/skim/"+record.plazaName} target="_blank" >查看地图</a>
			      <span className="ant-divider" />
					<a href="#" onClick={this.editPlaza.bind(this,record.plazaId,record.plazaName)}>解锁</a>
			      <span className="ant-divider" />
					<a href="#" onClick={this.verifyPlaza.bind(this,record.plazaId,record.plazaName)}>加锁</a>
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
		this.fetchHistory = this.fetchHistory.bind(this);
		this.verifyPlaza=this.verifyPlaza.bind(this);
		this.editPlaza = this.editPlaza.bind(this);
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
		this.setState({
			loadingHistory:true
		});
		let self=this;
		Service.getPlazaHistoryAjax(params,(res)=>{
			let pagination = {};
			pagination.total = res.data.sum;
			if(res.data.sum == 0){
				res.data.plazas = [];
			}
			let pLength = res.data.plazas.length;
			for(let i=0; i< pLength; i++){
				if(res.data.plazas[i].state == 0){
					res.data.plazas[i].state = "";
				}
				if(res.data.plazas[i].state == 1){
					res.data.plazas[i].state = "编辑";
				}
				if(res.data.plazas[i].state == 2){
					res.data.plazas[i].state = "审核";
				}
			}

			this.setState({
				loadingHistory:false,
				dataHistory:res.data.plazas,
				paginationHistory:pagination
			});

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
		let reg = new RegExp("^[0-9]*$");
		let idValue = -1;
		if(reg.test(plazaIdValue.value)){
			idValue = plazaIdValue.value;
		}
		sendParams.plazaId = idValue;
		sendParams.plazaName = plazaNameValue.value;
		sendParams.userName = userNameValue.value;
		sendParams.startPage = params.startPage;
		sendParams.pageSize = params.pageSize;
	    Service.getPlazaVerifyListAjax(sendParams,(res)=>{
			const pagination = self.state.pagination;
			pagination.total = res.data.sum;
			if(res.data.sum == 0){
				res.data.plazas = [];
			}
			let pLength = res.data.plazas.length;
			for(let i=0; i< pLength; i++){
				if(res.data.plazas[i].state == 0){
					res.data.plazas[i].state = "";
				}
				if(res.data.plazas[i].state == 1){
					res.data.plazas[i].state = "编辑中";
				}
				if(res.data.plazas[i].state == 2){
					res.data.plazas[i].state = "审核中";
				}
				if(res.data.plazas[i].state == 3){
					res.data.plazas[i].state = "审核不通过";
				}
				if(res.data.plazas[i].state == 4){
					res.data.plazas[i].state = "审核通过";
				}
			}
			self.setState({
				loading: false,
				data: res.data.plazas,
				pagination,
			});
		});
  	}

	verifyPlaza(id,plazaName){

		//this.setState({ loading: true });
		let self=this;
		let sendParams = {};
		sendParams.plazaId = id;

		let winHandler = window;

		Service.postVerifyPlazaAjax(sendParams,(res)=>{
			//self.setState({
			//	loading: false
			//});

			let msgInfo = "";//审核成功
			if(res.status != 200){
				msgInfo = res.message;
				Modal.info({
					title: '广场：' + plazaName + "不能审核的原因：",
					content: (
						<div>
							<p>{msgInfo}</p>
						</div>
					),
					onOk() {},
				});
			}
			else{
				//var newTab=window.open('about:blank');
				var newTab=winHandler.open('about:blank');
				newTab.location.href="#/" + id +"/review/" + plazaName;
			}

		});
	}

	editPlaza(id,plazaName){

		//this.setState({ loading: true });
		let self=this;
		let sendParams = {};
		sendParams.plazaId = id;

		//const w=window.open('about:blank');
		let winHandler = window;

		Service.postEditPlazaAjax(sendParams,(res)=>{
			//self.setState({
			//	loading: false
			//});

			let msgInfo = "";//审核成功
			if(res.status != 200){
				msgInfo = res.message;
				Modal.info({
					title: '广场：' + plazaName + "不能编辑的原因：",
					content: (
						<div>
							<p>{msgInfo}</p>
						</div>
					),
					onOk() {},
				});
			}else{
				var newTab=winHandler.open('about:blank');
				newTab.location.href="#/" + id +"/edit/" + plazaName;
			}

		});
	}

	componentDidMount() {
		this.item.pageSize=10;
		this.item.startPage=1;
	    this.fetch(this.item);
	
		

			
	}
	inEditChange(e) {
    	this.item.editing=!this.item.editing;
		const formatData=this.item;
		formatData.pageSize=10;
		formatData.startPage=1;
    	this.fetch(formatData);
  	}
    inReviewChange(e) {
  		this.item.verifying =!this.item.verifying;
		const formatData=this.item;
		formatData.pageSize=10;
		formatData.startPage=1;
		this.fetch(formatData);
	}
    myPlazaChange(e) {
  		this.item.myPlaza=!this.item.myPlaza;
		const formatData=this.item;
		formatData.pageSize=10;
		formatData.startPage=1;
		this.fetch(formatData);
	}
    plazaIdSearch(value) {
  		this.item.plazaId=value;
		const formatData=this.item;
		formatData.pageSize=10;
		formatData.startPage=1;
		this.fetch(formatData);
	}
    plazaNameSearch(value) {
  		this.item.plazaName=value;
		const formatData=this.item;
		formatData.pageSize=10;
		formatData.startPage=1;
		this.fetch(formatData);
	}
    userNameSearch(value) {
  		this.item.userName=value;
		const formatData=this.item;
		formatData.pageSize=10;
		formatData.startPage=1;
		this.fetch(formatData);
	}
	// componentWillReceiveprops() {
	// 		var table = document.getElementsByTagName('Table')[0];
		
	// 	var reg = /(ssiue)$/;
	// 	var bool = reg.test(this.str)
	// 	if(true) {
			
	// 		this.columns = this.ssiueColumns;
			
	// 	}
	// }
	//判断不同页面的不同显隐
	ssiueHidd() {
		this.str = window.location.href;
		var reg = /(ssiue)$/;
		var bool = reg.test(this.str)
		var showArr = document.getElementsByClassName("show");
		console.log(showArr);
		if(bool == true) {
			alert(1);
			
			
			for(var i=0;i<showArr.length;i++) {
				showArr[i].classList.add('hidd');
			}
			this.setState();
			return true;
		}

		
	}
	//判断不同页面改变table组件的属性
	componentWillMount() {
		this.ssiueHidd();
	}
	
	render() {
		return (
			<div id="plazatable">
				<div className="filter-item">
					<Checkbox defaultChecked="true" onChange={this.inEditChange} className="show">未锁定</Checkbox>
					<Checkbox defaultChecked="true" onChange={this.inReviewChange} className="show">已锁定</Checkbox>
				
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
					 <Button onClick={this.showConfirm} className="quit-btn issue-btn show" type="primary">发布中</Button>
					 <a href="#/ssiue" target="_blank"><Button onClick={this.showConfirm} className="quit-btn issue-btn show" type="primary">发布记录</Button></a>
				</div>
				<EditHistory
					ref="editHis"
					visible={this.state.visible}
					onCancel={this.handleCancel}
					fetchHistory = {this.fetchHistory}
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

