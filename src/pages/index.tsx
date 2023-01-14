import * as React from "react";
import { NextPage } from "next";

import Container from "@/components/Container";
import Spinner from "@/components/Spinner";

const defaultUserInput =
  "closeup portrait of eneax as a Harry Potter character";

const Home: NextPage = () => {
  const [userInput, setUserInput] = React.useState(defaultUserInput);
  const [isGenerating, setIsGenerating] = React.useState(false);

  const callGenerateEndpoint = async () => {
    console.log("Generating...");
  };

  const onUserChangedText = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserInput(event.target.value);
  };

  return (
    <Container>
      <div className="flex flex-col justify-center items-left border-gray-700 py-16">
        <div className="flex flex-col text-left min-h-screen">
          <div className="w-full mb-8">
            <textarea
              name="magic-prompt"
              id="magic-prompt"
              cols={30}
              rows={5}
              disabled={isGenerating}
              className="block w-full text-lg px-4 py-2 bg-gray-800 text-primary-50 border rounded-2xl border-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-transparent resize-none"
              value={userInput}
              onChange={onUserChangedText}
            />

            <div className="flex flex-col items-start border-gray-700 mt-6">
              <button
                className="no-underline font-semibold px-4 py-2.5 rounded-2xl text-black bg-primary-400 hover:bg-primary-400/95 transition duration-300"
                onClick={callGenerateEndpoint}
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
        </div>
      </div>
    </Container>
  );
};

export default Home;
