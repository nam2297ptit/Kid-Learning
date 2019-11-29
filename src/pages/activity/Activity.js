import React from "react";
import { Link } from "react-router-dom";
import Notification from "../../components/Notification";
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
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faTimes,
    faPlusCircle,
    faPlus,
    faComment,
    faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { CustomImg, LoadingSprinner, Description } from "../../components/CustomTag";
import cup from "../../assets/img/photos/cup.png";
import cup_gold from "../../assets/img/photos/cup-gold.png";
import cup_sliver from "../../assets/img/photos/cup-sliver.png";
import cup_cu from "../../assets/img/photos/cup.png";

// const api = require("./api/api");
const utils = require("../../utils/utils");

class Rank extends React.Component {
    constructor(props) {
        super(props);
        const { dataInfoProject } = this.props;
        this.toggle = this.toggle.bind(this);
        this.state = {
            dataInfoProject: dataInfoProject,
            tooltipOpen: false,
        };
    }
    toggle() {
        this.setState({
            tooltipOpen: !this.state.tooltipOpen,
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
                            <tr>
                                <th scope='row' className='float-left'>
                                    <CustomImg
                                        key={utils.randomString()}
                                        src={cup_gold}
                                        alt='cup'
                                        className='img--user--square-2x'
                                    />
                                </th>
                                <td>Mark</td>
                                <td>Otto</td>
                            </tr>
                            <tr>
                                <th scope='row' className='text-left'>
                                    <CustomImg
                                        key={utils.randomString()}
                                        src={cup_sliver}
                                        alt='cup'
                                        className='img--user--square-2x'
                                    />
                                </th>
                                <td>Mark</td>
                                <td>Otto</td>
                            </tr>
                            <tr>
                                <th scope='row' className='text-left'>
                                    <CustomImg
                                        key={utils.randomString()}
                                        src={cup_cu}
                                        alt='cup'
                                        className='img--user--square-2x'
                                    />
                                </th>
                                <td>Mark</td>
                                <td>Otto</td>
                            </tr>
                            <tr>
                                <th scope='row' className='text-left pl-2'>
                                    &emsp; 4
                                </th>
                                <td>Mark</td>
                                <td>Otto</td>
                            </tr>
                            <tr>
                                <th scope='row' className='text-left pl-2'>
                                    &emsp; 5
                                </th>
                                <td>Mark</td>
                                <td>Otto</td>
                            </tr>
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
        const { dataInfoProject } = this.props;
        this.toggle = this.toggle.bind(this);
        this.state = {
            dataInfoProject: dataInfoProject,
            tooltipOpen: false,
        };
    }
    toggle() {
        this.setState({
            tooltipOpen: !this.state.tooltipOpen,
        });
    }
    render() {
        return (
            <Card>
                <CardHeader>
                    <CardTitle tag='h5' className='mb-0'>
                        Infomartion
                    </CardTitle>
                </CardHeader>
                <CardBody className='text-center m-3'>
                    <h3 className='font-weight-bold'>Bài kiểm tra số 1</h3>
                    <h4 className='mt-4'>Số lượng câu hỏi: </h4>
                </CardBody>
            </Card>
        );
    }
}
class Questions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: "",
            data: [1, 2, 3],
        }; // You can also pass a Quill Delta here
        this.handleChange = this.handleChange.bind(this);
        this.handleImageChange = this.handleImageChange.bind(this);
    }

    handleChange(value) {
        this.setState({ text: value });
    }

    toggle(component) {
        this.setState({
            [component]: !this.state[component],
        });
    }

    handleImageChange(event) {
        this.setState({
            changeLogo: event.target.files[0],
            tempLogo: URL.createObjectURL(event.target.files[0]),
        });
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
                        return (
                            <Card>
                                <CardHeader>
                                    <CardTitle tag='h5' className='mb-0 d-inline '>
                                        {"Question " + (i + 1)}
                                    </CardTitle>
                                    <Button
                                        color='none'
                                        className='close d-inline '
                                        //onClick={() => this.handerUpdate()}
                                    >
                                        <FontAwesomeIcon icon={faTrash} color='red' />
                                    </Button>
                                </CardHeader>
                                <CardBody>
                                    <Label>Nội dung câu hỏi</Label>
                                    <Description />
                                    <Row className='mt-2'>
                                        <Col sm='12' md='4'>
                                            <Label>Ảnh câu hỏi</Label>
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
                                                        style={{
                                                            height: "200px",
                                                            width: "100%",
                                                        }}
                                                    />
                                                </Label>
                                            </FormGroup>
                                        </Col>
                                        <Col>
                                            <Label className='d-inline'>Câu trả lời</Label>
                                            <Button
                                                color='none'
                                                //onClick={() => this.handerUpdate()}
                                            >
                                                <FontAwesomeIcon icon={faComment} color='green' />
                                            </Button>

                                            <Row>
                                                <Col xs='11'>
                                                    <InputGroup>
                                                        <InputGroupAddon addonType='prepend'>
                                                            <Button color='success'>Đúng</Button>
                                                        </InputGroupAddon>
                                                        <Input
                                                            placeholder='default'
                                                            className='d-inline'
                                                        />
                                                    </InputGroup>
                                                    <Button
                                                        color='none'
                                                        block
                                                        //onClick={() => this.handerUpdate()}
                                                    >
                                                        <Label>Thêm ảnh cho câu trả lời</Label>
                                                    </Button>
                                                </Col>
                                                <Col xs='1'>
                                                    <Button
                                                        color='none'
                                                        className='close d-inline'
                                                        //onClick={() => this.handerUpdate()}
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faTimes}
                                                            className='m-1'
                                                            color='red'
                                                        />
                                                    </Button>
                                                </Col>
                                            </Row>
                                            <Row>
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
                                                        />
                                                    </InputGroup>
                                                    <Button
                                                        color='none'
                                                        block
                                                        //onClick={() => this.handerUpdate()}
                                                    >
                                                        <Label>Thêm ảnh cho câu trả lời</Label>
                                                    </Button>
                                                </Col>
                                                <Col xs='1'>
                                                    <Button
                                                        color='none'
                                                        className='close'
                                                        //onClick={() => this.handerUpdate()}
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faTimes}
                                                            className='m-1'
                                                            color='red'
                                                        />
                                                    </Button>
                                                </Col>
                                            </Row>
                                            <Row>
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
                                                        />
                                                    </InputGroup>
                                                    <Button
                                                        color='none'
                                                        block
                                                        //onClick={() => this.handerUpdate()}
                                                    >
                                                        <Label>Thêm ảnh cho câu trả lời</Label>
                                                    </Button>
                                                </Col>
                                                <Col xs='1'>
                                                    <Button
                                                        color='none'
                                                        className='close'
                                                        //onClick={() => this.handerUpdate()}
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faTimes}
                                                            className='m-1'
                                                            color='red'
                                                        />
                                                    </Button>
                                                </Col>
                                            </Row>
                                            <Button
                                                block
                                                color='none'
                                                className='load-more mt-2 text-primary font-weight-bold'
                                                //onClick={() => this.handerUpdate()}
                                            >
                                                <FontAwesomeIcon icon={faPlus} /> Thêm câu trả lời
                                            </Button>
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
                        //onClick={() => this.handerUpdate()}
                    >
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
        };
    }
    componentWillMount() {
        const that = this;
        // api.getActivities(1,(err, result)=>{
        //   if(err){
        //     Notification("error", "Error", err);
        //   } else{
        //     console.log(result);

        //       that.setState({
        //         dataTimeline: result,
        //         isLoaderAPI_Activities: true
        //     });
        //   }
        // })
        // api.getInfoProject((err, result)=>{
        //     if(err){
        //       Notification("error", "Error", err);
        //     } else{
        //       that.setState({
        //         dataInfoProject: result,
        //         isLoaderAPI_InfoProject: true});
        //     }
        // })
    }
    render() {
        return (
            <Container fluid className='p-0  h-100'>
                <Row>
                    <Col md='7' xl='8'>
                        <Questions />
                    </Col>
                    <Col md='5' xl='4'>
                        <Information />
                        <Rank />
                    </Col>
                </Row>
            </Container>
        );
    }
}
export default Timeline;
