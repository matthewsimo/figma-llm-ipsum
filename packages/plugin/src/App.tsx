import { useCallback, useEffect, useState } from "react";
import { UIPostMessage, postToFigma } from "./common/msg";
import { useAppState, useDispatch, useFigmaData } from "./hooks/appContext";
import { LogData, LogElement } from "./components/logger";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Header from "./components/header";

type ResultType =
  | "words"
  | "sentences"
  | "paragraphs"
  | "list-items-num"
  | "list-items-bullet";

type ResultTypePrompt = Record<ResultType, string>;
const resultTypePrompts: ResultTypePrompt = {
  words: "words",
  sentences: "sentences",
  paragraphs: "paragraphs",
  "list-items-num": "numbered list items",
  "list-items-bullet": "bulleted list items",
};

function App() {
  const dispatch = useDispatch();

  const { initialized } = useAppState();
  const data = useFigmaData();

  const handleMessage = useCallback(
    (msg: UIPostMessage) => {
      true && console.log({ handleMessage: true, msg });

      dispatch({
        type: "UPDATE_FIGMA_DATA",
        payload: {
          ...msg.data.pluginMessage,
        },
      });

      dispatch({
        type: "SET_LOADING",
        payload: {
          isLoading: false,
        },
      });

      if (!initialized) {
        dispatch({
          type: "SET_INITIALIZED",
        });
      }
    },
    [dispatch, initialized]
  );

  useEffect(() => {
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [handleMessage]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<null | string>(null);
  const [response, setResponse] = useState<null | string>(null);
  const [system, setSystem] = useState<string>(
    "You take specific instructions on the amount of text to generate and generate the single best option. You only respond with the generated text and do not add any other text or information. Do not acknowledge the question, only respond with your answer. You are an expert copywriter, your generated text has a warm and engaging but professional tone."
  );
  const [prompt, setPrompt] = useState<string>(
    "Write copy for the introduction section for the website of a fashionable hat shop"
  );
  const [number, setNumber] = useState(3);
  const [type, setType] = useState<ResultType>("sentences");

  const getMessages = () => {
    const messages = [
      {
        role: "system",
        content: `${system}

Respond in JSON format with the following structure:
{ content: "Example text" }`,
      },
      {
        role: "user",
        content: `${prompt}

Your generated text should consist of exactly ${number} ${resultTypePrompts[type]}.
`,
      },
    ];
    return response
      ? messages.concat([
          {
            role: "assistant",
            content: JSON.stringify({ content: response }),
          },
          {
            role: "user",
            content: "Please try again",
          },
        ])
      : messages;
  };

  const handleSubmit = async () => {
    const messages = getMessages();

    console.log({
      messages,
      number,
      type,
      prompt,
      system,
    });

    setIsLoading(true);
    setResponse(null);
    setError(null);

    const r = await fetch("http://localhost:8787", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages,
      }),
    });

    const resp = await r.json();
    if (resp.content) {
      setResponse(resp.content);
    } else {
      setError("Some network error");
    }
    console.log({ resp });

    setIsLoading(false);
  };

  const handleAdd = async () => {
    postToFigma({ type: "create", payload: { content: response } });
  };

  const handleReset = () => {
    setIsLoading(false);
    setResponse(null);
    setError(null);
  };

  return (
    <LogElement>
      <main className="space-y-4 p-4">
        <Header system={system} setSystem={setSystem} />

        <div className="space-y-4">
          <div className="flex flex-row gap-4">
            <Input
              className="w-1/2"
              type="number"
              value={number}
              onChange={(e) => setNumber(parseInt(e.target.value))}
              min="1"
              max="9"
              step="1"
            />
            <Select
              value={type}
              onValueChange={(v) => setType(v as ResultType)}
            >
              <SelectTrigger className="w-1/2">
                <SelectValue placeholder="Type of output" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="words">Words</SelectItem>
                <SelectItem value="sentences">Sentences</SelectItem>
                <SelectItem value="paragraphs">Paragraphs</SelectItem>
                <SelectItem value="list-items-num">
                  Numbered List Items
                </SelectItem>
                <SelectItem value="list-items-bullet">
                  Bullet List Items
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col space-y-4 mb-12 items-end">
            <Textarea
              placeholder="Prompt goes here.."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            {!response && (
              <Button
                disabled={isLoading}
                onClick={() => handleSubmit()}
                className="w-fit"
              >
                {isLoading ? "Loading" : "Generate"}
              </Button>
            )}
          </div>
        </div>

        {error && (
          <div>
            <div className="flex flex-col space-y-4 mb-12 items-end">
              <p className="font-mono w-full">{error}</p>
            </div>
          </div>
        )}

        {response && (
          <div>
            <div className="flex flex-col space-y-4 mb-12 items-end">
              <p className="font-mono w-full">{response}</p>
              <div className="flex flex-row justify-between w-full">
                <Button
                  className="justify-self-start"
                  disabled={isLoading}
                  onClick={() => handleReset()}
                  variant="destructive"
                >
                  Reset
                </Button>
                <div className="space-x-4 ">
                  <Button
                    disabled={isLoading}
                    onClick={() => handleSubmit()}
                    variant="outline"
                  >
                    Try again
                  </Button>
                  <Button onClick={() => handleAdd()}>Add Text</Button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* <div>
          <LogData data={data} />
        </div> */}
      </main>
    </LogElement>
  );
}

export default App;
