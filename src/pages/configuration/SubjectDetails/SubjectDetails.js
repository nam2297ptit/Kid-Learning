import React, { Component } from "react";
import Notification from "../../../components/Notification";
import LoadingSprinner from "../../../components/LoadingSprinner";
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    CardFooter,
    Form,
    FormGroup,
    Label,
    Input,
    Modal,
    ModalBody,
    ModalFooter,
    FormFeedback,
    CustomInput,
    Col,
} from "reactstrap";
import { Phone, User, Camera, Book, Clock } from "react-feather";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faLeaf } from "@fortawesome/free-solid-svg-icons";
import notifier from "simple-react-notifications";
import { CustomImg } from "../../../components/CustomTag";
import { connect } from "react-redux";
import "../Configuration.css";
import moment from "moment";
import ReactLoading from "react-loading";

const api = require("../api/api");
const utils = require("../../../utils/utils");
const data_subject = {};
class ProfDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isDelete: false,
            isEdit: false,
            data: {},
        };
        this.updateUser = this.updateUser.bind(this);
        this.toggle = this.toggle.bind(this);
        this.handleChangeAvatar = this.handleChangeAvatar.bind(this);
        this.handleChangeValue = this.handleChangeValue.bind(this);
    }

    updateUser(event) {
        event.preventDefault();
        this.setState({ submitted: true });
        const formPhoto = new FormData();
        formPhoto.append("avatar", this.state.fileUpdateAvt);
        const { dispatch, user } = this.props;
        let {
            changeFullname,
            changeBio,
            changeGender,
            changePhone_number,
            changeAddress,
            data,
            checkChangePass,
            new_pass,
            old_pass,
            confirm_new_pass,
        } = this.state;

        if (!changeFullname) return; //fullname is required
        if (checkChangePass) {
            //password must contain at least 8 or more characters
            if (!/(?=^.{8,}$).*$/i.test(new_pass) || new_pass !== confirm_new_pass) {
                return;
            }
        }
        if (
            changeFullname !== data.full_name ||
            changeBio !== data.bio ||
            changeGender !== data.gender ||
            changePhone_number !== data.phone_number ||
            changeAddress !== data.address
        ) {
            api.updateUserInfo(
                user.user.id,
                {
                    full_name: changeFullname,
                    bio: changeBio,
                    gender: changeGender,
                    phone_number: changePhone_number,
                    address: changeAddress,
                },
                (err, result) => {
                    if (err) {
                        Notification(
                            "error",
                            "Error",
                            err.data === undefined
                                ? err
                                : err.status + " " + err.data._error_message,
                        );
                    } else {
                        dispatch({ type: "LOGIN_USER", user: result }); //save new info user in the redux
                        this.setState(prevState => ({
                            data: {
                                ...prevState.data,
                                full_name: result.full_name,
                                gender: result.gender,
                                phone_number: result.phone_number,
                                address: result.address,
                                bio: result.bio,
                            },
                        }));
                        Notification("success", "Update user info successfully", "");
                    }
                },
            );
        }
        if (checkChangePass) {
            api.changePassword(
                { current_password: old_pass, password: new_pass },
                (err, result) => {
                    if (err) {
                        Notification(
                            "error",
                            "Error",
                            err.data === undefined
                                ? err
                                : err.status + " " + err.data._error_message,
                        );
                    } else {
                        Notification("success", "Change password successfully", "");
                    }
                },
            );
        }
        if (this.state.fileUpdateAvt !== null) {
            this.setState({ isLoadedImg: false }); //wait api update avatar
            api.updateAvatar(formPhoto, (err, result) => {
                if (err) {
                    this.setState({ isLoadedImg: true }); //when api update avatar done
                    Notification(
                        "error",
                        "Error",
                        err.data === undefined ? err : err.data._error_message,
                    );
                } else {
                    dispatch({ type: "LOGIN_USER", user: result }); //save new info user in the redux
                    this.setState({ isLoadedImg: true }); //when api update avatar done
                    this.setState(prevState => ({
                        data: {
                            ...prevState.data,
                            photo: result.photo,
                        },
                    }));
                    Notification("success", "Update avatar successfully", "");
                }
            });
        }
        this.setState(prevState => ({
            modal: !prevState.modal,
        }));
    }

    checkChangePass(event) {
        this.setState({
            [event.target.name]: event.target.checked,
        });
    }

    handleChangeAvatar(event) {
        this.setState({
            fileUpdateAvt: event.target.files[0],
            tempAvt: URL.createObjectURL(event.target.files[0]),
        });
    }

    handleChangeValue(event) {
        let value = event.target.value;
        if (value === "") value = null;
        this.setState({
            [event.target.name]: value,
        });
    }

    toggle() {
        //If click "Cancle" update, all of input field return to origin
        this.setState(prevState => ({
            changeFullname: this.state.data.full_name,
            changeGender: this.state.data.gender,
            changePhone_number: this.state.data.phone_number,
            changeAddress: this.state.data.address,
            changeBio: this.state.data.bio,
            modal: !prevState.modal,
            tempAvt: null,
            fileUpdateAvt: null,
            submitted: false,
            checkChangePass: false,
            new_pass: null,
            confirm_new_pass: null,
        }));
    }

    deleteSubject() {
        this.setState({ isDelete: false });
        api.deleteSubject(this.state.data, (err, result) => {
            if (err) {
                notifier.error(err.data === undefined ? err : err.data._error_message);
            } else {
                window.location.replace("/subject");
            }
        });
    }

    saveEditSubject() {
        let temp = Object.assign({}, this.state);
        let id = utils.getInfoSubject().id;
        api.editSubject(id, data_subject, (err, result) => {
            if (err) {
                notifier.error(err.data === undefined ? err : err.data._error_message);
            } else {
                temp.data = result;
                temp.isEdit = false;
                this.setState(temp);
            }
        });
    }

    handleChangeSubject(event) {
        data_subject.name = event.target.value;
    }

    handleChangeImg(event) {
        data_subject.image = event.target.value;
    }

    cancelEditSubject() {
        let temp = Object.assign({}, this.state.data);
        data_subject.name = temp.name;
        data_subject.image = temp.image;
        this.setState({ isEdit: false });
    }
    componentDidMount() {
        const that = this;
        let id = JSON.parse(localStorage.getItem("subject")).id;
        api.getInfoSubject(id, (err, result) => {
            if (err) {
                notifier.error(err.data === undefined ? err : err.data._error_message);
            } else {
                that.setState({ data: result, isLoaderAPI: true });
            }
        });
    }

    render() {
        const { submitted, new_pass, confirm_new_pass } = this.state;
        return !this.state.isLoaderAPI === true ? (
            <center>
                <ReactLoading type='bars' color='black' />
            </center>
        ) : (
            <Card>
                <CardHeader>
                    <CardTitle tag='h5' className='mb-0 '>
                        Subject Configuration{/* {this.state.checkMainAcc === "" && ( */}
                        {/* )} */}
                    </CardTitle>
                </CardHeader>

                <Modal isOpen={this.state.modal} toggle={this.toggle}>
                    <Form onSubmit={this.updateUser}>
                        <ModalBody>
                            <div className='Profile__containerImgUpdate'>
                                <center>
                                    <CustomImg src='' className='img-responsive mt-2 ' />
                                </center>

                                <Label className='Profile__iconUpdateAvt' for='updateAvt'>
                                    <Input
                                        type='file'
                                        id='updateAvt'
                                        hidden
                                        onChange={this.handleChangeAvatar}
                                    />
                                    <Camera size='50%' className='Profile__iconUpdateEffect' />
                                    <div className='Profile__iconUpdateEffect'>Update</div>
                                </Label>
                            </div>

                            <FormGroup>
                                <Label className='text-primary'>Fullname</Label>
                                <Label className='text-danger'>*</Label>
                                <Input
                                    type='text'
                                    id='fullname'
                                    name='changeFullname'
                                    defaultValue=''
                                    onChange={this.handleChangeValue}
                                    invalid={
                                        submitted && this.state.changeFullname === null
                                            ? true
                                            : false
                                    }
                                />
                                <FormFeedback invalid>Fullname is a required field!</FormFeedback>
                            </FormGroup>

                            <FormGroup>
                                <Label className='text-primary'>Email</Label>
                                <Input
                                    type='text'
                                    id='email'
                                    name='changeEmail'
                                    defaultValue=''
                                    disabled
                                />
                            </FormGroup>

                            <FormGroup row>
                                <Col sm='5'>
                                    <FormGroup className='Profile__marginbottom'>
                                        <Label className='text-primary'>Mobile</Label>
                                        <Input
                                            type='text'
                                            id='phone_number'
                                            name='changePhone_number'
                                            defaultValue=''
                                            onChange={this.handleChangeValue}
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
                                                        "Delete",
                                                        "Backspace",
                                                        "ArrowLeft",
                                                        "ArrowRight",
                                                    ].includes(event.key)
                                                ) {
                                                    event.preventDefault();
                                                }
                                            }}
                                        />
                                    </FormGroup>
                                </Col>

                                <Col sm='3'>
                                    <FormGroup className='Profile__marginbottom'>
                                        <Label className='text-primary'>Gender</Label>
                                        <Input
                                            type='select'
                                            id='gender'
                                            name='changeGender'
                                            defaultValue=''
                                            onChange={this.handleChangeValue}>
                                            <option>Male</option>
                                            <option>Female</option>
                                            <option>unknown</option>
                                        </Input>
                                    </FormGroup>
                                </Col>

                                <Col sm='4'>
                                    <FormGroup className='Profile__paddingtop25rem Profile__marginbottom'>
                                        <Label>
                                            <CustomInput
                                                type='checkbox'
                                                name='checkChangePass'
                                                id='checkChangePass'
                                                onChange={this.checkChangePass.bind(this)}
                                            />
                                        </Label>
                                        Change Password
                                    </FormGroup>
                                </Col>
                            </FormGroup>

                            {this.state.checkChangePass && (
                                <div>
                                    <FormGroup>
                                        <Label className='text-primary'>Old Password</Label>
                                        <Input
                                            type='password'
                                            name='old_pass'
                                            onChange={this.handleChangeValue}
                                        />
                                    </FormGroup>

                                    <FormGroup>
                                        <Label className='text-primary'>New Password</Label>
                                        <Input
                                            type='password'
                                            name='new_pass'
                                            onChange={this.handleChangeValue}
                                            invalid={
                                                submitted && !/(?=^.{8,}$).*$/i.test(new_pass)
                                                    ? true
                                                    : false
                                            }
                                        />
                                        <FormFeedback invalid>
                                            {" "}
                                            Your new password must contain at least 8 or more
                                            characters
                                        </FormFeedback>
                                    </FormGroup>

                                    <FormGroup>
                                        <Label className='text-primary'>Confirm New Password</Label>
                                        <Input
                                            type='password'
                                            name='confirm_new_pass'
                                            onChange={this.handleChangeValue}
                                            invalid={
                                                submitted && new_pass !== confirm_new_pass
                                                    ? true
                                                    : false
                                            }
                                        />
                                        <FormFeedback invalid>
                                            Confirm password incorrect. Please retype the password
                                        </FormFeedback>
                                    </FormGroup>
                                </div>
                            )}

                            <FormGroup>
                                <Label className='text-primary'>Address</Label>
                                <Input
                                    type='text'
                                    id='address'
                                    name='changeAddress'
                                    defaultValue=''
                                    onChange={this.handleChangeValue}
                                />
                            </FormGroup>

                            <FormGroup>
                                <Label className='text-primary'>Bio</Label>
                                <Input
                                    type='text'
                                    id='bio'
                                    name='changeBio'
                                    defaultValue=''
                                    onChange={this.handleChangeValue}
                                />
                            </FormGroup>
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                type='button'
                                className='ml-2'
                                color='secondary'
                                onClick={this.toggle}>
                                Cancel
                            </Button>
                            <Button type='submit' className='mr-2' color='success'>
                                Save
                            </Button>
                        </ModalFooter>
                    </Form>
                </Modal>

                {/* modal delete subject */}
                <Modal isOpen={this.state.isDelete}>
                    <ModalBody tag='h4'>Do you want to delete this Subject ?</ModalBody>
                    <ModalFooter>
                        <Button
                            color='secondary'
                            onClick={event => this.setState({ isDelete: false })}>
                            Cancel
                        </Button>
                        <Button color='primary' onClick={this.deleteSubject.bind(this)}>
                            {" "}
                            Sure
                        </Button>{" "}
                    </ModalFooter>
                </Modal>

                <CardBody className='pb-0'>
                    {/* {!this.state.isLoadedImg ? (
                        <LoadingSprinner />
                    ) : ( */}
                    {!this.state.isEdit ? (
                        <React.Fragment>
                            <CustomImg
                                src={
                                    this.state.data.image ||
                                    "https://atasouthport.com/wp-content/uploads/2017/04/default-image.jpg"
                                }
                                className='img-responsive mb-3 img-fluid m-auto d-flex justify-content-center'
                            />
                            {/* )} */}
                            <CardTitle className='text-center font-weight-bold mb-0 mt-2'>
                                <h1>{this.state.data.name}</h1>
                            </CardTitle>
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            <Card>
                                <CardBody>
                                    <Label className='font-weight-bold'> Subject: </Label>
                                    <Input
                                        name='subject'
                                        onChange={this.handleChangeSubject.bind(this)}
                                        type='text'
                                        placeholder='input text'
                                        defaultValue={this.state.data.name}
                                    />
                                    <Label className='mt-1 font-weight-bold'>Image: </Label>
                                    <Input
                                        name='img'
                                        onChange={this.handleChangeImg.bind(this)}
                                        type='text'
                                        placeholder='imput url image'
                                        defaultValue={this.state.data.image}
                                    />
                                </CardBody>
                                <CardFooter className='d-flex justify-content-end'>
                                    <Button
                                        color='secondary'
                                        className='mr-1'
                                        onClick={this.cancelEditSubject.bind(this)}>
                                        Cancel
                                    </Button>
                                    <Button
                                        color='success'
                                        onClick={this.saveEditSubject.bind(this)}>
                                        {" "}
                                        Save
                                    </Button>
                                </CardFooter>
                            </Card>
                        </React.Fragment>
                    )}
                </CardBody>

                <hr />

                <CardBody>
                    <CardTitle tag='h5'>About</CardTitle>
                    <ul className='list-unstyled mb-0'>
                        <div>
                            <li className='mb-1'>
                                <User width={14} height={14} className='mr-1' /> Owner: {}
                            </li>
                        </div>

                        <div>
                            <li className='mb-1'>
                                <Book width={14} height={14} className='mr-1' /> Description:{" "}
                                {this.state.data.description}
                            </li>
                        </div>

                        <div>
                            <li className='mb-1'>
                                <Clock width={14} height={14} className='mr-1' /> Creat Date:{" "}
                                {moment.utc(this.state.data.createdDate).format("DD/MM/YYYY")}
                            </li>
                        </div>
                    </ul>
                </CardBody>
                <CardFooter>
                    <Button
                        className='width-percent-45 mr-3'
                        color='primary'
                        onClick={event => this.setState({ isEdit: true })}>
                        <FontAwesomeIcon icon={faEdit} /> Edit Subject
                    </Button>{" "}
                    <Button
                        className='width-percent-45'
                        color='danger'
                        onClick={event => this.setState({ isDelete: true })}>
                        <FontAwesomeIcon icon={faTrash} /> Delete Subject
                    </Button>
                </CardFooter>
            </Card>
        );
    }
}

export default connect(store => ({
    user: store.user,
}))(ProfDetails);
