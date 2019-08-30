
import React, { Component } from "react";
import { EditorState, RichUtils, Modifier } from "draft-js";
import PropTypes from "prop-types";
import { ToolbarButton } from "draftail";


const getSelectedBlock = (editorState) => {
    const selection = editorState.getSelection();
    const contentState = editorState.getCurrentContent();
    const blockStartKey = selection.getStartKey();

    return contentState.getBlockMap().get(blockStartKey);
  }


const fireKey = () => {
    var e = $.Event('keypress');
    e.which = 9;
    $('.foo').val(String.fromCharCode(e.which));
};

//Indent button
class Indent extends Component {
    constructor(props) {
      super(props);

        this.fireKey = this.fireKey.bind(this);
    }

    fireKey() {
        var e = $.Event('keypress');
        e.which = 9;
        $('.foo').val(String.fromCharCode(e.which));
    };


    render() {
        const { getEditorState } = this.props


        return (
        <ToolbarButton
            class = "foo"
            name="INDENT"
            label={'-->|'}
            title={`INDENT`}
            onClick={this.fireKey}
        />
        );
    }

}

Indent.propTypes = {
  getEditorState: PropTypes.func.isRequired,
};

export default Indent;
