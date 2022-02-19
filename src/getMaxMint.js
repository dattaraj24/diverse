const fs = require("fs");

var obj = {
  list: [
    {
      pubkey: "0xb4e912C0ED3B356af88Ee2587250875d4676Ca02",
      amount: 2,
    },
    {
      pubkey: "0xe035b3Abc220741bBb5D780b8d7A5e763c1BF53C",
      amount: 2,
    },
    {
      pubkey: "0xB6aBAA44A5B9fF17358B8189Acb70EbD0D6F3Ff1",
      amount: 3,
    },
  ],
};

var addLength = obj["list"].length;
let targetMint;

export function getMaxMintAmount(varTargetAddress) {
  for (let i = 0; i < addLength; i++) {
    if (obj["list"][i]["pubkey"] === varTargetAddress) {
      targetMint = obj["list"][i]["amount"];
      return targetMint;
    }
  }
}

console.log(getMaxMintAmount("5gYTLjtTRD1XaqxoWenXtVF32bZMpxeARYJvZ5kvQTLN"));
