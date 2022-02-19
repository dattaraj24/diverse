import { ethers } from "ethers";
import keccak256 from "keccak256";
import { MerkleTree } from "merkletreejs";
import abi from "../src/contract/abi.json";
import { useEffect, useState } from "react";
import { Address } from "./whitelist";
import { getMaxMintAmount } from "./getMaxMint";
import logo from "../src/assets/logo.png";
import Alert from "@mui/material/Alert";
import "./App.css";
import Button from "@mui/material/Button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function App() {
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const getProof = (address) => {
    console.log(Address);
    const leaves = Address.map((v) => keccak256(v));
    //console.log(leaves);
    const tree = new MerkleTree(leaves, keccak256, { sort: true });
   // console.log(tree);
    const leaf = keccak256(address);
   // console.log(leaf);
    const proof = tree.getHexProof(leaf);
    return proof;
  };

  const connectWallet = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const network = await provider.getNetwork();
    const chainId = network.chainId;
    console.log(chainId);
    console.log("CONNECTED");
    if (chainId !== 4) {
      toast.error("Please Switch to Ethereum Mainnet");
    }
  };

  useEffect(() => {
    connectWallet();
  }, []);

  const write = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        setLoading(true);
        const contract_address = "0x2bAAe14019cdCe5C22973BeB9651bAd034f82Be7";
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.listAccounts();
        const add = accounts[0];
        const signer = provider.getSigner();
        const proof = getProof(add);
        const options = { value: ethers.utils.parseEther("0.1") };
        const contract = new ethers.Contract(contract_address, abi, signer);
        const cost = contract.cost()
        console.log(cost);
        const res = await contract.mint(1, proof,options);

        console.log(getMaxMintAmount(add))
        setLoading(false);
        console.log(res);
        if (res.hash !== undefined) {
          toast.success("Successfully Minted");
        }
        setLoading(false);
      } catch (error) {
        if (
          error.message.includes('execution reverted: Invalid merkle proof')
        ) {
          toast.error("Invalid proof");
          return;
        } else if (
          error.message.includes("User denied transaction signature")
        ) {
          toast.error("User denied transaction signature");
          return;
        } else if (
          error.message.includes(
            "insufficient funds for intrinsic transaction cost "
          )
        ) {
          toast.error("Insufficient funds for intrinsic transaction cost");
          return;
        }

        toast.error("The Tx Failed");

        console.log(error);
      }
    }
  };
  return (
    <div className="App">
      <div className="img-container">
        <img src={logo} alt="logo" className="image" />
        {typeof window.ethereum === undefined ? (
          <Button
            onClick={connectWallet}
            sx={{
              marginTop: "50px",
              width: "100%",
              height: "50px",
              borderRadius: "25px",
              border: "none",
              backgroundColor: "#f1f1f1",
              color: "#000",
              fontSize: "20px",
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "#000",
                color: "white",
              },
            }}
          >
            Connect Wallet
          </Button>
        ) : (
          <Button
            onClick={write}
            sx={{
              marginTop: "50px",
              width: "100%",
              height: "50px",
              borderRadius: "25px",
              border: "none",
              backgroundColor: "#f1f1f1",
              color: "#000",
              fontSize: "20px",
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "#000",
                color: "white",
              },
            }}
          >
            {isLoading ? "Minting..." : "Mint"}
          </Button>
        )}
      </div>
      <ToastContainer />
    </div>
  );
}

export default App;
