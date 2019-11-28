import React from "react";
import {
    Badge,
    Button,
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    Col,
    Row,
    FormGroup,
    FormFeedback,
    Input,
    Label,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Alert
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobeAmericas, faKey, faTags } from "@fortawesome/free-solid-svg-icons";
import "./General.css";
import Notification from "../../../components/Notification";
import { CustomImg } from "../../../components/CustomTag";
import { Camera } from "react-feather";
import { connect } from "react-redux";

const api = require("./api/generalApi");
const utils = require("../../../utils/utils");

class General extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: {
                drop: false,
                change: false,
                changeType: false
            },
            file: null,
            data: [],
            isLoaded: false,
            modal: false,
            id_project: null,
            password: null,
            passwordToModify: null,
            changeName: null,
            changeBudget: null,
            changeCurrencyUnit: null,
            changeDescription: null,
            changeIsPrivate: null,
            logo: null,
            changeLogo: null,
            tempLogo: null,
            error: "",
            form: []
        };
        this.handleChange = this.handleChange.bind(this);
        this.toggle = this.toggle.bind(this);
        this.handleImageChange = this.handleImageChange.bind(this);
        this.handleSaveChange = this.handleSaveChange.bind(this);
        this.handleChangeType = this.handleChangeType.bind(this);
        this.handleShowModal = this.handleShowModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
        this.handleAddTag = this.handleAddTag.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    handleChange(event) {
        let name = event.target.name;
        let value = event.target.value;
        this.setState({
            [name]: value,
            form: [...this.state.form, event.target.name]
        });
    }

    handleChangeType(type) {
        this.setState({
            changeIsPrivate: type === "private",
            form: [...this.state.form, type]
        });
    }

    handleAddTag(event) {
        if (event.key === "Enter") {
            let tag = document.getElementById("inputTags").value;
            if (utils.ValidInput.isEmpty(tag)) {
                Notification("warning", "Empty value", "Tag is empty value");
            } else {
                if (tag !== "") {
                    let data = Object.assign({}, this.state.data);
                    data.tags.push(tag);
                    this.setState({ data: data });
                    api.addTag(data, (err, result) => {
                        if (err) {
                            Notification("error", "Error", err.data === undefined ? err : err.data._error_message);
                        } else {
                            this.setState({ data: result });
                        }
                    });
                }
            }
        }
    }

    handleRemoveTag(index) {
        let data = Object.assign({}, this.state.data);
        data.tags.splice(index, 1);
        this.setState({ data: data });
        api.removeTag(data, (err, result) => {
            if (err) {
                Notification("error", "Error", err.data === undefined ? err : err.data._error_message);
            } else {
                this.setState({ data: result });
            }
        });
    }

    handleImageChange(event) {
        this.setState({
            changeLogo: event.target.files[0],
            tempLogo: URL.createObjectURL(event.target.files[0])
        });
    }

    handleSaveChange() {
        this.props.handleLoading(true);
        let infoProject = {};
        this.state.form.map((value, key) => {
            switch (value) {
                case "changeDescription":
                    infoProject.description = this.state.changeDescription;
                    break;
                case "changeName":
                    infoProject.name = this.state.changeName;
                    break;
                case "changeBudget":
                    infoProject.budget = this.state.changeBudget;
                    break;
                case "changeCurrencyUnit":
                    infoProject.currency = this.state.changeCurrencyUnit;
                    break;
                case "public":
                    infoProject.is_private = false;
                    break;
                case "private":
                    infoProject.is_private = true;
                    break;
                default:
                    break;
            }
            return "";
        });
        api.modifyProject(this.state.id_project, infoProject, this.state.passwordToModify, (err, result) => {
            if (err) {
                this.props.handleLoading(false);
                this.setState({ error: err.data === undefined ? err : err.data._error_message, loading: false });
            } else {
                this.setState({ form: [] });
                this.props.handleLoading(false);
                this.handleCloseModal("change");
            }
        });
        const formLogo = new FormData();
        formLogo.append("logo", this.state.changeLogo);
        if (this.state.changeLogo !== null) {
            api.changePhoto(formLogo, (err, result) => {
                if (err) {
                    this.setState({ error: err.data === undefined ? err : err.data._error_message, loading: false });
                } else {
                    this.setState({ logo: result.logo });
                    sessionStorage.setItem("project", JSON.stringify(result));
                }
            });
        }
    }

    toggle() {
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    }

    handleShowModal(modal) {
        let state = Object.assign({}, this.state);
        state.showModal[modal] = true;
        this.setState(state);
    }

    handleCloseModal(modal) {
        let state = Object.assign({}, this.state);
        state.showModal[modal] = false;
        this.setState(state);
    }

    handleKeyPress(e) {
        if (e.target.value !== "") {
            if (e.key === "Enter") {
                if (e.target.name === "passwordToModify") {
                    this.handleSaveChange();
                } else if (e.target.name === "password") {
                    this.handleDelProject();
                }
            }
        }
    }

    handleDelProject() {
        const { id_project, password } = this.state;
        api.deleteProject(id_project, password, (err, result) => {
            if (err) {
                this.setState({ error: err.data === undefined ? err : err.data._error_message, loading: false });
            } else {
                this.handleCloseModal("drop");
                sessionStorage.removeItem("project");
                window.location.replace("/project");
            }
        });
    }

    componentDidMount() {
        const that = this;
        api.getInfoProject((err, result) => {
            if (err) {
                Notification("error", "Project info", "Error when loading project information!!!");
            } else {
                const { id, name, description, is_private, logo, budget, currency } = result;
                that.setState({
                    data: result,
                    isLoaded: true,
                    id_project: id,
                    changeName: name,
                    changeDescription: description,
                    changeIsPrivate: is_private,
                    changeBudget: budget.budget,
                    changeCurrencyUnit: currency,
                    logo: logo
                });
            }
        });

        api.getInfoProjectAll((err, result) => {
            if (err) {
                Notification("error", "Error", err.data === undefined ? err : err.data._error_message);
            } else {
                that.setState({ projects: result, isLoaderAPI: true });
            }
        });
    }

    render() {
        const { error } = this.state;
        const { user } = this.props;
        const maxPrivateProject = user.user.max_private_projects;
        const maxPublicProject = user.user.max_public_projects;
        const publicProject = this.state.projects !== undefined ? this.state.projects.filter(project => !project.is_private && project.i_am_owner) : null;
        const countPublicProject = this.state.projects !== undefined ? publicProject.length : null;
        const privateProject = this.state.projects !== undefined ? this.state.projects.filter(project => project.is_private && project.i_am_owner) : null;
        const countPrivateProject = this.state.projects !== undefined ? privateProject.length : null;
        return !this.state.isLoaded ? null : (
            <Card className="admin__general__card">
                <CardHeader>
                    <CardTitle tag="h5" className="mb-0">
                        Project detail
                    </CardTitle>
                </CardHeader>
                <CardBody>
                    <Row>
                        <Col md="8">
                            <FormGroup>
                                <Label for="inputProjectName">Project name</Label>
                                <Input
                                    type="text"
                                    name="changeName"
                                    placeholder="Project name"
                                    autoComplete="off"
                                    defaultValue={this.state.data.name}
                                    onChange={this.handleChange}
                                    invalid={!this.state.changeName ? true : false}
                                />
                                <FormFeedback invalid>Name project is a required field!</FormFeedback>
                            </FormGroup>
                            <FormGroup className="mb-0">
                                <Row>
                                    <Col xl="9">
                                        <FormGroup>
                                            <Label>Budget</Label>
                                            <Input
                                                type="text"
                                                name="changeBudget"
                                                placeholder="Budget"
                                                defaultValue={this.state.data.budget.budget}
                                                onChange={this.handleChange}
                                                onKeyDown={event => {
                                                    if (
                                                        ![
                                                            "0",
                                                            "1",
                                                            "2",
                                                            "3",
                                                            "4",
                                                            "5",
                                                            "6",
                                                            "7",
                                                            "8",
                                                            "9",
                                                            "Enter",
                                                            "Delete",
                                                            "Backspace",
                                                            "ArrowLeft",
                                                            "ArrowRight"
                                                        ].includes(event.key)
                                                    ) {
                                                        event.preventDefault();
                                                    }
                                                }}
                                                invalid={
                                                    !this.state.changeBudget ||
                                                    (this.state.changeCurrencyUnit === "VND"
                                                        ? this.state.changeBudget % 10000 !== 0
                                                        : this.state.changeBudget % 1000 !== 0)
                                                        ? true
                                                        : false
                                                }
                                            />
                                            <FormFeedback invalid>
                                                Budget is a required field and divisible by 1000 with $ unit, 10000 with VND unit
                                            </FormFeedback>
                                        </FormGroup>
                                    </Col>
                                    <Col xl="3">
                                        <FormGroup>
                                            <Label>Currency unit</Label>
                                            <Input type="select" defaultValue={this.state.data.currency} onChange={this.handleChange} name="changeCurrencyUnit">
                                                <option value="VND">VND</option>
                                                <option value="$">$</option>
                                            </Input>
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </FormGroup>
                            <FormGroup>
                                <Label>Description</Label>
                                <Input
                                    type="textarea"
                                    rows="2"
                                    name="changeDescription"
                                    placeholder="Something about project"
                                    autoComplete="off"
                                    defaultValue={this.state.data.description}
                                    onChange={this.handleChange}
                                    invalid={!this.state.changeDescription ? true : false}
                                />
                                <FormFeedback invalid>Description is a required field!</FormFeedback>
                            </FormGroup>
                            <FormGroup>
                                <Label for="inputTags">
                                    <FontAwesomeIcon icon={faTags} size="xs" />
                                    {this.state.data.tags.map((tag, index) => {
                                        return (
                                            <Badge key={index} className="badge-pill ml-1 mr-1 " color="info">
                                                <label className="mb-0">{tag}</label>
                                                &nbsp;
                                                <label className="mb-0 cursor-pointer" id={index} onClick={() => this.handleRemoveTag(index)}>
                                                    X
                                                </label>
                                            </Badge>
                                        );
                                    })}
                                </Label>
                                <Input type="text" id="inputTags" placeholder="Enter tag" autoComplete="off" onKeyPress={this.handleAddTag} />
                            </FormGroup>
                            <FormGroup>
                                <Row className="mt-4">
                                    <Col className="col-6">
                                        <Button
                                            type="button"
                                            id="inputPublic"
                                            onClick={
                                                maxPublicProject > countPublicProject
                                                    ? this.handleChangeType.bind(this, "public")
                                                    : this.handleShowModal.bind(this, "changeType")
                                            }
                                            color="primary"
                                            outline
                                            active={!this.state.changeIsPrivate}
                                        >
                                            <FontAwesomeIcon icon={faGlobeAmericas} /> Public
                                        </Button>
                                    </Col>
                                    <Col className="col-6">
                                        <Button
                                            type="button"
                                            id="inputPrivate"
                                            onClick={
                                                maxPrivateProject > countPrivateProject
                                                    ? this.handleChangeType.bind(this, "private")
                                                    : this.handleShowModal.bind(this, "changeType")
                                            }
                                            color="warning"
                                            outline
                                            active={this.state.changeIsPrivate}
                                        >
                                            <FontAwesomeIcon icon={faKey} /> Private
                                        </Button>
                                    </Col>
                                </Row>
                            </FormGroup>
                        </Col>
                        <Col md="4" className="mt-5">
                            <div className="admin__general__containerImgUpdate">
                                <CustomImg
                                    alt="Avatar project"
                                    src={this.state.tempLogo || this.state.logo}
                                    className="rounded-circle img-responsive mt-2 admin__imgUpdate"
                                    width="128"
                                    height="128"
                                />
                                <Label className="admin__general__iconUpdateAvt" for="logoChange">
                                    <Input type="file" id="logoChange" hidden onChange={this.handleImageChange} />
                                    <Camera size="50%" className="admin__general__iconUpdateEffect" />
                                    <div className="admin__general__iconUpdateEffect">Update</div>
                                </Label>
                            </div>
                            <div className="text-center pt-3">
                                <small>For best results, use an image at least 128px by 128px in .jpg format</small>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col md="8">
                            <Button type="button" color="primary" onClick={this.handleShowModal.bind(this, "change")}>
                                Save changes
                            </Button>
                            {/* Modal change type of project */}
                            <Modal isOpen={this.state.showModal.changeType}>
                                <ModalHeader>Notification</ModalHeader>
                                <ModalBody>Exceed the number of projects. Please upgrade your account!</ModalBody>
                                <ModalFooter>
                                    <Button color="success" onClick={this.handleCloseModal.bind(this, "changeType")}>
                                        OK
                                    </Button>
                                </ModalFooter>
                            </Modal>
                            {/* Modal confirm to save change */}
                            <Modal isOpen={this.state.showModal.change}>
                                {error && (
                                    <Alert color="danger" className="p-2">
                                        Wrong password
                                    </Alert>
                                )}
                                <ModalHeader>Confirm</ModalHeader>
                                <ModalBody>
                                    <FormGroup>
                                        <Label>Please enter your password to change project details</Label>
                                        <Input
                                            type="password"
                                            placeholder="Password"
                                            autoComplete="nope"
                                            name="passwordToModify"
                                            value={this.state.passwordToModify}
                                            onChange={this.handleChange}
                                            onKeyPress={this.handleKeyPress.bind(this)}
                                        />
                                    </FormGroup>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="secondary" onClick={this.handleCloseModal.bind(this, "change")}>
                                        Cancel
                                    </Button>
                                    <Button color="success" onClick={this.handleSaveChange.bind(this)}>
                                        OK
                                    </Button>
                                </ModalFooter>
                            </Modal>
                        </Col>
                        <Col md="4">
                            <Button type="button" color="danger" onClick={this.handleShowModal.bind(this, "drop")}>
                                Delete project
                            </Button>
                            <Modal isOpen={this.state.showModal.drop}>
                                {error && (
                                    <Alert color="danger" className="p-2">
                                        Wrong password
                                    </Alert>
                                )}
                                <ModalHeader>Confirm</ModalHeader>
                                <ModalBody>
                                    <FormGroup>
                                        <Label>Please enter your password to delete project</Label>
                                        <Input
                                            type="password"
                                            placeholder="Password"
                                            autoComplete="nope"
                                            name="password"
                                            value={this.state.password}
                                            onChange={this.handleChange}
                                            onKeyPress={this.handleKeyPress.bind(this)}
                                        />
                                    </FormGroup>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="secondary" onClick={this.handleCloseModal.bind(this, "drop")}>
                                        Cancel
                                    </Button>
                                    <Button color="success" onClick={this.handleDelProject.bind(this)}>
                                        OK
                                    </Button>
                                </ModalFooter>
                            </Modal>
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        );
    }
}

export default connect(store => ({
    user: store.user
}))(General);
