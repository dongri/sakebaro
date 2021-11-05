
$ = (id) => { return document.getElementById(id); }
const p = "@c64_g2EogHgn*6VuQdT6W7Z@c64_g2EogHgn*6VuQdT6W7Z";

window.onload = async() => {
  await reload();
}

try {
  window.ethereum.on('accountsChanged', async(accounts) => {
    await walletChanged()
  });
  window.ethereum.on('networkChanged', async(networkId) => {
    await walletChanged()
  });
} catch (e) {
  console.log(e)
}

walletChanged = async () => {
  await reload();
};

reload = async () => {
}

getWeb3 = async () => {
  try {
    let currentProvider = null;
    if (window.ethereum) {
      await window.ethereum.enable();
      currentProvider = window.ethereum;
    } else if (window.web3) {
      currentProvider = window.web3.currentProvider;
    } else {
      alert('Please install MetaMask');
    }
    if (currentProvider) {
      const web3 = new Web3(currentProvider);
      const networkId = await web3.eth.net.getId(); // const networkType = await web3.eth.net.getNetworkType();
      const accounts = (await web3.eth.getAccounts()) || web3.eth.accounts;
      const account = accounts[0];
      return {web3, account, networkId}
    }
  } catch (err) {
    console.log(err);
  }
}

mintToken = async (tokenType) => {
  try {
    let { web3, account, networkId } = await getWeb3();
    const nftContractABI = getNFTContractABI()
    const tokenTypeData = tokenTypes[tokenType];
    let nftContractAddress = await getEnv('nft_address')
    const contract = new web3.eth.Contract(nftContractABI, nftContractAddress)
    const value = String(web3.utils.toWei(tokenTypeData["eth"], 'ether'));
    const estimateGas = await contract.methods.mint(tokenType).estimateGas({from: account, value: value});
    contract.methods.mint(tokenType).send(
      {
        from: account,
        value: value,
        gas: estimateGas,
      }, (err, txHash) => {
        if (err) {
          console.log(err);
          return
        }
        $('etherscan').innerHTML = '<a href="'+ getEnv("etherscan") + '/tx/' + txHash + '" target="_blank" style="font-size: large">Etherscan</a>';
      })
  } catch (err) {
    console.log(err);
  }
}

showStore = async (tokenType) => {
  try {
    let { web3, account, networkId } = await getWeb3();
    const nftContractABI = getNFTContractABI()
    let nftContractAddress = await getEnv('nft_address')
    const contract = new web3.eth.Contract(nftContractABI, nftContractAddress)
    const tokenIds = await contract.methods.tokensOfOwner(account).call();

    let have = false;
    for(let tokenId of tokenIds) {
      const tokenTypeChain = await contract.methods.getTypeByTokenId(tokenId).call();
      if (tokenTypeChain == tokenType || String(tokenTypeChain) == "1") {
        have = true;
        break;
      }
    };
    if (have == true) {
      const store = storeInfo[tokenType];
      const address = decrypt(store["address"])
      const tel = decrypt(store["tel"])
      document.getElementById("store-" + tokenType).style.display = "block";
      document.getElementById("store-" + tokenType + "-address").innerHTML = '住所: ' + address;
      document.getElementById("store-" + tokenType + "-tel").innerHTML = '電話: ' + tel;
    } else {
      alert("You don't seem to have the relevant NFTs, let's Mint them.");
    }
  } catch (err) {
    console.log(err);
  }
}

getNFTContractABI = () => {
  const nftContractABI = '[{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"baseURI","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"burn","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"isOwner","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenOfOwnerByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getMintDisabled","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"bool","name":"_disabled","type":"bool"}],"name":"setMintDisabled","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getMintFeeReceiveAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address payable","name":"receiveAddress","type":"address"}],"name":"setMintFeeReceiveAddress","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_mintType","type":"uint256"},{"internalType":"uint256","name":"_mintFee","type":"uint256"}],"name":"setMintFees","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"_mintType","type":"uint256"}],"name":"getMintFees","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_mintType","type":"uint256"},{"internalType":"uint256","name":"_mintMax","type":"uint256"}],"name":"setMintMaxs","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"_mintType","type":"uint256"}],"name":"getMintMaxs","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_mintType","type":"uint256"},{"internalType":"string","name":"_mintHash","type":"string"}],"name":"setMintHashs","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"_mintType","type":"uint256"}],"name":"getMintHashs","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getCurrentTokenId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getTypeByTokenId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"tokensOfOwner","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"mintType","type":"uint256"}],"name":"mint","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":true,"stateMutability":"payable","type":"function"}]'
  return JSON.parse(nftContractABI)
}

getEnv = async (key) => {
  let { web3, account, networkId } = await getWeb3();
  if (!["1", "4"].includes(String(networkId))) {
    return ""
  }
  return env[key][String(networkId)]
}

const env = {
  "nft_address": {
    "1": "",
    "4": "0xb5277aA562A3d0ea8ABCDf6db07304C5dFf86e3C"
  },
  "etherscan": {
    "1": "https://etherscan.io",
    "4": "https://rinkeby.etherscan.io"
  },
  "network": {
    "1": "Mainnet",
    "4": "Rinkeby"
  }
}

const tokenTypes = {
  "1": {
    "eth": "1"
  },
  "2": {
    "eth": "0.2"
  },
  "3": {
    "eth": "0.2"
  },
  "4": {
    "eth": "0.2"
  },
  "5": {
    "eth": "0.2"
  },
}

const storeInfo = {
  "2": {
    "address": "U2FsdGVkX1/Bo4sBsEMC5nBRvONygQuKuAo0UJ24NqA=",
    "tel": "U2FsdGVkX18Bq1eVXmZWz6WJRIE70BxpkxdC8j0eUp0="
  },
  "3": {
    "address": "U2FsdGVkX1/Bo4sBsEMC5nBRvONygQuKuAo0UJ24NqA=",
    "tel": "U2FsdGVkX18Bq1eVXmZWz6WJRIE70BxpkxdC8j0eUp0="
  },
  "4": {
    "address": "U2FsdGVkX1/Bo4sBsEMC5nBRvONygQuKuAo0UJ24NqA=",
    "tel": "U2FsdGVkX18Bq1eVXmZWz6WJRIE70BxpkxdC8j0eUp0="
  },
  "5": {
    "address": "U2FsdGVkX1/Bo4sBsEMC5nBRvONygQuKuAo0UJ24NqA=",
    "tel": "U2FsdGVkX18Bq1eVXmZWz6WJRIE70BxpkxdC8j0eUp0="
  },
}

encrypt = (word) => {
  return CryptoJS.AES.encrypt(word, p).toString();
}

decrypt = (word) => {
  return CryptoJS.AES.decrypt(word, p).toString(CryptoJS.enc.Utf8);
}
