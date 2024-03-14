const OpenAI = require('openai');
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const transaction = require("../models/transaction");
const keyword = require("../models/keyword");

exports.askAssistant = (req, res) => {

  const reqBody = req.body;
  console.log(reqBody, "reqBody")
  const content= `가계부 정리 중이야. { title = ${reqBody} }`
  + `9가지 항목 (식비||생활비||통신비||교통비||교육비||주거비||문화생활/여가||경조사||기타)`
  + `중 어디로 들어가야할지 판단해서 title과, category 항목이 key, value로 함께 들어있는 깔끔한 json array형태의 "items"라는 변수명으로 리턴해.`
  + `리턴시 title은 일반적인 검색어로 다시 등록하기 위해 지명, 이름 등은 제외시키고 일반적인 이름 및 띄어쓰기로 리턴한다.`
  + `롯데시네마_위례=>롯데시네마, 커스텀커피광교호수=>커스텀 커피, 지에스25성남성일점=>지에스25, BKR 버거킹 분당수=>BKR 버거킹, 씨유(CU)신대방아너=>씨유 CU 등`
  + `'네이버페이','카카오페이',누군가의 '이름' 등의 항목은 ‘기타’ 항목으로 분류한다.`
  + `리턴시에는 [ 'back-tick*3', '( )', '+' ]등의 기호를 사용하지 않는 Json 객체로 리턴한다.`
  + `ai의 전문성으로 판단을 내려줘. 중요한건 "items" 라는 항목으로 배열을 리턴해야 해`
  console.log(content, "content")

  /** This function retrieves the messages from a thread in ascending order.
   * @param {Thread} thread - The thread to retrieve messages from.
   */
  async function getResponse(thread) {
    const response = await openai.beta.threads.messages.list(thread.id);
    const value = response.data ;

    const calcs = value.map( (element) => {

      if (element.role === "assistant") {
        const text = element.content.map((el)=>{
          console.log(el.text.value)
        })
      }
    })

    return response;
  }

  /** This function creates a new thread. */
  async function createThread() {
      const thread = await openai.beta.threads.create();
      return thread;
  }

  function calc (params) {

    var WordToReg;

    // console.log(params[0].content, "params[0].content")
    if (params[0].role === "assistant") {
      var processing = params[0].content[0].text.value;
      // console.log(JSON.parse(processing),"json parsing")
      // console.log(processing, "processing")
      // if (JSON.stringify(processing).indexOf("[") !== 0 ) {
      //   console.log(processing ,  "processing before", processing.items[0])
      //   const vv = processing.items;
      //   console.log(vv ,  "processing after")
      // }
      // console.log(processing)
      // a = processing.length
      // b = processing.indexOf("]")
      // processing = processing.substr(0, b+1)
      // console.log(processing , "processing")
      c = processing.replace(/`/g, "").replace("```","").replace(/\n/g, "")
      .replace("json","").replace("python","").replace("items=","")
      d = c.replaceAll("title", "word")
      // console.log(d, "d")
      WordToReg = JSON.parse(d)
      console.log(WordToReg)

      } // if

    // console.log(WordToReg , "WordToReg")
    return WordToReg;
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
      { role: "user", content: content }
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

    if (updatedRun.status === "completed") {
      handleUpdate(thread)
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
// handleUpdate(thread);

async function handleUpdate(thread) {
  const response = await openai.beta.threads.messages.list(
    thread.id
    // "thread_P2iqz2SD4VW8Q2qEy1Yi3wHY"
  );

  const value = response.data

  var WordToReg = calc(value);
  console.log(WordToReg, "###### WordToReg ######", typeof(WordToReg))
  
  if( typeof(WordToReg) === "object") {
    WordToReg = WordToReg.items;
    console.log(WordToReg, "ddd")
  }

  // 값 찾아내어 parsing하기
  if (WordToReg !== null) {

      try {

          WordToReg.map( async (element) => {
          console.log(element.word)
          const updateOne = await transaction.updateMany(
              { title: { "$regex" : element.word } }, // filter
              { $set: { category: element.category } } // update
          )

          console.log (updateOne, "###### updateOne ######")
          })

          const insertKeyword = await keyword.insertMany(WordToReg)
          console.log(insertKeyword, "###### create word ######")
          
      } catch (err) {
          console.log(err)
      }
    }
  } // handleUpdate()

}

/** 응답받기 */
exports.getAnswer = async(req, res) => {

  console.log("######### getAnswer ##########")
  async function getMessage() {
    const response = await openai.beta.threads.messages.list(
      thread.id
    );
    const value = response.data
    var result;
    var WordToReg;

    // 값 찾아내어 parsing하기
    const calcs = value.map( (element) => {

      if (element.role === "assistant") {
        const text = element.content.map((el)=>{
          const processing = el.text.value;
          // console.log(processing[1])
          c = processing.replace(/`/g, "").replace("```","").replace(/\n/g, "").replace("json","")
          d = c.replaceAll("title", "word")
          WordToReg = JSON.parse(d)
          result = JSON.parse(c)
          console.log(result , WordToReg.items, "result", "WordToReg.items")
        }) // element.content
      } // if
    }) // value.map

    if (c !== null) {
        try {

          result.items.map( async (element) => {
            const updateOne = await transaction.updateMany(
              { title: /element.title/i },
              {
                $set: { category: element.category }
              })

            console.log (updateOne, "###### updateOne ###### updated:", element.title, "to", element.category)
            })

            const insertKeyword = await keyword.insertMany(WordToReg.items)
            console.log(insertKeyword, "###### create word ######")

        } catch (err) {
            console.log(err)
        }
      }
    }
    
  // res.json(updateOne)
  getMessage()
  
}