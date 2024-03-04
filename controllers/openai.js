const OpenAI = require('openai');
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


exports.getAsk = () => {

    async function main() {

        const assistant_id = "asst_dWzY54dGBv91b4rudTiCrrCP";
      
        const thread = await openai.beta.threads.create();
        
        const message = await openai.beta.threads.messages.create(
            thread.id,
            {
              role: "user",
              content: "Explain deep learning to a 5 year old."
            }
          );
        
        const run = await openai.beta.threads.runs.create(
          thread.id,
          {
            assistant_id: assistant_id,
            model: "gpt-4-turbo-preview",
            instructions: "New instructions that override the Assistant instructions",
            tools: [{"type": "code_interpreter"}, {"type": "retrieval"}]
          }
        );

      }

      main()
}


exports.getAnswer = async() => {
    const messages = await openai.beta.threads.messages.list(
        thread.id
      );
    console.log(messages)
}