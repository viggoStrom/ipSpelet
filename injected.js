// applies on https://ip.ntig.dev/
// uses https://chromewebstore.google.com/detail/custom-javascript-for-web/ddbjnfjiigjmcpcpkmhogomapikjbjdk?hl=en-US&utm_source=ext_sidebar

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
    ||
    true
) {
    const IP = client.IP.split(".")
    const gateway = client.gateway.split(".")
    const netID = client.netID.split(".")

    if (
        IP[0] === gateway[0]
        &&
        IP[0] === netID[0]
    ) {

    }
}

// solve IP (in /24 cases)
if (
    client.IP === ""
    &&
    client.netID !== ""
    &&
    client.mask === "255.255.255.0"
) {
    let baseIP = client.netID.replace(/\.\d+$/, '')
    let newClientIP = baseIP + ".1"

    while (
        newClientIP === client.gateway
        ||
        newClientIP === gateway.client
        ||
        newClientIP === baseIP + ".0"
        ||
        newClientIP === baseIP + ".255"
    ) {
        newClientIP = baseIP + `.${Math.random() * 255}`
    }

    client.IP = newClientIP
}
if (
    client.IP === ""
    &&
    client.gateway !== ""
    &&
    client.mask === "255.255.255.0"
) {
    let baseIP = client.gateway.replace(/\.\d+$/, '')
    let newClientIP = baseIP + ".1"

    while (
        newClientIP === client.gateway
        ||
        newClientIP === gateway.client
        ||
        newClientIP === baseIP + ".0"
        ||
        newClientIP === baseIP + ".255"
    ) {
        newClientIP = baseIP + `.${Math.random() * 255}`
    }

    client.IP = newClientIP
}
if (
    server.IP === ""
    &&
    server.netID !== ""
    &&
    server.mask === "255.255.255.0"
) {
    let baseIP = server.netID.replace(/\.\d+$/, '')
    let newServerIP = baseIP + ".1"

    while (
        newServerIP === server.gateway
        ||
        newServerIP === gateway.server
        ||
        newServerIP === baseIP + ".0"
        ||
        newServerIP === baseIP + ".255"
    ) {
        newServerIP = baseIP + `.${Math.random() * 255}`
    }

    server.IP = newServerIP
}
if (
    server.IP === ""
    &&
    server.gateway !== ""
    &&
    server.mask === "255.255.255.0"
) {
    let baseIP = server.gateway.replace(/\.\d+$/, '')
    let newserverIP = baseIP + ".1"

    while (
        newserverIP === server.gateway
        ||
        newserverIP === gateway.server
        ||
        newserverIP === baseIP + ".0"
        ||
        newserverIP === baseIP + ".255"
    ) {
        newserverIP = baseIP + `.${Math.random() * 255}`
    }

    server.IP = newserverIP
}




console.log("Client", client);
console.log("Gateway", gateway);
console.log("Server", server);


// loop through and enter the new results at every location missing a value i.e. .value === ""