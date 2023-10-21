// /pages/api/transcript.js
import { YoutubeTranscript } from "youtube-transcript";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { CharacterTextSplitter } from "langchain/text_splitter";
import { OpenAI } from "langchain";

// Global variables
let chain;
let chatHistory = [];

// DO THIS SECOND
const initializeChain = async (initialPrompt, transcript) => {
  try {
    const model = new ChatOpenAI({
      temperature: 0.8,
      modelName: "gpt-3.5-turbo",
    });

    const vectorStore = await HNSWLib.fromDocuments(
      [{ pageContent: transcript }],
      new OpenAIEmbeddings()
    );
    const directory = "/Users/abdullaababakre/Desktop/openai-javascript-course";
    await vectorStore.save(directory);

    chain = ConversationalRetrievalQAChain.fromLLM(
      model,
      vectorStore.asRetriever(),
      { verbose: true } // Add verbose option here
    );

    const response = await chain.call({
      question: initialPrompt,
      chat_history: chatHistory,
    });

    chatHistory.push({
      role: "assistant",
      content: response.text,
    });

    return response;
  } catch (error) {
    console.error(error);
  }
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    // DO THIS FIRST
    const { prompt, firstMsg } = req.body;

    // Then if it's the first message, we want to initialize the chain, since it doesn't exist yet
    if (firstMsg) {
      try {
        const initialPrompt =
          "please give me a summary of the transcript: ${prompt}";
        chatHistory.push({
          role: "user",
          content: initialPrompt,
        });

        const transcriptResponse = await YoutubeTranscript.fetchTranscript(
          prompt
        );
        if (!transcriptResponse) {
          return res.status(400).json({ error: "Failed to get transcript" });
        }
        let transcript = "";
        transcriptResponse.forEach((line) => {
          transcript += line.text + " ";
        });
        const response = await initializeChain(initialPrompt, transcript);

        // And then we'll jsut get the response back and the chatHistory
        return res.status(200).json({ output: response, chatHistory });
      } catch (err) {
        console.error(err);
        return res
          .status(500)
          .json({ error: "An error occurred while fetching transcript" });
      }

      // do this third!
    } else {
      // If it's not the first message, we can chat with the bot
      try {
        chatHistory.push(({
          role:"user",
          content: prompt
        }));

        const response = await chain.call({
           question:prompt,
           chat_history: chatHistory
        });

        chatHistory.push({
          role:"assistant",
          content:response.text
        })

        return res.status(200).json({ output: response, chatHistory });
      } catch (error) {
        // Generic error handling
        console.error(error);
        res
          .status(500)
          .json({ error: "An error occurred during the conversation." });
      }
    }
  }
}
