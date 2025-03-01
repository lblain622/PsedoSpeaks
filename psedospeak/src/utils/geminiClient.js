import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyBA8Dj4xZ2tLlcK9jZtvkjpf_qMZLKGp6U"; 
const genAI = new GoogleGenerativeAI(API_KEY);

export async function uploadAndProcessAudio(file) {
  try {
    const fileData = await readFileAsBase64(file);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent([
      "The user will provide a requirement in the form of audio. Your task is to analyze it and generate a solution in pseudocode. " +
      "Do not write actual code, but rather a high-level pseudocode that represents the logic of the solution." +
      "If the the context is not code, or coding ,notify the use the you cannot answer this and say \"This is not revevant\"",

      {
        inlineData: {
          data: fileData,
          mimeType: file.type,
        },
      },
    ]);

    return result.response.text();
  } catch (error) {
    console.error("Error processing the audio file:", error);
    throw error;
  }
}

function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64Data = reader.result.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = (error) => reject(error);
  });
}
