import {SubstrateExtrinsic,SubstrateEvent,SubstrateBlock} from "@subql/types";
import {AcalaCrowdloanParticipation} from "../types";
import {Balance} from "@polkadot/types/interfaces";

const isset = (ref) => typeof ref !== 'undefined';

function hex_to_ascii(str1)
 {
	var hex  = str1.toString().substring(2);
	var str = '';
	for (var n = 0; n < hex.length; n += 2) {
		str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
	}
	return str;
 }

export async function handleEvent(event: SubstrateEvent): Promise<void> {
    const {event: {data: [account1, account2, amount]}} = event;
    // retreive the block number
    if (account2.toString() === "132zsjMwGjNaUXF5XjUCDs2cDEq9Qao51TsL9RSUTGZbinVK"){        
    
        var referrer = null;
        if (isset(event.extrinsic.extrinsic.method) && isset(event.extrinsic.extrinsic.method.args)) {
            var args_string = event.extrinsic.extrinsic.method.args.toString()
            try {
                var args_obj=JSON.parse(args_string);
            } catch (e) {
                args_obj=Array();
            }
            args_obj.forEach(element => {
                if (isset(element) && isset(element.args) && isset(element.args.remark)) {
                    if (hex_to_ascii(element.args.remark).substring(0,9) == "referrer:") {
                        referrer=hex_to_ascii(element.args.remark).substring(9)
                    }
                }
            });
        }
        const block_number = event.extrinsic.block.block.header.hash.toString();
        
        let record = new AcalaCrowdloanParticipation(block_number);
        record.field1 = event.extrinsic.block.block.header.number.toNumber();
        record.field2 = event.extrinsic.idx.toString()
        record.field3 = account1.toString();
        record.field4 = account2.toString();
        record.field5 = referrer;
        record.field6 = (amount as Balance).toBigInt();
        await record.save();
    }
}



