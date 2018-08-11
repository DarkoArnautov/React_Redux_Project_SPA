
export function increment(i) {
  return {
    type: 'INCREMENT_LIKES',
    index: i
  };
}



export function addComment(postId, author, comment) {
  return {
    type: 'ADD_COMMENT',
    postId,
    author, 
    comment 
  };
}

export function removeComment(postId, i){
  return {
    type: 'REMOVE_COMMENT',
    i,
    postId
  };
}
