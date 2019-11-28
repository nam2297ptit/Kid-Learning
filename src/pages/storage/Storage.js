import React from "react";
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    Col,
    Container,
    Row,
    Table,
    ListGroup,
    ListGroupItem,
    CustomInput,
    Input,
    Label,
    Form,
    FormGroup,
} from "reactstrap";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./StorageLayout.css";
import paginationFactory from "react-bootstrap-table2-paginator";
import Notification from "../../components/Notification";
import Moment from "moment";
const api = require("./api/api");
class FileSideBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            navActive: "mine",
        };
        this.handleSelectNav.bind(this);
    }

    handleSelectNav(action) {
        this.setState({
            navActive: action,
        });
    }

    render() {
        return (
            <React.Fragment>
                <Card>
                    <ListGroup flush>
                        <ListGroupItem
                            tag='a'
                            href='#'
                            action
                            className={
                                this.state.navActive === "mine"
                                    ? "active"
                                    : "inactive"
                            }
                            onClick={() => {
                                this.props.handleChange("Mine");
                                this.handleSelectNav("mine");
                            }}>
                            My documents
                        </ListGroupItem>
                        <ListGroupItem
                            tag='a'
                            href='#'
                            action
                            className={
                                this.state.navActive === "their"
                                    ? "active"
                                    : "inactive"
                            }
                            onClick={() => {
                                this.props.handleChange("Their");
                                this.handleSelectNav("their");
                            }}>
                            Shared documents
                        </ListGroupItem>
                    </ListGroup>
                </Card>
            </React.Fragment>
        );
    }
}
class FileMine extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filter: "",
            data: [],
            allchecked: false,
            max: 5,
        };
    }

    handleDownload() {
        var count = 0;
        for (var i = 0; i < this.state.data.length; i++)
            if (this.state.data[i].checked) {
                var url = "";
                this.state.data[i].file.toLowerCase();
                window.open(url);
            }
    }
    handleSearch = event => {
        this.setState({ filter: event.target.value });
    };
    render() {
        const { filter, data } = this.state;
        //  ------------------------------------
        const { listFileTask } = this.props;
        // ---------------------------------------
        const lowercasedFilter = filter.toLowerCase();
        // const filteredData = listFileTask.filter(item => {
        //   return Object.keys(item).some(key =>
        //     item[key].toLowerCase().includes(lowercasedFilter)
        //   );
        // });
        const filteredData = listFileTask.filter(item => {
            return Object.keys(item).some(key =>
                item[key].toLowerCase().includes(lowercasedFilter),
            );
        });
        return (
            <Card>
                <CardHeader>
                    <CardTitle tag='h5' className='mb-0'>
                        {" "}
                        My documents
                        <Col sm={5} className='float-right'>
                            {" "}
                            <Input
                                type='search'
                                value={filter}
                                placeholder='Search file..'
                                onChange={this.handleSearch}
                            />
                        </Col>
                    </CardTitle>
                </CardHeader>
                <CardBody>
                    <Table responsive hover>
                        <thead>
                            <tr className='File-mine'>
                                <th className='File-mine_col-id'>ID</th>
                                <th className='File-mine_col-type'>Type</th>
                                <th className='File-mine_col-file'>File</th>
                                <th className='File-mine_col-project'>Project</th>
                                <th className='File-mine_col-date'>Date</th>
                                <th className='File-their_col-uploader'>
                                    Uploader
                                </th>
                                <th className='File-mine_col-description'>
                                    Description
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((item, index) => {
                                return (
                                    <tr>
                                        <td>{index + 1}</td>
                                        <td>{item.attachment_type}</td>
                                        <td id='item'>
                                            <a
                                                href={item.preview_url}
                                                download
                                                target='_blank'>
                                                {item.subject}
                                            </a>
                                        </td>
                                        <td>{item.project}</td>
                                        <td>
                                            <Moment format='YYYY/MM/DD'>
                                                {item.created_date}
                                            </Moment>
                                        </td>
                                        <td>{item.owner}</td>
                                        <td>{item.description}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                </CardBody>
            </Card>
        );
    }
}

class FileTheir extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filter: "",
            data: [],
            allchecked: false,
        };
    }
    toggleall() {
        if (this.state.allchecked == true) {
            this.setState({ allchecked: false });
            for (var i = 0; i < this.state.data.length; i++) {
                this.state.data[i].checked = false;
            }
        }
        if (this.state.allchecked == false) {
            this.setState({ allchecked: true });
            for (var i = 0; i < this.state.data.length; i++) {
                this.state.data[i].checked = true;
            }
        }
    }
    toggle(index) {
        let state = Object.assign({}, this.state);
        state.data[index].checked = !state.data[index].checked;
        this.setState(state);
    }
    handleDownload() {
        var count = 0;
        for (var i = 0; i < this.state.data.length; i++)
            if (this.state.data[i].checked) {
                var url = "";
                this.state.data[i].file.toLowerCase();
                window.open(url);
            }
    }
    handleSearch = event => {
        this.setState({ filter: event.target.value });
    };
    render() {
        //  ------------------------------------
        const { listFileWiki } = this.props;
        // ---------------------------------------
        const { filter, data } = this.state;
        const lowercasedFilter = filter.toLowerCase();
        const filteredData = listFileWiki.filter(item => {
            return Object.keys(item).some(key =>
                item[key].toLowerCase().includes(lowercasedFilter),
            );
        });
        return (
            <Card>
                <CardHeader>
                    <CardTitle tag='h5' className='mb-0'>
                        {" "}
                        Shared documents
                        <Col sm={5} className='float-right'>
                            {" "}
                            <Input
                                type='search'
                                value={filter}
                                placeholder='Search file..'
                                onChange={this.handleSearch}
                            />
                        </Col>
                    </CardTitle>
                </CardHeader>
                <CardBody>
                    <Table responsive hover>
                        <thead>
                            <tr className='File-their'>
                                <th className='File-their_col-id'>ID</th>
                                <th className='File-their_col-type'>Type</th>
                                <th className='File-their_col-file'>File</th>
                                <th className='File-their_col-project'>Project</th>
                                <th className='File-their_col-date'>Date</th>
                                <th className='File-their_col-uploader'>
                                    Uploader
                                </th>
                                <th className='File-their_col-description'>
                                    Description
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((item, index) => {
                                return (
                                    <tr>
                                        <td>{index + 1}</td>
                                        <td>{item.attachment_type}</td>
                                        <td id='item'>
                                            <a
                                                href={item.preview_url}
                                                download
                                                target='_blank'>
                                                {item.subject}
                                            </a>
                                        </td>
                                        <td>{item.project}</td>
                                        <td>
                                            <Moment format='YYYY/MM/DD'>
                                                {item.created_date}
                                            </Moment>
                                        </td>
                                        <td>{item.owner}</td>
                                        <td>{item.description}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                </CardBody>
            </Card>
        );
    }
}
class FileUpload extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Card>
                <CardHeader>
                    <h2 style={{ textAlign: "center" }}>
                        <FontAwesomeIcon icon={faUpload} /> Upload a file
                    </h2>
                </CardHeader>
                <CardBody>
                    <Form>
                        <Row className='justify-content-center mt-3 mb-2'>
                            <Col md='10'>
                                <FormGroup>
                                    <Label for='inputFilename'>File name</Label>
                                    <Input
                                        type='text'
                                        id='inputFilename'
                                        placeholder='File name'
                                    />
                                    <br />
                                    <Input type='file' name='file' />
                                    <br />
                                    <Label for='inputDescription'>
                                        Description
                                    </Label>
                                    <Input
                                        type='textarea'
                                        id='inputDescription'
                                        placeholder=''
                                    />
                                    <Label for='inputProject'>Project</Label>
                                    <CustomInput type='select' id='inputProject'>
                                        <option value=''>Select...</option>
                                        <option>Xay Dung</option>
                                        <option>Nha cua</option>
                                        <option>Dat dai</option>
                                    </CustomInput>
                                </FormGroup>
                                <Button href='#' color='primary'>
                                    Upload
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </CardBody>
            </Card>
        );
    }
}
class Storage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [
                {
                    content_type: "",
                    attachment_type: "",
                    attached_file: "",
                    project: {
                        subject: "",
                    },
                    created_date: "",
                    owner: {
                        full_name: "",
                    },
                    description: "",
                    subject: "",
                    url: "",
                    preview_url: "",
                },
            ],
            listFileTask: [],
            listFileWiki: [],
            isRenderTheir: false,
            isRenderMine: true,
            isRenderUpload: false,
        };
        this.handleChange = this.handleChange.bind(this);
    }
    componentDidMount() {
        api.getFileOfWorkAndTask((err, result) => {
            if (err) {
                Notification(
                    "error",
                    "Error",
                    err.data === undefined
                        ? err
                        : err.status + " " + err.data._error_message,
                );
            } else {
                let arr1 = [];
                result.map(item => {
                    let item2 = {
                        attachment_type: item.attachment_type || "",
                        preview_url: item.preview_url || "",
                        subject: item.subject || "",
                        project: item.project.subject || "",
                        owner: item.owner.full_name || "",
                        created_date: item.created_date || "",
                        description: item.description || "",
                    };
                    arr1.push(item2);
                });
                this.setState({
                    isLoaded_Work_Task: true,
                    listFileTask: arr1,
                });
            }
        });
        api.getFileOfWiki((err, result) => {
            if (err) {
                Notification(
                    "error",
                    "Error",
                    err.data === undefined
                        ? err
                        : err.status + " " + err.data._error_message,
                );
            } else {
                let arr = [];
                result.map(item => {
                    let item1 = {
                        attachment_type: item.attachment_type || "",
                        preview_url: item.preview_url || "",
                        subject: item.subject || "",
                        project: item.project.subject || "",
                        owner: item.owner.full_name || "",
                        created_date: item.created_date || "",
                        description: item.description || "",
                    };
                    arr.push(item1);
                });
                this.setState({
                    data: result,
                    isLoaded_Wiki: true,
                    listFileWiki: arr,
                });
            }
        });
    }
    handleChange(options) {
        if (options === "Mine") {
            this.setState({
                isRenderTheir: false,
                isRenderUpload: false,
                isRenderMine: true,
            });
        }
        if (options === "Their") {
            this.setState({
                isRenderUpload: false,
                isRenderMine: false,
                isRenderTheir: true,
            });
        }
    }
    render() {
        return this.state.isLoaded_Work_Task === true &&
            this.state.isLoaded_Wiki ? (
            <Container fluid className='p-0'>
                <h2 className='h3 mb-3'>Document management</h2>
                <Row>
                    <Col xs='3'>
                        <FileSideBar handleChange={this.handleChange} />
                    </Col>
                    <Col xs='9'>
                        {this.state.isRenderMine ? (
                            <FileMine listFileTask={this.state.listFileTask} />
                        ) : (
                            <FileTheir listFileWiki={this.state.listFileWiki} />
                        )}
                    </Col>
                </Row>
            </Container>
        ) : null;
    }
}
export default Storage;
