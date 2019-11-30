import React, { Component } from "react";
import { Button, Card, CardBody, Media, Row, Col } from "reactstrap";
import Notification from "../../../components/Notification";
import "../Configuration.css";
import LoadingSprinner from "../../../components/LoadingSprinner";
import { CustomImg } from "../../../components/CustomTag";
import { Link, ArrowRight } from "react-feather";
import moment from "moment";
import { connect } from "react-redux";
import { isEmpty } from "../../../utils/ValidInput";

const api = require("../api/api");
// const apiProject = require("../../project/api/api");

class Timeline extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            maxLoad: 10,
            wikiChangeID: null,
        };
        this.convertDateTime = this.convertDateTime.bind(this);
    }
    loadMore() {
        this.setState({ maxLoad: this.state.maxLoad + 10 });
    }
    componentDidMount() {
        const { user, id } = this.props;
        this.setState({ loadApiGetTimeline: false });
        // api.getTimeline(user.user.id, id, (err, result) => {
        //     if (err) {
        //         console.log("getTimeLine error");
        //         Notification(
        //             "error",
        //             "Error",
        //             err.data === undefined ? err : err.data._error_message,
        //         );
        //     } else {
        //         this.setState({ data: result, loadApiGetTimeline: true });
        //     }
        // });
    }
    wikiChangeMore(id) {
        this.setState({
            wikiChangeID: id,
        });
    }
    wikiChangeLess() {
        this.setState({
            wikiChangeID: null,
        });
    }
    handleSelectProject(id, type, idCustom) {
        // apiProject.getInfoProject(id, (err, result) => {
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
        //         if (type === "timeline") window.location.replace("/project/work");
        //         else if (type === "work") window.location.replace("/project/work?id=" + idCustom);
        //         else if (type === "task")
        //             window.location.replace("/project/work/task?id=" + idCustom);
        //         else if (type === "wiki") window.location.replace("/project/wiki");
        //         else if (type === "issue") window.location.replace("/project/issue?id=" + idCustom);
        //         else if (type === "epic") window.location.replace("/project/epic");
        //         else if (type === "members") window.location.replace("/project/clients");
        //     }
        // });
    }
    //title of time occur event
    convertDateTime(date, getFullTime) {
        let convertdate = new Date(date);
        let date_year = convertdate.getFullYear();
        let date_month = convertdate.getMonth() + 1;
        let date_date = convertdate.getDate();
        if (date_month < 10) date_month = "0" + date_month;
        if (date_date < 10) date_date = "0" + date_date;
        let _date = `${date_date}-${date_month}-${date_year}`;
        let _time = `${convertdate.toLocaleTimeString().substr(0, 5)}`;
        return getFullTime ? `${_time} ${_date}` : _date;
    }

    render() {
        const idUser = this.props.user.user.id;
        return (
            <div>
                <Card>
                    <CardBody className='tiles mb-4' aria-live='polite'>
                        {this.state.data === "No Content"
                            ? this.state.data
                            : this.state.data.slice(0, this.state.maxLoad).map((data, index) => {
                                  return (
                                      <div key={index}>
                                          <Media>
                                              {/* avatar */}
                                              <Media
                                                  left
                                                  href={
                                                      data.data.user.id !== idUser
                                                          ? `?email=${data.data.user.email}`
                                                          : window.location.pathname
                                                  }>
                                                  <CustomImg
                                                      src={data.data.user.photo}
                                                      className='rounded-circle mr-2 img--user--square-3x'
                                                      title={data.data.user.full_name}
                                                      alt='Avatar'
                                                  />
                                              </Media>
                                              {/* body */}
                                              <Media body>
                                                  {/* content */}
                                                  <div className='float-left Profile__width_88'>
                                                      <Media>{this.renderHeaderEvent(data)}</Media>
                                                  </div>
                                                  {/* time */}
                                                  <div
                                                      className='float-right'
                                                      title={this.convertDateTime(
                                                          data.created_date,
                                                          true,
                                                      )}>
                                                      {moment(data.created_date).fromNow()}
                                                  </div>
                                              </Media>
                                          </Media>
                                          <div className='Profile__marginleft_58px_toRem'>
                                              {this.renderFooterEvent(data)}
                                          </div>
                                          <hr />
                                      </div>
                                  );
                              })}
                        {this.state.maxLoad < this.state.data.length && (
                            <Button
                                block
                                color='primary'
                                className='load-more'
                                onClick={this.loadMore.bind(this)}>
                                Load More
                            </Button>
                        )}
                    </CardBody>
                </Card>
            </div>
        );
    }
}
export default connect(store => ({
    user: store.user,
}))(Timeline);

