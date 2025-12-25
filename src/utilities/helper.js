const getInputArr = (testCases) => {
  let inputArr = [];

  testCases.map((ele) => {
    let arr = [];
    for (const [key, val] of Object.entries(ele.input)) {
      arr.push([key, val]);
    }
    inputArr.push(arr);
  });
  return inputArr;
};

export { getInputArr };
