import * as fs from 'fs';
import { Contract } from "ethers";

export const save = (network:string, deployed:{ [name: string]: Contract }):void => {
    if(!fs.existsSync(`deployed.uniswap.${network}.json`)){
        fs.writeFileSync(`deployed.uniswap.${network}.json`, '{}', {flag:'w'})
    }
    let data = JSON.parse(fs.readFileSync(`deployed.uniswap.${network}.json`).toString());
    for (const item of Object.keys(deployed)){
        data[item] = deployed[item].address;
    }
    fs.writeFileSync(`deployed.uniswap.${network}.json`, JSON.stringify(data, null, 2));
}