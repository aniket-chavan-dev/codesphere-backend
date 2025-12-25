export default function parseProblemDescription(description, title) {
  const digitStringArr = ["zero","one","two","three","four","five","six","seven","eight","nine"];

  // Replace digit at start of title with word (e.g., "2 Sum" → "two Sum")
  const code = title.charCodeAt(0);
  if (code >= 48 && code <= 57) {
    let index = code - 48;
    title = title.replace(`${index}`, `${digitStringArr[index]}`);
  }

  const function_name = title.toLowerCase().split(" ").join("_").replace("-", "");
  const descLower = description.toLowerCase();

  // Detect problem type
  let isLinkedList = descLower.includes("linked list") || descLower.includes("listnode");
  let isTree = descLower.includes("binary tree") || descLower.includes("treenode") || descLower.includes("binary search tree");

  // Regex to find Input / Output lines
  const inputRegex = /Input:\s*([^\n]+)/g;
  const outputRegex = /Output:\s*([^\n]+)/g;
  let match, inputs = [], outputs = [];

  while ((match = inputRegex.exec(description)) !== null) inputs.push(match[1].trim());
  while ((match = outputRegex.exec(description)) !== null) {
    const out = match[1].trim();
    if (!/^[A-Za-z]/.test(out)) outputs.push(out);
    else if (/^(true|false|null)$/i.test(out)) outputs.push(out);
  }

  // Extract parameter names from first input
  const firstInput = inputs[0] || "";
  const jsonLike = "{" + firstInput.replace(/(\w+)\s*=/g, '"$1":') + "}";
  let paramsObj;
  try {
    paramsObj = JSON.parse(jsonLike);
  } catch {
    paramsObj = {};
  }
  const parameters = Object.keys(paramsObj);

  // Build the test_cases array
  const testCases = inputs.map((inp, i) => {
    const inputLine = "{" + inp.replace(/(\w+)\s*=/g, '"$1":') + "}";
    let inputObj;
    try {
      inputObj = JSON.parse(inputLine);
    } catch {
      inputObj = {};
    }

    const outStr = (outputs[i] || "").trim();
    let expectedOutput;

    if (outStr.includes("->")) {
      // Linked-list notation: "1->2->3->null"
      expectedOutput = outStr.split("->").map(x => (x.trim().toLowerCase() === "null" ? null : Number(x)));
    } else {
      const lower = outStr.toLowerCase();
      if (lower === "true") expectedOutput = true;
      else if (lower === "false") expectedOutput = false;
      else if (lower === "null") expectedOutput = null;
      else {
        try {
          expectedOutput = JSON.parse(outStr);
        } catch {
          expectedOutput = isNaN(outStr) ? outStr.replace(/['"]/g, "") : Number(outStr);
        }
      }
    }

    return { input: inputObj, expected_output: expectedOutput };
  });

  // Detect if any input array contains null (tree indicator)
  for (const testCase of testCases) {
    const input = testCase.input;
    for (const key in input) {
      const value = input[key];
      if (Array.isArray(value) && value.includes(null)) {
        isTree = true;
      }
    }
  }

  // Determine if conversion is needed (universal)
  let needConvert = false;

  if (isLinkedList) {
    // Convert only if expected output looks like a list/array
    needConvert = testCases.some(tc => Array.isArray(tc.expected_output));
  } else if (isTree) {
    // Convert if description suggests returning a tree or any input array has nulls
    // (and expected_output is an array)
    const hasNullTreeInput = testCases.some(tc =>
      Object.values(tc.input).some(
        val => Array.isArray(val) && val.includes(null)
      )
    );

    needConvert =
      (hasNullTreeInput || /return\s+(the\s+)?root|return\s+tree/.test(descLower)) &&
      testCases.some(tc => Array.isArray(tc.expected_output));
  }

  testCases.map((val) => {
    let output =val.expected_output;
    if(Array.isArray(output)) {
      for(let i = 0; i < output.length ; i++) {
        if(output[i] == null) {
          needConvert = true;
          break;
        }
        needConvert = false;
      }
    }
  })

  return {
    parameters,
    test_cases: testCases,
    is_linkedList: isLinkedList,
    is_tree: isTree,
    need_to_convert_list_tree_to_array: needConvert,
    function_name
  };
}
