import React, { useState } from 'react';

// import { COUNTRIES } from './countries';
 import './tag.scss';
import { WithContext as ReactTags } from 'react-tag-input';

// const suggestions = COUNTRIES.map(country => {
//   return {
//     id: country,
//     text: country
//   };
// });

const KeyCodes = {
  comma: 188,
  enter: 13
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

const TagInput = ({suggestions= [], selectTagValues, showError, errorMessage}) => {

  const [tags, setTags] = React.useState([]);

  const handleDelete = (i) => {
    setTags(tags.filter((tag, index) => index !== i));
    selectTagValues(tags.filter((tag, index) => index !== i));
  };

  const handleAddition = (tag) => {
    setTags([...tags, tag]);
    selectTagValues([...tags, tag]);
  };

  const handleDrag = (tag, currPos, newPos) => {
    const newTags = tags.slice();

    newTags.splice(currPos, 1);
    newTags.splice(newPos, 0, tag);
    // re-render
    setTags(newTags);
    selectTagValues(newTags);
  };

  const handleTagClick = (index) => {
    console.log('The tag at index ' + index + ' was clicked');
  };

  return (
    <div className="tag-input">
      <div>
        <ReactTags
          tags={tags}
          suggestions={suggestions}
          delimiters={delimiters}
          handleDelete={handleDelete}
          handleAddition={handleAddition}
          handleDrag={handleDrag}
          handleTagClick={handleTagClick}
          inputFieldPosition="bottom"
          autocomplete
          placeholder="Type minister names"
        />
      </div>
      {showError && (
          <div className="small w-100 text-left text-danger">
              {errorMessage}
          </div>
      )}
    </div>
  );
};

export default TagInput;