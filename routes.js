const router = require("express").Router();

const {postProfile,getProfiles} = require("./controllers/profile");
const {postTransaction,getTransactions,getTransactionsbyDate} = require("./controllers/transaction");

router.post("/profile",postProfile);
router.get("/profile",getProfiles);

router.post("/transaction",postTransaction);
router.get("/transaction",getTransactions);
router.get("/transactionsByDate",getTransactionsbyDate);
router.post("/",getTransactionsbyDate);

module.exports = router;