import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyBA8Dj4xZ2tLlcK9jZtvkjpf_qMZLKGp6U";
const genAI = new GoogleGenerativeAI(API_KEY);



export default {
  async fetch(req) {
    const url = new URL(req.url);
    const { pathname } = url;

    if (req.method === "POST" && pathname === "/process-audio") {
      try {
        // Handle the form data (audio file)
        const formData = await req.formData();
        const file = formData.get("audio");

        if (!file) {
          return new Response(JSON.stringify({ error: "No file uploaded" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

        const fileBuffer = Buffer.from(await file.arrayBuffer());
        const fileData = fileBuffer.toString("base64");

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Prompt for the generative AI model
        const result = await model.generateContent([
          "Analyze the provided audio file and extract its content. First, summarize its main idea in a short sentence labeled as 'input'. Then, determine if the content is related to coding or programming. If it is, generate a high-level pseudocode solution labeled as 'output', ensuring it follows this exact structure:\n\n```\nBEGIN\n  [Describe the first step]\n  [Describe the second step]\n  IF [condition] THEN\n    [Action if true]\n  ELSE\n    [Action if false]\n  ENDIF\nEND\n```\n\nIdentify and list all variable names separately under 'variables'. Lastly, provide a brief constructive 'feedback' on the pseudocode. If the content is not related to coding or programming, return 'This is not relevant' as the output.",
          {
            inlineData: {
              data: fileData,
              mimeType: file.type,
            },
          },
        ]);

        const geminiOutput = result.response.text();

        // Extract the relevant parts of the AI's response
        const inputMatch = geminiOutput.match(/\*\*input:\*\* (.+)/);
        const outputMatch = geminiOutput.match(/\*\*output:\*\*\n([\s\S]+?)\n\n\*\*variables:/);
        const variablesMatch = geminiOutput.match(/\*\*variables:\*\*\n([\s\S]+?)\n\n\*\*feedback:/);
        const feedbackMatch = geminiOutput.match(/\*\*feedback:\*\*\n([\s\S]+)/);

        const extractedInput = inputMatch ? inputMatch[1].trim() : "No description available";
        const extractedOutput = outputMatch ? outputMatch[1].trim() : "No pseudocode generated";
        const extractedFeedback = feedbackMatch ? feedbackMatch[1].trim() : "No feedback available";

        let extractedVariables = [];
        if (variablesMatch) {
          extractedVariables = variablesMatch[1]
              .split("\n")
              .map((v) => v.trim())
              .filter((v) => v !== "");
        }

        const jsonData = {
          input: extractedInput,
          output: extractedOutput,
          variables: extractedVariables,
          feedback: extractedFeedback,
        };

        // Save the result to Cloudflare KV
        await PS.put("geminiResponse", JSON.stringify(jsonData));

        return new Response(
            JSON.stringify({ message: "Processed successfully", response: jsonData }),
            {
              status: 200,
              headers: { "Content-Type": "application/json" },
            }
        );
      } catch (error) {
        console.error("Error processing the request:", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    if (req.method === "GET" && pathname === "/get-response") {
      try {
        // Retrieve the saved response from KV
        const data = await PS.get("geminiResponse");
        if (data) {
          return new Response(data, {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } else {
          return new Response(JSON.stringify({ error: "No data available" }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
          });
        }
      } catch (error) {
        return new Response(JSON.stringify({ error: "Internal server error" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    return new Response("Not Found", { status: 404 });
  },
};
