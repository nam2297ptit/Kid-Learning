import React from "react";
import "../WorkDetail.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
    Container,
    Row,
    Col,
    Card,
    CardHeader,
    CardTitle,
    CardBody,
    CardSubtitle,
    Table,
    Input,
    Button,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    FormGroup,
    Label,
    Progress,
} from "reactstrap";

import { ModalAssignUser } from "../../../../components/Modal";
import { CustomImg, Notification } from "../../../../components/CustomTag";
import { stringTypeAnnotation } from "@babel/types";
import { faPen, faSave, faPlus, faAngleDown, faAngleRight, faTrash } from "@fortawesome/free-solid-svg-icons";
import { PlusCircle, MoreHorizontal, Trash, Save, EditRounded } from "react-feather";
const api = require("../api/api");
const utils = require("../../../../utils/utils");
let memberInProject = [];

const work_id = window.location.search
    .slice(1)
    .split("&")
    .map(p => p.split("="))
    .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {}).id;

class WorkInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    toggle(component) {
        this.setState({
            [component]: !this.state[component],
        });
    }

    render() {
        return <React.Fragment></React.Fragment>;
    }
}

export default WorkInfo;
