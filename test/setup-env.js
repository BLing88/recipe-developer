import "core-js/stable";
import "regenerator-runtime/runtime";

const port = 8800 + Number(process.env.JEST_WORKER_ID);
process.env.PORT = process.env.PORT || port;
