
import React, { Component } from "react";
import { EditorState, RichUtils } from "draft-js";
import PropTypes from "prop-types";
import { ToolbarButton } from "draftail";
import { all } from "q";


const getSelectedBlock = (editorState) => {
  const selection = editorState.getSelection();
  const contentState = editorState.getCurrentContent();
  const blockStartKey = selection.getStartKey();

  return contentState.getBlockMap().get(blockStartKey);
}

const getAllBlocks = (editorState) => {
    const allBlocks = editorState
    .getCurrentContent()
    .getBlockMap()
    .toList()
    return allBlocks
}

const increaseBlockDepth = (block, editorState) => {
  const blockKey = block.getKey();
  const depth = block.getDepth();
  const newBlock = block.set('depth', depth + 1);
  const contentState = editorState.getCurrentContent();
  const blockMap = contentState.getBlockMap();
  const newBlockMap = blockMap.set(blockKey, newBlock);

  return EditorState.moveSelectionToEnd(
    EditorState.push(
      editorState,
      contentState.merge({ blockMap: newBlockMap }),
      'adjust-depth'
    )
  );
}

const isValid = (block) => {
  var blockType = block.getType();
  const isListItemBlock = blockType.endsWith("-list-item");
  const isIndentableBlock = block.getDepth() >= 0 && block.getDepth() <= 3;
  const isValidBlock = isListItemBlock && isIndentableBlock

    return isValidBlock
}



//Indent button
class Indent extends Component {
    constructor(props) {
      super(props);

        this.onClick = this.onClick.bind(this);
    }

    onClick() {
        const { getEditorState, onChange } = this.props
        const editorState = getEditorState()
        const allBlocks = getAllBlocks(editorState)

        let newEditorState = editorState;
        for  (let i = 0; i < allBlocks.size; i+=1) {
            const block = allBlocks.get(i)

            if (isValid(block)) {
            newEditorState = increaseBlockDepth(block, newEditorState);
          }
        }

        if (newEditorState !== editorState) {
          onChange(newEditorState);
        }
    }

    render() {
        const { getEditorState } = this.props


        return (
        <ToolbarButton
            name="INDENT"
            label={'-->|'}
            title={`INDENT`}
            onClick={this.onClick}
        />
        );
    }

}

Indent.propTypes = {
  getEditorState: PropTypes.func.isRequired,
};

export default Indent;