//content below the header of the events
class DetailTimeline extends Component {
    render() {
        const props = this.props;
        const domainFile = "http://fback.tinasoft.com.vn:3001/static/media/";
        const extention_img = ["png", "jpg", "gif", "tiff", "bmp"];
        return props.type === "create" ? ( //event create a project, work, ...   //description
            <div>
                <blockquote className='Profile__quote'>{props.description}</blockquote>
            </div>
        ) : props.type === "new" ? ( //event create a new attachment       //content, href
            <div>
                <blockquote className='Profile__quote'>
                    {extention_img.includes(
                        props.href.split(".")[props.href.split(".").length - 1].toLowerCase(),
                    ) ? (
                        //if the file as a image -> show preview image
                        <a
                            title={`See ${props.content}`}
                            target='_blank'
                            rel='noopener noreferrer'
                            href={domainFile + props.href}>
                            <img
                                className='Profile__size-imgfile-timeline'
                                src={domainFile + props.href}
                            />
                        </a>
                    ) : (
                        //if not -> show file name
                        <a
                            target='_blank'
                            rel='noopener noreferrer'
                            download
                            href={domainFile + props.href}>
                            <Link size='2%' />
                            {props.content}
                        </a>
                    )}
                </blockquote>
            </div>
        ) : props.type === "delete" ? ( //event delete a attachment           //content
            <div>
                <blockquote className='Profile__quote'>
                    <del style={{ background: "#ffe6e6" }}>
                        <Link size='2%' />
                        {props.content}
                    </del>
                </blockquote>
            </div>
        ) : props.type === "user" ? ( //event relative to a user            //id, idUser, email, photo, full_name, role
            <div>
                <blockquote className='Profile__quote'>
                    <Row>
                        <div className='float-left'>
                            <Media
                                left
                                href={
                                    props.id !== props.idUser
                                        ? `?email=${props.email}`
                                        : window.location.pathname
                                }>
                                <CustomImg
                                    src={props.photo}
                                    className='rounded-circle mr-2 img--user--square-3x'
                                    title={props.full_name}
                                    alt='Avatar'
                                />
                            </Media>
                        </div>
                        <div>
                            <Media heading>
                                <a
                                    title={props.full_name}
                                    href={
                                        props.id !== props.idUser
                                            ? `?email=${props.email}`
                                            : window.location.pathname
                                    }>
                                    {props.full_name}
                                </a>
                            </Media>
                            <Media>
                                <del style={{ background: "#ffe6e6" }}>{props.previous}</del>
                                {props.previous && <ArrowRight size='5%' />}
                                <ins style={{ background: "#e6ffe6" }}>{props.next}</ins>
                            </Media>
                        </div>
                    </Row>
                </blockquote>
            </div>
        ) : props.type === "change_attr" ? (
            <div>
                <blockquote className='Profile__quote'>
                    <div className='position-relative'>
                        <div className='float-left' style={{ background: "#ffe6e6" }}>
                            <del dangerouslySetInnerHTML={{ __html: props.previous }} />
                        </div>
                        <ArrowRight className='float-left' size='2%' />
                        <div className='float-left' style={{ background: "#e6ffe6" }}>
                            <ins dangerouslySetInnerHTML={{ __html: props.next }} />
                        </div>
                        <div className='clearfix'></div>
                    </div>
                </blockquote>
            </div>
        ) : null;
    }
}
