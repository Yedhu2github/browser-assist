import { CreateMLCEngine } from "@mlc-ai/web-llm";

let engine = null;
let isModelLoaded = false;
const MODEL_ID = "Llama-3.2-1B-Instruct-q4f16_1-MLC";

const initLLM = async () :Promise<void>=> {
  return new Promise(async(resolve,reject)=>{
    engine = await CreateMLCEngine("Llama-3.2-1B-Instruct-q4f16_1-MLC", {
      initProgressCallback: (report) => {
        chrome.runtime.sendMessage({
          type: "MODEL_PROGRESS",
          payload: {
            progress: report.progress, 
            text: report.text, 
          },
        });
      }
    });
    resolve();
  })
};

initLLM();

const summarizeContent = (prompt): Promise<any> => {
  return new Promise((resolve, reject) => {
    engine.chat.completions
      .create({
        messages: [
          {
            role: "system",
            content: `You are a summarizer. You will receive text in Markdown format containing links like [text](url). 
                  Summarize the content concisely and, if a link is highly relevant to the summary, include it as a reference.`,
          },
          { role: "user", content: prompt },
        ],
      })
      .then((data) => resolve(data));
  });
};

const classify = async (text:string): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    engine.chat.completions.create({
     messages: [
        {
          role: "system",
          content: `You are a high-speed web scraper filter. Your goal is to distinguish between high-value information (DATA) and website navigation/junk (NOISE).

### DEFINITIONS
- DATA: Educational content, news stories, product descriptions, or full human sentences.
- NOISE: Login buttons, cookie banners, navigation links, sidebar lists, or copyright footers.

### CLASSIFICATION RULES
1. If the text contains a subject and a verb, it is DATA.
2. If the text is a list of disconnected words (e.g., "Home Contact Blog"), it is NOISE.
3. If the text is a single label (e.g., "Search"), it is NOISE.
4. Output ONLY the word 'DATA' or 'NOISE'.`
        },
        {
          role: "user",
          content: `### EXAMPLES
Input: "The quick brown fox jumps over the lazy dog." -> Output: DATA
Input: "About Us | Careers | FAQ | Help" -> Output: NOISE
Input: "This article explains how to use Chrome extensions to block ads." -> Output: DATA
Input: "Follow us on Twitter, Facebook, and Instagram." -> Output: NOISE

### INPUT TO CLASSIFY
Input: "${text.substring(0, 350)}"
Output:`
        }
      ],
      temperature: 0.0,
      max_tokens: 20,
      top_p: 1.0,
      presence_penalty: 0.0,
      frequency_penalty: 0.0
    }).then(res=>{
      const label = res.choices[0].message.content;
      resolve(label);
    }).catch(err=>{console.log(err)
    })
  });
};

async function runInference(prompt: string) {
  if (!engine) {
    initLLM();
  }
  const completion: any = await summarizeContent(prompt);
  return completion.choices[0].message.content;
}

const loadModel = async () => {
  if (isModelLoaded) return;
  console.log("Loading model weights into GPU...");
  await engine?.reload(MODEL_ID, {
    model_list: [
      {
        model: `https://huggingface.co/mlc-ai/${MODEL_ID}-MLC/resolve/main/`,
        model_id: MODEL_ID,
      },
    ],
  });
  isModelLoaded = true;
};

const unloadModel = async () => {
  if (!engine || !isModelLoaded) return;
  console.log("Unloading model to free VRAM...");
  await engine.unload();
  isModelLoaded = false;
};



chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
 
  if (message.target === "offscreen-ai-engine") {
   
    runInference(message.prompt).then((result) => {
      sendResponse({ answer: result });
    });
  }
  else if(message.target === "classify-text"){
    classify(message.prompt).then(l => {    
      sendResponse({ label: l });
    });
  }
  else if (message.target === "toggle") {
    
    if (message.active) {
      loadModel().then(() => sendResponse({ status: "loaded" }));
    } else {
      unloadModel().then(() => sendResponse({ status: "unloaded" }));
    }
  }

 
  return true; 
});

export default function OffscreenPage() {
  return <div>AI Engine Running...</div>;
}