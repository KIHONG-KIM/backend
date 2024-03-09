const router = require("express").Router();

const {postProfile,getProfiles} = require("./controllers/profile");
const {postTransaction,getTransactions,getTransactionsbyDate,getTransactionsByCat,postTransactionUpadate} = require("./controllers/transaction");
const {postKeywords,getKeywords,test} = require("./controllers/keyword");
const {askAssistant,getAnswer} = require("./controllers/openai");

router.get("/profile",getProfiles);
router.post("/profile",postProfile);

router.get("/transaction",getTransactions);
router.get("/transactionsByDate",getTransactionsbyDate);
router.get("/transactionsByCat",getTransactionsByCat);
router.post("/transaction",postTransaction);
router.post("/transactionUpdate",postTransactionUpadate);

router.get("/keyword",getKeywords);
router.post("/keyword",postKeywords);

router.post("/assistant",askAssistant);
router.get("/assistant",getAnswer);

router.get("/", getTransactions);

module.exports = router;