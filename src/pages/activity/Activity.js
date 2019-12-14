import React from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { CSVLink } from "react-csv";
import {
    Container,
    Button,
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    Col,
    Row,
    Table,
    Label,
    FormGroup,
    Input,
    InputGroup,
    InputGroupAddon,
    Modal,
    ModalHeader,
    ModalFooter,
    ModalBody,
    UncontrolledDropdown,
    DropdownItem,
    DropdownToggle,
    DropdownMenu,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPlusCircle,
    faComment,
    faTrash,
    faArrowAltCircleLeft,
    faEdit,
    faDownload,
} from "@fortawesome/free-solid-svg-icons";
import ReactLoading from "react-loading";
import { CustomImg } from "../../components/CustomTag";
import notifier from "simple-react-notifications";
import cup from "../../assets/img/photos/cup.png";
import cup_gold from "../../assets/img/photos/cup-gold.png";
import cup_sliver from "../../assets/img/photos/cup-sliver.png";
import cup_cu from "../../assets/img/photos/cup.png";
import image from "../../assets/img/photos/image.jpg";

const api = require("./api/api");
const utils = require("../../utils/utils");

class Rank extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            csv: [],
        };
    }
    componentDidMount() {
        let rank = [...this.props.statistical.rank];
        let element = [];
        rank.map((values, index) => {
            let value = {};
            value.answer = values.keyArray;
            value.user = values.user.fullName;
            value.point = values.point;
            value.time = moment(values.submitDate).format("DD/MM/YYYY h:mm:ss a");
            element.push(value);
            return element;
        });

        this.setState({
            data: this.props.statistical.rank,
            csv: element,
        });
    }
    render() {
        console.log(this.state.csv);
        return (
            <Card>
                <CardHeader>
                    <CardTitle tag='h3' className='mb-0 mt-4 d-inline'>
                        Rank
                    </CardTitle>
                    <div className='float-right d-inline'>
                        <CSVLink data={this.state.csv} filename={"student_list.csv"}>
                            <FontAwesomeIcon
                                icon={faDownload}
                                size='2x'
                                color='grey'
                                onClick={this.printListMember}
                            />
                        </CSVLink>
                    </div>
                </CardHeader>
                <CardBody className='text-center m-3'>
                    <CustomImg
                        key={utils.randomString()}
                        src={cup}
                        alt='cup'
                        className='img--user--square-7x'
                    />
                    <h4 className='mt-4'>Bảng xếp hạng học sinh hoàn thành bài kiểm tra</h4>
                </CardBody>
                <CardBody className='text-center m-3'>
                    <Table>
                        <thead>
                            <tr>
                                <th className='text-left'>STT</th>
                                <th>Họ và tên</th>
                                <th>Số điểm</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.data.map((item, i) => {
                                if (i === 0) {
                                    return (
                                        <tr>
                                            <th scope='row' className='float-left'>
                                                <CustomImg
                                                    key={utils.randomString()}
                                                    src={cup_gold}
                                                    alt='cup'
                                                    className='img--user--square-2x'
                                                />
                                            </th>
                                            <td>{item.user.fullName}</td>
                                            <td>{item.point}</td>
                                        </tr>
                                    );
                                } else if (i === 1) {
                                    return (
                                        <tr>
                                            <th scope='row' className='text-left'>
                                                <CustomImg
                                                    key={utils.randomString()}
                                                    src={cup_sliver}
                                                    alt='cup'
                                                    className='img--user--square-2x'
                                                />
                                            </th>
                                            <td>{item.user.fullName}</td>
                                            <td>{item.point}</td>
                                        </tr>
                                    );
                                } else if (i === 2) {
                                    return (
                                        <tr>
                                            <th scope='row' className='text-left'>
                                                <CustomImg
                                                    key={utils.randomString()}
                                                    src={cup_cu}
                                                    alt='cup'
                                                    className='img--user--square-2x'
                                                />
                                            </th>
                                            <td>{item.user.fullName}</td>
                                            <td>{item.point}</td>
                                        </tr>
                                    );
                                } else {
                                    return (
                                        <tr>
                                            <th scope='row' className='text-left pl-2'>
                                                &emsp; {i + 1}
                                            </th>
                                            <td>{item.user.fullName}</td>
                                            <td>{item.point}</td>
                                        </tr>
                                    );
                                }
                            })}
                        </tbody>
                    </Table>
                </CardBody>
            </Card>
        );
    }
}

