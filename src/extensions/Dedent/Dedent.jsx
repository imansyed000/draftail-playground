
import React, { Component } from "react";
import { EditorState, RichUtils } from "draft-js";
import PropTypes from "prop-types";
import { ToolbarButton } from "draftail";


const getSelectedBlock = (editorState) => {
  const selection = editorState.getSelection();
  const contentState = editorState.getCurrentContent();
  const blockStartKey = selection.getStartKey();

  return contentState.getBlockMap().get(blockStartKey);
}

const isValid = (block) => {
  var blockType = block.getType();
  const isListItemBlock = blockType === 'unordered-list-item' || blockType === 'ordered-list-item';
  const isIndentableBlock = block.getDepth() >= 1 && block.getDepth() <= 4;
  const isValidBlock = isListItemBlock && isIndentableBlock

    return isValidBlock
}


const increaseBlockDepth = (block, editorState) => {
  const blockKey = block.getKey();
  const depth = block.getDepth();
  const newBlock = block.set('depth', depth - 1);
  const contentState = editorState.getCurrentContent();
  const blockMap = contentState.getBlockMap();
  const newBlockMap = blockMap.set(blockKey, newBlock);

  return EditorState.push(
    editorState,
    contentState.merge({ blockMap: newBlockMap }),
    'adjust-depth'
   );
}


//Dedent button
class Dedent extends Component {
    constructor(props) {
      super(props);

        this.onClick = this.onClick.bind(this);
    }

    onClick() {
        const { getEditorState, onChange } = this.props
        const editorState = getEditorState()
        const block = getSelectedBlock(editorState);

        if (isValid(block)) {
          const newEditorState = increaseBlockDepth(block, editorState);
          onChange(newEditorState);
        }


    }

    render() {
        const { getEditorState } = this.props
        const editorState = getEditorState()
        // const block = getSelectedBlock(editorState)


        return (
        <ToolbarButton
            name="DEDENT"
            label={'|<=='}
            title={`DEDENT`}
            onClick={this.onClick}
        />
        );
    }

}

Dedent.propTypes = {
  getEditorState: PropTypes.func.isRequired,
};

export default Dedent;
