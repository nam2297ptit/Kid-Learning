import React, { Component } from 'react';
import {
    Button, Modal, ModalHeader, ModalBody, ModalFooter,
    Label,
    Input,
    Container, Row, Col,
    Card, CardBody, CardTitle,
    Badge,
    UncontrolledTooltip,
    UncontrolledDropdown,
    DropdownToggle, DropdownItem, DropdownMenu,
} from 'reactstrap';
import { MoreHorizontal, Save } from "react-feather";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import avatar from "../../assets/img/avatars/avatar-2.jpg"
import { CustomImg } from "../../components/CustomTag";
import moment from "moment";
import Data from "./Data.json"

const ValidInput = require("../../utils/utils");


class TableQuiz extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: this.props.data,
            isEdit: false
        }
    }

    handleChange(event) {
        let temp = Object.assign({}, this.state.data);
        temp[event.target.name] = event.target.value;
        this.setState({ data: temp });
    }

    saveSubject() {
        this.setState({ isEdit: false });
    }

    componentDidMount() {

    }

    render() {
        return (
            <Container fluid className="table-project mt-1 pr-0">
                <Card className="d-flex flex-row">
                    <CustomImg className="img--user--square-6x mr-3" src={avatar} alt="avt" />
                    <CardTitle className=" full-width mb-0 font-size-3x font-weight-bold text-color-black mt-0 border-bottom-0">
                        <div className="d-flex justify-content-between ">
                            <div >
                                {
                                    this.state.isEdit ?
                                        <div className="d-flex flex-row">
                                            <Input
                                                name="name"
                                                value={this.state.data.name}
                                                onChange={this.handleChange.bind(this)}
                                                type="text"
                                            />
                                            <Save className="ml-2" onClick={this.saveSubject.bind(this)}></Save>
                                        </div>
                                        :
                                        this.state.data.name
                                }
                            </div>
                            <div className="mr-2">
                                <UncontrolledDropdown>
                                    <DropdownToggle tag="a">
                                        <MoreHorizontal />
                                    </DropdownToggle>
                                    <DropdownMenu right>
                                        <DropdownItem><FontAwesomeIcon icon={faTrash} /> Delete Subject</DropdownItem>
                                        <DropdownItem onClick={(event) => this.setState({ isEdit: true })}> <FontAwesomeIcon icon={faEdit} /> Edit Subject </DropdownItem>
                                    </DropdownMenu>
                                </UncontrolledDropdown>
                            </div>
                        </div>
                        <h6 className="text-muted table-project__h6">Tag: {this.state.data.tag}</h6>
                        <h6 className="text-muted table-project__h6">Created date: {this.state.data.creat_date}</h6>
                        <h6 className="text-muted table-project__h6">Total questions: {this.state.data.total_question}</h6>
                    </CardTitle>
                </Card>
            </Container>
        )
    }
}

class Quiz extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isClose: false,
            data: [],
            keyWord: null
        }
    }

    componentDidMount() {
        this.setState({
            data: Data
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
        console.log("event:", event.target.name)
        let temp = Object.assign({}, this.state.data);
        temp.tag = event.target.value
        console.log("tag:", temp.tag)
        //this.setState({ data: temp });
    }

    handleChangeSubject(event) {
        let temp = Object.assign({}, this.state.data);
        temp.name = event.target.value
        console.log("subject:", temp.name)
        //this.setState({ data: temp });
    }

    saveQuiz() {
        this.setState({
            isClose: false
        });
    }

    render() {
        return (
            <React.Fragment >
                <Modal isOpen={this.state.isClose}>
                    <ModalHeader className="d-flex justify-content-center">
                        Create Quiz
                    </ModalHeader>
                    <ModalBody>
                        <Label> Subject </Label>
                        <Input
                            name="subject"
                            onChange={this.handleChangeSubject.bind(this)}
                            type="text"
                        />
                        <Label className="mt-1">Tags</Label>
                        <Input name="tag" type="select" id={"tasks-input-status-new"} onChange={this.handleChange.bind(this)}>
                            <option>project1</option>
                            <option>project2</option>
                            <option>project3</option>
                        </Input>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={() => this.setState({ isClose: false })}>
                            Cancel
                        </Button>
                        <Button color="success" onClick={this.saveQuiz.bind(this)}>
                            Save
                        </Button>
                    </ModalFooter>
                </Modal>

                <Container fluid className="width-percent-90">
                    <Row className="mb-5">
                        <Col>
                            <Input className="width-percent-40" id="inputSearch" placeholder="Search Project" onKeyUp={this.handleSearch.bind(this)} />
                        </Col>
                        <Col className="pr-0">
                            <Button
                                className="float-right"
                                onClick={() => this.setState({ isClose: true })}
                            >
                                <FontAwesomeIcon icon={faPlus} /> New Quiz
                            </Button>
                        </Col>
                    </Row>
                    <Row>
                        {
                            this.state.data.map((value, index) => {
                                if (ValidInput.isEmpty(this.state.keyWord)) {
                                    return (
                                        <TableQuiz
                                            key={index}
                                            data={value}
                                        ></TableQuiz>
                                    )
                                }
                                else {
                                    if (value.name.toLowerCase().indexOf(this.state.keyWord) !== -1) {
                                        return (
                                            <TableQuiz
                                                key={index}
                                                data={value}
                                            ></TableQuiz>
                                        )
                                    }
                                }
                                return "";
                            })
                        }
                    </Row>
                </Container>
            </React.Fragment >
        );
    }
}

export default Quiz;