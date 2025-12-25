import api from "./api";

const runPublicTestCases = async (code, payload,problem_id,url) => {
  console.log(payload,"payload")
  try {
    const res = await api.post(url, {
      code,
      payload,
      id : problem_id
    });
    if (res.status == 200) {
      const data = res.data;
      return data;
    } else if (res.status == 502) {
      let res_data = {
        result: {
          error: res.data.response_text,
          output: [],
          execution_time: 0,
          memory_used: 0,
        },
        test_cases: res.data.test_cases,
      };
      return res_data;
    }
  } catch (error) {
    return null;
  }
};

export default runPublicTestCases;
