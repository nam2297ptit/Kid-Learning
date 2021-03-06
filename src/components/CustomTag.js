import React from "react";
import empty_avatar from "../assets/img/avatars/empty_avatar.png";
import { Input } from "reactstrap";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import utils from "../utils/utils";
import Notification from "./Notification";

const ValidInput = require("../utils/utils");
const randomString = require("../utils/utils").randomString;

export { Notification };

export class CustomImg extends React.Component {
    render() {
        const copyProps = JSON.parse(JSON.stringify(this.props));
        copyProps.src = ValidInput.isEmpty(copyProps.src) ? empty_avatar : copyProps.src;
        return <img {...copyProps} alt='' />;
    }
}

export class SearchBox extends React.Component {
    // eslint-disable-next-line no-useless-constructor
    constructor(props) {
        super(props);
        this.state = {
            id: randomString(20),
        };
    }

    handleGetData(event) {
        if (this.props.mode === "key_enter") {
            if (event.keyCode === 13) {
                this.props.handleGetData(document.getElementById(this.state.id).value);
            }
        } else {
            this.props.handleGetData(document.getElementById(this.state.id).value);
        }
    }

    render() {
        const { placeHolder } = this.props;
        return (
            <div>
                <Input
                    type='search'
                    id={this.state.id}
                    placeholder={placeHolder === undefined ? "Search" : placeHolder}
                    onKeyUp={this.handleGetData.bind(this)}
                />
            </div>
        );
    }
}

let quill_icons = Quill.import("ui/icons");
quill_icons["save"] = '<i class="fa fa-save text-primary" aria-hidden="true"></i>';
quill_icons["close"] = '<i class="fa fa-window-close text-danger" aria-hidden="true"></i>';

export class Description extends React.Component {
    constructor(props) {
        super(props);

        const modules = {
            toolbar: {
                handlers: {
                    save: this.handleSave.bind(this),
                    close: this.handleClose.bind(this),
                },
                container: [
                    [{ header: [1, 2, 3, 4, 5, 6, false] }],
                    ["bold", "italic", "underline", "strike"],
                    [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
                    ["code-block"],
                    ["clean"],
                    [],
                    [],
                    [],
                    [],
                    [],
                    ["save", "close"],
                ],
            },
        };

        this.state = {
            description: "",
            edit: false,
            modules: modules,
        };
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({
            description: utils.returnThisWhenNull(nextProps.description, ""),
        });
    }

    toggle(component) {
        this.setState({
            [component]: !this.state[component],
        });
    }

    handleSave() {
        this.props.handleSave(this.state.description);
        this.toggle("edit");
    }

    handleClose() {
        this.toggle("edit");
    }

    handleChange(value) {
        this.setState({ description: value });
    }

    render() {
        return (
            <>
                {this.state.edit ? (
                    <ReactQuill
                        placeholder='Change description'
                        defaultValue={this.props.description}
                        onChange={this.handleChange.bind(this)}
                        modules={this.state.modules}
                        className='scrollbar-width-1x scrollbar-style-1 '
                    />
                ) : (
                    <div
                        className='overflow-y-20x border min-height-0.5x cursor-pointer scrollbar-style-1 scrollbar-width-1x'
                        onClick={this.toggle.bind(this, "edit")}>
                        <div
                            className='p-2'
                            dangerouslySetInnerHTML={{
                                __html: utils.returnThisWhenNull(
                                    this.props.description,
                                    "Điền nội dung câu hỏi vào đây....",
                                ),
                            }}
                        />
                    </div>
                )}
            </>
        );
    }
}
