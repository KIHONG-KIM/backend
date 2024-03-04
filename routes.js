const router = require("express").Router();

const {postProfile,getProfiles} = require("./controllers/profile");
const {postTransaction,getTransactions,getTransactionsbyDate,postTransactionUpadate} = require("./controllers/transaction");
const {postKeywords,getKeywords,test} = require("./controllers/keyword");
const {getAsk,getAnswer} = require("./controllers/openai");

router.post("/profile",postProfile);
router.get("/profile",getProfiles);

router.post("/transaction",postTransaction);
router.get("/transaction",getTransactions);
router.get("/transactionsByDate",getTransactionsbyDate);
router.post("/transactionUpdate",postTransactionUpadate);

router.get("/keyword",getKeywords);
router.post("/keyword",postKeywords);
router.get("/keywordTest",postKeywords);

router.get("/gptAsk",getAsk);
router.get("/gptAnswer",getAnswer);

router.get("/");

module.exports = router;