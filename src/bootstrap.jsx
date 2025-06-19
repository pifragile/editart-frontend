import { Buffer } from "buffer";
import process from "process";

// The missing piece
globalThis.global = globalThis;
globalThis.Buffer = Buffer;
globalThis.process = process;

// console.log("Global Buffer:", Buffer);
// console.log("Buffer.from:", Buffer.from);
// console.log("Buffer.alloc:", Buffer.alloc);
// console.log("Buffer.prototype.slice:", Buffer.prototype.slice);

