import './loginpage.css';
import React from 'react'; 
import { connect } from 'react-redux';
import * as Service from '../../services/index';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import { SET_USERINFO } from '../../action/actionTypes';
import md5 from 'js-md5';
const FormItem = Form.Item;    

class Login extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			reqMessage : ''
		};

		this.handleLogin = this.handleLogin.bind(this);
		this.rememberMe = this.rememberMe.bind(this);

		this.clearTxt = this.clearTxt.bind(this);
	}

	handleLogin(e) {
		e.preventDefault();
		this.clearTxt();
		this.props.form.validateFields((err, values) => {
			console.log(values)
			values.password = md5.hex(values.password);
			if (!err) {
				Service.userLogin(values, (req) => {
					if(req.status == 200) {
						localStorage.setItem("userData",JSON.stringify(req.data));
						this.props.setUser(req.data);
					}
					else {
						this.setState({'reqMessage' : req.message});
					}
				});
			}
		});
	}

	rememberMe(e) {
		const form = this.props.form;
		const isChecked = e ? e.target.checked : form.getFieldValue('remember') ; 
		const nameField = form.getFieldInstance('phone');
		const psField = form.getFieldInstance('password');
		
		if(isChecked) {
			nameField.refs['input'].autocomplete = 'on';
			psField.refs['input'].autocomplete = 'on';
		}
		else {
			nameField.refs['input'].autocomplete = 'off';
			psField.refs['input'].autocomplete = 'off';
		}
	}

	componentDidMount() {
		this.rememberMe();
	}

	clearTxt() {
		this.setState({'reqMessage' : ''});
	}

	render() {
		const { getFieldDecorator } = this.props.form;
		
		return (
			<div className="login" id="login">
				<div className="main">
					<div className="info">
						<p className="title">欢迎使用FFAN地图在线编辑平台</p>
						<div className="error-txt">{this.state.reqMessage}</div>
						<Form onSubmit={this.handleLogin} className="login-form">
							<FormItem>
							{getFieldDecorator('phone', {
								rules: [{ 
									pattern : /^1\d{10}$/,
									required: true, 
									message: '请您正确填写手机号' 
								}],
							})(
								<Input onChange={this.clearTxt} prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="请输入注册手机号" />
							)}
							</FormItem>
							<FormItem>
							{getFieldDecorator('password', {
								rules: [{ required: true, message: '请您填写密码' }],
							})(
								<Input onChange={this.clearTxt} prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="请输入密码" />
							)}
							</FormItem>
							<FormItem className="login-subline">
							{getFieldDecorator('remember', {
								valuePropName: 'checked',
								initialValue: true,
							})(
								<Checkbox onChange={this.rememberMe}>记住我</Checkbox>
							)}
							<Button type="primary" htmlType="submit" className="login-button">登录</Button>
							</FormItem>
						</Form>
					</div>
				</div>
			</div>
		);
	}
}
const LoginForm = Form.create()(Login);
class LoginPage extends React.Component{
	constructor(props) {
		super(props);

		this.setUser = this.setUser.bind(this);
	}

	setUser(data) {
		this.props.dispatch({
			type : SET_USERINFO,
			data : data || {}
		});
		document.cookie = 'uuid=' + escape(data.uuid) + ';path=/;domain=ffan.com;expires=' + ((new Date()).getTime() + 1*24*60*60*1000);
		location.href = location.pathname + '#/plazalist';
	}

	render() {
		return (<LoginForm setUser={this.setUser} />);
	}
}

function mapStateToProps(state) {
  return state;
}
export default connect(mapStateToProps)(LoginPage);

