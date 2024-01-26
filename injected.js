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

function solveEmptyCase() { // requires: -
    if (
        client.IP === ""
        &&
        client.mask === ""
        &&
        client.gateway === ""
        &&
        client.netID === ""
        &&
        gateway.client === ""
    ) {
        client.IP = "1.2.3.4"
        client.mask = "255.255.255.0"
        client.gateway = "1.2.3.5"
        client.netID = "1.2.3.0"

        gateway.client = "1.2.3.5"
    }
}

function solveGatewayMirror() { // requires: -
    if (
        gateway.client === ""
        &&
        client.gateway !== ""
    ) {
        gateway.client = client.gateway
    }
    else if (
        gateway.client !== ""
        &&
        client.gateway === ""
    ) {
        client.gateway = gateway.client
    }
}

function solveGatewayPair() { // requires: netID
    if (
        client.gateway === ""
        &&
        gateway.client === ""
    ) {
        client.gateway = client.netID
        gateway.client = client.netID
    }
}

function solveNetID() { // requires: mask, IP
    if (client.netID === "") {
        const maskLength = client.mask.split(".").filter((element) => { return element === "255" }).length

        client.netID = client.IP.split(".").slice(0, maskLength).concat(new Array(4 - maskLength).fill("0")).join(".")
    }
}

function solveMask() { // requires: two of [ IP, gateway, netID ]
    if (client.mask === "") {
        const IP = client.IP.split(".")
        const gateway = client.gateway.split(".")
        const netID = client.netID.split(".")
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

        client.mask = mask.join(".")
    }
}

function solveIP() { // requires: netID or gateway
    if (client.IP === "") {
        if (client.netID !== "") {
            clientIP = client.netID.split(".").slice(0, 3);
            clientIP.push(
              (parseInt(client.netID.split(".")[3]) + 1).toString()
            );
            client.IP = clientIP.join(".");
        } else if (client.gateway !== "") {
            clientIP = client.gateway.split(".").slice(0, 3);
            clientIP.push(
              (parseInt(client.gateway.split(".")[3]) + 1).toString()
            );
            client.IP = clientIP.join(".");
        }
    }
}



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