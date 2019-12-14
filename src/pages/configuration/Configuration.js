import React from "react";
import Notification from "../../components/Notification";
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    Form,
    FormGroup,
    Label,
    Input,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    FormFeedback,
    CustomInput,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Col,
    Row,
} from "reactstrap";
import { User, Camera, Book, Clock } from "react-feather";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import notifier from "simple-react-notifications";
import { CustomImg } from "../../components/CustomTag";
import moment from "moment";
import ReactLoading from "react-loading";
import image from "../../assets/img/photos/image.jpg";

const api = require("./api/api");
const data_subject = {};

class Profile extends React.Component {
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
        let id = JSON.parse(localStorage.getItem("subject")).id;
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
                    <CardTitle tag='h3' className='mb-0 '>
                        <h3 className='text-center font-weight-bold'>Subject Configuration</h3>
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
                    <ModalHeader className='d-flex justify-content-center'>
                        Delete Subject
                    </ModalHeader>
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
                    <Row>
                        <Col xs='12' sm='12' md='6' lg='6'>
                            <React.Fragment>
                                <CardBody>
                                    <CustomImg
                                        src={this.state.data.image || image}
                                        className='img-responsive mb-3 img-fluid m-auto d-flex justify-content-center'
                                    />
                                </CardBody>
                            </React.Fragment>

                            <React.Fragment>
                                <Modal isOpen={this.state.isEdit}>
                                    <ModalHeader className='d-flex justify-content-center'>
                                        Edit Subject
                                    </ModalHeader>
                                    <ModalBody tag='h4'>
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
                                    </ModalBody>
                                    <ModalFooter>
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
                                    </ModalFooter>
                                </Modal>
                            </React.Fragment>
                        </Col>
                        <Col xs='12' sm='12' md='6' lg='6'>
                            <Card className='mt-3 '>
                                <CardBody>
                                    <h1 className='text-center font-weight-bold'>
                                        {this.state.data.name}
                                    </h1>
                                    <InputGroup size='lg'>
                                        <InputGroupAddon addonType='prepend'>
                                            <InputGroupText>
                                                <User width={14} height={14} className='mr-1' />
                                                &ensp;&ensp; Owner:&ensp;
                                            </InputGroupText>
                                        </InputGroupAddon>
                                        <Input value={this.state.data.ownerId} disabled />
                                    </InputGroup>
                                    <InputGroup size='lg' className='mt-4'>
                                        <InputGroupAddon addonType='prepend'>
                                            <InputGroupText>
                                                <Book width={14} height={14} className='mr-1' />{" "}
                                                Description:
                                            </InputGroupText>
                                        </InputGroupAddon>
                                        <Input value={this.state.data.description} disabled />
                                    </InputGroup>
                                    <InputGroup size='lg' className='mt-4'>
                                        <InputGroupAddon addonType='prepend'>
                                            <InputGroupText>
                                                <Clock width={14} height={14} className='mr-1' />
                                                Creat Date:
                                            </InputGroupText>
                                        </InputGroupAddon>
                                        <Input
                                            value={moment
                                                .utc(this.state.data.createdDate)
                                                .format("DD/MM/YYYY")}
                                            disabled
                                        />
                                    </InputGroup>
                                </CardBody>

                                <CardBody className='text-center font-weight-bold mb-0 mt-2'>
                                    <Button
                                        className='float-right mr-3 width-percent-45'
                                        color='danger'
                                        size='lg'
                                        onClick={event => this.setState({ isDelete: true })}>
                                        <FontAwesomeIcon icon={faTrash} /> Delete Subject
                                    </Button>

                                    <Button
                                        className=' mr-3 float-right width-percent-45'
                                        color='primary'
                                        size='lg'
                                        onClick={event => this.setState({ isEdit: true })}>
                                        <FontAwesomeIcon icon={faEdit} /> Edit Subject
                                    </Button>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </CardBody>

                <hr />
            </Card>
        );
    }
}

export default Profile;
