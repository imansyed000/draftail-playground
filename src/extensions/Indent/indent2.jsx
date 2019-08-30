
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
  if (editorState) {
    return editorState
    .getCurrentContent()
    .getBlockMap()
    .toList();
  }
  return new List();
}

const increaseAllBlockDepths = (editorState) => {
  const allBlocks = getAllBlocks(editorState)
  if (allBlocks && allBlocks.size > 0) {
    for (let i = 0; i < allBlocks.size; i += 1) {
      let currentBlock = allBlocks.get(i)
      const blockKey = currentBlock.getKey();
      const depth = currentBlock.getDepth();
      const newBlock = currentBlock.set('depth', depth + 1);
      const contentState = editorState.getCurrentContent();
      const blockMap = contentState.getBlockMap();
      const newBlockMap = blockMap.set(blockKey, newBlock);

      return EditorState.push(
        editorState,
        contentState.merge({ blockMap: newBlockMap }),
        'adjust-depth'
      );
    }
  }
}

const increaseBlockDepth = (block, editorState) => {
  const blockKey = block.getKey();
  const depth = block.getDepth();
  const newBlock = block.set('depth', depth + 1);
  const contentState = editorState.getCurrentContent();
  const blockMap = contentState.getBlockMap();
  const newBlockMap = blockMap.set(blockKey, newBlock);

  return EditorState.push(
    editorState,
    contentState.merge({ blockMap: newBlockMap }),
    'adjust-depth'
   );
}

const isValid = (block) => {
  var blockType = block.getType();
  const isListItemBlock = blockType === 'unordered-list-item' || blockType === 'ordered-list-item';
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

        for  (let i = 0; i < allBlocks.size; i+=1) {
            const block = allBlocks.get(i)

            if (isValid(block)) {
            const newEditorState = increaseBlockDepth(block, editorState);
            onChange(newEditorState);
            }
        }


    }

    render() {
        const { getEditorState } = this.props
        const editorState = getEditorState()


        return (
        <ToolbarButton
            name="INDENT"
            label={'==>|'}
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
