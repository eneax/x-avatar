import { NextApiRequest, NextApiResponse } from "next";

const bufferToBase64 = (buffer: Buffer) => {
  const base64 = buffer.toString("base64");
  return `data:image/png;base64,${base64}`;
};

const generateAction = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log("Received request");

  const input = JSON.parse(req.body).input;

  const response = await fetch(
    `https://api-inference.huggingface.co/models/${process.env.HUGGING_FACE_USERNAME}/${process.env.HUGGING_FACE_MODEL_NAME}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.HUGGING_FACE_AUTH_KEY}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        inputs: input,
      }),
    }
  );

  if (response.ok) {
    const buffer = await response.arrayBuffer();
    const base64 = bufferToBase64(Buffer.from(buffer));
    res.status(200).json({ image: base64 });
  } else if (response.status === 503) {
    const json = await response.json();
    res.status(503).json(json);
  } else {
    const json = await response.json();
    console.error(json);
    res.status(response.status).json({ error: response.statusText });
  }
};

export default generateAction;
