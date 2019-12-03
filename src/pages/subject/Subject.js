import React from "react";
import {
    Row,
    Col,
    Container,
    Button,
    ModalHeader,
    ModalFooter,
    Modal,
    ModalBody,
    FormGroup,
    FormFeedback,
    Input,
    Label,
    CardBody,
    CardTitle,
    CardText,
    Card,
    CardImg,
    CardSubtitle,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobeAmericas, faKey, faPlus } from "@fortawesome/free-solid-svg-icons";
import { CustomImg } from "../../components/CustomTag";
// import Notification from "../../components/Notification";
// import { LoadingSprinner } from "../../components/CustomTag";
import "./Subject.css";
import { connect } from "react-redux";
import moment from "moment";
import { Link } from "react-router-dom";
import { Camera } from "react-feather";
import ReactLoading from "react-loading";
import notifier from "simple-react-notifications";
import "simple-react-notifications/dist/index.css";

import camera from "../../assets/img/photos/camera.png";
import subject from "../../assets/img/photos/subject.png";

const api = require("./api/api");
const ValidInput = require("../../utils/ValidInput");

class Project extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            hover: null,
            showModal: {
                create_project: false,
            },
            temp: {
                name: "",
                description: "",
                file: "",
            },
            submitted: false,
            isLoaderAPI: false,
            keyWord: null,
            tempLogo: "",
        };
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleCreateSubject = this.handleCreateSubject.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.changeSearchChars = this.changeSearchChars.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);

        this.handleSelectSubject = this.handleSelectSubject.bind(this);
        this.handleImageChange = this.handleImageChange.bind(this);
    }

    handleSelectSubject(id) {
        api.getInfoSubject(id, (err, result) => {
            if (err) {
                notifier.error(err.data === undefined ? err : err.data._error_message);
            } else {
                console.log(result);

                localStorage.setItem("subject", JSON.stringify(result));
                window.location.replace("/quiz");
            }
        });
    }

    handleChange(event) {
        let temp = Object.assign({}, this.state.temp);
        temp[event.target.name] = event.target.value;
        this.setState({ temp: temp });
    }

    handleShow() {
        let state = Object.assign({}, this.state);
        state.showModal.create_project = true;
        this.setState(state);
    }

    handleClose() {
        let state = Object.assign({}, this.state);
        state.submitted = false;
        state.temp.name = "";
        state.temp.description = "";
        state.temp.file = "";
        state.showModal.create_project = false;
        state.tempLogo = "";
        this.setState(state);
    }

    handleSearch(event) {
        this.changeSearchChars(event.target.value);
    }

    changeSearchChars(chars) {
        let state = Object.assign({}, this.state);
        state.keyWord = chars.toLowerCase();
        this.setState(state);
    }

    handleKeyPress(e) {
        if (e.target.value !== "") {
            if (e.key === "Enter") {
                this.handleCreateSubject();
            }
        }
    }

    handleCreateSubject() {
        let state = Object.assign({}, this.state);
        const that = this;
        this.setState({ submitted: true });

        // stop here if form is invalid
        const { name } = this.state.temp;
        if (!name) {
            return;
        }

        api.createSubject(state.temp, (err, result) => {
            if (err) {
                this.setState({
                    loading: false,
                });
            } else {
                state.data.push(result);
                that.setState(state);
                that.handleClose();
            }
        });
    }

    componentDidMount() {
        const that = this;
        api.getListSubject((err, result) => {
            if (err) {
                notifier.error(err.data === undefined ? err : err.data._error_message);
            } else {
                that.setState({ data: result, isLoaderAPI: true });
            }
        });
    }

    handleImageChange(event) {
        let temp = Object.assign({}, this.state.temp);

        temp[event.target.name] = event.target.value;
        this.setState({
            temp: temp,
            tempLogo: event.target.value,
        });
    }

    render() {
        return !this.state.isLoaderAPI ? (
            <center>
                <ReactLoading type='bars' color='black' />
            </center>
        ) : (
            <React.Fragment>
                <Modal isOpen={this.state.showModal.create_project} className='modal-project'>
                    <ModalHeader className='modal-project__header'>Create Subject</ModalHeader>
                    <ModalBody>
                        <Row>
                            <Col>
                                <FormGroup>
                                    <Label for='name_of_project'>Subject Name</Label>
                                    <Input
                                        type='text'
                                        name='name'
                                        placeholder='subject name'
                                        value={this.state.temp.name}
                                        onChange={this.handleChange}
                                        invalid={
                                            this.state.submitted && !this.state.temp.name
                                                ? true
                                                : false
                                        }
                                        onKeyPress={this.handleKeyPress.bind(this)}
                                    />
                                    <FormFeedback invalid>
                                        Subject name is a required field!
                                    </FormFeedback>
                                </FormGroup>
                                <FormGroup>
                                    <Label for='description'>Description</Label>
                                    <Input
                                        type='textarea'
                                        rows='5'
                                        name='description'
                                        placeholder='description'
                                        value={this.state.temp.description}
                                        onChange={this.handleChange}
                                        onKeyPress={this.handleKeyPress.bind(this)}
                                    />
                                </FormGroup>
                            </Col>
                            <Col>
                                <Label>Ảnh môn học</Label>
                                <FormGroup>
                                    <Input
                                        className='boder'
                                        type='text'
                                        name='file'
                                        id='logo_subject'
                                        placeholder='Url Image'
                                        onChange={this.handleImageChange}
                                    />
                                    <Label
                                        for='logo_subject'
                                        className='hover-pointer:hover d-flex justify-content-center mt-2'
                                        style={{ cursor: "-webkit-grab", cursor: "grab" }}>
                                        <CustomImg
                                            className='img-fluid img-thumbnail'
                                            style={{ height: "200px", width: "100%" }}
                                            src={this.state.tempLogo || camera}
                                            alt='image subject'
                                            hidden={this.state.tempLogo === "" ? true : false}
                                        />
                                    </Label>
                                </FormGroup>
                            </Col>
                        </Row>
                    </ModalBody>
                    <ModalFooter>
                        <Button color='secondary' onClick={this.handleClose.bind(this)}>
                            Cancel
                        </Button>
                        <Button color='success' onClick={this.handleCreateSubject.bind(this)}>
                            Create
                        </Button>
                    </ModalFooter>
                </Modal>

                <Container fluid className='width-percent-60 w-75 '>
                    <Row>
                        <Col xs='4'>
                            <Input
                                className='width-percent-40'
                                id='inputSearch'
                                placeholder='Search subject'
                                onKeyUp={this.handleSearch.bind(this)}
                            />
                        </Col>
                        <Col>
                            <Button className='float-right' onClick={this.handleShow.bind(this)}>
                                <FontAwesomeIcon icon={faPlus} /> Create Subject
                            </Button>
                        </Col>
                    </Row>
                    <Row className='mt-3'>
                        {this.state.data.map((item, i) => {
                            return (
                                <Col md='2' sm='12' className='mr-2'>
                                    <Link
                                        to='#'
                                        replace='true'
                                        onClick={this.handleSelectSubject.bind(this, item.id)}
                                        className='hover-pointer:hover text-decoration-none overflow-hidden position-relative'>
                                        <Card
                                            onMouseOver={() => this.setState({ hover: i })}
                                            onMouseLeave={() => this.setState({ hover: null })}
                                            outline
                                            color={this.state.hover !== i ? null : "success"}
                                            className='shadow-lg bg-white rounded'
                                            style={{ "box-shadow": "10px 10px" }}>
                                            <CustomImg
                                                className='img-fluid img-thumbnail'
                                                style={{ height: "200px" }}
                                                src={item.image || subject}
                                                alt='Image Subject'
                                            />
                                            <CardBody>
                                                <CardTitle>
                                                    <h3 className='text-center font-weight-bold text-primary'>
                                                        {item.name || "Subject"}
                                                    </h3>
                                                </CardTitle>
                                                {/* <h6 className='text-center font-weight-bold text-mute'>
                                                    {"Description: " + item.description}
                                                </h6> */}
                                                <h6 className='text-center font-weight-bold text-mute'>
                                                    {"Created : " +
                                                        moment
                                                            .utc(item.createdDate)
                                                            .format("DD/MM/YYYY")}
                                                </h6>
                                            </CardBody>
                                        </Card>
                                    </Link>
                                </Col>
                            );
                        })}
                    </Row>
                </Container>
            </React.Fragment>
        );
    }
}

export default connect(store => ({
    user: store.user,
}))(Project);
