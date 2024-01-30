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
 * Requires [ IP && mask ]
 * @param side Client or server.
 */
function solveNetID(side) {
    if (side.netID === "") {
        const maskLength = side.mask.split(".").filter((element) => { return element === "255" }).length

        side.netID = side.IP.split(".").slice(0, maskLength).concat(new Array(4 - maskLength).fill("0")).join(".")
    }
}

/**
 * Requires [ (IP && gateway) || (IP && netID) || (gateway && netID) ]
 * Unsure
 * @param side Client or server.
 */
function solveMask(side) {
    if (side.mask === "") {
        const IP = side.IP.split(".")
        const gateway = side.gateway.split(".")
        const netID = side.netID.split(".")
        const addresses = [IP, gateway, netID].filter(Boolean)

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

        } else if (side.gateway !== "") {
            const IP = side.gateway.split(".").slice(0, 3);

            IP.push(
                (parseInt(side.gateway.split(".")[3]) + 1).toString()
            );

            side.IP = IP.join(".");
        }
    }
}

// Requires nothing.
// Might fill some info. 
solveEmptyCase(client)
solveEmptyCase(server)

// If either gateway is defined
solveGatewayMirror(client)
solveGatewayMirror(server)

solveNetID

// If none of the gateways are defined try to define them with netID
solveGatewayPair(client)
solveGatewayPair(server)



console.log("Client", client);
console.log("Gateway", gateway);
console.log("Server", server);


// set results
addEventListener("keydown", (event) => {
    if (event.key === " ") {
        event.preventDefault()
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
    }
})