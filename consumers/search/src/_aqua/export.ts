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

// Functions
 
export type ResolveProvidersResult = [{ key_id: string; peer_id: string; relay_id: string[]; service_id: string[]; set_by: string; signature: number[]; solution: number[]; timestamp_created: number; value: string; }[], string[]]
export function resolveProviders(
    resource_id: string,
    ack: number,
    config?: {ttl?: number}
): Promise<ResolveProvidersResult>;

export function resolveProviders(
    peer: FluencePeer,
    resource_id: string,
    ack: number,
    config?: {ttl?: number}
): Promise<ResolveProvidersResult>;

export function resolveProviders(...args: any) {

    let script = `
                    (xor
                     (seq
                      (seq
                       (seq
                        (seq
                         (call %init_peer_id% ("getDataSrv" "-relay-") [] -relay-)
                         (call %init_peer_id% ("getDataSrv" "resource_id") [] resource_id)
                        )
                        (call %init_peer_id% ("getDataSrv" "ack") [] ack)
                       )
                       (new $successful
                        (new $res
                         (xor
                          (seq
                           (seq
                            (seq
                             (seq
                              (seq
                               (seq
                                (call -relay- ("op" "string_to_b58") [resource_id] k)
                                (call -relay- ("kad" "neighborhood") [k [] []] nodes)
                               )
                               (par
                                (fold nodes n-0
                                 (par
                                  (seq
                                   (xor
                                    (xor
                                     (seq
                                      (seq
                                       (call n-0 ("peer" "timestamp_sec") [] t)
                                       (call n-0 ("registry" "get_records") [resource_id t] get_result)
                                      )
                                      (xor
                                       (match get_result.$.success! true
                                        (seq
                                         (ap get_result.$.result! $res)
                                         (ap true $successful)
                                        )
                                       )
                                       (ap get_result.$.error! $error)
                                      )
                                     )
                                     (call n-0 ("op" "noop") [])
                                    )
                                    (seq
                                     (call -relay- ("op" "noop") [])
                                     (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 1])
                                    )
                                   )
                                   (call -relay- ("op" "noop") [])
                                  )
                                  (next n-0)
                                 )
                                )
                                (null)
                               )
                              )
                              (new $status
                               (new $result-0
                                (seq
                                 (seq
                                  (seq
                                   (par
                                    (seq
                                     (seq
                                      (call -relay- ("math" "sub") [ack 1] sub)
                                      (call -relay- ("op" "noop") [$successful.$.[sub]!])
                                     )
                                     (ap "ok" $status)
                                    )
                                    (call -relay- ("peer" "timeout") [6000 "timeout"] $status)
                                   )
                                   (call -relay- ("op" "identity") [$status.$.[0]!] stat)
                                  )
                                  (xor
                                   (match stat "ok"
                                    (ap true $result-0)
                                   )
                                   (ap false $result-0)
                                  )
                                 )
                                 (call -relay- ("op" "identity") [$result-0] result-fix)
                                )
                               )
                              )
                             )
                             (xor
                              (match result-fix.$.[0]! false
                               (ap "timeout exceeded" $error)
                              )
                              (call -relay- ("op" "noop") [])
                             )
                            )
                            (call -relay- ("registry" "merge") [$res] result)
                           )
                           (xor
                            (match result.$.success! false
                             (ap result.$.error! $error)
                            )
                            (call -relay- ("op" "noop") [])
                           )
                          )
                          (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 2])
                         )
                        )
                       )
                      )
                      (xor
                       (call %init_peer_id% ("callbackSrv" "response") [result.$.result! $error])
                       (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 3])
                      )
                     )
                     (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 4])
                    )
    `
    return callFunction(
        args,
        {
    "functionName" : "resolveProviders",
    "arrow" : {
        "tag" : "arrow",
        "domain" : {
            "tag" : "labeledProduct",
            "fields" : {
                "resource_id" : {
                    "tag" : "scalar",
                    "name" : "string"
                },
                "ack" : {
                    "tag" : "scalar",
                    "name" : "i16"
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
                        "name" : "Record",
                        "fields" : {
                            "relay_id" : {
                                "tag" : "array",
                                "type" : {
                                    "tag" : "scalar",
                                    "name" : "string"
                                }
                            },
                            "signature" : {
                                "tag" : "array",
                                "type" : {
                                    "tag" : "scalar",
                                    "name" : "u8"
                                }
                            },
                            "set_by" : {
                                "tag" : "scalar",
                                "name" : "string"
                            },
                            "peer_id" : {
                                "tag" : "scalar",
                                "name" : "string"
                            },
                            "service_id" : {
                                "tag" : "array",
                                "type" : {
                                    "tag" : "scalar",
                                    "name" : "string"
                                }
                            },
                            "value" : {
                                "tag" : "scalar",
                                "name" : "string"
                            },
                            "timestamp_created" : {
                                "tag" : "scalar",
                                "name" : "u64"
                            },
                            "key_id" : {
                                "tag" : "scalar",
                                "name" : "string"
                            },
                            "solution" : {
                                "tag" : "array",
                                "type" : {
                                    "tag" : "scalar",
                                    "name" : "u8"
                                }
                            }
                        }
                    }
                },
                {
                    "tag" : "array",
                    "type" : {
                        "tag" : "scalar",
                        "name" : "string"
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
