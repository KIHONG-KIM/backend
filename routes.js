const router = require("express").Router();

const {postProfile,getProfiles} = require("./controllers/profile");
const {postTransaction,getTransactions,getTransactionsbyDate,getTransactionsByCat, 
    postTransactionUpdate,aggrBar, getAggrbyDate} = require("./controllers/transaction");
const {postKeywords,getKeywords,updateKeywords,deleteKeywords} = require("./controllers/keyword");
const {askAssistant,getAnswer} = require("./controllers/openai");
const {test,testTra,testKey,testDupl,testDel, testDelNot} = require("./controllers/test");

router.get("/profile",getProfiles);
router.post("/profile",postProfile);

router.get("/transaction",getTransactions);
router.get("/transactionsByDate",getTransactionsbyDate);
router.get("/transactionsByCat",getTransactionsByCat);
router.post("/transaction",postTransaction);
router.post("/transactionUpdate",postTransactionUpdate);
router.get("/aggrBar",aggrBar);
router.get("/aggrByDate",getAggrbyDate);

router.get("/keyword",getKeywords);
router.post("/keywordInsert",postKeywords);
router.post("/keywordUpdate",updateKeywords);
router.delete("/keyword",deleteKeywords);

router.post("/assistant",askAssistant);
router.get("/assistant",getAnswer);

router.get("/", test);
router.get("/testtra", testTra);
router.get("/testkey", testKey);
router.get("/testdupl", testDupl);
router.get("/testdel", testDel);
router.get("/testdelnot", testDelNot);

module.exports = router;