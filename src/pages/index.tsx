import * as React from "react";
import { NextPage } from "next";

import Container from "@/components/Container";
import Spinner from "@/components/Spinner";
import Image from "@/components/Image";

const defaultImage = "/images/default-image.png";
const defaultInput = "closeup portrait of eneax as a Harry Potter character";

const Home: NextPage = () => {
  const maxRetries = 20;
  const [input, setInput] = React.useState(defaultInput);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [image, setImage] = React.useState(defaultImage);
  const [retry, setRetry] = React.useState(0);
  const [retryCount, setRetryCount] = React.useState(maxRetries);
  const [finalPrompt, setFinalPrompt] = React.useState("");

  const onUserChangedText = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
  };

  const generateAction = React.useCallback(async () => {
    console.log("Generating...");

    if (isGenerating && retry === 0) return;
    setIsGenerating(true);

    // Check if the user has any retries left
    if (retry > 0) {
      setRetryCount((prevState) => {
        if (prevState === 0) {
          return 0;
        } else {
          return prevState - 1;
        }
      });

      setRetry(0);
    }

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "image/jpeg",
      },
      body: JSON.stringify({ input }),
    });

    const data = await response.json();

    // If the server is busy, retry after the estimated time
    if (response.status === 503) {
      setRetry(data.estimated_time);
      return;
    }

    if (!response.ok) {
      console.log(`Error: ${data.error}`);
      setIsGenerating(false);
      return;
    }

    console.log("Generated!", data);
    setFinalPrompt(input);
    setImage(data.image);
    setIsGenerating(false);
  }, [input, isGenerating, retry]);

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  React.useEffect(() => {
    const runRetry = async () => {
      if (retryCount === 0) {
        console.log(
          `Model still loading after ${maxRetries} retries. Try request again in 5 minutes.`
        );
        setRetryCount(maxRetries);
        return;
      }

      console.log(`Trying again in ${retry} seconds.`);

      await sleep(retry * 1000);
      await generateAction();
    };

    if (retry === 0) return;

    runRetry();
  }, [generateAction, retry, retryCount]);

  return (
    <Container>
      <div className="flex flex-col justify-center items-left border-gray-700 pt-8 pb-16">
        <div className="flex flex-col text-left min-h-screen">
          <div className="w-full mb-8">
            <div className="inline-block relative w-full">
              <textarea
                name="magic-prompt"
                id="magic-prompt"
                cols={30}
                rows={3}
                disabled={isGenerating}
                className="block w-full text-lg px-4 pt-2 pb-14 bg-gray-800 text-primary-50 border rounded-2xl border-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-transparent resize-none"
                value={input}
                onChange={onUserChangedText}
              />

              <div className="absolute bottom-4 right-4 text-right">
                <button
                  className="no-underline font-semibold px-4 py-2.5 rounded-2xl text-black bg-primary-400 hover:bg-primary-400/95 transition duration-300"
                  onClick={generateAction}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <span>
                      <Spinner
                        spinnerColor="text-primary-50"
                        className="inline w-4 h-4 text-white animate-spin"
                      />
                    </span>
                  ) : (
                    <span>Generate</span>
                  )}
                </button>
              </div>
            </div>

            <div className="flex flex-col items-start border-gray-700 my-6">
              <Image
                alt={finalPrompt}
                src={image}
                isGenerating={isGenerating}
              />
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Home;
