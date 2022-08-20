/**
 *
 * This file is auto-generated. Do not edit manually: changes may be erased.
 * Generated by Aqua compiler: https://github.com/fluencelabs/aqua/.
 * If you find any bugs, please write an issue on GitHub: https://github.com/fluencelabs/aqua/issues
 * Aqua version: 0.7.4-338
 *
 */
import { Fluence, FluencePeer } from '@fluencelabs/fluence';
import {
    CallParams,
    callFunction,
    registerService,
} from '@fluencelabs/fluence/dist/internal/compilerSupport/v3';


// Services

export interface ShopServiceDef {
    list: (callParams: CallParams<null>) => { address: string; id: string; price: number; title: string; }[] | Promise<{ address: string; id: string; price: number; title: string; }[]>;
    list_by_keyword: (search: string, callParams: CallParams<'search'>) => { address: string; id: string; price: number; title: string; }[] | Promise<{ address: string; id: string; price: number; title: string; }[]>;
}
export function registerShopService(service: ShopServiceDef): void;
export function registerShopService(serviceId: string, service: ShopServiceDef): void;
export function registerShopService(peer: FluencePeer, service: ShopServiceDef): void;
export function registerShopService(peer: FluencePeer, serviceId: string, service: ShopServiceDef): void;
       

export function registerShopService(...args: any) {
    registerService(
        args,
        {
    "defaultServiceId" : "shopservice",
    "functions" : {
        "tag" : "labeledProduct",
        "fields" : {
            "list" : {
                "tag" : "arrow",
                "domain" : {
                    "tag" : "nil"
                },
                "codomain" : {
                    "tag" : "unlabeledProduct",
                    "items" : [
                        {
                            "tag" : "array",
                            "type" : {
                                "tag" : "struct",
                                "name" : "Product",
                                "fields" : {
                                    "address" : {
                                        "tag" : "scalar",
                                        "name" : "string"
                                    },
                                    "id" : {
                                        "tag" : "scalar",
                                        "name" : "string"
                                    },
                                    "price" : {
                                        "tag" : "scalar",
                                        "name" : "u32"
                                    },
                                    "title" : {
                                        "tag" : "scalar",
                                        "name" : "string"
                                    }
                                }
                            }
                        }
                    ]
                }
            },
            "list_by_keyword" : {
                "tag" : "arrow",
                "domain" : {
                    "tag" : "labeledProduct",
                    "fields" : {
                        "search" : {
                            "tag" : "scalar",
                            "name" : "string"
                        }
                    }
                },
                "codomain" : {
                    "tag" : "unlabeledProduct",
                    "items" : [
                        {
                            "tag" : "array",
                            "type" : {
                                "tag" : "struct",
                                "name" : "Product",
                                "fields" : {
                                    "address" : {
                                        "tag" : "scalar",
                                        "name" : "string"
                                    },
                                    "id" : {
                                        "tag" : "scalar",
                                        "name" : "string"
                                    },
                                    "price" : {
                                        "tag" : "scalar",
                                        "name" : "u32"
                                    },
                                    "title" : {
                                        "tag" : "scalar",
                                        "name" : "string"
                                    }
                                }
                            }
                        }
                    ]
                }
            }
        }
    }
}
    );
}
      
// Functions
 
export type Generate_proofResult = { byteSignal: string; fullProof: { proof: { curve: string | null; pi_a: string[] | null; pi_b: string[][] | null; pi_c: string[] | null; protocol: string | null; }; publicSignals: { externalNullifier: string; merkleRoot: string; nullifierHash: string; signalHash: string; }; }; solidityProof: string[]; }
export function generate_proof(
    message: string,
    config?: {ttl?: number}
): Promise<Generate_proofResult>;

export function generate_proof(
    peer: FluencePeer,
    message: string,
    config?: {ttl?: number}
): Promise<Generate_proofResult>;

