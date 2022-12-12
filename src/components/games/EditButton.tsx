import React from "react";

const EditButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <button
      onClick={() => onClick()}
      className="ml-2 h-[1.75rem] w-[1.75rem] rounded-lg bg-blue-600 p-2 transition-colors duration-300 ease-in-out hover:bg-blue-700"
    >
      <svg className="h-[.75rem] w-[.75rem] invert">
        <image href="/edit.svg" className="h-[.75rem] w-[.75rem]" />
      </svg>
    </button>
  );
};

export default EditButton;
