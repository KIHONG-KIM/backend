const OpenAI = require('openai');
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const Transcation = require("../models/transaction");

exports.askAssistant = (req, res) => {

  console.log(req.body, "req.body")
  const reqBody = req.body;
  const content= `가계부 정리 중이야. 다음 항목을 판단해줘 title = ${reqBody}는 4가지 항목 (식비||생활비||교통비||고정지출) 중 어디로 들어가야할지 판단해서 title과, category 항목이 key, value로 함께 들어있는 json array로 리턴해줘. 리턴시에는 파싱하지 않고 사용할 수 있도록 [ 'back-tick*3', '(\n)', '+' ]등의 기호를 사용하지 않고 깔끔한 Json 객체로 리턴해줘. ai의 전문성으로 판단을 내려줘.`
  console.log(content)

  /** This function retrieves the messages from a thread in ascending order.
   * @param {Thread} thread - The thread to retrieve messages from.
   */
  async function getResponse(thread) {
    const response = await openai.beta.threads.messages.list(thread.id);
    const value = response.data ;

    const calcs = value.map( (element) => {

      if (element.role === "assistant") {
        const text = element.content.map((el)=>{
          const processing = el.text.value;
          // console.log(processing, "processing")
          const c = processing.replace(/`/g, "").replace("```","").replace(/\n/g, "").replaceAll(" ","").replace("json","")
          const d = JSON.parse(c)
          console.log(d, "c")
        })
      }
    })

      // // 답변 표시하기
      // const reply = value.map( (el) => {
      //     if(el.role === "assistant") {
      //     console.log(el.content)
      //     }
      // })

    return response;
  }


  /** This function creates a new thread. */
  async function createThread() {
      const thread = await openai.beta.threads.create();
      return thread;
  }

  let assistant, thread;

  async function main() {

    // 1. assistant
    const assistants = await openai.beta.assistants.list({
      order: "desc",
      limit: "10"
    });
    assistant = assistants.data[0];

    // 2. thread
    thread = await createThread();

    // 3. message
    const message = await openai.beta.threads.messages.create(
      thread.id,
      {
          role: "user",
          content: content
      }
    );

    // 4. run
    const run = await openai.beta.threads.runs.create(
      thread.id,
      { assistant_id: assistant.id }
  );

  const updatedRun = await waitOnRun(run);

  if (updatedRun.status === "requires_action") {
      const toolCall = updatedRun.required_action.submit_tool_outputs.tool_calls[0];
      const name = toolCall.function.name;
      const arguments = JSON.parse(toolCall.function.arguments);

      console.log("Waiting for custom Function:", name);
      console.log("Function arguments:");
      console.log(arguments);

      const task = decideCategory(arguments);

      const finalRun = await openai.beta.threads.runs.submit_tool_outputs(
          thread.id,
          updatedRun.id,
          {
              tool_outputs: [
                  {
                      tool_call_id: toolCall.id,
                      output: "done"
                  }
              ]
          }
      );

      getResponse(thread)
      const response = await waitOnRun(finalRun);
      console.log(await getResponse(thread))
    }

  } // main

  async function waitOnRun(run) {
    /**
     * This function waits for a run to finish.
     * @param {Run} run - The run to wait for.
     */
    while (run.status === "queued" || run.status === "in_progress") {
        run = await openai.beta.threads.runs.retrieve(
            thread.id,
            run.id
        );

        getResponse(thread);
        console.log(run.status);
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    return run;
}

main()

}

exports.getAnswer = async(req, res) => {

  async function getMessage() {
    const response = await openai.beta.threads.messages.list(
      "thread_sZSxupsuvoM4we30cSQDTp6X"
    );
    const value = response.data
    var result;

    // 값 찾아내어 parsing하기


    const calcs = value.map( (element) => {

      if (element.role === "assistant") {
        const text = element.content.map((el)=>{
          const processing = el.text.value;
          // console.log(processing, "processing")
          const c = processing.replace(/`/g, "").replace("```","").replace(/\n/g, "").replaceAll(" ","").replace("json","")
          result = JSON.parse(c)
          console.log(result, "result")
        })
      }
    })

    console.log("### BACKEND post /transactionUpdate, updateOne ###")
    console.log("Trying to updateOne data")

    for ( var i = 0 ; i < result.length ; i ++) {
      console.log(result[i].title, result[i].category)
        try {
            const updateOne = Transcation.updateOne(
                { title: result[i].title }, 
                { category: result[i].category }
            )
            const findOne = Transcation.find({title: result[i].title });
            console.log(findOne.data)
        } catch (err) {
            console.log(err)
        }
    }
    console.log ("### FINISH ###")

    res.json(result)

  }

  getMessage()
}