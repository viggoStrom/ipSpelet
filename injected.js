// applies on https://ip.ntig.dev/
// uses https://chromewebstore.google.com/detail/user-javascript-and-css/nbhcbdghjpllgmfilhnhkllmkecfmpld?hl=sv

const clientPanel = document.querySelector("tbody").children
const gatewayPanel = document.querySelectorAll("tbody")[1].children[1].children
const serverPanel = document.querySelectorAll("tbody")[2].children

const locations = [
    // Client
    clientPanel[1].children[1].children[0].value, // ip
    clientPanel[2].children[1].children[0].value, // mask
    clientPanel[3].children[1].children[0].value, // gateway
    clientPanel[4].children[1].children[0].value, // netID

    gatewayPanel[1].children[0].value, // client gateway
    gatewayPanel[3].children[0].value, // server gateway

    // Server
    serverPanel[1].children[1].children[0].value, // ip
    serverPanel[2].children[1].children[0].value, // mask
    serverPanel[3].children[1].children[0].value, // gateway
    serverPanel[4].children[1].children[0].value, // netID
]

const client = {
    IP: locations[0],
    mask: locations[1],
    gateway: locations[2],
    netID: locations[3],
    name: "client"
}
const gateway = {
    client: locations[4],
    server: locations[5],
}
const server = {
    IP: locations[6],
    mask: locations[7],
    gateway: locations[8],
    netID: locations[9],
    name: "server"
}


// *************** //
// The Logic-ining //
// *************** //

// solve mask
// 11111111111111111111111100000000
// 256/(2^n). bits in byte, n gives number of ips per block
// if (
//     client.mask === ""
// ) {
//     const toCIDR = (decimal) => {
//         let binary = parseInt(decimal).toString(2)
//         return binary.split("").filter((element) => { return element === "1" }).length
//     }

//     for (const decimalByte in client.mask.split(".")) {
//         toCIDR(decimalByte)
//     }
// }

/**
 * Requires [ - ]
 * @param side Client or server.
 */
function solveEmptyCase(side) {
    if (
        side.IP === ""
        &&
        side.mask === ""
        &&
        side.gateway === ""
        &&
        side.netID === ""
        &&
        gateway[side.name] === ""
    ) {
        side.IP = "1.2.3.4"
        side.mask = "255.255.255.0"
        side.gateway = "1.2.3.5"
        side.netID = "1.2.3.0"

        gateway[side.name] = "1.2.3.5"
    }
}

/**
 * Requires [ - ]
 * @param side Client or server.
 */
function solveOnlyMaskCase(side) {
    if (
        side.IP === ""
        &&
        side.mask !== ""
        &&
        side.gateway === ""
        &&
        side.netID === ""
        &&
        gateway[side.name] === ""
    ) {
        // side.IP = "1.1.1.1"
        // side.gateway = "1.1.1.0"
        // side.netID = "1.1.1.0"

        const CIDRArray = []

        side.mask.split(".").forEach(decimal => {
            const binary = parseInt(decimal).toString(2).split("")

            const localCIDR = binary.filter(element => { return element === "1" }).length

            CIDRArray.push(localCIDR)
        });

        const CIDR = CIDRArray.reduce((partialSum, a) => partialSum + a, 0);

        const CIDRFloor = Math.floor(CIDR / 8)
        const CIDRRest = CIDR % 8

        let netIDArray = []

        for (let index = 0; index < CIDRFloor; index++) {
            netIDArray.push("255")
        }
        if (CIDRRest !== 0) {
            const div = (256 / CIDRRest).toString()
            netIDArray.push(div)
        }

        for (let index = 0; index < 4 - netIDArray.length; index++) {
            netIDArray.push("0")

        }

        side.netID = netIDArray.join(".")
    }
}

/**
 * Requires [ either gateway ]
 * @param side Client or server.
 */
function solveGatewayMirror(side) {
    if (
        gateway[side.name] === ""
        &&
        side.gateway !== ""
    ) {
        gateway[side.name] = side.gateway
    }
    else if (
        gateway[side.name] !== ""
        &&
        side.gateway === ""
    ) {
        side.gateway = gateway[side.name]
    }
}

/**
 * Requires [ netID ]
 * @param side Client or server.
 */
function solveGatewayPair(side) {
    if (
        side.gateway === ""
        &&
        gateway[side.name] === ""
    ) {
        side.gateway = side.netID
        gateway[side.name] = side.netID
    }
}

/**
 * Requires [ (IP || gateway) && mask ]
 * @param side Client or server.
 */
function solveNetID(side) {
    if (side.netID === "") {
        const maskLength = side.mask.split(".").filter((element) => { return element === "255" }).length

        if (side.IP !== "") {
            side.netID = side.IP.split(".").slice(0, maskLength).concat(new Array(4 - maskLength).fill("0")).join(".")
        } else
            if (side.gateway !== "") {
                side.netID = side.gateway.split(".").slice(0, maskLength).concat(new Array(4 - maskLength).fill("0")).join(".")
            }
    }
}

/**
 * Requires [ IP || netID || gateway ]
 * Unsure
 * @param side Client or server.
 */
function solveMask(side) {
    if (side.mask === "") {
        const IP = side.IP.split(".")
        const gateway = side.gateway.split(".")
        const netID = side.netID.split(".")
        const addresses = [IP, gateway, netID].filter(Boolean)

        if (addresses.length === 1) {

            if (side.netID === "") {
                side.mask = "0.0.0.0"
            }
            else {
                side.mask = "255.255.255.254"
            }


        } else {


            const mask = ["", "", "", ""]
            let last;

            for (let index = 0; index < 4; index++) {
                for (let addressIndex = 0; addressIndex < addresses.length; addressIndex++) {
                    if (addresses[addressIndex][index] === last) {
                        mask[index] = "255"
                    }
                    last = addresses[addressIndex][index]
                }
            }

            for (let index = 0; index < 4; index++) {
                const decimalByte = mask[index]
                if (
                    decimalByte === ""
                ) {
                    mask[index] = "0"
                }
            }

            side.mask = mask.join(".")
        }
    }
}

