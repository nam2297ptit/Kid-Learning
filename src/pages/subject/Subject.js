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
import TableProject from "./TableProject";
import { CustomImg } from "../../components/CustomTag";
// import Notification from "../../components/Notification";
// import { LoadingSprinner } from "../../components/CustomTag";
//import "./Subject.css";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Camera } from "react-feather";

const api = require("./api/api");
const ValidInput = require("../../utils/ValidInput");

class Project extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [1, 2, 3, 4, 5],
            hover: null,
            showModal: {
                create_project: false,
            },
            temp: {
                name: "",
                description: "",
                is_private: true,
                budget: "",
                currency: "VND",
            },
            submitted: false,
            isLoaderAPI: false,
            keyWord: null,
        };
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleCreateProject = this.handleCreateProject.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.changeSearchChars = this.changeSearchChars.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);

        this.handleSelectProject = this.handleSelectProject.bind(this);
        this.handleImageChange = this.handleImageChange.bind(this);
    }

    handleSelectProject() {
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
    handleChangeType(type) {
        let tmp = Object.assign({}, this.state.temp);
        tmp.is_private = type === "private";
        this.setState({ temp: tmp });
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
        state.is_private = false;
        state.temp.budget = "";
        state.temp.currency = "";
        state.showModal.create_project = false;
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
                this.handleCreateProject();
            }
        }
    }

    handleCreateProject() {
        let state = Object.assign({}, this.state);
        const that = this;
        this.setState({ submitted: true });

        // stop here if form is invalid
        const { name, description, budget } = this.state.temp;
        if (!(name && description && budget && budget % 1000 === 0)) {
            return;
        }
        api.createProject(state.temp, (err, result) => {
            if (err) {
                this.setState({
                    error: err.data === undefined ? err : err.data._error_message,
                    loading: false,
                });
            } else {
                state.data.push(result);
                that.setState(state);
                that.handleClose();
                Notification("success", "Create project", "Created project is successfully!!!");
            }
        });
    }

    componentDidMount() {
        const that = this;
        // api.getInfoProjectAll((err, result) => {
        //     if (err) {
        //         Notification(
        //             "error",
        //             "Error",
        //             err.data === undefined ? err : err.data._error_message,
        //         );
        //     } else {
        //         that.setState({ data: result, isLoaderAPI: true });
        //     }
        // });
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state === nextState) {
            return false;
        }
        return true;
    }

    handleImageChange(event) {
        this.setState({
            changeLogo: event.target.files[0],
            tempLogo: URL.createObjectURL(event.target.files[0]),
        });
    }

    render() {
        const { user } = this.props;
        const maxPrivateProject = user.user.max_private_projects;
        const maxPublicProject = user.user.max_public_projects;
        const publicProject = this.state.data.filter(
            project => !project.is_private && project.i_am_owner,
        );
        const countPublicProject = publicProject.length;
        const privateProject = this.state.data.filter(
            project => project.is_private && project.i_am_owner,
        );
        const countPrivateProject = privateProject.length;
        return (
            <React.Fragment>
                <Modal isOpen={this.state.showModal.create_project} className='modal-project'>
                    <ModalHeader className='modal-project__header'>Tạo môn học</ModalHeader>
                    <ModalBody>
                        <Row>
                            <Col>
                                <FormGroup>
                                    <Label for='name_of_project'>Tên môn học</Label>
                                    <Input
                                        type='text'
                                        name='name'
                                        placeholder='Điền tên môn học vào đây'
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
                                        Name project is a required field!
                                    </FormFeedback>
                                </FormGroup>
                                <FormGroup>
                                    <Label for='description'>Description</Label>
                                    <Input
                                        type='textarea'
                                        rows='5'
                                        name='description'
                                        placeholder='Description'
                                        value={this.state.temp.description}
                                        onChange={this.handleChange}
                                        invalid={
                                            this.state.submitted && !this.state.temp.description
                                                ? true
                                                : false
                                        }
                                        onKeyPress={this.handleKeyPress.bind(this)}
                                    />
                                    <FormFeedback invalid>
                                        Description is a required field!
                                    </FormFeedback>
                                </FormGroup>
                            </Col>
                            <Col>
                                <Label>Ảnh môn học</Label>
                                <FormGroup>
                                    <Label
                                        for='logo_subject'
                                        className='hover-pointer:hover d-flex justify-content-center my-auto'>
                                        <Input
                                            className='boder'
                                            type='file'
                                            name='file'
                                            id='logo_subject'
                                            hidden
                                            onChange={this.handleImageChange}
                                        />
                                        <img
                                            alt='Avatar project'
                                            src={this.state.tempLogo || this.state.logo}
                                            className='img-thumbnail'
                                            style={{ height: "200px", width: "100%" }}
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
                        <Button color='success' onClick={this.handleCreateProject.bind(this)}>
                            Create
                        </Button>
                    </ModalFooter>
                </Modal>

                <Container fluid className='width-percent-80 w-75'>
                    <Row>
                        <Col xs='2'>
                            <Input
                                className='width-percent-40'
                                id='inputSearch'
                                placeholder='Tìm kiếm tên môn học'
                                onKeyUp={this.handleSearch.bind(this)}
                            />
                        </Col>
                        <Col>
                            <Button
                                className='float-right'
                                disabled={
                                    countPublicProject >= maxPublicProject &&
                                    countPrivateProject >= maxPrivateProject
                                        ? true
                                        : false
                                }
                                onClick={this.handleShow.bind(this)}>
                                <FontAwesomeIcon icon={faPlus} /> Tạo môn học
                            </Button>
                        </Col>
                    </Row>
                    <Row className='mt-3'>
                        {this.state.data.map((item, i) => {
                            return (
                                <Col sm='3'>
                                    <Link
                                        to='#'
                                        onClick={this.handleSelectProject.bind(this)}
                                        className='hover-pointer:hover text-decoration-none overflow-hidden position-relative'>
                                        <Card
                                            onMouseOver={() => this.setState({ hover: i })}
                                            onMouseLeave={() => this.setState({ hover: null })}>
                                            <CustomImg
                                                className='img-thumbnail img-fluid'
                                                style={{ height: "200px" }}
                                                src='https://cdnstepup.r.worldssl.net/wp-content/uploads/2019/03/learn-english1-vicook-6e068f469abc86e7b50da7d64c57c3d1-min.jpg'
                                                alt='Card image cap'
                                            />
                                            {this.state.hover !== i ? null : (
                                                <CardBody>
                                                    <CardTitle>
                                                        <h3 className='text-center font-weight-bold'>
                                                            Tiếng anh lớp 6
                                                        </h3>
                                                    </CardTitle>
                                                </CardBody>
                                            )}
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
