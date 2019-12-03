import React from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import {
    Container,
    Button,
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    Col,
    Row,
    Media,
    Table,
    Label,
    FormGroup,
    Input,
    CustomInput,
    InputGroup,
    InputGroupAddon,
    Modal,
    ModalHeader,
    ModalFooter,
    ModalBody,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faTimes,
    faPlusCircle,
    faPlus,
    faComment,
    faTrash,
    faArrowAltCircleLeft,
    faEdit,
} from "@fortawesome/free-solid-svg-icons";
import ReactLoading from "react-loading";
import { CustomImg, Description } from "../../components/CustomTag";
import notifier from "simple-react-notifications";
import cup from "../../assets/img/photos/cup.png";
import cup_gold from "../../assets/img/photos/cup-gold.png";
import cup_sliver from "../../assets/img/photos/cup-sliver.png";
import cup_cu from "../../assets/img/photos/cup.png";
const api = require("./api/api");
const utils = require("../../utils/utils");

class Rank extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
        };
    }
    componentDidMount() {
        this.setState({
            data: this.props.statistical.rank,
        });
    }
    render() {
        return (
            <Card>
                <CardHeader>
                    <CardTitle tag='h5' className='mb-0'>
                        Rank
                    </CardTitle>
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
                                            <td>{item.user.name}</td>
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
                                            <td>{item.user.name}</td>
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
                                            <td>{item.user.name}</td>
                                            <td>{item.point}</td>
                                        </tr>
                                    );
                                } else {
                                    return (
                                        <tr>
                                            <th scope='row' className='text-left pl-2'>
                                                &emsp; {i + 1}
                                            </th>
                                            <td>{item.user.name}</td>
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
                console.log(err);

                notifier.error(err.data === undefined ? err : err.data._error_message);
            } else {
                console.log(result);

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
                console.log(err);

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
        const that = this;
        let data = [...this.state.data];
        api.deleteQuestion(data[index].id, (err, result) => {
            if (err) {
                notifier.error(err.data === undefined ? err : err.data._error_message);
            } else {
                data.pop();
                this.setState({ data: data, lenght_data: this.state.lenght_data - 1 });
            }
        });
    }

    componentDidMount() {
        this.setState({ data: this.props.questions, lenght_data: this.props.questions.length });
    }

    render() {
        return (
            <Card>
                <CardHeader>
                    <CardTitle tag='h5' className='mb-0'>
                        Questions
                    </CardTitle>
                </CardHeader>
                <CardBody>
                    {/*  */}
                    {this.state.data.map((item, i) => {
                        console.log(item);

                        return (
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
                                        <Button
                                            color='none'
                                            className='close d-inline '
                                            onClick={this.removeQuestion.bind(this, i)}>
                                            <FontAwesomeIcon icon={faTrash} color='red' />
                                        </Button>
                                    )}
                                </CardHeader>
                                <CardBody>
                                    <Label>Nội dung câu hỏi:</Label>
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
                                            value={item.content || this.state.question.content}
                                        />
                                    )}

                                    <Row className='mt-2'>
                                        <Col sm='12' md='4'>
                                            <Label>Ảnh câu hỏi</Label>
                                            {i < this.state.lenght_data ? (
                                                <img
                                                    alt='Img questions'
                                                    src={item.linkImage || this.state.tempLogo}
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
                                            <Label className='d-inline'>Câu trả lời</Label>
                                            <Button
                                                color='none'
                                                onClick={this.handleSolution.bind(this)}>
                                                <FontAwesomeIcon icon={faComment} color='green' />
                                            </Button>
                                            <InputGroup className='my-1' name='solution'>
                                                <Input
                                                    name='solution'
                                                    placeholder='solution'
                                                    className='d-inline'
                                                    value={item.solution}
                                                    onChange={this.handleChangeSolution}
                                                />
                                            </InputGroup>
                                            {item.result.map((data, index) => {
                                                if (index === 0) {
                                                    return (
                                                        <Row className='my-2'>
                                                            <Col xs='11'>
                                                                <InputGroup>
                                                                    <InputGroupAddon addonType='prepend'>
                                                                        <Button color='success'>
                                                                            Đúng
                                                                        </Button>
                                                                    </InputGroupAddon>
                                                                    <Input
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
                                                        </Row>
                                                    );
                                                } else {
                                                    return (
                                                        <Row className='my-2'>
                                                            <Col xs='11'>
                                                                <InputGroup>
                                                                    <InputGroupAddon addonType='prepend'>
                                                                        <Button color='danger'>
                                                                            &ensp;Sai&ensp;
                                                                        </Button>
                                                                    </InputGroupAddon>
                                                                    <Input
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
                                                            {i < this.state.lenght_data ? null : (
                                                                <Col xs='1'>
                                                                    <Button
                                                                        color='none'
                                                                        className='close'
                                                                        onClick={this.handleDeleteQuestion.bind(
                                                                            this,
                                                                            index,
                                                                            i,
                                                                        )}>
                                                                        <FontAwesomeIcon
                                                                            icon={faTimes}
                                                                            className='m-1'
                                                                            color='red'
                                                                        />
                                                                    </Button>
                                                                </Col>
                                                            )}
                                                        </Row>
                                                    );
                                                }
                                            })}
                                            {i < this.state.lenght_data ? null : (
                                                <Button
                                                    block
                                                    color='none'
                                                    className='load-more mt-2 text-primary font-weight-bold'
                                                    onClick={this.handleCreateResult.bind(this)}>
                                                    <FontAwesomeIcon icon={faPlus} /> Thêm câu trả
                                                    lời
                                                </Button>
                                            )}
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
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
                console.log(err);

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
