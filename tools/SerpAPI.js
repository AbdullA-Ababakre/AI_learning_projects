import { SerpAPI } from "langchain/tools";

const SerpAPITool = () => {
  const serpAPI = new SerpAPI(process.env.SERPAPI_API_KEY, {
    baseUrl: "http://localhost:3000/agents",
    location: "Sanfranscio,California,USA",
    hl: "en",
    gl: "us",
  });
  serpAPI.returnDirect = true;

  return serpAPI;
};

export default SerpAPITool;
