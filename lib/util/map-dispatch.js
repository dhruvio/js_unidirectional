"use strict";

export default (parentMessage, parentDispatch) => (childMessage, childData) => {
  if (childMessage[0] === "@")
    parentDispatch(childMessage, childData);
  else
    parentDispatch(parentMessage, {
      message: childMessage,
      data: childData
    });
};

