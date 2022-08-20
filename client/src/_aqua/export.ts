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

 
export type RegisterProviderResult = [boolean, string[]]
export function registerProvider(
    resource_id: string,
    value: string,
    service_id: string | null,
    config?: {ttl?: number}
): Promise<RegisterProviderResult>;

export function registerProvider(
    peer: FluencePeer,
    resource_id: string,
    value: string,
    service_id: string | null,
    config?: {ttl?: number}
): Promise<RegisterProviderResult>;

export function registerProvider(...args: any) {

    let script = `
                    (xor
                     (seq
                      (seq
                       (seq
                        (seq
                         (seq
                          (call %init_peer_id% ("getDataSrv" "-relay-") [] -relay-)
                          (call %init_peer_id% ("getDataSrv" "resource_id") [] resource_id)
                         )
                         (call %init_peer_id% ("getDataSrv" "value") [] value)
                        )
                        (call %init_peer_id% ("getDataSrv" "service_id") [] service_id)
                       )
                       (new $successful
                        (new $error_get
                         (new $success
                          (seq
                           (new $relay_id
                            (seq
                             (seq
                              (ap -relay- $relay_id)
                              (call %init_peer_id% ("peer" "timestamp_sec") [] t)
                             )
                             (xor
                              (seq
                               (seq
                                (call -relay- ("registry" "get_record_bytes") [resource_id value $relay_id service_id t []] bytes)
                                (xor
                                 (call %init_peer_id% ("sig" "sign") [bytes] signature)
                                 (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 1])
                                )
                               )
                               (xor
                                (match signature.$.success! false
                                 (seq
                                  (ap signature.$.error.[0]! $error)
                                  (ap false $success)
                                 )
                                )
                                (seq
                                 (seq
                                  (seq
                                   (new $resources
                                    (new $successful-0
                                     (new $result
                                      (seq
                                       (seq
                                        (seq
                                         (seq
                                          (seq
                                           (call -relay- ("op" "string_to_b58") [resource_id] k)
                                           (call -relay- ("kad" "neighborhood") [k [] []] nodes-1)
                                          )
                                          (par
                                           (fold nodes-1 n-0-0
                                            (par
                                             (seq
                                              (xor
                                               (xor
                                                (seq
                                                 (seq
                                                  (call n-0-0 ("peer" "timestamp_sec") [] t-0)
                                                  (call n-0-0 ("registry" "get_key_metadata") [resource_id t-0] get_result)
                                                 )
                                                 (xor
                                                  (match get_result.$.success! true
                                                   (seq
                                                    (ap get_result.$.key! $resources)
                                                    (ap true $successful-0)
                                                   )
                                                  )
                                                  (seq
                                                   (call n-0-0 ("op" "concat_strings") [get_result.$.error! " on "] e)
                                                   (call n-0-0 ("op" "concat_strings") [e n-0-0] $error-0)
                                                  )
                                                 )
                                                )
                                                (call n-0-0 ("op" "noop") [])
                                               )
                                               (seq
                                                (call -relay- ("op" "noop") [])
                                                (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 2])
                                               )
                                              )
                                              (call -relay- ("op" "noop") [])
                                             )
                                             (next n-0-0)
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
                                                 (call -relay- ("math" "sub") [1 1] sub)
                                                 (call -relay- ("op" "noop") [$successful-0.$.[sub]!])
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
                                            (call -relay- ("op" "identity") [$result-0] result-fix-0)
                                           )
                                          )
                                         )
                                        )
                                        (xor
                                         (match result-fix-0.$.[0]! false
                                          (ap "resource not found: timeout exceeded" $error-0)
                                         )
                                         (seq
                                          (call -relay- ("registry" "merge_keys") [$resources] merge_result)
                                          (xor
                                           (match merge_result.$.success! true
                                            (ap merge_result.$.key! $result)
                                           )
                                           (ap merge_result.$.error! $error-0)
                                          )
                                         )
                                        )
                                       )
                                       (call -relay- ("op" "identity") [$result] result-fix)
                                      )
                                     )
                                    )
                                   )
                                   (call -relay- ("op" "identity") [$error-0] push-to-stream-40)
                                  )
                                  (ap push-to-stream-40 $error_get)
                                 )
                                 (xor
                                  (match result-fix []
                                   (seq
                                    (fold $error_get e-0-0
                                     (seq
                                      (ap e-0-0 $error)
                                      (next e-0-0)
                                     )
                                    )
                                    (ap false $success)
                                   )
                                  )
                                  (seq
                                   (seq
                                    (seq
                                     (seq
                                      (seq
                                       (seq
                                        (call -relay- ("op" "string_to_b58") [resource_id] k-0)
                                        (call -relay- ("kad" "neighborhood") [k-0 [] []] nodes)
                                       )
                                       (par
                                        (fold nodes n-1
                                         (par
                                          (seq
                                           (seq
                                            (ap n-1 $error)
                                            (xor
                                             (xor
                                              (seq
                                               (seq
                                                (seq
                                                 (call n-1 ("peer" "timestamp_sec") [] t-1)
                                                 (call n-1 ("trust-graph" "get_weight") [result-fix.$.[0].owner_peer_id! t-1] weight)
                                                )
                                                (call n-1 ("registry" "republish_key") [result-fix.$.[0]! weight t-1] result-1)
                                               )
                                               (xor
                                                (match result-1.$.success! false
                                                 (ap result-1.$.error! $error)
                                                )
                                                (seq
                                                 (seq
                                                  (seq
                                                   (call n-1 ("peer" "timestamp_sec") [] t-2)
                                                   (call n-1 ("trust-graph" "get_weight") [%init_peer_id% t-2] weight-0)
                                                  )
                                                  (call n-1 ("registry" "put_record") [resource_id value $relay_id service_id t [] signature.$.signature.[0]! weight-0 t-2] result-2)
                                                 )
                                                 (xor
                                                  (match result-2.$.success! true
                                                   (ap true $successful)
                                                  )
                                                  (ap result-2.$.error! $error)
                                                 )
                                                )
                                               )
                                              )
                                              (call n-1 ("op" "noop") [])
                                             )
                                             (seq
                                              (call -relay- ("op" "noop") [])
                                              (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 3])
                                             )
                                            )
                                           )
                                           (call -relay- ("op" "noop") [])
                                          )
                                          (next n-1)
                                         )
                                        )
                                        (null)
                                       )
                                      )
                                      (new $status-0
                                       (new $result-3
                                        (seq
                                         (seq
                                          (seq
                                           (par
                                            (seq
                                             (seq
                                              (call -relay- ("math" "sub") [1 1] sub-0)
                                              (call -relay- ("op" "noop") [$successful.$.[sub-0]!])
                                             )
                                             (ap "ok" $status-0)
                                            )
                                            (call -relay- ("peer" "timeout") [6000 "timeout"] $status-0)
                                           )
                                           (call -relay- ("op" "identity") [$status-0.$.[0]!] stat-0)
                                          )
                                          (xor
                                           (match stat-0 "ok"
                                            (ap true $result-3)
                                           )
                                           (ap false $result-3)
                                          )
                                         )
                                         (call -relay- ("op" "identity") [$result-3] result-fix-1)
                                        )
                                       )
                                      )
                                     )
                                     (ap result-fix-1.$.[0]! $success)
                                    )
                                    (call -relay- ("op" "identity") [$success.$.[0]!] identity)
                                   )
                                   (xor
                                    (match identity false
                                     (ap "provider hasn't registered: timeout exceeded" $error)
                                    )
                                    (call -relay- ("op" "noop") [])
                                   )
                                  )
                                 )
                                )
                               )
                              )
                              (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 4])
                             )
                            )
                           )
                           (call %init_peer_id% ("op" "identity") [$success] success-fix)
                          )
                         )
                        )
                       )
                      )
                      (xor
                       (call %init_peer_id% ("callbackSrv" "response") [success-fix.$.[0]! $error])
                       (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 5])
                      )
                     )
                     (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 6])
                    )
    `
    return callFunction(
        args,
        {
    "functionName" : "registerProvider",
    "arrow" : {
        "tag" : "arrow",
        "domain" : {
            "tag" : "labeledProduct",
            "fields" : {
                "resource_id" : {
                    "tag" : "scalar",
                    "name" : "string"
                },
                "value" : {
                    "tag" : "scalar",
                    "name" : "string"
                },
                "service_id" : {
                    "tag" : "option",
                    "type" : {
                        "tag" : "scalar",
                        "name" : "string"
                    }
                }
            }
        },
        "codomain" : {
            "tag" : "unlabeledProduct",
            "items" : [
                {
                    "tag" : "scalar",
                    "name" : "bool"
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