class Information extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            isEdit: false,
            isDelete: false,
        };
    }
    componentDidMount() {
        this.setState({ data: this.props.informartion });
    }

    handleEdit(event) {
        let temp = Object.assign({}, this.state.data);
        temp[event.target.name] = event.target.value;
        this.setState({ data: temp });
    }
    saveQuiz() {
        this.setState({ isEdit: false });
        const that = this;
        api.editQuiz(this.state.data, (err, result) => {
            if (err) {
                notifier.error(err.data === undefined ? err : err.data._error_message);
            } else {
                that.setState({
                    data: result,
                });
            }
        });
    }
    removeQuiz() {
        this.setState({ isEdit: false });

        api.deleteQuiz((err, result) => {
            if (err) {
                notifier.error(err.data === undefined ? err : err.data._error_message);
            } else {
                window.location.replace("/quiz");
            }
        });
    }
    render() {
        return (
            <React.Fragment>
                <Modal isOpen={this.state.isEdit}>
                    <ModalHeader className='d-flex justify-content-center'>Edit Quiz</ModalHeader>
                    <ModalBody>
                        <Label> Name Quiz </Label>
                        <Input
                            name='name'
                            onChange={this.handleEdit.bind(this)}
                            type='text'
                            value={this.state.data.name}
                        />
                        <br></br>
                        <Label> Test Time </Label>
                        <Input
                            name='timeTest'
                            onChange={this.handleEdit.bind(this)}
                            type='text'
                            value={this.state.data.timeTest}
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

                <Modal isOpen={this.state.isDelete}>
                    <ModalHeader className='d-flex justify-content-center'>Delete Quiz</ModalHeader>
                    <ModalBody>
                        <h4>Do you want to delete this Quiz ?</h4>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            color='secondary'
                            onClick={() => this.setState({ isDelete: false })}>
                            Cancel
                        </Button>
                        <Button color='success' onClick={this.removeQuiz.bind(this)}>
                            OK
                        </Button>
                    </ModalFooter>
                </Modal>

                <Card>
                    <CardHeader>
                        <CardTitle tag='h1' className='my-0'>
                            Infomartion
                            <Button
                                className='float-right d-inline  mr-0 text-danger'
                                color='none'
                                onClick={() => this.setState({ isDelete: true })}>
                                <FontAwesomeIcon icon={faTrash} size='2x' />
                            </Button>
                            <Button
                                className='float-right d-inline  mr-0 text-primary'
                                color='none'
                                onClick={() => this.setState({ isEdit: true })}>
                                <FontAwesomeIcon icon={faEdit} size='2x' />
                            </Button>
                        </CardTitle>
                    </CardHeader>
                    <CardBody className='text-center m-2'>
                        <h3 className='font-weight-bold'>{this.state.data.name}</h3>
                        <Row className='text-left'>
                            <Col>
                                <h4 className='mt-4'>
                                    Questions number: {this.state.data.questionNumber}
                                </h4>
                            </Col>
                            <Col>
                                <h4 className='mt-4'>
                                    Test Time: {this.state.data.timeTest} minutue
                                </h4>
                            </Col>
                        </Row>
                        <Row className='text-left'>
                            <Col>
                                <h4 className='mt-4'>
                                    Created Date:{" "}
                                    {moment.utc(this.state.createdDate).format("DD/MM/YYYY")}
                                </h4>
                            </Col>
                            <Col>
                                <h4 className='mt-4'>Status: {this.state.data.status}</h4>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </React.Fragment>
        );
    }
}

