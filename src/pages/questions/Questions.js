import React from "react";
import { connect } from "react-redux";
import { LoadingSprinner } from "../../components/CustomTag";
import "./Questions.css";
import ListWiki from "./QuestionsList";
import Content from "./content";
import {
    Col,
    Container,
    Row,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Form,
    Navbar,
    NavbarBrand,
    Input,
    Button,
} from "reactstrap";
import Notification from "../../components/Notification";
const api = require("./api/WikiApi");
const utils = require("../../utils/utils");
const ValidInput = require("../../utils/ValidInput");

class Wiki extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            wikiName: "",
            description: null,
            history: [],
            listWiki: [],
            listFile: [],
            isOpenUpload: false,
            isLoadMore: false,
            openDes: false,
            isLoad: true,
            isLoadall: true,
            isLoadListWiki: true,
            isLoadHis: true,
            isLoadFile: false,
            idWiki: null,
            percentage: 0,
            firstWiki: null,
        };
        // this.AddFile = this.AddFile.bind(this);
        this.uploadFiles = this.uploadFiles.bind(this);
        this.getWikiHistory = this.getWikiHistory.bind(this);
        this.getTimeline = this.getTimeline.bind(this);
        this.CreateWiki = this.CreateWiki.bind(this);
        this.DeleteWiki = this.DeleteWiki.bind(this);
        this.EditWiki = this.EditWiki.bind(this);
        this.getWikiHistory = this.getWikiHistory.bind(this);
        this.getListAttachments = this.getListAttachments.bind(this);
        this.DeleteFile = this.DeleteFile.bind(this);
        this.getWiki = this.getWiki.bind(this);
    }
    // Lấy danh sách các Wiki
    getTimeline() {
        this.setState({
            isLoadall: true,
            isLoad: true,
            isLoadListWiki: true,
            isLoadHis: true,
            isLoadFile: false,
        });
        // api.getTimeline((err, result) => {
        //     if (err) {
        //         this.setState({ isLoad: false, isLoadHis: false, isLoadFile: false });

        //         Notification(
        //             "error",
        //             "Error",
        //             err.data === undefined ? err : err.data._error_message,
        //         );
        //         return;
        //     } else {
        //         this.setState({
        //             isLoadall: false,
        //             listWiki: result,
        //             isLoad: false,
        //             isLoadListWiki: false,
        //             isLoadHis: false,
        //             isLoadFile: false,
        //             firstWiki: result[0],
        //         });
        //         if (this.state.listWiki.length === 0) {
        //             this.setState({ isOpen: true });
        //         }
        //         if (this.state.listWiki.length !== 0) {
        //             this.getWiki(this.state.listWiki[0].id);
        //         }
        //     }
        // });
    }

    //Tạo Một Wiki mới
    CreateWiki(e) {
        if (ValidInput.isEmpty(e)) {
            Notification("error", "CreateWiki", "Bạn phải nhập tên wiki");
        } else if (ValidInput.isEmpty(e.trim())) {
            Notification("error", "CreateWiki", "Bạn phải nhập tên wiki");
        } else {
            this.setState({ isLoadListWiki: true });
            api.CreateWiki(e, (err, result) => {
                if (err) {
                    this.setState({ isLoadListWiki: false });
                    this.setState({ isLoad: false });
                    Notification(
                        "error",
                        "Error",
                        err.data === undefined ? err : err.data._error_message,
                    );
                    return;
                } else {
                    var listWiki = utils.copyState(this.state.listWiki);
                    listWiki.push(result);
                    this.setState({
                        isLoadListWiki: false,
                        listWiki: listWiki,
                        firstWiki: result,
                        check: true,
                    });
                    this.getWiki(result.id);
                }
            });
        }
    }

    // Xoa Wiki
    DeleteWiki(e, item) {
        if (
            item.owner.id === this.props.user.id ||
            JSON.parse(sessionStorage.getItem("project")).i_am_admin
        ) {
            this.setState({ isLoadListWiki: true });
            api.DeleteWiki(e, (err, result) => {
                if (err) {
                    this.setState({ isLoadListWiki: false });
                    Notification(
                        "error",
                        "Error",
                        err.data === undefined ? err : err.data._error_message,
                    );
                } else {
                    var listWiki = utils.copyState(this.state.listWiki);
                    var index = this.state.listWiki.indexOf(item);
                    listWiki.splice(index, 1);
                    this.setState({
                        openDes: false,
                        listFile: [],
                        history: [],
                        username: "",
                        wikiName: "",
                        listWiki: listWiki,
                        isLoadMore: false,
                        isLoadListWiki: false,
                        firstWiki: this.state.listWiki[0],
                    });
                    if (this.state.listWiki.length !== 0) {
                        this.getWiki(this.state.listWiki[0].id);
                    } else {
                        this.setState({ isOpen: !this.state.isOpen });
                    }
                    Notification("success", "Delete", "Delete thành công");
                }
            });
        } else {
            Notification("error", "Delete", "Bạn không phải người tạo ra wiki");
        }
    }

    // Chỉnh sửa Description của Wiki
    EditWiki(e) {
        this.setState({ isLoad: true, isLoadHis: true });
        api.EditWikiDes(e, (err, result) => {
            if (err) {
                this.setState({ isLoad: false, isLoadHis: false });
                Notification(
                    "error",
                    "Error",
                    err.data === undefined ? err : err.data._error_message,
                );
                return;
            } else {
                this.setState({
                    description: result.html,
                    isLoad: false,
                    isLoadHis: false,
                });
                this.getWikiHistory(utils.getWikiId());
                let x = {
                    id: result.id,
                    version: result.version,
                };
                sessionStorage.setItem("wiki", JSON.stringify(x));
                Notification("success", "Edit", "Chỉnh sửa mô tả thành công");
                api.getTimeline((err, result) => {
                    if (err) {
                        Notification(
                            "error",
                            "Error",
                            err.data === undefined ? err : err.data._error_message,
                        );
                    } else {
                        this.setState({
                            listWiki: result,
                        });
                    }
                });
            }
        });
    }
    //Lấy Lịch sử của wiki
    getWikiHistory(id) {
        this.setState({ isLoadHis: true });
        api.getWikiHistory(id, (err, result) => {
            if (err) {
                this.setState({ isLoadHis: false });
                Notification(
                    "error",
                    "Error",
                    err.data === undefined ? err : err.data._error_message,
                );
                return;
            } else {
                this.setState({
                    history: result,
                    isLoadHis: false,
                });
            }
        });
    }
    //Lấy list file
    getListAttachments() {
        this.setState({
            isLoadFile: true,
        });
        api.getListAttachments((err, result) => {
            if (err) {
                this.setState({ isLoadFile: false });
                Notification(
                    "error",
                    "Error",
                    err.data === undefined ? err : err.data._error_message,
                );
                return;
            } else {
                this.setState({
                    isOpenUpload: true,
                    listFile: result,
                    isLoadFile: false,
                });
            }
        });
    }
    //Add File
    uploadFiles(file) {
        // console.log( api.Addfile())
        api.Addfile(
            file,
            (err, result) => {
                if (err) {
                    this.setState({ isLoad: false, percentage: 0 });
                    Notification(
                        "error",
                        "Error",
                        err.data === undefined ? err : err.data._error_message,
                    );
                    return;
                } else {
                    var listFile = utils.copyState(this.state.listFile);
                    listFile.push(result);
                    this.setState({ percentage: 0, listFile: listFile });
                    this.getWikiHistory(utils.getWikiId());
                    Notification("success", "Success", "UpLoad thành công");
                }
            },
            process => {
                this.setState({
                    percentage: process,
                });
            },
        );
    }

    //Xóa File
    DeleteFile(id) {
        var listFile = utils.copyState(this.state.listFile);
        listFile.map((val, key) => {
            if (val.id === id) {
                var index = listFile.indexOf(val);
                listFile.splice(index, 1);
            }
            return null;
        });
        this.setState({ isLoadHis: true, isLoadFile: true });
        api.DeleteFile(id, (err, result) => {
            if (err) {
                this.setState({ isLoadHis: false, isLoadFile: false });
                Notification(
                    "error",
                    "Error",
                    err.data === undefined ? err : err.data._error_message,
                );
            } else {
                this.setState({ isLoadHis: false, isLoadFile: false, listFile: listFile });
                Notification("success", "Delete", "Delete thành công");
                this.getWikiHistory(utils.getWikiId());
            }
        });
    }
    getWiki(event) {
        if (event !== this.state.idWiki) {
            this.setState({ isLoadHis: true, isLoadFile: true });
            this.state.listWiki.map((val, key) => {
                if (val.id === event) {
                    let x = {
                        id: val.id,
                        version: val.version,
                    };
                    sessionStorage.setItem("wiki", JSON.stringify(x));
                    this.setState({
                        openDes: true,
                        idWiki: event,
                        username: val.owner.full_name,
                        wikiName: val.subject,
                        isLoadMore: true,
                        description: val.html,
                        firstWiki: val,
                    });
                    this.getWikiHistory(val.id);
                    this.getListAttachments();
                }
                return null;
            });
        }
    }
    toggle = () => {
        this.setState({
            isOpen: !this.state.isOpen,
        });
    };
    isChange = event => {
        this.setState({ nameWikiNo1: event.target.value });
    };
    getValueAddAdmin = () => {
        if (ValidInput.isEmpty(this.state.nameWikiNo1)) {
            Notification("error", "Delete", "Bạn phải nhập tên wiki");
        } else if (ValidInput.isEmpty(this.state.nameWikiNo1.trim())) {
            Notification("error", "Delete", "Bạn phải nhập tên wiki");
        } else {
            this.setState({ isLoadListWiki: true });
            api.CreateWiki(this.state.nameWikiNo1, (err, result) => {
                if (err) {
                    this.setState({ isLoadListWiki: false });
                    this.setState({ isLoad: false });
                    Notification(
                        "error",
                        "Error",
                        err.data === undefined ? err : err.data._error_message,
                    );
                    return;
                } else {
                    var listWiki = utils.copyState(this.state.listWiki);
                    listWiki.push(result);
                    this.setState({
                        isOpen: !this.state.isOpen,
                        isLoadListWiki: false,
                        listWiki: listWiki,
                        firstWiki: result,
                        check: true,
                    });
                    this.getWiki(result.id);
                }
            });
        }
    };
    componentWillMount() {
        this.getTimeline();
    }

    render() {
        console.log(this.props.user);

        return (
            <React.Fragment>
                <Container fluid className='p-0'>
                    <Modal isOpen={this.state.isOpen} toggle={() => this.toggle()} centered>
                        <ModalHeader>Chưa có wiki nào, mời bạn tạo 1 wiki:</ModalHeader>
                        <ModalBody>
                            <div className='m-sm-4'>
                                <Form>
                                    <Input
                                        onChange={event => {
                                            this.isChange(event);
                                        }}
                                    />
                                </Form>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color='success' onClick={() => this.getValueAddAdmin()}>
                                Save changes
                            </Button>
                        </ModalFooter>
                    </Modal>

                    <Row className='Wiki'>
                        <Col md='3' xl='3'>
                            <ListWiki
                                firstWiki={this.state.firstWiki}
                                isLoad={this.state.isLoadListWiki}
                                getWiki={this.getWiki}
                                CreateWiki={this.CreateWiki}
                                listWiki={this.state.listWiki}
                                DeleteWiki={this.DeleteWiki}
                            />
                        </Col>
                        <Col md='9' xl='9'>
                            <Content
                                progress={this.state.percentage}
                                isLoadFile={this.state.isLoadFile}
                                isLoadHis={this.state.isLoadHis}
                                isLoad={this.state.isLoad}
                                openDes={this.state.openDes}
                                isLoadMore={this.state.isLoadMore}
                                isOpenUpload={this.state.isOpenUpload}
                                listFile={this.state.listFile}
                                DeleteFile={this.DeleteFile}
                                AddFile={this.uploadFiles}
                                wikiName={this.state.wikiName}
                                username={this.state.username}
                                description={this.state.description}
                                history={this.state.history}
                                EditWiki={this.EditWiki}
                            />
                        </Col>
                    </Row>
                </Container>
            </React.Fragment>
        );
    }
}
export default connect(store => ({
    app: store.app,
    user: store.user,
}))(Wiki);
