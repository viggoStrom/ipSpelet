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

// Empty cases
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
if (
    server.IP === ""
    &&
    server.mask === ""
    &&
    server.gateway === ""
    &&
    server.netID === ""
    &&
    gateway.server === ""
) {
    server.IP = "2.3.4.156"
    server.mask = "255.255.255.0"
    server.gateway = "2.3.4.5"
    server.netID = "2.3.4.0"

    gateway.server = "2.3.4.5"
}

// Gateway mirror cases
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
if (
    gateway.server === ""
    &&
    server.gateway !== ""
) {
    gateway.server = server.gateway
}
else if (
    gateway.server !== ""
    &&
    server.gateway === ""
) {
    server.gateway = gateway.server
}

// solve mask
if (
    client.mask === ""
) {
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
            // &&
            // netID[index] === "0"
        ) {
            mask[index] = "0"
        }
    }

    client.mask = mask.join(".")
}
if (
    server.mask === ""
) {
    const IP = server.IP.split(".")
    const gateway = server.gateway.split(".")
    const netID = server.netID.split(".")
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
            // &&
            // netID[index] === "0"
        ) {
            mask[index] = "0"
        }
    }

    server.mask = mask.join(".")
}

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

// solve IP
if (
    client.IP === ""
) {
    if (client.netID !== "") {
        client.IP = client.netID.replace(/\.\d+$/, '') + ".1"
    } else if (client.gateway !== "") {
        client.IP = client.gateway.replace(/\.\d+$/, '') + ".1"
    }
}


// solve netID
if (
    client.netID === ""
) {
    const maskLength = client.mask.split(".").filter((element) => { return element === "255" }).length

    client.netID = client.IP.split(".").slice(0, maskLength).concat(new Array(4 - maskLength).fill("0")).join(".")
}
if (
    server.netID === ""
) {
    const maskLength = server.mask.split(".").filter((element) => { return element === "255" }).length

    server.netID = server.IP.split(".").slice(0, maskLength).concat(new Array(4 - maskLength).fill("0")).join(".")
}

// solve two missing gateway
if (
    client.gateway === ""
    &&
    gateway.client === ""
) {
    client.gateway = client.netID
    gateway.client = client.netID
}
if (
    server.gateway === ""
    &&
    gateway.server === ""
) {
    server.gateway = server.netID
    gateway.server = server.netID
}


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


console.log("Client", client);
console.log("Gateway", gateway);
console.log("Server", server);


// loop through and enter the new results at every location missing a value i.e. .value === ""