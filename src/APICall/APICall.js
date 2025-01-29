import axios from "axios";

export const ApiCall = async (apiUrl, inputParam, methodType = "POST") => {
  let response;
  let dataResponse;
  try {
    if (typeof inputParam == "string") {
      inputParam = JSON.parse(inputParam);
    }

    const stringifyInput =
      typeof inputParam == "object" ? JSON.stringify(inputParam) : inputParam;

    let config = {
      url: apiUrl,
      method: methodType.toString(),
      data: stringifyInput,
    };

    config = {
      ...config,
      headers: {
        "Content-Type": "application/json",
      },
    };

    const startTime = Date.now();
    console.log(`time Startted: ${startTime}`);

    response = await axios(config);

    dataResponse = response.data;

    const endTime = Date.now();
    const seconds = Math.floor((endTime - startTime) / 1000);
    console.log(`API Call Time: ${seconds} seconds `);
  } catch (error) {
    console.log("====================================");
    console.log(`error while calling  Api: ${error}`);
    console.log("====================================");
  }
  return dataResponse;
};
