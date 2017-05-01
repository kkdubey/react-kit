import React, { PropTypes } from 'react';
import TextField from 'material-ui/TextField/TextField';
import RaisedButton from 'material-ui/RaisedButton/RaisedButton';
import Card from 'material-ui/Card/Card';
import CardText from 'material-ui/Card/CardText';
import CardHeader from 'material-ui/Card/CardHeader';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Signin.css';
import fetch from '../../core/fetch';
import FlatButton from 'material-ui/FlatButton/FlatButton';
import Snackbar from 'material-ui/Snackbar/Snackbar';
import { connect } from 'react-redux';
import { login } from '../../actions/login';

const snackbarStyle = {
  position: 'absolute',
  marginTop: '50px !important',
};

class SigninPage extends React.Component {
  static propTypes = {
    login: PropTypes.func.isRequired,
    loginErrorMessage: React.PropTypes.string,
    loggedInUser: React.PropTypes.shape({
      status: React.PropTypes.string,
      avtaarUrl: React.PropTypes.string,
      user: React.PropTypes.shape({
        name: React.PropTypes.string,
      }),
    }),
  };

  constructor(props) {
    super(props);
    this.handleUserNameChange = this.handleUserNameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleOrganisationChange = this.handleOrganisationChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePhoneChange = this.handlePhoneChange.bind(this);
    this.loginUser = this.loginUser.bind(this);
    this.registerUser = this.registerUser.bind(this);
    this.forgotPassword = this.forgotPassword.bind(this);
    this.state = {
      userName: '',
      userNameErrorText: '',
      password: '',
      passwordErrorText: '',
      name: '',
      phone: '',
      email: '',
      organisation: '',
      nameErrorText: '',
      phoneErrorText: '',
      emailErrorText: '',
      organisationErrorText: '',
      SnackBarOpen: false,
      SnackBarText: '',
    };
  }

  loginUser = (e) => {
    e.preventDefault();
    if (this.state.userName === '') {
      this.setState({ userNameErrorText: 'Please enter user name' });
    } else if (this.state.password === '') {
      this.setState({ passwordErrorText: 'Please enter password' });
    } else {
      this.props.login(this.state.userName, this.state.password);
    }
  };

