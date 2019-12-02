import React from "react";
import { Link, NavLink } from "react-router-dom";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
// import { CustomImg, LoadingSprinner } from "../../components/CustomTag";
import ReactLoading from "react-loading";
import avata from "../../assets/img/logo/login.png";
import logo from "../../assets/img/logo/Manager.png";
import utils from "../../utils/utils";
import "./SignIn.css";
import { CustomImg } from "../../components/CustomTag";

import {
    Button,
    Card,
    CardBody,
    Form,
    FormGroup,
    FormFeedback,
    Input,
    Alert,
    Container,
} from "reactstrap";
const api = require("./api/api");
class SignIn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            submitted: false,
            loading: false,
            error: "",
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value,
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        this.setState({ submitted: true });
        const { email, password } = this.state;

        // stop here if form is invalid
        if (!(email && password)) {
            return;
        }

        this.setState({ loading: true });
        setTimeout(() => {
            api.login(email, password, (err, result) => {
                if (err) {
                    this.setState({
                        error: err.data === undefined ? err : err.data._error_message,
                        loading: false,
                    });
                } else {
                    if (result.authToken !== undefined) {
                        localStorage.setItem("token", result.authToken);
                        window.location.replace("/");
                    }
                }
            });
        }, 500);
    }

    render() {
        const { email, password, submitted, loading, error } = this.state;
        return (
            <React.Fragment>
                <Container className='width-percent-80 SignIn-card'>
                    {error && (
                        <Alert color='danger' className='p-2 SignIn-alert'>
                            {error}
                        </Alert>
                    )}
                    <Container className='px-0'>
                        <Card className='SignIn-form'>
                            <CardBody className='pt-0 pb-0'>
                                <div>
                                    <div className='text-center mb-4'>
                                        <CustomImg
                                            key={utils.randomString()}
                                            src={logo}
                                            alt='cup'
                                            className='img--user--square-11x'
                                        />
                                    </div>
                                    <h1 className='text-center font-weight-bold pb-3 m-auto'>
                                        Sign In
                                    </h1>
                                    <Form onSubmit={this.handleSubmit}>
                                        <FormGroup>
                                            <Input
                                                bsSize='mb-3'
                                                type='text'
                                                name='email'
                                                value={this.state.email}
                                                onChange={this.handleChange}
                                                placeholder='Username'
                                                invalid={submitted && !email ? true : false}
                                            />
                                            <FormFeedback invalid>
                                                Email is a required field!
                                            </FormFeedback>
                                        </FormGroup>
                                        <FormGroup>
                                            <Input
                                                bsSize='mb-3'
                                                type='password'
                                                name='password'
                                                value={this.state.password}
                                                onChange={this.handleChange}
                                                placeholder='Password'
                                                invalid={submitted && !password ? true : false}
                                            />
                                            <FormFeedback invalid>
                                                Passwords is a required field!
                                            </FormFeedback>
                                        </FormGroup>
                                        <div className='text-center mt-3'>
                                            {loading === false ? (
                                                <Button
                                                    color='primary'
                                                    font-weight='200'
                                                    size='mb-3'
                                                    className='btn btn-block text-capitalize'>
                                                    {"Đăng nhập"}
                                                </Button>
                                            ) : (
                                                <div className='d-flex justify-content-center'>
                                                    <ReactLoading type='bars' color='black' />
                                                </div>
                                            )}
                                        </div>
                                    </Form>
                                </div>
                            </CardBody>
                        </Card>
                    </Container>
                </Container>
            </React.Fragment>
        );
    }
}

export default withRouter(connect()(SignIn));
