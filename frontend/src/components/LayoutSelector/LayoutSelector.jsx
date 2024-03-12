import './LayoutSelector.css';
import { TfiLayoutGrid2 } from "react-icons/tfi";
import { TfiLayoutListThumb } from "react-icons/tfi";
import React from 'react';

const LayoutSelector = ({ onChange, selectedLayout }) => {
  return (
    <div class = 'selector'>
      <label>
        <input
          type="radio"
          value="list"
          checked={selectedLayout === 'list'}
          // onChange={() => onChange('list')}
        />
        <div class = 'icon'> <TfiLayoutListThumb/> </div>
      </label>
      <label>
        <input
          type="radio"
          value="grid"
          checked={selectedLayout === 'grid'}
          // onChange={() => onChange('grid')}
        />
        <div class = 'icon'> <TfiLayoutGrid2/> </div>
      </label>
    </div>
  );
};

export default LayoutSelector;