class Questions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: "",
            isShow: false,
            isSave: false,
            lenght_data: null,
            isClose: false,
            data: [],
            question: {
                subjectId: null,
                quizId: null,
                linkImage: null,
                linkVideo: null,
                content: null,
                result: ["", "", "", ""],
                key: null,
                solution: null,
            },
            result: [],
        }; // You can also pass a Quill Delta here
        this.handleChangeSolution = this.handleChangeSolution.bind(this);
        this.handleImageChange = this.handleImageChange.bind(this);
        this.handleSave = this.handleSave.bind(this);
    }

    toggle(component) {
        this.setState({
            [component]: !this.state[component],
        });
    }

    handleChangeSolution(event) {
        let temp = Object.assign({}, this.state.question);

        temp["solution"] = event.target.value;

        this.setState({
            question: temp,
        });
    }

    handleImageChange(event) {
        let temp = Object.assign({}, this.state.question);

        temp["linkImage"] = event.target.value;

        this.setState({
            question: temp,
            tempLogo: event.target.value,
        });
    }

    handleSolution() {
        this.setState({
            isShow: !this.state.isShow,
        });
    }

    handleCreate() {
        let temp = [...this.state.data];
        temp.push(this.state.question);
        this.setState({ data: temp, isSave: true });
    }

    handleSave(event) {
        let temp = Object.assign({}, this.state.question);
        temp["content"] = event.target.value;
        this.setState({ question: temp });
    }

    handleSaveQuestion() {
        let question = Object.assign({}, this.state.question);
        const that = this;
        api.createQuestion(question, (err, result) => {
            if (err) {
                notifier.error(err.data === undefined ? err : err.data._error_message);
            } else {
                let data = [...this.state.data];
                data[data.length - 1] = result;
                let question = {
                    subjectId: null,
                    quizId: null,
                    linkImage: null,
                    linkVideo: null,
                    content: null,
                    result: ["", "", "", ""],
                    key: null,
                    solution: null,
                };
                that.setState({
                    isSave: false,
                    question: question,
                    tempLogo: null,
                    lenght_data: this.state.lenght_data + 1,
                    data: data,
                });
            }
        });
    }

    handleDeleteQuestion(index, i) {
        let data = [...this.state.data];
        delete data[i].result[index];
        this.setState({ data: data });
    }

    handleCreateResult() {
        let data = [...this.state.data];
        data[data.length - 1].result.push("");
        this.setState({ data: data });
    }

    handleKeyAnswer(event) {
        let data = [...this.state.data];
        let question = Object.assign({}, this.state.question);
        data[data.length - 1].result[event.target.id[0]] = event.target.value;
        question.result[event.target.id[0]] = event.target.value;
        this.setState({ data: data, question: question });
    }

    removeQuestion(index) {
        let data = [...this.state.data];
        api.deleteQuestion(data[index].id, (err, result) => {
            if (err) {
                notifier.error(err.data === undefined ? err : err.data._error_message);
            } else {
                let question = {
                    subjectId: null,
                    quizId: null,
                    linkImage: null,
                    linkVideo: null,
                    content: null,
                    result: ["", "", "", ""],
                    key: null,
                    solution: null,
                };
                data.splice(index, 1);

                this.setState({
                    question: question,
                    data: data,
                    lenght_data: this.state.lenght_data - 1,
                    isClose: false,
                });
            }
        });
    }

    componentDidMount() {
        this.setState({ data: this.props.questions, lenght_data: this.props.questions.length });
    }

    render() {
        return (
            <React.Fragment>
                <Card>
                    <CardHeader>
                        <CardTitle tag='h5' className='mb-0'>
                            Questions
                        </CardTitle>
                    </CardHeader>
                    <CardBody>
                        {/*  */}

                        {this.state.data.map((item, i) => {
                            return (
                                <React.Fragment>
                                    <Card color='success' outline>
                                        <CardHeader>
                                            <CardTitle tag='h5' className='mb-0 d-inline '>
                                                {"Question " + (i + 1)}
                                            </CardTitle>
                                            {i + 1 === this.state.data.length &&
                                            this.state.isSave === true ? (
                                                <Button
                                                    className='float-right d-inline bg-success'
                                                    onClick={this.handleSaveQuestion.bind(this)}>
                                                    Save questions
                                                </Button>
                                            ) : (
                                                <React.Fragment>
                                                    <Modal isOpen={this.state.isClose}>
                                                        <ModalHeader className='d-flex justify-content-center'>
                                                            Delete question
                                                        </ModalHeader>
                                                        <ModalBody>
                                                            <h4>
                                                                Do you want to delete this question
                                                                ?
                                                            </h4>
                                                        </ModalBody>
                                                        <ModalFooter>
                                                            <Button
                                                                color='secondary'
                                                                onClick={() =>
                                                                    this.setState({
                                                                        isClose: false,
                                                                    })
                                                                }>
                                                                Cancel
                                                            </Button>
                                                            <Button
                                                                color='success'
                                                                onClick={this.removeQuestion.bind(
                                                                    this,
                                                                    this.state.remove_id,
                                                                )}>
                                                                OK
                                                            </Button>
                                                        </ModalFooter>
                                                    </Modal>

                                                    <UncontrolledDropdown
                                                        setActiveFromChild
                                                        className='d-inline float-right'>
                                                        <DropdownToggle
                                                            tag='a'
                                                            className='nav-link d-inline'
                                                            caret>
                                                            More
                                                        </DropdownToggle>
                                                        <DropdownMenu>
                                                            <DropdownItem
                                                                onClick={() =>
                                                                    this.setState({
                                                                        isClose: true,
                                                                        remove_id: i,
                                                                    })
                                                                }>
                                                                <FontAwesomeIcon
                                                                    icon={faTrash}
                                                                    className='mr-2'
                                                                    color='red'
                                                                />
                                                                Delete question
                                                            </DropdownItem>
                                                        </DropdownMenu>
                                                    </UncontrolledDropdown>
                                                </React.Fragment>
                                            )}
                                        </CardHeader>
                                        <CardBody>
                                            <Label>Content questions:</Label>
                                            {i < this.state.lenght_data ? (
                                                <Input
                                                    type='textarea'
                                                    value={
                                                        utils.isEmpty(item.content) === true
                                                            ? null
                                                            : item.content
                                                    }
                                                    disabled
                                                />
                                            ) : (
                                                <Input
                                                    onChange={this.handleSave}
                                                    type='textarea'
                                                    value={
                                                        item.content || this.state.question.content
                                                    }
                                                />
                                            )}

                                            <Row className='mt-2'>
                                                <Col sm='12' md='4'>
                                                    <Label>Photo question</Label>
                                                    {i < this.state.lenght_data ? (
                                                        <img
                                                            alt='Img questions'
                                                            src={
                                                                item.linkImage ||
                                                                this.state.tempLogo ||
                                                                image
                                                            }
                                                            className='img-thumbnail'
                                                            style={{
                                                                height: "200px",
                                                                width: "100%",
                                                            }}
                                                        />
                                                    ) : (
                                                        <FormGroup>
                                                            <Input
                                                                className='boder'
                                                                type='text'
                                                                name='file'
                                                                id='logo_subject'
                                                                placeholder='Url Image'
                                                                onChange={this.handleImageChange}
                                                                value={item.linkImage}
                                                            />
                                                            <Label
                                                                for='logo_subject'
                                                                className='hover-pointer:hover d-flex justify-content-center my-auto'>
                                                                <img
                                                                    alt='Img questions'
                                                                    src={
                                                                        item.linkImage ||
                                                                        this.state.tempLogo
                                                                    }
                                                                    className='img-thumbnail'
                                                                    style={{
                                                                        height: "200px",
                                                                        width: "100%",
                                                                    }}
                                                                />
                                                            </Label>
                                                        </FormGroup>
                                                    )}
                                                </Col>
                                                <Col>
                                                    <Label className='d-inline'>Answer</Label>
                                                    <Button
                                                        color='none'
                                                        onClick={this.handleSolution.bind(this)}>
                                                        <FontAwesomeIcon
                                                            icon={faComment}
                                                            color='green'
                                                        />
                                                    </Button>
                                                    <InputGroup className='my-1' name='solution'>
                                                        <Input
                                                            size='lg'
                                                            name='solution'
                                                            placeholder='solution'
                                                            className='d-inline'
                                                            value={item.solution}
                                                            onChange={this.handleChangeSolution}
                                                        />
                                                    </InputGroup>
                                                    <Row className='mt-4 mb-4'>
                                                        {item.result.map((data, index) => {
                                                            if (index === 0) {
                                                                return (
                                                                    <Col xs='6' className='my-3'>
                                                                        <InputGroup>
                                                                            <InputGroupAddon addonType='prepend'>
                                                                                <Button color='success'>
                                                                                    True&nbsp;
                                                                                </Button>
                                                                            </InputGroupAddon>
                                                                            <Input
                                                                                size='lg'
                                                                                placeholder='answer'
                                                                                className='d-inline'
                                                                                id={index}
                                                                                value={data}
                                                                                onChange={this.handleKeyAnswer.bind(
                                                                                    this,
                                                                                )}
                                                                            />
                                                                        </InputGroup>
                                                                    </Col>
                                                                );
                                                            } else {
                                                                return (
                                                                    <React.Fragment>
                                                                        <Col
                                                                            xs='6'
                                                                            className='my-3'>
                                                                            <InputGroup>
                                                                                <InputGroupAddon addonType='prepend'>
                                                                                    <Button color='danger'>
                                                                                        False
                                                                                    </Button>
                                                                                </InputGroupAddon>
                                                                                <Input
                                                                                    size='lg'
                                                                                    placeholder='default'
                                                                                    className='d-inline'
                                                                                    value={data}
                                                                                    id={index}
                                                                                    onChange={this.handleKeyAnswer.bind(
                                                                                        this,
                                                                                    )}
                                                                                />
                                                                            </InputGroup>
                                                                        </Col>
                                                                    </React.Fragment>
                                                                );
                                                            }
                                                        })}
                                                    </Row>
                                                </Col>
                                            </Row>
                                        </CardBody>
                                    </Card>
                                </React.Fragment>
                            );
                        })}

                        {/*  */}
                        <Button
                            block
                            color='primary'
                            className='load-more'
                            onClick={this.handleCreate.bind(this)}
                            hidden={this.state.isSave ? true : false}>
                            <FontAwesomeIcon icon={faPlusCircle} /> Thêm câu hỏi
                        </Button>
                    </CardBody>
                </Card>
            </React.Fragment>
        );
    }
}

