import express, { Application } from 'express';
import reveal, { RevealOptions } from 'reveal-sdk-node';
import cors from "cors";

const app: Application = express();

app.use(cors());

app.use("/", reveal());

const revealOptions: RevealOptions = {
    localFileStoragePath: "data"
}
app.use('/', reveal(revealOptions));

app.listen(8080, () => {
    console.log(`Reveal server accepting http requests`);
});