  registerUser = () => {
    if (this.state.name === '') {
      this.setState({ nameErrorText: 'Please enter name' });
    } else if (this.state.organisation === '') {
      this.setState({ organisationErrorText: 'Please enter organisation' });
    } else if (this.state.email === '') {
      this.setState({ emailErrorText: 'Please enter email' });
    } else if (this.state.phone === '') {
      this.setState({ phoneErrorText: 'Please enter phone number' });
    } else {
      const obj = {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          crossDomain: true,
        },
        body: JSON.stringify({
          name: this.state.name,
          organisation: this.state.organisation,
          email: this.state.email,
          phone: this.state.phone,
        }),
      };
      let isSuccess = false;
      fetch('/api/user/register', obj)
        .then((res) => {
          if (res.status === 200) {
            isSuccess = true;
          } else {
            document.getElementById('successmsg').innerText = res.statusText;
          }

          if (isSuccess) {
            this.setState({ name: '' });
            this.setState({ organisation: '' });
            this.setState({ email: '' });
            this.setState({ phone: '' });
            this.setState({ SnackBarText: 'User created successfully' });
            this.setState({ SnackBarOpen: true });
          }
        });
    }
  };

  forgotPassword = () => {
    if (this.state.userName === '') {
      this.setState({ userNameErrorText: 'Please enter your email' });
    } else {
      console.log(this.state.userName);
      const obj = {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          crossDomain: true,
        },
        body: JSON.stringify({
          email: this.state.userName,
        }),
      };

      fetch('/api/user/forgotpassword', obj)
        .then((res) => {
          if (res.status === 200) {
            this.setState({ SnackBarText:
              'Password is reset successfully, Please check your email' });
            this.setState({ SnackBarOpen: true });
          } else {
            document.getElementById('successmsg').innerText = res.statusText;
            this.setState({ SnackBarText: 'Something went worng' });
            this.setState({ SnackBarOpen: true });
          }
        });
    }
  };

  handleUserNameChange = (e) => {
    this.setState({ userName: e.target.value.trim() });
    if (e.target.value.trim() === '') {
      this.setState({ userNameErrorText: 'Please enter user name' });
    } else {
      this.state.userNameErrorText = '';
    }
  };

  handlePasswordChange = (e) => {
    this.setState({ password: e.target.value.trim() });
    if (e.target.value.trim() === '') {
      this.state.passwordErrorText = 'Please enter password';
    } else {
      this.state.passwordErrorText = '';
    }
  };

  handleNameChange = (e) => {
    this.setState({ name: e.target.value });
    if (e.target.value.trim() === '') {
      this.state.nameErrorText = 'Please enter name';
    } else {
      this.state.nameErrorText = '';
    }
  };

  handleOrganisationChange = (e) => {
    this.setState({ organisation: e.target.value });
    if (e.target.value.trim() === '') {
      this.state.organisationErrorText = 'Please enter organisation';
    } else {
      this.state.organisationErrorText = '';
    }
  };

  handleEmailChange = (e) => {
    this.setState({ email: e.target.value });
    if (e.target.value.trim() === '') {
      this.state.emailErrorText = 'Please enter email';
    } else {
      this.state.emailErrorText = '';
    }
  };

  handlePhoneChange = (e) => {
    this.setState({ phone: e.target.value });
    if (e.target.value.trim() === '') {
      this.state.phoneErrorText = 'Please enter phone number';
    } else {
      this.state.phoneErrorText = '';
    }
  };

  handleRequestClose = () => {
    this.setState({
      SnackBarOpen: false,
    });
  };

  render() {
    return (
      <div>
        <div className={s.subheader}>Sign In</div>
        <div className={s.container}>
          <div className={s.column}>
            <div className={s.signincard}>
              <form className={s.signinarea} onSubmit={this.loginUser}>
                <div id="loginSuccessmsg">{this.props.loginErrorMessage.toString()}</div>
                <TextField
                  id="User_Name" hintText="User Name" value={this.state.userName}
                  errorText={this.state.userNameErrorText}
                  onChange={
                    this.handleUserNameChange
                  }
                  floatingLabelText="User Name"
                /><br />
                <TextField
                  id="password" hintText="Password" value={this.state.password}
                  errorText={this.state.passwordErrorText}
                  onChange={this.handlePasswordChange}
                  floatingLabelText="Password" type="password"
                /><br /><br />
                <RaisedButton label="Submit" type="submit" primary /><br /><br />
                <FlatButton
                  label="Forgot Password?"
                  linkButton primary
                  onTouchTap={this.forgotPassword}
                />
              </form>
            </div>
          </div>
          <div className={s.column}>
            <Card className={s.contactuscard}>
              <CardHeader title="Account Creation" />
              <CardText>
                <div>Get in touch with us for an account creation</div>
                <div id="successmsg"></div>
                <TextField
                  id="Name" hintText="Name" value={this.state.name}
                  errorText={this.state.nameErrorText}
                  onChange={this.handleNameChange}
                  floatingLabelText="Name"
                /><br />
                <TextField
                  id="organisation" hintText="organisation" value={this.state.organisation}
                  errorText={this.state.organisationErrorText}
                  onChange={this.handleOrganisationChange}
                  floatingLabelText="Organisation"
                /><br />
                <TextField
                  id="email" hintText="Email" value={this.state.email}
                  errorText={this.state.emailErrorText}
                  onChange={this.handleEmailChange}
                  floatingLabelText="Email"
                /><br />
                <TextField
                  id="phone_number" hintText="Phone Number" value={this.state.phone}
                  errorText={this.state.phoneErrorText}
                  onChange={this.handlePhoneChange}
                  floatingLabelText="Phone Number"
                /><br />
                <RaisedButton
                  label="Submit" primary
                  onTouchTap={this.registerUser}
                />
              </CardText>
            </Card>
          </div>
        </div>
        <Snackbar
          style={snackbarStyle}
          open={this.state.SnackBarOpen}
          message={this.state.SnackBarText}
          autoHideDuration={4000}
          onRequestClose={this.handleRequestClose}
        />
      </div>
    );
  }
}

export default withStyles(s)(connect(state => ({
  loggedInUser: state.onemedia.loggedInUser,
  loginErrorMessage: state.onemedia.loginErrorMessage,
}), {
  login,
})(SigninPage));
