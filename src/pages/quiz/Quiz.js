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
    CardBody,
    CardTitle,
    Badge,
    UncontrolledTooltip,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownItem,
    DropdownMenu,
} from "reactstrap";
import { MoreHorizontal, Save } from "react-feather";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import avatar from "../../assets/img/avatars/avatar-2.jpg";
import { CustomImg } from "../../components/CustomTag";
import moment from "moment";
import Data from "./Data.json";
import { Link } from "react-router-dom";
const ValidInput = require("../../utils/utils");

class TableQuiz extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hover: false,
            data: this.props.data,
            isEdit: false,
        };
        this.handleSelectQuiz = this.handleSelectQuiz.bind(this);
    }

    handleChange(event) {
        let temp = Object.assign({}, this.state.data);
        temp[event.target.name] = event.target.value;
        this.setState({ data: temp });
    }

    saveQuiz() {
        this.setState({ isEdit: false });
    }

    handleEdit(event) {
        let temp = Object.assign({}, this.state.data);
        temp.name = event.target.value;
        console.log("subject:", temp.name);
        //this.setState({ data: temp });
    }

    handleSelectQuiz() {
        console.log("ssss");

        // api.getInfoProject(this.state.data.id, (err, result) => {
        //     if (err) {
        //         Notification(
        //             "error",
        //             "Error",
        //             err.data === undefined ? err : err.data._error_message,
        //         );
        //     } else {
        //         const { id, i_am_owner, i_am_admin, i_am_member } = result;
        //         let project = {
        //             id: id,
        //             i_am_owner: i_am_owner,
        //             i_am_admin: i_am_admin,
        //             i_am_member: i_am_member,
        //         };
        //         sessionStorage.setItem("project", JSON.stringify(project));
        //         window.location.replace("/project/work");
        //     }
        // });
    }
    componentDidMount() {}

    render() {
        return (
            <React.Fragment>
                <Modal isOpen={this.state.isEdit}>
                    <ModalHeader className='d-flex justify-content-center'>Edit Quiz</ModalHeader>
                    <ModalBody>
                        <Label> Name Quiz </Label>
                        <Input
                            name='subject'
                            onChange={this.handleEdit.bind(this)}
                            type='text'
                            value={this.state.data.name}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button color='secondary' onClick={() => this.setState({ isEdit: false })}>
                            Cancel
                        </Button>
                        <Button color='success' onClick={this.saveQuiz.bind(this)}>
                            Save
                        </Button>
                    </ModalFooter>
                </Modal>

                <Container fluid className='table-project mt-1 pr-0'>
                    <Card
                        className='d-flex flex-row quiz__card__header'
                        style={
                            this.state.hover === this.props.index
                                ? { "background-color": "#b3d1ff" }
                                : null
                        }
                        onMouseOver={() => this.setState({ hover: this.props.index })}
                        onMouseLeave={() => this.setState({ hover: null })}>
                        {/* <CustomImg
                            className='img--user--square-3x img-fluid ml-3  mt-4 mr-4 rounded-circle'
                            src={avatar}
                            alt='avt'
                        /> */}
                        <div
                            className='rounded-circle bg-primary mt-4 mb-3 ml-3 mr-3'
                            style={{ height: "50px", width: "50px" }}>
                            <h1 className='ml-3 mt-2 text-white'>1</h1>
                        </div>
                        <CardTitle className=' full-width mb-0 font-size-3x font-weight-bold text-color-black mt-0 border-bottom-0 '>
                            <Row>
                                <Col xs='11'>
                                    <Link
                                        to='/activity'
                                        onClick={this.handleSelectQuiz.bind(this)}
                                        className='hover-pointer:hover text-decoration-none overflow-hidden position-relative'>
                                        <div className='d-flex justify-content-between mt-2'>
                                            <div>{this.state.data.name}</div>
                                        </div>
                                        <h6 className='text-muted mt-2'>
                                            Created date: {this.state.data.creat_date}
                                        </h6>
                                        <h6 className='text-muted'>
                                            Total questions: {this.state.data.total_question}
                                        </h6>
                                    </Link>
                                </Col>
                                <Col xs='1'>
                                    <UncontrolledDropdown className='float-right mr-2'>
                                        <DropdownToggle tag='a'>
                                            <MoreHorizontal />
                                        </DropdownToggle>
                                        <DropdownMenu right c>
                                            <DropdownItem
                                                onClick={event => this.setState({ isEdit: true })}>
                                                {"   "}
                                                <FontAwesomeIcon icon={faEdit} /> Edit Quiz
                                            </DropdownItem>
                                            <DropdownItem>
                                                <FontAwesomeIcon
                                                    icon={faTrash}
                                                    className='text-danger'
                                                />
                                                {"   "}
                                                Delete Quiz
                                            </DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledDropdown>
                                </Col>
                            </Row>
                        </CardTitle>
                    </Card>
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
            keyWord: null,
        };
    }

    componentDidMount() {
        this.setState({
            data: Data,
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
        console.log("event:", event.target.name);
        let temp = Object.assign({}, this.state.data);
        temp.tag = event.target.value;
        console.log("tag:", temp.tag);
        //this.setState({ data: temp });
    }

    handleChangeSubject(event) {
        let temp = Object.assign({}, this.state.data);
        temp.name = event.target.value;
        console.log("subject:", temp.name);
        //this.setState({ data: temp });
    }

    saveQuiz() {
        this.setState({
            isClose: false,
        });
    }

    render() {
        return (
            <React.Fragment>
                <Modal isOpen={this.state.isClose}>
                    <ModalHeader className='d-flex justify-content-center'>Create Quiz</ModalHeader>
                    <ModalBody>
                        <Label> Subject </Label>
                        <Input
                            name='subject'
                            onChange={this.handleChangeSubject.bind(this)}
                            type='text'
                        />
                        <Label className='mt-1'>Tags</Label>
                        <Input
                            name='tag'
                            type='select'
                            id={"tasks-input-status-new"}
                            onChange={this.handleChange.bind(this)}>
                            <option>project1</option>
                            <option>project2</option>
                            <option>project3</option>
                        </Input>
                    </ModalBody>
                    <ModalFooter>
                        <Button color='secondary' onClick={() => this.setState({ isClose: false })}>
                            Cancel
                        </Button>
                        <Button color='success' onClick={this.saveQuiz.bind(this)}>
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
                                placeholder='Search Project'
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