class Timeline extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaderAPI_Activities: false,
            isLoaderAPI_InfoProject: false,
            questions: [],
            statistical: {},
            data: {},
        };
        this.getAPI = this.getAPI.bind(this);
    }
    getAPI() {
        let id = JSON.parse(localStorage.getItem("quiz"));
        const that = this;
        api.getListQuiz(id, (err, result) => {
            if (err) {
                notifier.error(err.data === undefined ? err : err.data._error_message);
            } else {
                that.setState({
                    data: result,
                    questions: result.questionArray,
                    statistical: result.statistical,
                    isLoaderAPI: true,
                });
            }
        });
    }
    componentDidMount() {
        this.getAPI();
    }
    render() {
        return !this.state.isLoaderAPI ? (
            <center>
                <ReactLoading type='bars' color='black' />
            </center>
        ) : (
            <Container fluid className='p-0  h-100'>
                <Card className='my-0 mb-2 '>
                    <CardHeader>
                        <Link to='quiz'>
                            <FontAwesomeIcon
                                icon={faArrowAltCircleLeft}
                                className='d-inline mr-2'
                                size='2x'
                            />
                        </Link>
                        <h4 className='d-inline mb-2 font-weight-bold'>{this.state.data.name}</h4>
                    </CardHeader>
                </Card>
                <Row>
                    <Col md='7' xl='8'>
                        <Questions questions={this.state.questions} getAPI={this.getAPI} />
                    </Col>
                    <Col md='5' xl='4'>
                        <Information informartion={this.state.data} />
                        <Rank statistical={this.state.statistical} />
                    </Col>
                </Row>
            </Container>
        );
    }
}
export default Timeline;