export function generate_proof(...args: any) {

    let script = `
                    (xor
                     (seq
                      (seq
                       (seq
                        (seq
                         (seq
                          (call %init_peer_id% ("getDataSrv" "-relay-") [] -relay-)
                          (call %init_peer_id% ("getDataSrv" "message") [] message)
                         )
                         (call -relay- ("op" "noop") [])
                        )
                        (call "12D3KooWSD5PToNiLQwKDXsu8JSysCwUt8BVUJEqCHcDe7P5h45e" ("op" "noop") [])
                       )
                       (xor
                        (seq
                         (seq
                          (call "12D3KooWEF8ddP67Zg6mRZgH6WkDccPSxsQHV4jGeH7fNerW8qSs" ("semaphoreservice" "add_member") [message] proofs)
                          (call "12D3KooWSD5PToNiLQwKDXsu8JSysCwUt8BVUJEqCHcDe7P5h45e" ("op" "noop") [])
                         )
                         (call -relay- ("op" "noop") [])
                        )
                        (seq
                         (seq
                          (call "12D3KooWSD5PToNiLQwKDXsu8JSysCwUt8BVUJEqCHcDe7P5h45e" ("op" "noop") [])
                          (call -relay- ("op" "noop") [])
                         )
                         (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 1])
                        )
                       )
                      )
                      (xor
                       (call %init_peer_id% ("callbackSrv" "response") [proofs])
                       (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 2])
                      )
                     )
                     (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 3])
                    )
    `
    return callFunction(
        args,
        {
    "functionName" : "generate_proof",
    "arrow" : {
        "tag" : "arrow",
        "domain" : {
            "tag" : "labeledProduct",
            "fields" : {
                "message" : {
                    "tag" : "scalar",
                    "name" : "string"
                }
            }
        },
        "codomain" : {
            "tag" : "unlabeledProduct",
            "items" : [
                {
                    "tag" : "struct",
                    "name" : "AddMember",
                    "fields" : {
                        "byteSignal" : {
                            "tag" : "scalar",
                            "name" : "string"
                        },
                        "fullProof" : {
                            "tag" : "struct",
                            "name" : "FullProof",
                            "fields" : {
                                "proof" : {
                                    "tag" : "struct",
                                    "name" : "Proof",
                                    "fields" : {
                                        "curve" : {
                                            "tag" : "option",
                                            "type" : {
                                                "tag" : "scalar",
                                                "name" : "string"
                                            }
                                        },
                                        "pi_a" : {
                                            "tag" : "option",
                                            "type" : {
                                                "tag" : "array",
                                                "type" : {
                                                    "tag" : "scalar",
                                                    "name" : "string"
                                                }
                                            }
                                        },
                                        "pi_c" : {
                                            "tag" : "option",
                                            "type" : {
                                                "tag" : "array",
                                                "type" : {
                                                    "tag" : "scalar",
                                                    "name" : "string"
                                                }
                                            }
                                        },
                                        "pi_b" : {
                                            "tag" : "option",
                                            "type" : {
                                                "tag" : "array",
                                                "type" : {
                                                    "tag" : "array",
                                                    "type" : {
                                                        "tag" : "scalar",
                                                        "name" : "string"
                                                    }
                                                }
                                            }
                                        },
                                        "protocol" : {
                                            "tag" : "option",
                                            "type" : {
                                                "tag" : "scalar",
                                                "name" : "string"
                                            }
                                        }
                                    }
                                },
                                "publicSignals" : {
                                    "tag" : "struct",
                                    "name" : "PublicSignals",
                                    "fields" : {
                                        "externalNullifier" : {
                                            "tag" : "scalar",
                                            "name" : "string"
                                        },
                                        "merkleRoot" : {
                                            "tag" : "scalar",
                                            "name" : "string"
                                        },
                                        "nullifierHash" : {
                                            "tag" : "scalar",
                                            "name" : "string"
                                        },
                                        "signalHash" : {
                                            "tag" : "scalar",
                                            "name" : "string"
                                        }
                                    }
                                }
                            }
                        },
                        "solidityProof" : {
                            "tag" : "array",
                            "type" : {
                                "tag" : "scalar",
                                "name" : "string"
                            }
                        }
                    }
                }
            ]
        }
    },
    "names" : {
        "relay" : "-relay-",
        "getDataSrv" : "getDataSrv",
        "callbackSrv" : "callbackSrv",
        "responseSrv" : "callbackSrv",
        "responseFnName" : "response",
        "errorHandlingSrv" : "errorHandlingSrv",
        "errorFnName" : "error"
    }
},
        script
    )
}

 

export function is_member(
    message: string,
    config?: {ttl?: number}
): Promise<boolean>;

export function is_member(
    peer: FluencePeer,
    message: string,
    config?: {ttl?: number}
): Promise<boolean>;

export function is_member(...args: any) {

    let script = `
                    (xor
                     (seq
                      (seq
                       (seq
                        (seq
                         (seq
                          (call %init_peer_id% ("getDataSrv" "-relay-") [] -relay-)
                          (call %init_peer_id% ("getDataSrv" "message") [] message)
                         )
                         (call -relay- ("op" "noop") [])
                        )
                        (call "12D3KooWSD5PToNiLQwKDXsu8JSysCwUt8BVUJEqCHcDe7P5h45e" ("op" "noop") [])
                       )
                       (xor
                        (seq
                         (seq
                          (call "12D3KooWEF8ddP67Zg6mRZgH6WkDccPSxsQHV4jGeH7fNerW8qSs" ("semaphoreservice" "is_member") [message] resp)
                          (call "12D3KooWSD5PToNiLQwKDXsu8JSysCwUt8BVUJEqCHcDe7P5h45e" ("op" "noop") [])
                         )
                         (call -relay- ("op" "noop") [])
                        )
                        (seq
                         (seq
                          (call "12D3KooWSD5PToNiLQwKDXsu8JSysCwUt8BVUJEqCHcDe7P5h45e" ("op" "noop") [])
                          (call -relay- ("op" "noop") [])
                         )
                         (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 1])
                        )
                       )
                      )
                      (xor
                       (call %init_peer_id% ("callbackSrv" "response") [resp])
                       (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 2])
                      )
                     )
                     (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 3])
                    )
    `
    return callFunction(
        args,
        {
    "functionName" : "is_member",
    "arrow" : {
        "tag" : "arrow",
        "domain" : {
            "tag" : "labeledProduct",
            "fields" : {
                "message" : {
                    "tag" : "scalar",
                    "name" : "string"
                }
            }
        },
        "codomain" : {
            "tag" : "unlabeledProduct",
            "items" : [
                {
                    "tag" : "scalar",
                    "name" : "bool"
                }
            ]
        }
    },
    "names" : {
        "relay" : "-relay-",
        "getDataSrv" : "getDataSrv",
        "callbackSrv" : "callbackSrv",
        "responseSrv" : "callbackSrv",
        "responseFnName" : "response",
        "errorHandlingSrv" : "errorHandlingSrv",
        "errorFnName" : "error"
    }
},
        script
    )
}
