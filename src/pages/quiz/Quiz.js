import React, { Component } from "react";
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Label,
    Input,
    Container,
    Row,
    Col,
    Card,
    CardTitle,
    FormGroup,
    FormFeedback,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import ReactLoading from "react-loading";
import { Link } from "react-router-dom";
import notifier from "simple-react-notifications";

const ValidInput = require("../../utils/utils");
const api = require("./api/api");

class TableQuiz extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hover: false,
            data: this.props.data,
            // isEdit: false,
        };
        this.handleSelectQuiz = this.handleSelectQuiz.bind(this);
    }

    handleChange(event) {
        let temp = Object.assign({}, this.state.data);
        temp[event.target.name] = event.target.value;
        this.setState({ data: temp });
    }

    // saveQuiz() {
    //     this.setState({ isEdit: false });
    // }

    // handleEdit(event) {
    //     let temp = Object.assign({}, this.state.data);
    //     temp.name = event.target.value;
    //     console.log("subject:", temp.name);
    //     //this.setState({ data: temp });
    // }

    handleSelectQuiz(id) {
        localStorage.setItem("quiz", id);
        window.location.replace("/activity");
    }

    render() {
        return (
            <React.Fragment>
                <Container fluid className='table-project mt-1 pr-0'>
                    <Link
                        to='#'
                        replace='true'
                        onClick={this.handleSelectQuiz.bind(this, this.state.data.id)}
                        className='hover-pointer:hover text-decoration-none overflow-hidden position-relative'>
                        <Card
                            className='d-flex flex-row quiz__card__header'
                            style={
                                this.state.hover === this.props.index
                                    ? { "background-color": "#b3d1ff" }
                                    : null
                            }
                            onMouseOver={() => this.setState({ hover: this.props.index })}
                            onMouseLeave={() => this.setState({ hover: null })}>
                            <div
                                className='rounded-circle bg-primary mt-4 mb-3 ml-3 mr-3'
                                style={{ height: "50px", width: "50px" }}>
                                <h1 className='ml-3 mt-2 text-white'>{this.props.index + 1}</h1>
                            </div>
                            <CardTitle className=' full-width mb-0 font-size-3x font-weight-bold text-color-black mt-0 border-bottom-0 '>
                                <Row>
                                    <Col xs='11'>
                                        <div className='d-flex justify-content-between mt-2'>
                                            <div>{this.state.data.name}</div>
                                        </div>
                                        <h6 className='text-muted mt-2'>
                                            Created date:{" "}
                                            {moment
                                                .utc(this.state.data.createdDate)
                                                .format("DD/MM/YYYY")}
                                        </h6>
                                        <h6 className='text-muted'>
                                            Total questions: {this.state.data.questionNumber}
                                        </h6>
                                    </Col>
                                </Row>
                            </CardTitle>
                        </Card>
                    </Link>
                </Container>
            </React.Fragment>
        );
    }
}

class Quiz extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isClose: false,
            data: [],
            temp: {
                name: "",
                time: "",
            },
            keyWord: null,
            isLoaderAP: false,
        };
    }

    componentDidMount() {
        const that = this;
        let id = JSON.parse(localStorage.getItem("subject")).id;
        api.getListQuiz(id, (err, result) => {
            if (err) {
                notifier.error(err.data === undefined ? err : err.data._error_message);
            } else {
                that.setState({ data: result, isLoaderAPI: true });
            }
        });
    }

    handleSearch(event) {
        this.changeSearchChars(event.target.value);
    }

    changeSearchChars(chars) {
        let state = Object.assign({}, this.state);
        state.keyWord = chars.toLowerCase();
        this.setState(state);
    }

    handleChange(event) {
        let temp = Object.assign({}, this.state.temp);
        temp[event.target.name] = event.target.value;
        this.setState({ temp: temp });
    }
    handleClose() {
        let state = Object.assign({}, this.state);
        state.submitted = false;
        state.temp.name = "";
        state.temp.time = "";
        state.showModal.create_project = false;
        this.setState(state);
    }
    createQuiz() {
        const that = this;
        let state = Object.assign({}, this.state);
        this.setState({ submitted: true });
        const { name } = this.state.temp;
        if (!name) {
            return;
        }
        api.createQuiz(state.temp, (err, result) => {
            if (err) {
                this.setState({
                    loading: false,
                });
                that.setState({ isClose: false });
            } else {
                state.data.push(result);
                that.setState(state);
                that.setState({ isClose: false });
            }
        });
    }

    render() {
        return !this.state.isLoaderAPI ? (
            <center>
                <ReactLoading type='bars' color='black' />
            </center>
        ) : (
            <React.Fragment>
                <Modal isOpen={this.state.isClose}>
                    <ModalHeader className='d-flex justify-content-center'>Create Quiz</ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <Label for='name_of_project'>Quiz Name</Label>
                            <Input
                                name='name'
                                onChange={this.handleChange.bind(this)}
                                type='text'
                                placeholder='Name Quiz'
                                invalid={
                                    this.state.submitted && !this.state.temp.name ? true : false
                                }
                            />
                            <FormFeedback invalid>Quiz name is a required field!</FormFeedback>
                        </FormGroup>
                        <FormGroup>
                            <Label for='name_of_project'>Test Time</Label>
                            <Input
                                name='time'
                                type='number'
                                id={"tasks-input-status-new"}
                                onChange={this.handleChange.bind(this)}
                                placeholder='Minute'
                                invalid={
                                    this.state.submitted && !this.state.temp.time ? true : false
                                }
                            />
                            <FormFeedback invalid>Time is a required field!</FormFeedback>
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color='secondary' onClick={() => this.setState({ isClose: false })}>
                            Cancel
                        </Button>
                        <Button color='success' onClick={this.createQuiz.bind(this)}>
                            Save
                        </Button>
                    </ModalFooter>
                </Modal>

                <Container fluid className='width-percent-90'>
                    <Row className='mb-3'>
                        <Col>
                            <Input
                                className='width-percent-40'
                                id='inputSearch'
                                placeholder='Search Quiz'
                                onKeyUp={this.handleSearch.bind(this)}
                            />
                        </Col>
                        <Col className='pr-0'>
                            <Button
                                className='float-right'
                                onClick={() => this.setState({ isClose: true })}>
                                <FontAwesomeIcon icon={faPlus} /> New Quiz
                            </Button>
                        </Col>
                    </Row>
                    <Row>
                        {this.state.data.map((value, index) => {
                            if (ValidInput.isEmpty(this.state.keyWord)) {
                                return (
                                    <TableQuiz key={index} index={index} data={value}></TableQuiz>
                                );
                            } else {
                                if (value.name.toLowerCase().indexOf(this.state.keyWord) !== -1) {
                                    return (
                                        <TableQuiz
                                            key={index}
                                            index={index}
                                            data={value}></TableQuiz>
                                    );
                                }
                            }
                            return "";
                        })}
                    </Row>
                </Container>
            </React.Fragment>
        );
    }
}

export default Quiz;