/**
 * Requires [ netID || gateway ]
 * @param side Client or server.
 */
function solveIP(side) {
    if (side.IP === "") {

        if (side.netID !== "") {
            const IP = side.netID.split(".").slice(0, 3);

            IP.push(
                (parseInt(side.netID.split(".")[3]) + 1).toString()
            );

            side.IP = IP.join(".");

        }
        // else if (side.gateway !== "") {
        //     const IP = side.gateway.split(".").slice(0, 3);

        //     IP.push(
        //         (parseInt(side.gateway.split(".")[3]) + 1).toString()
        //     );

        //     side.IP = IP.join(".");
        // }
    }
}

/**
 * Requires [ - ]
 * @param side Client or server.
 */
function bruteForce(side) {
    side.IP = "1.0.0.1"
    side.mask = "255.0.0.0"
    side.gateway = "1.0.0.0"
    gateway[side.name] = "1.0.0.0"
    side.netID = "1.0.0.0"
    // side.IP === ""
    // &&
    // side.mask === ""
    // &&
    // side.gateway === ""
    // &&
    // gateway[side.name] === ""
    // &&
    // side.netID === ""
    // if (
    //     side.mask === ""
    //     &&
    //     side.netID === ""
    // ) {
    //     side.IP = side.IP === "" ? "0.0.0.1" : 
    //     side.mask = side.mask === "" ? "0.0.0.0" :
    //     side.gateway = side.gateway === "" ? "0.0.0.0" :
    //     side.netID = side.netID === "" ? "0.0.0.0" :
    //     gateway[side.name] = gateway[side.name] === "" ? "0.0.0.0" :
    // }
}



const hearts = document.getElementById("hearts")
const observer = new MutationObserver((mutations) => {
    if (
        mutations.length > 0
        &&
        hearts.children.length > 0
        ) {
        location.reload()
    }
})
observer.observe(document.getElementById("myForm"), { attributes: true, childList: false, subtree: false })
// document.getElementById("myForm").addEventListener("", (event) => {
//     console.log(event);
// })

// addEventListener("keydown", (event) => {
//     console.log("object");
//     if (event.key === "enter") {
//         // location.reload()
//     }
// })
addEventListener("load", (event) => {
    client.IP = "1.0.0.1"
    client.mask = "255.0.0.0"
    client.gateway = "1.0.0.0"
    gateway[client.name] = "1.0.0.0"
    client.netID = "1.0.0.0"

    server.IP = "2.0.0.1"
    server.mask = "255.0.0.0"
    server.gateway = "2.0.0.0"
    gateway[server.name] = "2.0.0.0"
    server.netID = "2.0.0.0"

    clientPanel[1].children[1].children[0].value = client.IP
    clientPanel[2].children[1].children[0].value = client.mask
    clientPanel[3].children[1].children[0].value = client.gateway
    clientPanel[4].children[1].children[0].value = client.netID
    gatewayPanel[1].children[0].value = gateway.client
    gatewayPanel[3].children[0].value = gateway.server
    serverPanel[1].children[1].children[0].value = server.IP
    serverPanel[2].children[1].children[0].value = server.mask
    serverPanel[3].children[1].children[0].value = server.gateway
    serverPanel[4].children[1].children[0].value = server.netID
})

// set results
// addEventListener("keydown", (event) => {
//     if (event.key === " ") {

//         // bruteForce(client)
//         // bruteForce(server)

//         client.IP = "1.0.0.1"
//         client.mask = "255.0.0.0"
//         client.gateway = "1.0.0.0"
//         gateway[client.name] = "1.0.0.0"
//         client.netID = "1.0.0.0"

//         server.IP = "2.0.0.1"
//         server.mask = "255.0.0.0"
//         server.gateway = "2.0.0.0"
//         gateway[server.name] = "2.0.0.0"
//         server.netID = "2.0.0.0"
//         // solveMask(client)
//         // solveMask(server)

//         // for (let index = 0; index < 10; index++) {
//         //     // Might fill some info.
//         //     solveEmptyCase(client)
//         //     solveEmptyCase(server)

//         //     solveOnlyMaskCase(client)
//         //     solveOnlyMaskCase(server)

//         //     // If either gateway is defined
//         //     solveGatewayMirror(client)
//         //     solveGatewayMirror(server)

//         //     solveMask(client)
//         //     solveMask(server)

//         //     solveIP(client)
//         //     solveIP(server)

//         //     solveNetID(client)
//         //     solveNetID(server)

//         //     solveGatewayPair(client)
//         //     solveGatewayPair(server)
//         // }


//         console.log("Client", client);
//         console.log("Gateway", gateway);
//         console.log("Server", server);

//         event.preventDefault()
//         clientPanel[1].children[1].children[0].value = client.IP
//         clientPanel[2].children[1].children[0].value = client.mask
//         clientPanel[3].children[1].children[0].value = client.gateway
//         clientPanel[4].children[1].children[0].value = client.netID
//         gatewayPanel[1].children[0].value = gateway.client
//         gatewayPanel[3].children[0].value = gateway.server
//         serverPanel[1].children[1].children[0].value = server.IP
//         serverPanel[2].children[1].children[0].value = server.mask
//         serverPanel[3].children[1].children[0].value = server.gateway
//         serverPanel[4].children[1].children[0].value = server.netID
//     }
// })